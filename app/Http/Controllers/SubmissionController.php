<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\Review;
use App\Models\Submission;
use App\Models\User;
use App\Services\EvaluationService;
use App\Services\ProjectLifecycle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Stage flow for the reimagined lifecycle (spec 10.3 / 10.4):
 * draft saving, versioned stage submission, version history, and the
 * supervisor/examiner review endpoint. All project status changes go
 * through App\Services\ProjectLifecycle.
 */
class SubmissionController extends Controller
{
    /**
     * Save draft fields on the project itself. Editing a draft NEVER changes
     * the project status (spec FX1): resubmission is the separate, explicit
     * submit action below, and it always creates a new submission version.
     */
    public function saveDraft(Request $request, Project $project): JsonResponse
    {
        $this->assertCanWorkOnProject($project);

        if ($project->isPublished() || $project->status === 'archived') {
            return response()->json(['message' => 'This project is published/archived and can no longer be edited.'], 422);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'objectives' => 'sometimes|string',
            'benefits' => 'nullable|string',
            'body' => 'nullable|string',
            'github_link' => 'nullable|url',
            'supervisor_id' => 'nullable|exists:users,id',
            'course_id' => 'nullable|exists:courses,id',
            'payload' => 'nullable|array',
        ]);

        $fields = Arr::except($validated, ['payload']);
        if ($fields) {
            $project->update($fields);
        }

