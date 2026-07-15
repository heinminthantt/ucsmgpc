<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{


    public function index(): Response
    {
        return Inertia::render('admin/dashboard');
    }

    public function users(Request $request): JsonResponse
    {
        $size = min((int)($request->size ?? 100), 200);
        $page = max((int)($request->page ?? 0), 0) + 1;

        $paginated = User::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate($size, ['*'], 'page', $page);

        // ── FIX: Normalize role to uppercase in response ──
        $items = collect($paginated->items())->map(function ($user) {
            $userArray = $user->toArray();
            $userArray['role'] = strtoupper($userArray['role'] ?? 'USER');
            return $userArray;
        });

        return response()->json([
            'content' => $items,
            'totalPages' => $paginated->lastPage(),
            'number' => $paginated->currentPage() - 1,
        ]);
    }

    public function projects(Request $request): JsonResponse
    {
        $size = min((int)($request->size ?? 100), 200);
        $page = max((int)($request->page ?? 0), 0) + 1;

        $paginated = Project::with(['user:id,name', 'department:id,name', 'supervisor:id,name'])
            ->orderBy('created_at', 'desc')
            ->paginate($size, ['*'], 'page', $page);

        // ── FIX: Normalize approval_status to uppercase ──
        $items = collect($paginated->items())->map(function ($project) {
            $projectArray = $project->toArray();
            $projectArray['approvalStatus'] = strtoupper($projectArray['approval_status'] ?? 'PENDING');
            $projectArray['submittedByName'] = $projectArray['user']['name'] ?? null;
            unset($projectArray['approval_status']);
            return $projectArray;
        });

        return response()->json([
            'content' => $items,
            'totalPages' => $paginated->lastPage(),
            'number' => $paginated->currentPage() - 1,
        ]);
    }

    public function updateUserRole(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate(['role' => 'required|in:user,supervisor,admin']);
        $user->update(['role' => $validated['role']]);

        // ── FIX: Return normalized uppercase role ──
        $userArray = $user->toArray();
        $userArray['role'] = strtoupper($userArray['role']);
        return response()->json($userArray);
    }

    public function deactivateUser(User $user): JsonResponse
    {
        $user->update(['is_active' => false]);
        return response()->json(['message' => 'User deactivated']);
    }

    public function supervisors(): JsonResponse
    {
        $supervisors = User::where('role', 'supervisor')
            ->where('is_active', true)
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        // ── FIX: Normalize roles ──
        $normalized = $supervisors->map(function ($s) {
            $arr = $s->toArray();
            $arr['role'] = 'SUPERVISOR';
            return $arr;
        });

        return response()->json($normalized);
    }
}