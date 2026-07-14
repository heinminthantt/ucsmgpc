<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function update(User $user, Project $project): bool
    {
        // Owner can edit if not approved; admins can always edit
        return ($project->user_id === $user->id && $project->approval_status !== 'approved')
            || $user->isAdmin();
    }

    public function delete(User $user, Project $project): bool
    {
        return $project->user_id === $user->id || $user->isAdmin();
    }
}
