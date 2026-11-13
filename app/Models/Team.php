<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Team extends Model
{
    protected $fillable = [
        'cycle_id',
        'leader_id',
        'name',
        'status',
    ];

    /** @return BelongsTo<AcademicCycle, $this> */
    public function cycle(): BelongsTo
    {
        return $this->belongsTo(AcademicCycle::class, 'cycle_id');
    }

    /** @return BelongsTo<User, $this> */
    public function leader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    /** All membership rows, including pending/declined invites. */
    /** @return HasMany<TeamUser, $this> */
    public function memberships(): HasMany
    {
        return $this->hasMany(TeamUser::class);
    }

    /** @return BelongsToMany<User, $this> */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_user')
            ->withPivot(['id', 'role', 'invite_status', 'invited_at', 'confirmed_at']);
    }

    /** @return BelongsToMany<User, $this> */
    public function confirmedMembers(): BelongsToMany
    {
        return $this->members()->wherePivot('invite_status', 'confirmed');
    }

    /** @return HasOne<Project, $this> */
    public function project(): HasOne
    {
        return $this->hasOne(Project::class);
    }

    public function confirmedMemberCount(): int
    {
        return $this->memberships()->where('invite_status', 'confirmed')->count();
    }
}
