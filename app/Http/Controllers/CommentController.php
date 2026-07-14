<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Project;
use App\Models\ProjectNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        $comments = $project->comments()
            ->with('user:id,name,avatar_url')
            ->latest()
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'userId' => $c->user_id,
                'userName' => $c->user?->name,
                'userAvatar' => $c->user?->avatar_url,
                'comment' => $c->comment,
                'createdAt' => $c->created_at->toISOString(),
            ]);

        return response()->json($comments);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'comment' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'project_id' => $validated['project_id'],
            'user_id' => Auth::id(),
            'comment' => $validated['comment'],
        ]);

        // Notify project owner
        $project = Project::find($validated['project_id']);
        if ($project && $project->user_id !== Auth::id()) {
            ProjectNotification::create([
                'recipient_user_id' => $project->user_id,
                'message' => Auth::user()->name . ' commented on your project.',
                'project_id' => $project->id,
                'comment_id' => $comment->id,
                'notification_type' => 'comment',
                'project_title' => $project->title,
                'comment_text' => $comment->comment,
                'commenter_name' => Auth::user()->name,
            ]);
        }

        $comment->load('user:id,name,avatar_url');
        return response()->json([
            'id' => $comment->id,
            'userId' => $comment->user_id,
            'userName' => $comment->user?->name,
            'userAvatar' => $comment->user?->avatar_url,
            'comment' => $comment->comment,
            'createdAt' => $comment->created_at->toISOString(),
        ], 201);
    }

    public function destroy(Comment $comment): JsonResponse
    {
        if ($comment->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }
        $comment->delete();
        return response()->json(['message' => 'Comment deleted']);
    }
}
