<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One row of the team_user pivot, as a plain model so invites can be
 * addressed by id (POST /api/team-invites/{invite}/confirm|decline).
 * The pivot has no created_at/updated_at columns; invited_at and
 * confirmed_at carry the timing instead.
 */
class TeamUser extends Model
{
    protected $table = 'team_user';

    public $timestamps = false;

    protected $fillable = [
        'team_id',
        'user_id',
        'role',
        'invite_status',
        'invited_at',
        'confirmed_at',
    ];

    protected $casts = [
        'invited_at' => 'datetime',
        'confirmed_at' => 'datetime',
    ];

    /** @return BelongsTo<Team, $this> */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
