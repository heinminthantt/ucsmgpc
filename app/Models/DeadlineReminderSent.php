<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeadlineReminderSent extends Model
{
    protected $table = 'deadline_reminders_sent';

    protected $fillable = [
        'project_id',
        'stage',
        'days_before',
        'sent_on',
    ];

    protected $casts = [
        'sent_on' => 'date',
        'days_before' => 'integer',
    ];

    /** @return BelongsTo<Project, $this> */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
