<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    public const DECISIONS = ['accept', 'request_changes', 'decline', 'pass', 'revision_required', 'fail'];

    /** Decisions that must carry a written comment (spec 4.5 / RV2). */
    public const COMMENT_REQUIRED_FOR = ['request_changes', 'decline', 'revision_required', 'fail'];

    protected $fillable = [
        'submission_id',
        'reviewer_id',
        'reviewer_role',
        'decision',
        'comment',
    ];

    /** @return BelongsTo<Submission, $this> */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    /** @return BelongsTo<User, $this> */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
