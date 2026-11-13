<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Passkeys\Contracts\PasskeyUser;
use Laravel\Passkeys\PasskeyAuthenticatable;

class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'password',
        'avatar_url',
        'bio',
        'locale',
        'role',
        'is_active',
        'roll_number',
        'department_id',
        'student_year',
        'cohort_year',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'cohort_year' => 'integer',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    // Role helpers. Compared case-insensitively: legacy seeders stored
    // roles uppercase (ADMIN / SUPERVISOR / USER) while newer code writes
    // lowercase, and both spellings exist in real databases.
    public function hasRole(string $role): bool
    {
        return strtoupper((string) $this->role) === strtoupper($role);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isSupervisor(): bool
    {
        return $this->hasRole('supervisor');
    }

    public function isDepartmentAdmin(): bool
    {
        return $this->hasRole('department_admin');
    }

    public function isUser(): bool
    {
        return $this->hasRole('user') || $this->hasRole('student');
    }

    // Relationships
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function supervisedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'supervisor_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class);
    }

    public function savedProjects(): HasMany
    {
        return $this->hasMany(SavedProject::class);
    }

    /** @return HasMany<UserInvite, $this> */
    public function invites(): HasMany
    {
        return $this->hasMany(UserInvite::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(ProjectNotification::class, 'recipient_user_id');
    }

    /** @return BelongsTo<Department, $this> */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /** Teams this user belongs to (any invite status), via team_user. */
    /** @return BelongsToMany<Team, $this> */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_user')
            ->withPivot(['id', 'role', 'invite_status', 'invited_at', 'confirmed_at']);
    }

    /** @return HasMany<TeamUser, $this> */
    public function teamMemberships(): HasMany
    {
        return $this->hasMany(TeamUser::class);
    }

    /** @return HasMany<Team, $this> */
    public function ledTeams(): HasMany
    {
        return $this->hasMany(Team::class, 'leader_id');
    }

    /** @return HasMany<Project, $this> */
    public function examinedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'examiner_id');
    }

    /** @return HasMany<Submission, $this> */
    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class, 'submitted_by');
    }

    /** @return HasMany<Review, $this> */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }
}
