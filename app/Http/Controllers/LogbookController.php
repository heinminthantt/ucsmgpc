<?php

namespace App\Http\Controllers;

use App\Models\LogbookEntry;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Project logbook (spec 6.5 / WF5). Append-only by design: there are
 * deliberately no update or delete endpoints. Team members write; the
 * team, assigned supervisor/examiner, dept admin and admin can read.
 */
class LogbookController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        if (! $project->canBeViewedBy(Auth::user())) {
            abort(404);
        }

        $entries = $project->logbookEntries()
            ->with('author:id,name')
            ->orderBy('created_at')
            ->get()
            ->map(fn (LogbookEntry $e) => [
                'id' => $e->id,
                'authorId' => $e->author_id,
                'authorName' => $e->author?->name,
                'body' => $e->body,
                'link' => $e->link,
                'createdAt' => $e->created_at?->toISOString(),
            ]);

        return response()->json($entries);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        $user = Auth::user();
        $isTeamMember = $project->user_id === $user->id
            || ($project->team && $project->team->memberships()
                ->where('user_id', $user->id)
                ->where('invite_status', 'confirmed')
                ->exists());
        if (! $isTeamMember) {
            abort(403, 'Only confirmed team members can add logbook entries.');
        }

        $validated = $request->validate([
            'body' => 'required|string|max:5000',
            'link' => 'nullable|url|max:255',
        ]);

        $entry = LogbookEntry::create([
            'project_id' => $project->id,
            'author_id' => $user->id,
            'body' => $validated['body'],
            'link' => $validated['link'] ?? null,
        ]);

        return response()->json([
            'id' => $entry->id,
            'authorId' => $entry->author_id,
            'authorName' => $user->name,
            'body' => $entry->body,
            'link' => $entry->link,
            'createdAt' => $entry->created_at?->toISOString(),
        ], 201);
    }
}
