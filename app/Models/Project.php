<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'benefits',
        'body',
        'content_format',
        'cover_image_url',
        'excerpt',
        'academic_year',
        'student_year',
        'objectives',
        'github_link',
        'members_json',
        'user_id',
        'department_id',
        'course_id',
        'supervisor_id',
        'approval_status',
        'approved_at',
        'approved_by',
        'cycle_id',
        'team_id',
        'examiner_id',
        'status',
        'published_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saving(function (Project $project) {
            // Auto-generate excerpt from body
            if ($project->body) {
                $plainText = strip_tags($project->body);
                $plainText = preg_replace('/\s+/', ' ', trim($plainText));
                $project->excerpt = substr($plainText, 0, 500);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /** @return BelongsTo<AcademicCycle, $this> */
    public function cycle(): BelongsTo
    {
        return $this->belongsTo(AcademicCycle::class, 'cycle_id');
    }

    /** @return BelongsTo<Team, $this> */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /** @return BelongsTo<User, $this> */
    public function examiner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'examiner_id');
    }

    /** @return HasMany<Submission, $this> */
    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class)->latest();
    }

    /** True once the project has passed and is in the public catalog. */
    public function isPublished(): bool
    {
        return $this->status === 'approved_published'
            || $this->approval_status === 'approved';
    }

    /** Users allowed to see this project while it is unpublished (spec 3.3). */
    public function canBeViewedBy(?User $user): bool
    {
        if ($this->isPublished()) {
            return true;
        }
        if (!$user) {
            return false;
        }
        if ($user->isAdmin() || $this->user_id === $user->id
            || $this->supervisor_id === $user->id || $this->examiner_id === $user->id) {
            return true;
        }
        if ($user->isDepartmentAdmin() && $user->department_id
            && (int) $user->department_id === (int) $this->department_id) {
            return true;
        }
        if ($this->team_id) {
            return $this->team->memberships()
                ->where('user_id', $user->id)
                ->where('invite_status', 'confirmed')
                ->exists();
        }
        return false;
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'project_tags');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(Member::class, 'project_members')->withPivot('joined_at');
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->latest();
    }

    public function files(): HasMany
    {
        return $this->hasMany(ProjectFile::class);
    }

    public function savedByUsers(): HasMany
    {
        return $this->hasMany(SavedProject::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(ProjectNotification::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        // Published in either the new lifecycle status or the legacy flag,
        // so the public catalog never loses a project during the transition.
        return $query->where(function ($q) {
            $q->where('status', 'approved_published')
                ->orWhere('approval_status', 'approved');
        });
    }

    public function scopePublished($query)
    {
        return $this->scopeApproved($query);
    }

    public function scopePending($query)
    {
        return $query->where('approval_status', 'pending');
    }

    public function scopeForSupervisor($query, int $supervisorId)
    {
        return $query->where('supervisor_id', $supervisorId);
    }
}
