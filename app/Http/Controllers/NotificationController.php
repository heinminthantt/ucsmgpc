<?php

namespace App\Http\Controllers;

use App\Models\ProjectNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('notifications');
    }

    public function list(): JsonResponse
    {
        $notifications = ProjectNotification::where('recipient_user_id', Auth::id())
            ->with('project:id,title')
            ->latest()
            ->get();

        return response()->json($notifications);
    }

    public function unreadCount(): JsonResponse
    {
        $count = ProjectNotification::where('recipient_user_id', Auth::id())
            ->where('is_read', false)
            ->count();
        return response()->json(['count' => $count]);
    }

    public function markRead(ProjectNotification $notification): JsonResponse
    {
        if ($notification->recipient_user_id !== Auth::id()) abort(403);
        $notification->update(['is_read' => true]);
        return response()->json(['message' => 'Marked as read']);
    }

    public function markAllRead(): JsonResponse
    {
        ProjectNotification::where('recipient_user_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);
        return response()->json(['message' => 'All marked as read']);
    }
}
