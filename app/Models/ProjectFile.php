<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectFile extends Model
{
    public const KINDS = ['report_pdf', 'source_zip', 'slides', 'image', 'other'];

    protected $fillable = [
        'project_id',
        'file_path',
        'original_name',
        'kind',
        'submission_id',
        'size_bytes',
        'mime_type',
    ];

    protected $casts = [
        'size_bytes' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /** @return BelongsTo<Submission, $this> */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }
}
