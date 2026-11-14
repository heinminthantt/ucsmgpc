<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function update(User $user, Project $project): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        // Published/archived records are not edited via the legacy form.
        if ($project->isPublished() || $project->status === 'archived') {
            return false;
        }

        if ($project->user_id === $user->id) {
            return true;
        }

        // Team leader or confirmed member may edit drafts/workspace content
        // when the project is still in an editable lifecycle state.
        if ($project->team) {
            $editable = in_array($project->status, [
                'draft', 'proposal_changes_requested', 'proposal_declined',
                'in_progress', 'mid_review_submitted', 'revision_required',
            ], true);

            if (! $editable) {
                return false;
            }

            if ((int) $project->team->leader_id === (int) $user->id) {
                return true;
            }

            return $project->team->memberships()
                ->where('user_id', $user->id)
                ->where('invite_status', 'confirmed')
                ->exists();
        }

        return false;
    }

    public function delete(User $user, Project $project): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        // Do not allow deleting published/archived records through the app.
        if ($project->isPublished() || $project->status === 'archived') {
            return false;
        }

        return (int) $project->user_id === (int) $user->id;
    }
}
