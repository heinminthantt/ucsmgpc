<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectNotification extends Model
{
    protected $table = 'project_notifications';

    protected $fillable = [
        'recipient_user_id',
        'message',
        'project_id',
        'comment_id',
        'notification_type',
        'project_title',
        'comment_text',
        'commenter_name',
        'approver_name',
        'rejection_reason',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_user_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function comment(): BelongsTo
    {
        return $this->belongsTo(Comment::class);
    }
}
