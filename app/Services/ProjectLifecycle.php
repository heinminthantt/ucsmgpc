<?php

namespace App\Services;

use App\Mail\ProjectNotificationMail;
use App\Models\Project;
use App\Models\ProjectNotification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use InvalidArgumentException;

/**
 * The ONLY place a project's lifecycle status changes (spec 9.3 / NF15).
 *
 * Controllers and other services must call transition() instead of setting
 * Project::$status or Project::$approval_status directly. The legacy
 * approval_status column is kept in sync here so the existing React screens
 * and supervisor endpoints keep working during the Phase 1 transition.
 *
 * Transitions enforced are spec section 5.2, Phase 1 set, plus the
 * mid-review checkpoint pair (in_progress <-> mid_review_submitted).
 */
class ProjectLifecycle
{
    /** @var array<string, string[]> from-status => allowed to-statuses */
    public const TRANSITIONS = [
        'draft' => ['proposal_submitted'],
        'proposal_submitted' => ['proposal_changes_requested', 'in_progress', 'proposal_declined'],
        'proposal_changes_requested' => ['proposal_submitted'],
        'proposal_declined' => ['draft'],
        'in_progress' => ['mid_review_submitted', 'final_submitted'],
        'mid_review_submitted' => ['in_progress'],
        'final_submitted' => ['under_evaluation'],
        'under_evaluation' => ['revision_required', 'approved_published', 'not_passed'],
        'revision_required' => ['final_submitted'],
        'approved_published' => ['archived'],
        'not_passed' => [],
        'archived' => [],
    ];

    /** Lifecycle status => legacy approval_status value kept in sync. */
    private const APPROVAL_SYNC = [
        'approved_published' => 'approved',
        'proposal_declined' => 'rejected',
        'not_passed' => 'rejected',
        // 'archived' deliberately absent: archiving keeps whatever
        // approval_status the project had (published stays approved).
    ];

    public function canTransition(Project $project, string $to): bool
    {
        $from = $project->status ?: 'draft';

        return in_array($to, self::TRANSITIONS[$from] ?? [], true);
    }

    /**
     * Move a project to a new lifecycle status, sync the legacy column,
     * stamp publication fields where relevant, and notify per spec 8.
     *
     * @throws InvalidArgumentException when the transition is not allowed.
     */
    public function transition(Project $project, string $to, ?User $actor = null, ?string $comment = null): Project
    {
        $from = $project->status ?: 'draft';

        if (! $this->canTransition($project, $to)) {
            throw new InvalidArgumentException(
                "Project #{$project->id} cannot move from '{$from}' to '{$to}'."
            );
        }

        $updates = ['status' => $to];

        if (array_key_exists($to, self::APPROVAL_SYNC)) {
            $updates['approval_status'] = self::APPROVAL_SYNC[$to];
        } elseif ($to !== 'archived') {
            // Every working state is "pending" in the legacy vocabulary.
            $updates['approval_status'] = 'pending';
        }

        if ($to === 'approved_published') {
            $updates['published_at'] = now();
            $updates['approved_at'] = $project->approved_at ?? now();
            if ($actor) {
                $updates['approved_by'] = $actor->id;
            }
        }

        $project->update($updates);

        if ($to === 'in_progress' && $project->team_id && $project->team) {
            // Spec 6.4: accepting a proposal locks team membership (TM4).
            $project->team->update(['status' => 'locked']);
        }

        $this->notify($project, $from, $to, $actor, $comment);

        return $project;
    }

