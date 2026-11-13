<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DefenseRecord extends Model
{
    protected $fillable = [
        'project_id',
        'scheduled_at',
        'venue',
        'panel_json',
        'note',
        'created_by',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'panel_json' => 'array',
    ];

    /** @return BelongsTo<Project, $this> */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
