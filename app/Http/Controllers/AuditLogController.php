<?php

namespace App\Http\Controllers;

use App\Models\AcademicCycle;
use App\Models\AuditLog;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Read side of the audit log (spec NF10). Admins see everything; a
 * department admin sees rows whose subject belongs to their department
 * (user/project/cycle subjects) or whose actor is in their department.
 * No UI page in Phase 2; the endpoint is the deliverable.
 */
class AuditLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        if (! $user->isAdmin() && ! $user->isDepartmentAdmin()) {
            abort(403);
        }

        $query = AuditLog::with('actor:id,name')->orderByDesc('id');

        if (! $user->isAdmin()) {
            $deptId = (int) $user->department_id;
            $userIds = User::where('department_id', $deptId)->pluck('id');
            $projectIds = Project::where('department_id', $deptId)->pluck('id');
            $cycleIds = AcademicCycle::where('department_id', $deptId)->pluck('id');

            $query->where(function ($q) use ($userIds, $projectIds, $cycleIds) {
                $q->whereIn('actor_id', $userIds)
                    ->orWhere(fn ($s) => $s->where('subject_type', User::class)->whereIn('subject_id', $userIds))
                    ->orWhere(fn ($s) => $s->where('subject_type', Project::class)->whereIn('subject_id', $projectIds))
                    ->orWhere(fn ($s) => $s->where('subject_type', AcademicCycle::class)->whereIn('subject_id', $cycleIds));
            });
        }

        if ($request->filled('action')) {
            $query->where('action', $request->string('action'));
        }

        $page = $query->paginate(50);

        return response()->json([
            'data' => collect($page->items())->map(fn (AuditLog $log) => [
                'id' => $log->id,
                'actorId' => $log->actor_id,
                'actorName' => $log->actor?->name,
                'action' => $log->action,
                'subjectType' => $log->subject_type,
                'subjectId' => $log->subject_id,
                'meta' => $log->meta_json,
                'createdAt' => $log->created_at?->toISOString(),
            ])->values(),
            'total' => $page->total(),
            'currentPage' => $page->currentPage(),
            'lastPage' => $page->lastPage(),
        ]);
    }
}
