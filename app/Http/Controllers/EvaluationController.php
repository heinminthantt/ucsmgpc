<?php

namespace App\Http\Controllers;

use App\Models\DefenseRecord;
use App\Models\Project;
use App\Models\User;
use App\Services\AuditLogger;
use App\Services\EvaluationService;
use App\Services\Notifier;
use App\Services\ProjectLifecycle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Phase 2 assessment surface (spec 6.7, 7, 9.2, 10.5):
 * evaluation view with rubric scores (D9-gated for students), examiner
 * assignment + queue, dispute resolution, publish/unpublish overrides,
 * supervisor reassignment and defense records. Status changes always go
 * through ProjectLifecycle; privileged actions are audit logged.
 */
class EvaluationController extends Controller
{
    /** GET /api/projects/{project}/evaluation */
    public function show(Project $project): JsonResponse
    {
        $viewer = Auth::user();
        if (! $project->canBeViewedBy($viewer)) {
            abort(404);
        }

        $template = $project->rubricTemplate();
        $confirmed = $project->resultIsConfirmed();
        $isStaff = $viewer->isAdmin() || $viewer->isSupervisor() || $viewer->isDepartmentAdmin();

        $latestFinal = $project->submissions()->where('stage', 'final')->orderByDesc('id')->first();

        $reviews = [];
        if ($latestFinal) {
            $reviews = $latestFinal->reviews()->with(['reviewer:id,name', 'scores'])->get()->map(function ($r) use ($viewer, $isStaff, $confirmed, $template) {
                $visible = $isStaff || $confirmed || $r->reviewer_id === $viewer->id;

                return [
                    'id' => $r->id,
                    'reviewerId' => $r->reviewer_id,
                    'reviewerName' => $r->reviewer?->name,
                    'reviewer_role' => $r->reviewer_role,
                    'decision' => $r->decision,
                    'comment' => $r->comment,
                    'scores' => $visible ? $r->scores->map(fn ($s) => [
                        'criterion_key' => $s->criterion_key,
                        'score' => (float) $s->score,
                        'comment' => $s->comment,
                    ])->values() : null,
                    'weightedTotal' => $visible ? $template->weightedTotal($r->scoresByKey()) : null,
                    'createdAt' => $r->created_at?->toISOString(),
                ];
            })->values();
        }

        $defense = $project->defenseRecords()->orderByDesc('scheduled_at')->first();

        return response()->json([
            'projectId' => $project->id,
            'status' => $project->status,
            'resultConfirmed' => $confirmed,
            'evaluationConflict' => (bool) $project->evaluation_conflict,
            'supervisorId' => $project->supervisor_id,
            'examinerId' => $project->examiner_id,
            'rubricTemplate' => [
                'id' => $template->id,
                'name' => $template->name,
                'criteria' => $template->criteria_json,
                'passThreshold' => (float) $template->pass_threshold,
            ],
            'finalSubmissionId' => $latestFinal?->id,
            'reviews' => $reviews,
            'defense' => $defense ? $this->defensePayload($defense) : null,
        ]);
    }

    /** POST /api/projects/{project}/assign-examiner { examiner_id } */
    public function assignExaminer(Request $request, Project $project, AuditLogger $audit): JsonResponse
    {
        $actor = Auth::user();
        $this->assertDeptAdminOrAdmin($project, $actor);

        $validated = $request->validate(['examiner_id' => 'required|exists:users,id']);
        $examiner = User::findOrFail($validated['examiner_id']);

        if (! $examiner->is_active) {
            return response()->json(['message' => 'The examiner account is inactive.'], 422);
        }
        if ((int) $examiner->id === (int) $project->supervisor_id) {
            return response()->json(['message' => 'The examiner cannot be the project supervisor.'], 422);
        }
        $staffRole = $examiner->isSupervisor() || $examiner->isDepartmentAdmin() || $examiner->isAdmin();
        if (! $staffRole) {
            return response()->json(['message' => 'The examiner must be a supervisor or staff member.'], 422);
        }
        // Dept admins assign within their department; admins may choose any staff.
        if (! $actor->isAdmin() && (int) $examiner->department_id !== (int) $project->department_id) {
            return response()->json(['message' => 'The examiner must belong to the project department.'], 422);
        }

        $previous = $project->examiner_id;
        $project->update(['examiner_id' => $examiner->id]);

        Notifier::notifyUser($project, $examiner,
            "You were assigned as examiner for \"{$project->title}\". Review the final submission when it arrives.", 'examiner_assigned');

        $audit->log($actor, 'project.examiner_assigned', $project, [
            'from' => $previous, 'to' => $examiner->id,
        ], $request);

        return response()->json(['id' => $project->id, 'examinerId' => $project->examiner_id]);
    }

