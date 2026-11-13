<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Submission extends Model
{
    public const STAGES = ['proposal', 'mid_review', 'final'];

    public const STATUSES = ['submitted', 'changes_requested', 'accepted', 'declined'];

    protected $fillable = [
        'project_id',
        'stage',
        'version',
        'payload_json',
        'submitted_by',
        'submitted_at',
        'is_late',
        'status',
    ];

    protected $casts = [
        'payload_json' => 'array',
        'submitted_at' => 'datetime',
        'is_late' => 'boolean',
        'version' => 'integer',
    ];

    /** @return BelongsTo<Project, $this> */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /** @return BelongsTo<User, $this> */
    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    /** @return HasMany<Review, $this> */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /** @return HasMany<ProjectFile, $this> */
    public function files(): HasMany
    {
        return $this->hasMany(ProjectFile::class);
    }

    /** Next version number for a project's stage (1 for the first submission). */
    public static function nextVersion(int $projectId, string $stage): int
    {
        return (int) static::where('project_id', $projectId)
            ->where('stage', $stage)
            ->max('version') + 1;
    }
}
