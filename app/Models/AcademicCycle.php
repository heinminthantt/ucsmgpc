<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademicCycle extends Model
{
    public const STATUSES = ['setup', 'open', 'in_progress', 'evaluation', 'closed', 'archived'];

    public const PROJECT_TYPES = ['course_project', 'final_year_project'];

    protected $fillable = [
        'department_id',
        'academic_year',
        'semester',
        'project_type',
        'team_min',
        'team_max',
        'supervisor_capacity',
        'proposal_deadline',
        'mid_deadline',
        'final_deadline',
        'rubric_template_id',
        'report_pdf_visibility',
        'status',
        'created_by',
    ];

    protected $casts = [
        'proposal_deadline' => 'datetime',
        'mid_deadline' => 'datetime',
        'final_deadline' => 'datetime',
        'team_min' => 'integer',
        'team_max' => 'integer',
        'supervisor_capacity' => 'integer',
    ];

    /** @return BelongsTo<Department, $this> */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return HasMany<Team, $this> */
    public function teams(): HasMany
    {
        return $this->hasMany(Team::class, 'cycle_id');
    }

    /** @return HasMany<Project, $this> */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'cycle_id');
    }

    /** Deadline that applies to a submission stage, if the cycle sets one. */
    public function deadlineFor(string $stage): ?CarbonInterface
    {
        return match ($stage) {
            'proposal' => $this->proposal_deadline,
            'mid_review' => $this->mid_deadline,
            'final' => $this->final_deadline,
            default => null,
        };
    }

    public function isOpenForTeams(): bool
    {
        return in_array($this->status, ['open', 'in_progress'], true);
    }
}