    /**
     * Notifications for a transition (spec section 8): an in-app
     * ProjectNotification row (what the notifications UI reads) plus a
     * queued email to the same recipient, created together in notifyUser().
     */
    private function notify(Project $project, string $from, string $to, ?User $actor, ?string $comment): void
    {
        $title = $project->title;
        $actorName = $actor?->name;

        $toTeam = fn (string $message, string $type, ?string $reason = null) => $this->notifyTeam(
            $project, $message, $type, $actorName, $reason
        );

        switch ($to) {
            case 'proposal_submitted':
                if ($project->supervisor_id) {
                    $this->notifyUser($project, $project->supervisor_id,
                        ($from === 'proposal_changes_requested' ? 'A project was resubmitted for your review: "'.$title.'".' : 'A new proposal was submitted for your review: "'.$title.'".'),
                        'submission', $actorName);
                }
                break;

            case 'proposal_changes_requested':
                $toTeam('Changes were requested on your proposal for "'.$title.'". You can edit it and resubmit.', 'review', $comment);
                break;

            case 'proposal_declined':
                $toTeam('Your proposal for "'.$title.'" was declined. You can revise it and submit a new proposal, or request a different supervisor.', 'rejection', $comment);
                break;

            case 'in_progress':
                // Reached either by a mid-review checkpoint return (from
                // mid_review_submitted) or by proposal acceptance.
                if ($from === 'mid_review_submitted') {
                    $toTeam('Mid-review feedback was recorded for "'.$title.'". Your project continues in progress.', 'review', $comment);
                } else {
                    $toTeam('Your proposal for "'.$title.'" was accepted. Your project is now in progress.', 'approval');
                }
                break;

            case 'mid_review_submitted':
            case 'final_submitted':
                if ($project->supervisor_id) {
                    $label = $to === 'final_submitted' ? 'final submission' : 'mid-review report';
                    $this->notifyUser($project, $project->supervisor_id,
                        'A '.$label.' was submitted for "'.$title.'".', 'submission', $actorName);
                }
                break;

            case 'under_evaluation':
                if ($project->examiner_id) {
                    $this->notifyUser($project, $project->examiner_id,
                        'A project is ready for your evaluation: "'.$title.'".', 'evaluation', $actorName);
                }
                break;

            case 'revision_required':
                $toTeam('Revision was required after evaluation of "'.$title.'". You can fix it and resubmit the final package.', 'review', $comment);
                break;

            case 'approved_published':
                $toTeam('Your project "'.$title.'" passed and is now published in the catalog.', 'approval');
                break;

            case 'not_passed':
                $toTeam('The final result for "'.$title.'" was recorded as not passed.', 'rejection', $comment);
                break;

            default:
                // draft / archived: no notification required by the spec.
                break;
        }
    }

    private function notifyUser(Project $project, int $recipientId, string $message, string $type, ?string $actorName = null, ?string $reason = null): void
    {
        ProjectNotification::create([
            'recipient_user_id' => $recipientId,
            'message' => $message,
            'project_id' => $project->id,
            'notification_type' => $type,
            'project_title' => $project->title,
            'approver_name' => $actorName,
            'rejection_reason' => $reason,
        ]);

        // Spec section 8: the same notification also goes out as a queued
        // email. Inactive accounts are skipped (minimal status respect);
        // an email failure must never block the lifecycle action itself.
        $recipient = User::find($recipientId);
        if ($recipient && $recipient->is_active && filled($recipient->email)) {
            Mail::to($recipient)->queue(new ProjectNotificationMail(
                projectTitle: $project->title,
                messageText: $message,
                actorName: $actorName,
                notificationType: $type,
                projectUrl: route('projects.show-page', $project),
                reason: $reason,
            ));
        }
    }

    /**
     * Supervisor capacity guard for proposal acceptance (spec 6.4).
     *
     * Returns a human-readable block reason when accepting this project's
     * proposal would push its supervisor to/over the cycle capacity, or
     * null when the accept may proceed. Dept admins and system admins are
     * the override path and are never blocked here. Capacity comes from
     * the project's academic cycle; without a cycle (or no capacity set)
     * there is nothing configured to enforce, so it returns null — the
     * count query below still scopes by cycle when one exists and by the
     * supervisor's non-archived active projects when it does not.
     */
    public function capacityBlockReason(Project $project, ?User $actor = null): ?string
    {
        if (! $project->supervisor_id) {
            return null;
        }

        if ($actor && ($actor->isAdmin() || $actor->isDepartmentAdmin())) {
            return null;
        }

        $capacity = $project->cycle?->supervisor_capacity;
        if (! $capacity || (int) $capacity < 1) {
            return null;
        }

        // Projects this supervisor already carries past proposal acceptance.
        $active = ['in_progress', 'mid_review_submitted', 'final_submitted', 'under_evaluation', 'revision_required', 'approved_published'];

        $count = Project::query()
            ->where('supervisor_id', $project->supervisor_id)
            ->where('id', '!=', $project->id)
            ->whereIn('status', $active)
            ->when($project->cycle_id, fn ($q) => $q->where('cycle_id', $project->cycle_id))
            ->count();

        if ($count >= (int) $capacity) {
            return "This supervisor already supervises {$count} active team(s) in this cycle, which reaches the cycle capacity of {$capacity}. A department admin can accept this proposal as an override.";
        }

        return null;
    }

    /** Notify the project owner and every confirmed team member, once each. */
    private function notifyTeam(Project $project, string $message, string $type, ?string $actorName = null, ?string $reason = null): void
    {
        $recipientIds = collect([$project->user_id]);

        if ($project->team_id && $project->team) {
            $recipientIds = $recipientIds->merge(
                $project->team->memberships()
                    ->where('invite_status', 'confirmed')
                    ->pluck('user_id')
            );
        }

        foreach ($recipientIds->filter()->unique() as $recipientId) {
            $this->notifyUser($project, (int) $recipientId, $message, $type, $actorName, $reason);
        }
    }
}
