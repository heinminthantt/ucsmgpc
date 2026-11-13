<?php

namespace App\Console\Commands;

use App\Models\AcademicCycle;
use App\Models\DeadlineReminderSent;
use App\Models\Project;
use App\Models\User;
use App\Services\Notifier;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;

/**
 * Spec section 8 (Phase 2): for every open/in-progress cycle, remind all
 * confirmed team members when a stage deadline (proposal, mid-review when
 * set, final) is exactly 3 days or 1 day away (Asia/Yangon calendar days)
 * and that stage has not been submitted yet.
 *
 * Deduped by deadline_reminders_sent (project + stage + offset), so the
 * daily schedule never double-sends. Run manually: php artisan reminders:send
 */
class SendDeadlineReminders extends Command
{
    protected $signature = 'reminders:send';

    protected $description = 'Send 3-day and 1-day deadline reminders to project teams';

    private const STAGES = [
        'proposal' => 'proposal_deadline',
        'mid_review' => 'mid_deadline',
        'final' => 'final_deadline',
    ];

    public function handle(): int
    {
        $today = CarbonImmutable::now('Asia/Yangon')->startOfDay();
        $sent = 0;

        $cycles = AcademicCycle::whereIn('status', ['open', 'in_progress', 'evaluation'])->get();

        foreach ($cycles as $cycle) {
            foreach (self::STAGES as $stage => $deadlineColumn) {
                $deadline = $cycle->{$deadlineColumn};
                if (! $deadline) {
                    continue;
                }

                $deadlineDay = CarbonImmutable::instance($deadline)->setTimezone('Asia/Yangon')->startOfDay();
                $daysUntil = (int) $today->diffInDays($deadlineDay, false);
                if (! in_array($daysUntil, [3, 1], true)) {
                    continue;
                }

                $projects = $cycle->projects()
                    ->whereNotIn('status', ['archived', 'approved_published', 'not_passed'])
                    ->whereDoesntHave('submissions', fn ($q) => $q->where('stage', $stage))
                    ->with(['team.confirmedMembers', 'user'])
                    ->get();

                foreach ($projects as $project) {
                    $already = DeadlineReminderSent::where('project_id', $project->id)
                        ->where('stage', $stage)
                        ->where('days_before', $daysUntil)
                        ->exists();
                    if ($already) {
                        continue;
                    }

                    foreach ($this->recipients($project) as $member) {
                        Notifier::notifyUser(
                            $project,
                            $member,
                            "Reminder: the {$stage} deadline for \"{$project->title}\" is in {$daysUntil} day(s) ({$deadlineDay->toDateString()}).",
                            'deadline_reminder'
                        );
                    }

                    DeadlineReminderSent::create([
                        'project_id' => $project->id,
                        'stage' => $stage,
                        'days_before' => $daysUntil,
                        'sent_on' => $today->toDateString(),
                    ]);
                    $sent++;
                }
            }
        }

        $this->info("Deadline reminders sent for {$sent} project/stage/offset combination(s).");

        return self::SUCCESS;
    }

    /** @return Collection<int, User> confirmed team members + project owner */
    private function recipients(Project $project)
    {
        $members = $project->team ? $project->team->confirmedMembers : collect();
        if ($project->user) {
            $members = $members->push($project->user);
        }

        return $members->unique('id')->values();
    }
}
