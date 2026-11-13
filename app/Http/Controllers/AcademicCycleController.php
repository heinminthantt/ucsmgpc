<?php

namespace App\Http\Controllers;

use App\Models\AcademicCycle;
use App\Services\ProjectLifecycle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    public function update(Request $request, AcademicCycle $cycle): JsonResponse
    {
        $validated = $this->validateCycle($request, partial: true);
        $cycle->update($validated);

        return response()->json($this->formatCycle($cycle->load('department:id,name')));
    }

    /** Close a cycle: freeze it and archive its projects through the lifecycle service. */
    public function close(AcademicCycle $cycle, ProjectLifecycle $lifecycle): JsonResponse
    {
        $cycle->update(['status' => 'closed']);

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
            'status' => $cycle->status,
            'createdAt' => $cycle->created_at?->toISOString(),
        ];
    }
}
