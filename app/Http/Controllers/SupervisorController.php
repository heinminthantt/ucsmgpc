<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SupervisorController extends Controller
{
    private function requireSupervisorOrAdmin(): void
    {
        $user = Auth::user();
        if (!$user->isSupervisor() && !$user->isAdmin()) abort(403);
    }

    public function index(): Response
    {
        $this->requireSupervisorOrAdmin();
        return Inertia::render('supervisor/dashboard');
    }

    public function pendingProjects(): JsonResponse
    {
        $this->requireSupervisorOrAdmin();

        $projects = Project::with(['user:id,name', 'department:id,name', 'course:id,name,code', 'tags'])
            ->where('supervisor_id', Auth::id())
            ->where('approval_status', 'pending')
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
                'createdAt' => $p->created_at?->toISOString(),
            ]);

        return response()->json($projects);
    }

    public function approve(Project $project): JsonResponse
    {
        $this->requireSupervisorOrAdmin();
        if ($project->supervisor_id !== Auth::id() && !Auth::user()->isAdmin()) abort(403);

        $project->update([
            'approval_status' => 'approved',
            'approved_at' => now(),
            'approved_by' => Auth::id(),
        ]);

        // Notify project owner
        ProjectNotification::create([
            'recipient_user_id' => $project->user_id,
            'message' => 'Your project "' . $project->title . '" has been approved!',
            'project_id' => $project->id,
            'notification_type' => 'approval',
            'project_title' => $project->title,
            'approver_name' => Auth::user()->name,
        ]);

        return response()->json(['message' => 'Project approved', 'approvalStatus' => 'APPROVED']);
    }

    public function reject(Request $request, Project $project): JsonResponse
    {
        $this->requireSupervisorOrAdmin();
        if ($project->supervisor_id !== Auth::id() && !Auth::user()->isAdmin()) abort(403);

        $validated = $request->validate(['reason' => 'required|string|max:1000']);

        $project->update(['approval_status' => 'rejected']);

        // Notify project owner
        ProjectNotification::create([
            'recipient_user_id' => $project->user_id,
            'message' => 'Your project "' . $project->title . '" has been rejected.',
            'project_id' => $project->id,
            'notification_type' => 'rejection',
            'project_title' => $project->title,
            'approver_name' => Auth::user()->name,
            'rejection_reason' => $validated['reason'],
        ]);

        return response()->json(['message' => 'Project rejected', 'approvalStatus' => 'REJECTED']);
    }
}