    /** GET /api/examiner/queue — final-stage projects waiting on me as examiner. */
    public function queue(): JsonResponse
    {
        $projects = Project::with(['team.leader:id,name', 'supervisor:id,name', 'cycle:id,academic_year,semester'])
            ->where('examiner_id', Auth::id())
            ->whereIn('status', ['final_submitted', 'under_evaluation'])
            ->latest()
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'status' => $p->status,
                'evaluationConflict' => (bool) $p->evaluation_conflict,
                'teamLeaderName' => $p->team?->leader?->name,
                'supervisorName' => $p->supervisor?->name,
                'cycleLabel' => $p->cycle ? "{$p->cycle->academic_year} · {$p->cycle->semester}" : null,
                'finalSubmissionId' => $p->submissions()->where('stage', 'final')->orderByDesc('id')->value('id'),
            ]);

        return response()->json($projects);
    }

    /** POST /api/projects/{project}/resolve-evaluation { result, comment } */
    public function resolveEvaluation(Request $request, Project $project, EvaluationService $evaluation, AuditLogger $audit): JsonResponse
    {
        $actor = Auth::user();
        $this->assertDeptAdminOrAdmin($project, $actor);

        if (! $project->evaluation_conflict) {
            return response()->json(['message' => 'This project has no evaluation conflict to resolve.'], 422);
        }

        $validated = $request->validate([
            'result' => 'required|in:pass,revision_required,fail',
            'comment' => 'required|string|max:2000',
        ]);

        $evaluation->resolveConflict($project, $actor, $validated['result'], $validated['comment']);

        $audit->log($actor, 'evaluation.dispute_resolved', $project, [
            'result' => $validated['result'],
        ], $request);

        return response()->json([
            'id' => $project->id,
            'status' => $project->refresh()->status,
            'evaluationConflict' => (bool) $project->evaluation_conflict,
        ]);
    }

    /** POST /api/projects/{project}/publish — re-approve from under_evaluation with a completed evaluation. */
    public function publish(Project $project, ProjectLifecycle $lifecycle, AuditLogger $audit): JsonResponse
    {
        $actor = Auth::user();
        $this->assertDeptAdminOrAdmin($project, $actor);

        if ($project->status !== 'under_evaluation') {
            return response()->json(['message' => "Only a project under evaluation can be published (current status: '{$project->status}')."], 422);
        }
        if (! $this->hasCompletedEvaluation($project)) {
            return response()->json(['message' => 'The evaluation is not complete yet (supervisor and examiner reviews are required).'], 422);
        }

        try {
            $lifecycle->transition($project, 'approved_published', $actor);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        $audit->log($actor, 'project.published', $project, [], request());

        return response()->json(['id' => $project->id, 'status' => $project->refresh()->status]);
    }

    /**
     * POST /api/projects/{project}/unpublish.
     * Choice (documented in the progress log): unpublish transitions
     * approved_published -> under_evaluation, so the result is no longer
     * confirmed, scores are hidden from students again, and the project
     * leaves the public catalog until re-published.
     */
    public function unpublish(Project $project, ProjectLifecycle $lifecycle, AuditLogger $audit): JsonResponse
    {
        $actor = Auth::user();
        $this->assertDeptAdminOrAdmin($project, $actor);

        if ($project->status !== 'approved_published') {
            return response()->json(['message' => "Only a published project can be unpublished (current status: '{$project->status}')."], 422);
        }

        try {
            $lifecycle->transition($project, 'under_evaluation', $actor, 'Unpublished by department admin.');
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        $audit->log($actor, 'project.unpublished', $project, [], request());

        return response()->json(['id' => $project->id, 'status' => $project->refresh()->status]);
    }

    /** POST /api/projects/{project}/reassign-supervisor { supervisor_id } */
    public function reassignSupervisor(Request $request, Project $project, AuditLogger $audit): JsonResponse
    {
        $actor = Auth::user();
        $this->assertDeptAdminOrAdmin($project, $actor);

        $validated = $request->validate(['supervisor_id' => 'required|exists:users,id']);
        $supervisor = User::findOrFail($validated['supervisor_id']);

        if (! $supervisor->is_active || ! ($supervisor->isSupervisor() || $supervisor->isDepartmentAdmin() || $supervisor->isAdmin())) {
            return response()->json(['message' => 'The new supervisor must be an active supervisor or staff member.'], 422);
        }
        if (! $actor->isAdmin() && (int) $supervisor->department_id !== (int) $project->department_id) {
            return response()->json(['message' => 'The new supervisor must belong to the project department.'], 422);
        }

        $previous = $project->supervisor_id;
        $project->update(['supervisor_id' => $supervisor->id]);

        Notifier::notifyUser($project, $supervisor,
            "You were reassigned as supervisor for \"{$project->title}\".", 'supervisor_reassigned');

        $audit->log($actor, 'project.supervisor_reassigned', $project, [
            'from' => $previous, 'to' => $supervisor->id,
        ], $request);

        return response()->json(['id' => $project->id, 'supervisorId' => $project->supervisor_id]);
    }

    /** GET /api/projects/{project}/defense — all defense records, newest first. */
    public function defenses(Project $project): JsonResponse
    {
        if (! $project->canBeViewedBy(Auth::user())) {
            abort(404);
        }

        return response()->json(
            $project->defenseRecords()->orderByDesc('scheduled_at')->get()
                ->map(fn ($d) => $this->defensePayload($d))->values()
        );
    }

    /** POST /api/projects/{project}/defense — schedule/record a defense (spec WF7). */
    public function storeDefense(Request $request, Project $project, AuditLogger $audit): JsonResponse
    {
        $actor = Auth::user();
        $isExaminer = (int) $project->examiner_id === (int) $actor->id;
        if (! $isExaminer) {
            $this->assertDeptAdminOrAdmin($project, $actor);
        }

        $validated = $request->validate([
            'scheduled_at' => 'required|date',
            'venue' => 'nullable|string|max:255',
            'panel' => 'nullable|array',
            'panel.*' => 'integer|exists:users,id',
            'note' => 'nullable|string|max:2000',
        ]);

        $record = DefenseRecord::create([
            'project_id' => $project->id,
            'scheduled_at' => $validated['scheduled_at'],
            'venue' => $validated['venue'] ?? null,
            'panel_json' => $validated['panel'] ?? null,
            'note' => $validated['note'] ?? null,
            'created_by' => $actor->id,
        ]);

        $audit->log($actor, 'project.defense_recorded', $project, [
            'defense_id' => $record->id, 'scheduled_at' => $record->scheduled_at?->toISOString(),
        ], $request);

        return response()->json($this->defensePayload($record), 201);
    }

    // ── helpers ──────────────────────────────────────────────────────────

    private function defensePayload(DefenseRecord $d): array
    {
        return [
            'id' => $d->id,
            'projectId' => $d->project_id,
            'scheduledAt' => $d->scheduled_at?->toISOString(),
            'venue' => $d->venue,
            'panel' => $d->panel_json ?? [],
            'note' => $d->note,
            'createdBy' => $d->created_by,
            'createdAt' => $d->created_at?->toISOString(),
        ];
    }

    /** Supervisor + examiner both reviewed the latest final version, or an authority did. */
    private function hasCompletedEvaluation(Project $project): bool
    {
        $latestFinal = $project->submissions()->where('stage', 'final')->orderByDesc('id')->first();
        if (! $latestFinal) {
            return false;
        }

        $reviews = $latestFinal->reviews()->get();
        if ($reviews->isEmpty()) {
            return false;
        }
        if ($reviews->contains(fn ($r) => in_array($r->reviewer_role, ['dept_admin', 'admin'], true))) {
            return true;
        }
        $hasSupervisor = $reviews->contains('reviewer_id', (int) $project->supervisor_id);
        if (empty($project->examiner_id)) {
            return $hasSupervisor;
        }

        return $hasSupervisor && $reviews->contains('reviewer_id', (int) $project->examiner_id);
    }

    private function assertDeptAdminOrAdmin(Project $project, User $actor): void
    {
        $ok = $actor->isAdmin()
            || ($actor->isDepartmentAdmin() && (int) $actor->department_id === (int) $project->department_id);
        if (! $ok) {
            abort(403, 'Only a department admin of this department (or an admin) can do this.');
        }
    }
}
