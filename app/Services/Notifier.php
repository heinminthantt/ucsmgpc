<?php

namespace App\Services;

use App\Mail\ProjectNotificationMail;
use App\Models\Project;
use App\Models\ProjectNotification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

/**
 * Shared in-app + queued-email notification writer, mirroring the exact
 * pattern ProjectLifecycle uses privately (Phase 1). Used by Phase 2
 * features (examiner assignment, evaluation conflicts, deadline
 * reminders) so notifications stay consistent in shape.
 */
class Notifier
{
    public static function notifyUser(Project $project, User|int $recipient, string $message, string $type, ?string $actorName = null): void
    {
        $user = $recipient instanceof User ? $recipient : User::find($recipient);
        if (! $user) {
            return;
        }

        ProjectNotification::create([
            'recipient_user_id' => $user->id,
            'message' => $message,
            'project_id' => $project->id,
            'notification_type' => $type,
            'project_title' => $project->title,
            'approver_name' => $actorName,
        ]);

        if ($user->is_active && filled($user->email)) {
            Mail::to($user)->queue(new ProjectNotificationMail(
                projectTitle: $project->title,
                messageText: $message,
                actorName: $actorName,
                notificationType: $type,
                projectUrl: route('projects.show-page', $project),
            ));
        }
    }
}
