<?php

namespace App\Http\Controllers;

use App\Models\SavedProject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SavedProjectController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('projects/saved');
    }

    public function list(): JsonResponse
    {
        $saved = SavedProject::where('user_id', Auth::id())
            ->with(['project.tags', 'project.department', 'project.course', 'project.supervisor', 'project.files', 'project.user'])
            ->latest()
            ->get()
            ->map(fn($s) => ($s->project && $s->project->isPublished()) ? (new ProjectController)->formatProjectPublic($s->project) : null)
            ->filter()
            ->values();

        return response()->json($saved);
    }

    public function check(Request $request): JsonResponse
    {
        $request->validate(['project_id' => 'required|exists:projects,id']);
        $exists = SavedProject::where('project_id', $request->project_id)
            ->where('user_id', Auth::id())
            ->exists();
        return response()->json($exists);
    }

    public function toggle(Request $request): JsonResponse
    {
        $request->validate(['project_id' => 'required|exists:projects,id']);

        $project = \App\Models\Project::findOrFail($request->project_id);
        $existing = SavedProject::where('project_id', $request->project_id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['saved' => false]);
        }

        if (!$project->isPublished()) {
            return response()->json(['message' => 'Only published projects can be saved.'], 422);
        }

        SavedProject::create([
            'project_id' => $request->project_id,
            'user_id' => Auth::id(),
        ]);

        return response()->json(['saved' => true]);
    }
}
