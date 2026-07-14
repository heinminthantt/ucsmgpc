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
    private function requireAdmin(): void
    {
        if (!Auth::user()->isAdmin()) abort(403);
    }

    public function index(): Response
    {
        $this->requireAdmin();
        return Inertia::render('admin/dashboard');
    }

    public function users(Request $request): JsonResponse
    {
        $this->requireAdmin();
        $size = min((int)($request->size ?? 100), 200);
        $page = max((int)($request->page ?? 0), 0) + 1;

        $paginated = User::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate($size, ['*'], 'page', $page);

        return response()->json([
            'content' => $paginated->items(),
            'totalPages' => $paginated->lastPage(),
            'number' => $paginated->currentPage() - 1,
        ]);
    }

    public function projects(Request $request): JsonResponse
    {
        $this->requireAdmin();
        $size = min((int)($request->size ?? 100), 200);
        $page = max((int)($request->page ?? 0), 0) + 1;

        $paginated = Project::with(['user:id,name', 'department:id,name', 'supervisor:id,name'])
            ->orderBy('created_at', 'desc')
            ->paginate($size, ['*'], 'page', $page);

        return response()->json([
            'content' => $paginated->items(),
            'totalPages' => $paginated->lastPage(),
            'number' => $paginated->currentPage() - 1,
        ]);
    }

    public function updateUserRole(Request $request, User $user): JsonResponse
    {
        $this->requireAdmin();
        $validated = $request->validate(['role' => 'required|in:user,supervisor,admin']);
        $user->update(['role' => $validated['role']]);
        return response()->json($user);
    }

    public function deactivateUser(User $user): JsonResponse
    {
        $this->requireAdmin();
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
        return response()->json($supervisors);
    }
}
