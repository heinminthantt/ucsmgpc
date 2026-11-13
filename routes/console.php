<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Phase 2 (spec section 8): 3-day / 1-day stage deadline reminders,
// deduped inside the command via deadline_reminders_sent.
Schedule::command('reminders:send')->daily();