        return response()->json(['id' => $project->id, 'status' => $project->status]);
    }

    /**
     * Submit (or resubmit) a stage. Creates the next immutable Submission
     * version and moves the project through the lifecycle:
     *   proposal: draft|proposal_changes_requested -> proposal_submitted
     *   mid_review: in_progress -> mid_review_submitted
     *   final: in_progress|revision_required -> final_submitted
     * A project in proposal_declined must first be reopened to draft
     * (POST /projects/{project}/reopen) — spec 5.2 has no direct edge.
     */
    public function submit(Request $request, Project $project, ProjectLifecycle $lifecycle): JsonResponse
    {
        $this->assertLeader($project);

        $validated = $request->validate([
            'stage' => 'required|in:proposal,mid_review,final',
            // Optional last-minute draft fields, applied before the snapshot.
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'objectives' => 'sometimes|string',
            'benefits' => 'nullable|string',
            'body' => 'nullable|string',
            'github_link' => 'nullable|url',
            'supervisor_id' => 'nullable|exists:users,id',
            'course_id' => 'nullable|exists:courses,id',
            'payload' => 'nullable|array',
            'project_files.*' => 'nullable|file|max:102400',
            'file_kind' => 'sometimes|in:'.implode(',', ProjectFile::KINDS),
        ]);

        $stage = (string) $validated['stage'];

        $draftFields = Arr::except($validated, ['stage', 'payload', 'project_files', 'file_kind']);
        if ($draftFields) {
            $project->update($draftFields);
            $project->refresh();
        }

        // Team size gate for proposals (spec TM1), when the project has a team.
        if ($stage === 'proposal' && $project->team && $project->cycle) {
            $count = $project->team->confirmedMemberCount();
            if ($count < (int) $project->cycle->team_min || $count > (int) $project->cycle->team_max) {
                return response()->json([
                    'message' => "Team size ({$count}) is outside this cycle's allowed range ({$project->cycle->team_min}-{$project->cycle->team_max}).",
                ], 422);
            }
        }

        if ($stage === 'proposal') {
            $missing = $this->proposalChecklist($project);
            if ($missing) {
                return response()->json(['message' => 'Proposal is incomplete.', 'missing' => $missing], 422);
            }
        }

        if ($stage === 'final') {
            $missing = $this->finalChecklist($project, $request);
            if ($missing) {
                return response()->json(['message' => 'Final submission is incomplete.', 'missing' => $missing], 422);
            }
        }

        if ($stage === 'mid_review') {
            // Mid-review checklist (spec WF5): a short progress summary is
            // the one required item; it travels in the submission payload.
            $summary = $validated['payload']['progress_summary'] ?? $validated['payload']['summary'] ?? null;
            if (blank($summary)) {
                return response()->json([
                    'message' => 'Mid-review submission is incomplete.',
                    'missing' => ['progress summary'],
                ], 422);
            }
        }

        $target = match ($stage) {
            'proposal' => 'proposal_submitted',
            'mid_review' => 'mid_review_submitted',
            default => 'final_submitted',
        };

        if (! $lifecycle->canTransition($project, $target)) {
            return response()->json([
                'message' => "Cannot submit the {$stage} stage while the project is '{$project->status}'.",
            ], 422);
        }

        $submission = DB::transaction(function () use ($request, $project, $stage, $target, $validated, $lifecycle) {
            $deadline = $project->cycle?->deadlineFor($stage);

            $submission = Submission::create([
                'project_id' => $project->id,
                'stage' => $stage,
                'version' => Submission::nextVersion($project->id, $stage),
                'payload_json' => array_merge(
                    $this->snapshotPayload($project),
                    $validated['payload'] ?? []
                ),
                'submitted_by' => Auth::id(),
                'submitted_at' => now(),
                'is_late' => $deadline ? now()->gt($deadline) : false,
                'status' => 'submitted',
            ]);

            // Files uploaded with this submission become part of the version.
            if ($request->hasFile('project_files')) {
                foreach ($request->file('project_files') as $file) {
                    $path = $file->store('project-files', 'public');
                    if ($path === false) {
                        continue;
                    }
                    ProjectFile::create([
                        'project_id' => $project->id,
                        'submission_id' => $submission->id,
                        'file_path' => Storage::url($path),
                        'original_name' => $file->getClientOriginalName(),
                        'kind' => $validated['file_kind'] ?? 'other',
                        'size_bytes' => $file->getSize(),
                        'mime_type' => $file->getMimeType(),
                    ]);
                }
            }

            $lifecycle->transition($project, $target, Auth::user());

            return $submission;
        });

        return response()->json([
            'id' => $submission->id,
            'projectId' => $project->id,
            'stage' => $submission->stage,
            'version' => $submission->version,
            'is_late' => $submission->is_late,
            'projectStatus' => $project->refresh()->status,
        ], 201);
    }

    /** proposal_declined -> draft, so a declined team can start again (spec FX3). */
    public function reopen(Project $project, ProjectLifecycle $lifecycle): JsonResponse
    {
        $this->assertLeader($project);

        if (! $lifecycle->canTransition($project, 'draft')) {
            return response()->json([
                'message' => "Only a declined project can be reopened (current status: '{$project->status}').",
            ], 422);
        }

        $lifecycle->transition($project, 'draft', Auth::user());

        return response()->json(['id' => $project->id, 'status' => $project->status]);
    }

    /** Version history for a project (team + assigned staff + dept admin). */
    public function index(Project $project): JsonResponse
    {
        if (! $project->canBeViewedBy(Auth::user())) {
            abort(404);
        }

        $viewer = Auth::user();
        // Rubric scores are visible to staff at any time, and to the team
        // only once the final result is confirmed (spec D9). Never public:
        // this endpoint already requires canBeViewedBy().
        $isStaffViewer = $viewer->isAdmin() || $viewer->isSupervisor() || $viewer->isDepartmentAdmin();
        $showScores = $isStaffViewer || $project->resultIsConfirmed();
        $template = $project->rubricTemplate();

        $submissions = $project->submissions()
            ->with(['submitter:id,name', 'reviews.reviewer:id,name', 'reviews.scores', 'files'])
            ->orderBy('stage')
            ->orderByDesc('version')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'stage' => $s->stage,
                'version' => $s->version,
                'status' => $s->status,
                'is_late' => $s->is_late,
                'payload' => $s->payload_json,
                'submittedByName' => $s->submitter?->name,
                'submittedAt' => $s->submitted_at?->toISOString(),
                'files' => $s->files->map(fn ($f) => [
                    'id' => $f->id, 'name' => $f->original_name, 'kind' => $f->kind, 'url' => $f->file_path,
                ])->values(),
                'reviews' => $s->reviews->map(fn ($r) => array_filter([
                    'id' => $r->id,
                    'reviewerName' => $r->reviewer?->name,
                    'reviewer_role' => $r->reviewer_role,
                    'decision' => $r->decision,
                    'comment' => $r->comment,
                    'createdAt' => $r->created_at?->toISOString(),
                    // A reviewer always sees their own scores; everyone
                    // else follows the D9 gate above.
                    'scores' => ($showScores || $r->reviewer_id === $viewer->id)
                        ? $r->scores->map(fn ($score) => [
                            'criterion_key' => $score->criterion_key,
                            'score' => (float) $score->score,
                            'comment' => $score->comment,
                        ])->values()
                        : null,
                    'weightedTotal' => ($showScores || $r->reviewer_id === $viewer->id)
                        ? $template->weightedTotal($r->scoresByKey())
                        : null,
                ], fn ($v) => $v !== null))->values(),
            ]);

        return response()->json($submissions);
    }

    /**
     * Review one submission version.
     * Body: { decision: accept|request_changes|decline|pass|revision_required|fail, comment? }
     * Comment is required for negative decisions (spec RV2).
     * Only the assigned supervisor, the assigned examiner, an admin, or a
     * department admin of the project's department may review.
     */
    public function review(Request $request, Submission $submission, ProjectLifecycle $lifecycle, EvaluationService $evaluation): JsonResponse
    {
        $project = $submission->project;
        $reviewer = Auth::user();

        $isAssigned = $project->supervisor_id === $reviewer->id || $project->examiner_id === $reviewer->id;
        $isDeptAdmin = $reviewer->isDepartmentAdmin() && $reviewer->department_id
            && (int) $reviewer->department_id === (int) $project->department_id;
        if (! $isAssigned && ! $isDeptAdmin && ! $reviewer->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'decision' => 'required|in:'.implode(',', Review::DECISIONS),
            'comment' => 'nullable|string|max:2000',
            // Phase 2 rubric scores (final stage only):
            // [{criterion_key, score, comment?}]
            'scores' => 'nullable|array',
            'scores.*.criterion_key' => 'required_with:scores|string',
            'scores.*.score' => 'required_with:scores|numeric',
            'scores.*.comment' => 'nullable|string|max:1000',
        ]);
        $decision = $validated['decision'];
        $comment = $validated['comment'] ?? null;
        $scores = $validated['scores'] ?? [];

        if (in_array($decision, Review::COMMENT_REQUIRED_FOR, true) && blank($comment)) {
            return response()->json(['message' => 'A comment is required for this decision.'], 422);
        }

        // Mid-review feedback is always required (spec WF5): the comment IS
        // the on-track / needs-attention note, for accept as well.
        if ($submission->stage === 'mid_review' && blank($comment)) {
            return response()->json(['message' => 'Mid-review feedback (a comment) is required.'], 422);
        }

        if ($scores && $submission->stage !== 'final') {
            return response()->json(['message' => 'Rubric scores only apply to final submissions.'], 422);
        }

        if ($submission->status !== 'submitted') {
            return response()->json(['message' => 'This submission version has already been reviewed.'], 422);
        }

        // ── Final stage: rubric scoring + examiner confirmation rules ──
        // Handled by EvaluationService (spec 6.7 / 7). The submission stays
        // 'submitted' until the result is confirmed, so the second reviewer
        // can still review the same version.
        if ($submission->stage === 'final') {
            try {
                [$review, $outcome] = DB::transaction(function () use ($submission, $project, $reviewer, $decision, $comment, $scores, $evaluation) {
                    $review = Review::updateOrCreate(
                        ['submission_id' => $submission->id, 'reviewer_id' => $reviewer->id],
                        [
                            'reviewer_role' => $this->reviewerRole($project, $reviewer),
                            'decision' => $decision,
                            'comment' => $comment,
                        ]
                    );

                    if ($scores) {
                        $evaluation->storeScores($review, $project, $scores);
                    }

                    $outcome = $evaluation->applyFinalReview($project, $submission, $review, $reviewer);

                    return [$review, $outcome];
                });
            } catch (\InvalidArgumentException $e) {
                return response()->json(['message' => $e->getMessage()], 422);
            }

            return response()->json([
                'id' => $review->id,
                'submissionId' => $submission->id,
                'decision' => $review->decision,
                'projectStatus' => $project->refresh()->status,
                'evaluation' => $outcome,
                'weightedTotal' => $project->rubricTemplate()->weightedTotal($review->load('scores')->scoresByKey()),
            ]);
        }

        // Map (stage, decision) to a submission status + lifecycle target.
        [$submissionStatus, $target] = $this->mapDecision($submission, $project, $decision);
        if ($target === null) {
            return response()->json([
                'message' => "Decision '{$decision}' is not valid for a {$submission->stage} submission while the project is '{$project->status}'.",
            ], 422);
        }

        // Spec 6.4: supervisor capacity is enforced when a proposal is
        // accepted (dept admins / admins reviewing are the override path).
        if ($submission->stage === 'proposal' && $decision === 'accept') {
            $block = $lifecycle->capacityBlockReason($project, $reviewer);
            if ($block !== null) {
                return response()->json(['message' => $block], 422);
            }
        }

        $review = DB::transaction(function () use ($submission, $project, $reviewer, $decision, $comment, $submissionStatus, $target, $lifecycle) {
            $review = Review::updateOrCreate(
                ['submission_id' => $submission->id, 'reviewer_id' => $reviewer->id],
                [
                    'reviewer_role' => $this->reviewerRole($project, $reviewer),
                    'decision' => $decision,
                    'comment' => $comment,
                ]
            );

            $submission->update(['status' => $submissionStatus]);

            if ($project->refresh()->status !== $target) {
                $lifecycle->transition($project, $target, $reviewer, $comment);
            }

            return $review;
        });

        return response()->json([
            'id' => $review->id,
            'submissionId' => $submission->id,
            'decision' => $review->decision,
            'projectStatus' => $project->refresh()->status,
        ]);
    }

    /**
     * Used for proposal and mid_review stages. Final-stage decisions do NOT
     * come through here since Phase 2: EvaluationService owns them (the
     * 'final' arm below is kept only as documentation of the result mapping).
     *
     * @return array{0: ?string, 1: ?string} [submission status, lifecycle target]
     */
    private function mapDecision(Submission $submission, Project $project, string $decision): array
    {
        return match ($submission->stage) {
            'proposal' => match ($decision) {
                'accept' => ['accepted', 'in_progress'],
                'request_changes' => ['changes_requested', 'proposal_changes_requested'],
                'decline' => ['declined', 'proposal_declined'],
                default => [null, null],
            },
            'mid_review' => match ($decision) {
                // Checkpoint only: either outcome returns the project to
                // in_progress with the feedback recorded (spec WF5).
                'accept' => ['accepted', 'in_progress'],
                'request_changes' => ['changes_requested', 'in_progress'],
                default => [null, null],
            },
            'final' => match ($decision) {
                'accept', 'pass' => ['accepted', 'approved_published'],
                'request_changes', 'revision_required' => ['changes_requested', 'revision_required'],
                'decline', 'fail' => ['declined', 'not_passed'],
                default => [null, null],
            },
        };
    }

    private function reviewerRole(Project $project, User $reviewer): string
    {
        if ($reviewer->isAdmin()) {
            return 'admin';
        }
        if ($reviewer->isDepartmentAdmin()) {
            return 'dept_admin';
        }
        if ($project->examiner_id === $reviewer->id) {
            return 'examiner';
        }

        return 'supervisor';
    }

    /**
     * Spec 6.4 proposal completeness.
     *
     * @return string[]
     */
    private function proposalChecklist(Project $project): array
    {
        $missing = [];
        if (blank($project->title)) {
            $missing[] = 'title';
        }
        if (blank($project->description)) {
            $missing[] = 'problem statement / description';
        }
        if (blank($project->objectives)) {
            $missing[] = 'objectives';
        }
        if (! $project->supervisor_id) {
            $missing[] = 'supervisor request';
        }

        return $missing;
    }

    /**
     * Spec 6.6 final checklist, Phase 1 simplified set (per build brief):
     * abstract/description, a report (PDF file kind or rich-text body), and
     * source (GitHub link or any uploaded project file). Slides and member
     * contributions from the full spec are not enforced yet.
     *
     * @return string[] missing items
     */
    private function finalChecklist(Project $project, Request $request): array
    {
        $missing = [];

        if (blank($project->description)) {
            $missing[] = 'abstract / description';
        }

        $hasReportFile = $project->files()->where('kind', 'report_pdf')->exists();
        if (! $hasReportFile && blank($project->body)) {
            $missing[] = 'final report (upload a report_pdf file or provide the report body)';
        }

        $hasAnyFile = $project->files()->exists() || $request->hasFile('project_files');
        if (blank($project->github_link) && ! $hasAnyFile) {
            $missing[] = 'source code (GitHub link or an uploaded source file)';
        }

        return $missing;
    }

    /** @return array<string, mixed> */
    private function snapshotPayload(Project $project): array
    {
        return [
            'title' => $project->title,
            'description' => $project->description,
            'objectives' => $project->objectives,
            'benefits' => $project->benefits,
            'body' => $project->body,
            'github_link' => $project->github_link,
            'department_id' => $project->department_id,
            'course_id' => $project->course_id,
            'supervisor_id' => $project->supervisor_id,
        ];
    }

    /** Project owner, team leader, or a confirmed team member (draft editing, SB3). */
    private function assertCanWorkOnProject(Project $project): void
    {
        $user = Auth::user();
        $allowed = $user->isAdmin()
            || $project->user_id === $user->id
            || ($project->team && $project->team->leader_id === $user->id)
            || ($project->team && $project->team->memberships()
                ->where('user_id', $user->id)
                ->where('invite_status', 'confirmed')
                ->exists());
        if (! $allowed) {
            abort(403, 'You do not belong to this project team.');
        }
    }

    /** Only the project owner / team leader may submit (spec SB3). */
    private function assertLeader(Project $project): void
    {
        $user = Auth::user();
        $isLeader = $project->user_id === $user->id
            || ($project->team && $project->team->leader_id === $user->id)
            || $user->isAdmin();
        if (! $isLeader) {
            abort(403, 'Only the team leader can submit a stage.');
        }
    }
}
