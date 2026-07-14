<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Reaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReactionController extends Controller
{
    public function status(Project $project): JsonResponse
    {
        $reacted = Reaction::where('project_id', $project->id)
            ->where('user_id', Auth::id())
            ->exists();

        return response()->json([
            'reacted' => $reacted,
            'count' => $project->reactions()->count(),
        ]);
    }

    public function toggle(Request $request): JsonResponse
    {
        $request->validate(['project_id' => 'required|exists:projects,id']);

        $project = Project::findOrFail($request->project_id);
        $existing = Reaction::where('project_id', $project->id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existing) {
            $existing->delete();
            $reacted = false;
        } else {
            Reaction::create(['project_id' => $project->id, 'user_id' => Auth::id()]);
            $reacted = true;
        }

        return response()->json([
            'reacted' => $reacted,
            'count' => $project->reactions()->count(),
        ]);
    }
}
