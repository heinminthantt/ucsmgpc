<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectNotification;
use App\Services\ProjectLifecycle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SupervisorController extends Controller
{


    public function index(): Response
    {
        return Inertia::render('supervisor/dashboard');
    }

    public function pendingProjects(): JsonResponse
    {

        $projects = Project::with(['user:id,name', 'department:id,name', 'course:id,name,code', 'tags'])
            ->where('supervisor_id', Auth::id())
            ->where(function ($q) {
                // Legacy pending flag OR any lifecycle state waiting on a
                // supervisor, so resubmitted projects reappear here (FX1).
                $q->where('approval_status', 'pending')
                    ->orWhereIn('status', ['proposal_submitted', 'mid_review_submitted', 'final_submitted', 'under_evaluation']);
            })
            ->latest()
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'description' => $p->description,
                'objectives' => $p->objectives,
                'academic_year' => $p->academic_year,
                'student_year' => $p->student_year,
                'submittedByName' => $p->user?->name,
                'departmentName' => $p->department?->name,
                'courseName' => $p->course?->name,
                'tags' => $p->tags->pluck('name')->toArray(),
                'approvalStatus' => strtoupper($p->approval_status),
                'status' => $p->status,
                'createdAt' => $p->created_at?->toISOString(),
            ]);

        return response()->json($projects);
    }

    public function approve(Project $project, ProjectLifecycle $lifecycle): JsonResponse
    {
        if ($project->supervisor_id !== Auth::id() && !Auth::user()->isAdmin()) abort(403);

        // Legacy endpoint, lifecycle-backed: "approve" advances the project
        // to its next approved state instead of writing approval_status
        // directly. The lifecycle service creates the owner notification.
        try {
            if ($lifecycle->canTransition($project, 'in_progress')) {
                $lifecycle->transition($project, 'in_progress', Auth::user());
            } elseif ($project->status === 'final_submitted') {
                $lifecycle->transition($project, 'under_evaluation', Auth::user());
                $lifecycle->transition($project, 'approved_published', Auth::user());
            } elseif ($lifecycle->canTransition($project, 'approved_published')) {
                $lifecycle->transition($project, 'approved_published', Auth::user());
            } else {
                return response()->json([
                    'message' => "This project cannot be approved from its current status ('{$project->status}'). Use the submission review endpoint.",
                ], 422);
            }
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Project approved',
            'approvalStatus' => strtoupper($project->refresh()->approval_status),
            'status' => $project->status,
        ]);
    }

    public function reject(Request $request, Project $project, ProjectLifecycle $lifecycle): JsonResponse
    {
        if ($project->supervisor_id !== Auth::id() && !Auth::user()->isAdmin()) abort(403);

        $validated = $request->validate(['reason' => 'required|string|max:1000']);

        // Lifecycle-backed rejection: a proposal is declined (the team can
        // reopen it), a final package goes back as revision_required. The
        // lifecycle transition itself notifies the team (with the reason),
        // so this endpoint no longer creates its own notification row.
        try {
            if ($lifecycle->canTransition($project, 'proposal_declined')) {
                $lifecycle->transition($project, 'proposal_declined', Auth::user(), $validated['reason']);
            } elseif ($project->status === 'final_submitted') {
                $lifecycle->transition($project, 'under_evaluation', Auth::user());
                $lifecycle->transition($project, 'revision_required', Auth::user(), $validated['reason']);
            } elseif ($lifecycle->canTransition($project, 'revision_required')) {
                $lifecycle->transition($project, 'revision_required', Auth::user(), $validated['reason']);
            }
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Project rejected',
            'approvalStatus' => strtoupper($project->refresh()->approval_status),
            'status' => $project->status,
        ]);
    }
}
