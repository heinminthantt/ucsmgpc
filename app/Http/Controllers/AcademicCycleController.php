<?php

namespace App\Http\Controllers;

use App\Models\AcademicCycle;
use App\Models\Project;
use App\Models\RubricTemplate;
use App\Services\AuditLogger;
use App\Services\ProjectLifecycle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AcademicCycleController extends Controller
{
    /** All cycles visible to staff (admin: all; department_admin: own department). */
    public function index(Request $request): JsonResponse
    {
        $query = AcademicCycle::with('department:id,name')->latest();

        if (Auth::user()->isDepartmentAdmin() && Auth::user()->department_id) {
            $query->where('department_id', Auth::user()->department_id);
        }
        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->get()->map(fn ($c) => $this->formatCycle($c)));
    }

    /** Open cycles a student may join: own department only (spec 10.3). */
    public function openCycles(): JsonResponse
    {
        $query = AcademicCycle::with('department:id,name')
            ->whereIn('status', ['open', 'in_progress'])
            ->orderBy('proposal_deadline');

        if (Auth::user()->department_id) {
            $query->where('department_id', Auth::user()->department_id);
        }

        return response()->json($query->get()->map(fn ($c) => $this->formatCycle($c)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateCycle($request);

        // Phase 2: a cycle created without an explicit rubric template
        // gets the spec default attached (controller approach: no observer,
        // the choice is visible right here).
        if (empty($validated['rubric_template_id'])) {
            $validated['rubric_template_id'] = RubricTemplate::defaultTemplate()->id;
        }

        $cycle = AcademicCycle::create([
            ...$validated,
            'created_by' => Auth::id(),
        ]);

        return response()->json($this->formatCycle($cycle->load('department:id,name')), 201);
    }

    public function show(AcademicCycle $cycle): JsonResponse
    {
        return response()->json($this->formatCycle($cycle->load('department:id,name')));
    }

    public function update(Request $request, AcademicCycle $cycle, AuditLogger $audit): JsonResponse
    {
        $validated = $this->validateCycle($request, partial: true);

        // Audit deadline/setting edits (spec NF10): record from/to for the
        // fields that actually changed.
        $before = $cycle->only(array_keys($validated));
        $cycle->update($validated);
        $changes = [];
        foreach ($validated as $key => $value) {
            $old = $before[$key] ?? null;
            $oldStr = $old instanceof \DateTimeInterface ? $old->toISOString() : $old;
            $newStr = $cycle->{$key} instanceof \DateTimeInterface ? $cycle->{$key}->toISOString() : $cycle->{$key};
            if ((string) $oldStr !== (string) $newStr) {
                $changes[$key] = ['from' => $oldStr, 'to' => $newStr];
            }
        }
        if ($changes) {
            $audit->log(Auth::user(), 'cycle.updated', $cycle, ['changes' => $changes], $request);
        }

        return response()->json($this->formatCycle($cycle->load('department:id,name')));
    }

    /** Close a cycle: freeze it and archive its projects through the lifecycle service. */
    public function close(AcademicCycle $cycle, ProjectLifecycle $lifecycle, AuditLogger $audit): JsonResponse
    {
        $cycle->update(['status' => 'closed']);
        $audit->log(Auth::user(), 'cycle.closed', $cycle, [], request());

        foreach ($cycle->projects()->whereNotIn('status', ['archived'])->get() as $project) {
            if ($lifecycle->canTransition($project, 'archived')) {
                $lifecycle->transition($project, 'archived', Auth::user());
            }
            // Projects in states with no direct ->archived edge in spec 5.2
            // (e.g. draft) are left in place and simply frozen by the closed
            // cycle; see PHASE1_PROGRESS.md.
        }

        return response()->json(['message' => 'Cycle closed', 'id' => $cycle->id]);
    }

    /**
     * Department board (spec 6.9, Phase 2): counts by status plus a project
     * list with the current stage and how long the oldest waiting submission
     * has been sitting with staff.
     * GET /api/department/board?cycle_id&status&supervisor_id
     */
    public function board(Request $request): JsonResponse
    {
        $user = Auth::user();
        if (! $user->isAdmin() && ! $user->isDepartmentAdmin() && ! $user->isSupervisor()) {
            abort(403);
        }

        $query = Project::query();
        if ($user->isDepartmentAdmin() && ! $user->isAdmin() && $user->department_id) {
            $query->where('department_id', $user->department_id);
        }
        if ($request->filled('cycle_id')) {
            $query->where('cycle_id', $request->integer('cycle_id'));
        }
        if ($request->filled('supervisor_id')) {
            $query->where('supervisor_id', $request->integer('supervisor_id'));
        }

        $all = (clone $query)->get();
        $counts = [];
        foreach (array_keys(ProjectLifecycle::TRANSITIONS) as $status) {
            $counts[$status] = 0;
        }
        foreach ($all->countBy('status') as $status => $n) {
            $counts[$status] = $n;
        }

        $listQuery = clone $query;
        if ($request->filled('status')) {
            $listQuery->where('status', $request->string('status'));
        }

        $projects = $listQuery
            ->with(['team.leader:id,name', 'supervisor:id,name', 'examiner:id,name'])
            ->latest()
            ->get()
            ->map(function (Project $p) {
                $waiting = $p->submissions()->where('status', 'submitted')->orderBy('created_at')->first();
                $waitingDays = $waiting ? (int) $waiting->created_at->diffInDays(now()) : null;

                return [
                    'id' => $p->id,
                    'title' => $p->title,
                    'status' => $p->status,
                    'stage' => $this->stageForStatus($p->status),
                    'teamLeaderName' => $p->team?->leader?->name,
                    'supervisorName' => $p->supervisor?->name,
                    'examinerName' => $p->examiner?->name,
                    'evaluationConflict' => (bool) $p->evaluation_conflict,
                    'waitingDays' => $waitingDays,
                    'waitingOver7Days' => $waitingDays !== null && $waitingDays > 7,
                    'updatedAt' => $p->updated_at?->toISOString(),
                ];
            });

        return response()->json([
            'counts' => $counts,
            'total' => $all->count(),
            'projects' => $projects,
        ]);
    }

    /**
     * Department analytics (Phase 3, spec 2.3): per-cycle outcome numbers
     * for the department office. JSON only; the department page renders a
     * simple section from it.
     * GET /api/department/analytics?cycle_id=&department_id=
     * Dept admins are scoped to their own department; admins may pass
     * department_id. Without cycle_id the department's latest cycle is used.
     */
    public function analytics(Request $request): JsonResponse
    {
        $user = Auth::user();
        if (! $user->isAdmin() && ! $user->isDepartmentAdmin()) {
            abort(403);
        }

        $departmentId = $user->isAdmin() && $request->filled('department_id')
            ? $request->integer('department_id')
            : (int) $user->department_id;

        $cycle = null;
        if ($request->filled('cycle_id')) {
            $cycle = AcademicCycle::find($request->integer('cycle_id'));
            if (! $cycle || (! $user->isAdmin() && (int) $cycle->department_id !== $departmentId)) {
                abort(404);
            }
        } elseif ($departmentId) {
            $cycle = AcademicCycle::where('department_id', $departmentId)->latest('id')->first();
        }

        $query = Project::query();
        if ($cycle) {
            $query->where('cycle_id', $cycle->id);
        } elseif ($departmentId) {
            $query->where('department_id', $departmentId);
        }

        $projects = $query->with(['supervisor:id,name', 'tags:id,name', 'submissions.reviews.scores'])->get();
        $template = $cycle?->rubricTemplate ?? RubricTemplate::defaultTemplate();

        $byStatus = [];
        foreach ($projects->countBy('status') as $status => $n) {
            $byStatus[$status] = $n;
        }

        $published = $projects->where('status', 'approved_published')->count();
        $evaluated = $projects->whereIn('status', ['approved_published', 'not_passed', 'revision_required'])->count();
        $passRate = $evaluated > 0 ? round($published / $evaluated * 100, 1) : null;

        $totals = [];
        $durations = [];
        foreach ($projects as $project) {
            if ($project->resultIsConfirmed()) {
                $total = $this->confirmedTotal($project, $template);
                if ($total !== null) {
                    $totals[] = $total;
                }
            }
            if ($project->status === 'approved_published' && $project->published_at) {
                $firstProposal = $project->submissions->where('stage', 'proposal')->sortBy('id')->first();
                if ($firstProposal) {
                    $durations[] = $firstProposal->created_at->diffInDays($project->published_at);
                }
            }
        }

        $supervisorLoad = $projects->whereNotNull('supervisor_id')
            ->groupBy('supervisor_id')
            ->map(fn ($group) => [
                'supervisorId' => $group->first()->supervisor_id,
                'supervisorName' => $group->first()->supervisor?->name,
                'projects' => $group->count(),
            ])
            ->sortByDesc('projects')
            ->values();

        $topTags = $projects->where('status', 'approved_published')
            ->flatMap(fn ($p) => $p->tags->pluck('name'))
            ->countBy()
            ->sortDesc()
            ->take(5)
            ->map(fn ($n, $name) => ['tag' => $name, 'projects' => $n])
            ->values();

        return response()->json([
            'cycleId' => $cycle?->id,
            'cycleLabel' => $cycle ? "{$cycle->academic_year} · {$cycle->semester}" : null,
            'totalProjects' => $projects->count(),
            'byStatus' => $byStatus,
            'passRate' => $passRate,
            'evaluatedProjects' => $evaluated,
            'averageRubricTotal' => $totals ? round(array_sum($totals) / count($totals), 2) : null,
            'averageDaysProposalToPublished' => $durations ? round(array_sum($durations) / count($durations), 1) : null,
            'supervisorLoad' => $supervisorLoad,
            'topTags' => $topTags,
        ]);
    }

    /** Weighted total of the confirming review for a project, or null. */
    private function confirmedTotal(Project $project, RubricTemplate $template): ?float
    {
        $latestFinal = $project->submissions->where('stage', 'final')->sortByDesc('id')->first();
        if (! $latestFinal) {
            return null;
        }
        $reviews = $latestFinal->reviews;
        $confirming = $reviews->first(fn ($r) => in_array($r->reviewer_role, ['dept_admin', 'admin'], true))
            ?? $reviews->firstWhere('reviewer_id', (int) $project->examiner_id)
            ?? $reviews->firstWhere('reviewer_id', (int) $project->supervisor_id)
            ?? $reviews->first();

        return $confirming ? $template->weightedTotal($confirming->scoresByKey()) : null;
    }

    /**
     * Cycle export (spec 6.9 / WF8): one row per project with team,
     * staff, version counts and the confirmed rubric outcome.
     * GET /api/cycles/{cycle}/export?format=csv|json
     */
    public function export(Request $request, AcademicCycle $cycle): JsonResponse|StreamedResponse
    {
        $user = Auth::user();
        $allowed = $user->isAdmin()
            || ($user->isDepartmentAdmin() && (int) $user->department_id === (int) $cycle->department_id);
        if (! $allowed) {
            abort(403);
        }

        [$headers, $rows] = $this->exportTable($cycle);

        if ($request->query('format') === 'json') {
            $objects = array_map(fn ($row) => array_combine($headers, $row), $rows);

            return response()->json(['cycleId' => $cycle->id, 'rows' => $objects]);
        }

        return response()->streamDownload(function () use ($headers, $rows) {
            $out = fopen('php://output', 'w');
            fputcsv($out, $headers);
            foreach ($rows as $row) {
                fputcsv($out, $row);
            }
            fclose($out);
        }, "cycle-{$cycle->id}-export.csv", ['Content-Type' => 'text/csv']);
    }

    /** @return array{0: string[], 1: array<int, array<int, mixed>>} [headers, rows] */
    private function exportTable(AcademicCycle $cycle): array
    {
        $template = $cycle->rubricTemplate ?? RubricTemplate::defaultTemplate();
        $criteria = $template->criteriaByKey();

        $headers = [
            'Project title', 'Status', 'Team leader', 'Members', 'Supervisor', 'Examiner',
            'Proposal versions', 'Final versions', 'Weighted rubric total', 'Result', 'Published at',
        ];
        foreach ($criteria as $criterion) {
            $headers[] = 'Mark: '.$criterion['label'];
        }

        $projects = $cycle->projects()
            ->with([
                'team.leader:id,name',
                'team.memberships.user:id,name,roll_number',
                'supervisor:id,name',
                'examiner:id,name',
                'submissions.reviews.scores',
            ])
            ->orderBy('title')
            ->get();

        $rows = [];
        foreach ($projects as $project) {
            $members = $project->team
                ? $project->team->memberships
                    ->where('invite_status', 'confirmed')
                    ->map(fn ($m) => trim(($m->user?->name ?? '').' ('.($m->user?->roll_number ?? 'no roll').')'))
                    ->implode('; ')
                : '';

            $submissions = $project->submissions;
            $latestFinal = $submissions->where('stage', 'final')->sortByDesc('id')->first();

            // The confirming review: authority review first, then the
            // examiner's, then the supervisor's (spec 6.7).
            $confirming = null;
            if ($latestFinal && $project->resultIsConfirmed()) {
                $reviews = $latestFinal->reviews;
                $confirming = $reviews->first(fn ($r) => in_array($r->reviewer_role, ['dept_admin', 'admin'], true))
                    ?? $reviews->firstWhere('reviewer_id', (int) $project->examiner_id)
                    ?? $reviews->firstWhere('reviewer_id', (int) $project->supervisor_id)
                    ?? $reviews->first();
            }

            $total = $confirming ? $template->weightedTotal($confirming->scoresByKey()) : null;
            $scoresByKey = $confirming ? $confirming->scoresByKey() : [];

            $row = [
                $project->title,
                $project->status,
                $project->team?->leader?->name ?? '',
                $members,
                $project->supervisor?->name ?? '',
                $project->examiner?->name ?? '',
                $submissions->where('stage', 'proposal')->count(),
                $submissions->where('stage', 'final')->count(),
                $total !== null ? number_format($total, 2) : '',
                $this->resultLabel($project),
                $project->published_at?->toISOString() ?? '',
            ];
            foreach ($criteria as $key => $criterion) {
                $row[] = isset($scoresByKey[$key]) ? number_format($scoresByKey[$key], 2) : '';
            }
            $rows[] = $row;
        }

        return [$headers, $rows];
    }

    private function resultLabel(Project $project): string
    {
        return match ($project->status) {
            'approved_published' => 'Pass (published)',
            'revision_required' => 'Revision required',
            'not_passed' => 'Not passed',
            'archived' => 'Archived',
            default => 'In progress',
        };
    }

    private function stageForStatus(string $status): string
    {
        return match ($status) {
            'draft', 'proposal_submitted', 'proposal_changes_requested', 'proposal_declined' => 'proposal',
            'mid_review_submitted' => 'mid_review',
            'final_submitted', 'under_evaluation', 'revision_required', 'approved_published', 'not_passed' => 'final',
            default => 'in_progress',
        };
    }

    /** @return array<string, mixed> */
    private function validateCycle(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'department_id' => "$required|exists:departments,id",
            'academic_year' => "$required|string|max:20",
            'semester' => "$required|string|max:50",
            'project_type' => 'sometimes|in:course_project,final_year_project',
            'team_min' => 'sometimes|integer|min:1|max:50',
            'team_max' => 'sometimes|integer|min:1|max:50|gte:team_min',
            'supervisor_capacity' => 'sometimes|integer|min:1|max:100',
            'proposal_deadline' => "$required|date",
            'mid_deadline' => 'nullable|date',
            'final_deadline' => "$required|date",
            'report_pdf_visibility' => 'sometimes|in:public,university',
            'rubric_template_id' => 'nullable|exists:rubric_templates,id',
            'status' => 'sometimes|in:'.implode(',', AcademicCycle::STATUSES),
        ]);
    }

    /** @return array<string, mixed> */
    private function formatCycle(AcademicCycle $cycle): array
    {
        return [
            'id' => $cycle->id,
            'departmentId' => $cycle->department_id,
            'departmentName' => $cycle->department?->name,
            'academic_year' => $cycle->academic_year,
            'semester' => $cycle->semester,
            'project_type' => $cycle->project_type,
            'team_min' => $cycle->team_min,
            'team_max' => $cycle->team_max,
            'supervisor_capacity' => $cycle->supervisor_capacity,
            'proposal_deadline' => $cycle->proposal_deadline->toISOString(),
            'mid_deadline' => $cycle->mid_deadline?->toISOString(),
            'final_deadline' => $cycle->final_deadline->toISOString(),
            'report_pdf_visibility' => $cycle->report_pdf_visibility,
            'rubric_template_id' => $cycle->rubric_template_id,
            'status' => $cycle->status,
            'createdAt' => $cycle->created_at?->toISOString(),
        ];
    }
}
