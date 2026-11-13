<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

/**
 * Tiny audit writer (spec NF10). Call sites pass the acting user, a dotted
 * action name, the subject model and any useful meta; the log row is the
 * record, nothing is emailed.
 */
class AuditLogger
{
    public function log(?User $actor, string $action, mixed $subject = null, array $meta = [], ?Request $request = null): AuditLog
    {
        $subjectType = null;
        $subjectId = null;
        if ($subject instanceof Model) {
            $subjectType = $subject->getMorphClass();
            $subjectId = $subject->getKey();
        } elseif (is_array($subject)) {
            $subjectType = $subject['type'] ?? null;
            $subjectId = $subject['id'] ?? null;
        }

        return AuditLog::create([
            'actor_id' => $actor?->id,
            'action' => $action,
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'meta_json' => $meta ?: null,
            'ip' => $request?->ip() ?? (app()->bound('request') ? request()->ip() : null),
        ]);
    }
}
