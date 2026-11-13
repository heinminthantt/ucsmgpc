<?php

use App\Mail\ProjectNotificationMail;
use App\Models\AcademicCycle;
use App\Models\AuditLog;
use App\Models\Department;
use App\Models\Project;
use App\Models\ProjectNotification;
use App\Models\RubricTemplate;
use App\Models\Submission;
use App\Models\Team;
use App\Models\TeamUser;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

/**
 * Phase 2 (Assessment) tests: rubric scoring + weighted totals, the
 * examiner-confirmation rule, pass/fail dispute + dept admin resolution,
 * score visibility gating (spec D9), logbook, mid-review, defense records,
 * deadline reminders, cycle export, department board and audit logging.
 */
function phase2Department(): Department
{
    return Department::create(['name' => 'Computer Science']);
}

function phase2Cycle(Department $dept, User $creator, array $overrides = []): AcademicCycle
{
    return AcademicCycle::create(array_merge([
        'department_id' => $dept->id,
        'academic_year' => '2026-2027',
        'semester' => 'Semester VI',
        'project_type' => 'final_year_project',
        'team_min' => 1,
        'team_max' => 3,
        'supervisor_capacity' => 6,
        'proposal_deadline' => now()->addDays(7),
        'final_deadline' => now()->addDays(60),
        'status' => 'open',
        'created_by' => $creator->id,
    ], $overrides));
}

/** Draft project with a confirmed leader-only team. Returns [project, leader]. */
function phase2Project(Department $dept, AcademicCycle $cycle, User $supervisor, string $roll, string $title): array
{
    $leader = User::factory()->create(['department_id' => $dept->id, 'roll_number' => $roll]);
    $team = Team::create(['cycle_id' => $cycle->id, 'leader_id' => $leader->id, 'status' => 'active']);
    TeamUser::create(['team_id' => $team->id, 'user_id' => $leader->id, 'role' => 'leader',
        'invite_status' => 'confirmed', 'invited_at' => now(), 'confirmed_at' => now()]);

    $project = Project::create([
        'title' => $title,
        'description' => 'Problem statement for '.$title,
        'objectives' => 'Objectives for '.$title,
        'body' => 'Full report body for '.$title,
        'github_link' => 'https://github.com/example/'.$roll,
        'user_id' => $leader->id,
        'department_id' => $dept->id,
        'supervisor_id' => $supervisor->id,
        'cycle_id' => $cycle->id,
        'team_id' => $team->id,
        'approval_status' => 'pending',
        'status' => 'draft',
    ]);

    return [$project, $leader];
}

/** Drive a draft project through proposal acceptance to a submitted final. Returns the final Submission. */
function phase2DriveToFinal($test, Project $project, User $leader, User $supervisor): Submission
{
    $test->actingAs($leader)->postJson("/api/projects/{$project->id}/submit", ['stage' => 'proposal'])->assertCreated();
    $proposal = Submission::where('project_id', $project->id)->where('stage', 'proposal')->latest('id')->first();
    $test->actingAs($supervisor)->postJson("/api/submissions/{$proposal->id}/review", ['decision' => 'accept'])->assertOk();
    expect($project->refresh()->status)->toBe('in_progress');

    $test->actingAs($leader)->postJson("/api/projects/{$project->id}/submit", ['stage' => 'final'])->assertCreated();

    return Submission::where('project_id', $project->id)->where('stage', 'final')->latest('id')->first();
}

function phase2FullScores(int $base = 80): array
{
    return [
        ['criterion_key' => 'problem_objectives', 'score' => $base],
        ['criterion_key' => 'implementation', 'score' => $base],
        ['criterion_key' => 'documentation', 'score' => $base],
        ['criterion_key' => 'presentation_defense', 'score' => $base],
        ['criterion_key' => 'teamwork_process', 'score' => $base],
    ];
}

// ── Rubric math + default template ──────────────────────────────────────

test('rubric weighted total math, renormalisation and empty case', function () {
    $template = RubricTemplate::defaultTemplate();

    // (100*.15 + 100*.35 + 50*.20 + 0*.20 + 100*.10) = 70
    expect($template->weightedTotal([
        'problem_objectives' => 100,
        'implementation' => 100,
        'documentation' => 50,
        'presentation_defense' => 0,
        'teamwork_process' => 100,
    ]))->toBe(70.0)
        // Partial scoring renormalises over the scored criteria only.
        ->and($template->weightedTotal(['implementation' => 80]))->toBe(80.0)
        ->and($template->weightedTotal([]))->toBeNull()
        ->and((float) $template->pass_threshold)->toBe(50.0)
        ->and($template->criteriaByKey())->toHaveCount(5);
});

test('creating a cycle without a template attaches the spec default rubric', function () {
    $dept = phase2Department();
    $deptAdmin = User::factory()->create(['role' => 'department_admin', 'department_id' => $dept->id]);

    $response = $this->actingAs($deptAdmin)->postJson('/api/department/cycles', [
        'department_id' => $dept->id,
        'academic_year' => '2026-2027',
        'semester' => 'Semester VI',
        'proposal_deadline' => now()->addDays(7)->toDateString(),
        'final_deadline' => now()->addDays(60)->toDateString(),
    ])->assertCreated();

    $cycle = AcademicCycle::find($response->json('id'));
    expect($cycle->rubric_template_id)->not->toBeNull()
        ->and($cycle->rubricTemplate->name)->toBe(RubricTemplate::DEFAULT_NAME);
});

// ── Examiner confirmation ───────────────────────────────────────────────

test('examiner confirm flow: supervisor pass alone does not publish, examiner confirm does', function () {
    Mail::fake();
    $dept = phase2Department();
    $admin = User::factory()->create(['role' => 'admin']);
    $deptAdmin = User::factory()->create(['role' => 'department_admin', 'department_id' => $dept->id]);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $examiner = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $cycle = phase2Cycle($dept, $admin);
    [$project, $leader] = phase2Project($dept, $cycle, $supervisor, 'UCS-201', 'Examiner Confirm Project');
    $final = phase2DriveToFinal($this, $project, $leader, $supervisor);

    // Dept admin assigns the examiner; examiner is notified and queued.
    $this->actingAs($deptAdmin)->postJson("/api/projects/{$project->id}/assign-examiner", ['examiner_id' => $examiner->id])
        ->assertOk()->assertJsonPath('examinerId', $examiner->id);
    expect(ProjectNotification::where('recipient_user_id', $examiner->id)->where('notification_type', 'examiner_assigned')->exists())->toBeTrue();
    $this->actingAs($examiner)->getJson('/api/examiner/queue')
        ->assertOk()->assertJsonFragment(['id' => $project->id]);

    // Supervisor passes with scores: result must NOT be confirmed yet.
    $scores = [
        ['criterion_key' => 'problem_objectives', 'score' => 80],
        ['criterion_key' => 'implementation', 'score' => 90],
        ['criterion_key' => 'documentation', 'score' => 70],
        ['criterion_key' => 'presentation_defense', 'score' => 60],
        ['criterion_key' => 'teamwork_process', 'score' => 100],
    ];
    $this->actingAs($supervisor)->postJson("/api/submissions/{$final->id}/review", [
        'decision' => 'pass', 'comment' => 'Strong work.', 'scores' => $scores,
    ])->assertOk()
        ->assertJsonPath('evaluation', 'pending_confirmation')
        ->assertJsonPath('weightedTotal', 79.5);
    expect($project->refresh()->status)->toBe('under_evaluation')
        ->and($final->refresh()->status)->toBe('submitted');

    // Student cannot see the scores before confirmation (spec D9).
    $history = $this->actingAs($leader)->getJson("/api/projects/{$project->id}/submissions")->assertOk()->json();
    $finalEntry = collect($history)->firstWhere('stage', 'final');
    expect($finalEntry['reviews'][0])->not->toHaveKey('scores');

    $evaluation = $this->actingAs($leader)->getJson("/api/projects/{$project->id}/evaluation")->assertOk();
    $evaluation->assertJsonPath('resultConfirmed', false);
    expect($evaluation->json('reviews.0.scores'))->toBeNull();

    // Examiner confirms the pass: now the project publishes.
    $this->actingAs($examiner)->postJson("/api/submissions/{$final->id}/review", [
        'decision' => 'pass', 'comment' => 'Confirmed.', 'scores' => phase2FullScores(75),
    ])->assertOk()->assertJsonPath('evaluation', 'confirmed');
    expect($project->refresh()->status)->toBe('approved_published')
        ->and($project->approval_status)->toBe('approved')
        ->and($final->refresh()->status)->toBe('accepted');

    // After confirmation the student can see scores and totals.
    $evaluation = $this->actingAs($leader)->getJson("/api/projects/{$project->id}/evaluation")->assertOk();
    $evaluation->assertJsonPath('resultConfirmed', true);
    $supReview = collect($evaluation->json('reviews'))->firstWhere('reviewer_role', 'supervisor');
    expect($supReview['weightedTotal'])->toBe(79.5)
        ->and($supReview['scores'])->toHaveCount(5);
});

test('without an examiner the supervisor final decision stands alone', function () {
    $dept = phase2Department();
    $admin = User::factory()->create(['role' => 'admin']);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $cycle = phase2Cycle($dept, $admin);
    [$project, $leader] = phase2Project($dept, $cycle, $supervisor, 'UCS-202', 'Solo Decision Project');
    $final = phase2DriveToFinal($this, $project, $leader, $supervisor);

    $this->actingAs($supervisor)->postJson("/api/submissions/{$final->id}/review", [
        'decision' => 'pass', 'scores' => phase2FullScores(66),
    ])->assertOk()->assertJsonPath('evaluation', 'confirmed');
    expect($project->refresh()->status)->toBe('approved_published');
});

test('rubric scores are validated against the template criteria and max', function () {
    $dept = phase2Department();
    $admin = User::factory()->create(['role' => 'admin']);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $cycle = phase2Cycle($dept, $admin);
    [$project, $leader] = phase2Project($dept, $cycle, $supervisor, 'UCS-203', 'Score Validation Project');
    $final = phase2DriveToFinal($this, $project, $leader, $supervisor);

    $this->actingAs($supervisor)->postJson("/api/submissions/{$final->id}/review", [
        'decision' => 'pass',
        'scores' => [['criterion_key' => 'implementation', 'score' => 101]],
    ])->assertStatus(422);

    $this->actingAs($supervisor)->postJson("/api/submissions/{$final->id}/review", [
        'decision' => 'pass',
        'scores' => [['criterion_key' => 'not_a_criterion', 'score' => 10]],
    ])->assertStatus(422);

    expect($project->refresh()->status)->toBe('final_submitted');
});

// ── Disagreement + resolution ───────────────────────────────────────────

test('pass vs fail disagreement flags a conflict and a dept admin resolves it', function () {
    Mail::fake();
    $dept = phase2Department();
    $admin = User::factory()->create(['role' => 'admin']);
    $deptAdmin = User::factory()->create(['role' => 'department_admin', 'department_id' => $dept->id]);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $examiner = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $cycle = phase2Cycle($dept, $admin);
    [$project, $leader] = phase2Project($dept, $cycle, $supervisor, 'UCS-204', 'Disputed Project');
    $project->update(['examiner_id' => $examiner->id]);
    $final = phase2DriveToFinal($this, $project, $leader, $supervisor);

    $this->actingAs($supervisor)->postJson("/api/submissions/{$final->id}/review", [
        'decision' => 'pass', 'scores' => phase2FullScores(90),
    ])->assertOk()->assertJsonPath('evaluation', 'pending_confirmation');

    $this->actingAs($examiner)->postJson("/api/submissions/{$final->id}/review", [
        'decision' => 'fail', 'comment' => 'Not defensible.', 'scores' => phase2FullScores(20),
    ])->assertOk()->assertJsonPath('evaluation', 'conflict');

    expect($project->refresh()->status)->toBe('under_evaluation')
        ->and($project->evaluation_conflict)->toBeTrue()
        ->and(ProjectNotification::where('recipient_user_id', $deptAdmin->id)->where('notification_type', 'evaluation_conflict')->exists())->toBeTrue();

    // A plain student cannot resolve; the dept admin can.
    $this->actingAs($leader)->postJson("/api/projects/{$project->id}/resolve-evaluation", [
        'result' => 'pass', 'comment' => 'Let it pass.',
    ])->assertForbidden();

    $this->actingAs($deptAdmin)->postJson("/api/projects/{$project->id}/resolve-evaluation", [
        'result' => 'revision_required', 'comment' => 'Fix the report and resubmit.',
    ])->assertOk()->assertJsonPath('status', 'revision_required');

    expect($project->refresh()->evaluation_conflict)->toBeFalse()
        ->and(AuditLog::where('action', 'evaluation.dispute_resolved')->where('subject_id', $project->id)->exists())->toBeTrue();
});

// ── Logbook ─────────────────────────────────────────────────────────────

test('logbook is append-only for team members and hidden from other teams', function () {
    $dept = phase2Department();
    $admin = User::factory()->create(['role' => 'admin']);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $cycle = phase2Cycle($dept, $admin);
    [$project, $leader] = phase2Project($dept, $cycle, $supervisor, 'UCS-205', 'Logbook Project');
    [, $otherLeader] = phase2Project($dept, $cycle, $supervisor, 'UCS-206', 'Other Team Project');

    $this->actingAs($leader)->postJson("/api/projects/{$project->id}/logbook", [
        'body' => 'Finished the database schema.', 'link' => 'https://github.com/example/x/commit/1',
    ])->assertCreated()->assertJsonPath('authorName', $leader->name);

    $this->actingAs($leader)->getJson("/api/projects/{$project->id}/logbook")
        ->assertOk()->assertJsonCount(1)->assertJsonFragment(['body' => 'Finished the database schema.']);

    $this->actingAs($supervisor)->getJson("/api/projects/{$project->id}/logbook")->assertOk()->assertJsonCount(1);

    // Another team's student can neither read nor write.
    $this->actingAs($otherLeader)->getJson("/api/projects/{$project->id}/logbook")->assertNotFound();
    $this->actingAs($otherLeader)->postJson("/api/projects/{$project->id}/logbook", ['body' => 'Intrusion'])
        ->assertForbidden();
});

// ── Mid-review ──────────────────────────────────────────────────────────

test('mid-review flow: summary required, feedback required, returns to in_progress', function () {
    $dept = phase2Department();
    $admin = User::factory()->create(['role' => 'admin']);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $cycle = phase2Cycle($dept, $admin);
    [$project, $leader] = phase2Project($dept, $cycle, $supervisor, 'UCS-207', 'Mid Review Project');

    $this->actingAs($leader)->postJson("/api/projects/{$project->id}/submit", ['stage' => 'proposal'])->assertCreated();
    $proposal = Submission::where('project_id', $project->id)->where('stage', 'proposal')->first();
    $this->actingAs($supervisor)->postJson("/api/submissions/{$proposal->id}/review", ['decision' => 'accept'])->assertOk();

    // No progress summary -> blocked by the mid checklist.
    $this->actingAs($leader)->postJson("/api/projects/{$project->id}/submit", ['stage' => 'mid_review'])
        ->assertStatus(422)->assertJsonFragment(['missing' => ['progress summary']]);

    $this->actingAs($leader)->postJson("/api/projects/{$project->id}/submit", [
        'stage' => 'mid_review', 'payload' => ['progress_summary' => 'Prototype done, testing next.'],
    ])->assertCreated();
    expect($project->refresh()->status)->toBe('mid_review_submitted');

    $mid = Submission::where('project_id', $project->id)->where('stage', 'mid_review')->first();

    // Feedback is required even for an on-track accept.
    $this->actingAs($supervisor)->postJson("/api/submissions/{$mid->id}/review", ['decision' => 'accept'])
        ->assertStatus(422);

    $this->actingAs($supervisor)->postJson("/api/submissions/{$mid->id}/review", [
        'decision' => 'accept', 'comment' => 'On track.',
    ])->assertOk();
    expect($project->refresh()->status)->toBe('in_progress');
});

// ── Defense records ─────────────────────────────────────────────────────

test('defense record can be created by the examiner and shows in the evaluation view', function () {
    $dept = phase2Department();
    $admin = User::factory()->create(['role' => 'admin']);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $examiner = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $cycle = phase2Cycle($dept, $admin);
    [$project, $leader] = phase2Project($dept, $cycle, $supervisor, 'UCS-208', 'Defense Project');
    $project->update(['examiner_id' => $examiner->id]);

    $this->actingAs($examiner)->postJson("/api/projects/{$project->id}/defense", [
        'scheduled_at' => now()->addDays(5)->toDateTimeString(),
        'venue' => 'Room 204',
        'panel' => [$examiner->id, $supervisor->id],
        'note' => 'Bring printed reports.',
    ])->assertCreated()->assertJsonPath('venue', 'Room 204');

    $this->actingAs($leader)->postJson("/api/projects/{$project->id}/defense", [
        'scheduled_at' => now()->addDays(6)->toDateTimeString(),
    ])->assertForbidden();

    $this->actingAs($leader)->getJson("/api/projects/{$project->id}/evaluation")
        ->assertOk()->assertJsonPath('defense.venue', 'Room 204');
});

// ── Deadline reminders ──────────────────────────────────────────────────

test('reminder command notifies the team once per project, stage and offset', function () {
    Mail::fake();
    $dept = phase2Department();
    $admin = User::factory()->create(['role' => 'admin']);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);

    $deadline = Carbon::now('Asia/Yangon')->addDays(3)->setTime(12, 0);
    $cycle = phase2Cycle($dept, $admin, [
        'proposal_deadline' => $deadline,
        'final_deadline' => Carbon::now('Asia/Yangon')->addDays(40)->setTime(12, 0),
    ]);
    [$project, $leader] = phase2Project($dept, $cycle, $supervisor, 'UCS-209', 'Reminder Project');

    Artisan::call('reminders:send');
    expect(ProjectNotification::where('recipient_user_id', $leader->id)->where('notification_type', 'deadline_reminder')->count())->toBe(1);
    Mail::assertQueued(ProjectNotificationMail::class);

    // Second run: dedupe table blocks a repeat.
    Artisan::call('reminders:send');
    expect(ProjectNotification::where('recipient_user_id', $leader->id)->where('notification_type', 'deadline_reminder')->count())->toBe(1);
});

// ── Export + board ──────────────────────────────────────────────────────

test('cycle export contains the project row and respects department scope', function () {
    $dept = phase2Department();
    $otherDept = Department::create(['name' => 'Computer Technology']);
    $admin = User::factory()->create(['role' => 'admin']);
    $deptAdmin = User::factory()->create(['role' => 'department_admin', 'department_id' => $dept->id]);
    $otherAdmin = User::factory()->create(['role' => 'department_admin', 'department_id' => $otherDept->id]);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $cycle = phase2Cycle($dept, $admin);
    [$project, $leader] = phase2Project($dept, $cycle, $supervisor, 'UCS-210', 'Exportable Project');
    $final = phase2DriveToFinal($this, $project, $leader, $supervisor);
    $this->actingAs($supervisor)->postJson("/api/submissions/{$final->id}/review", [
        'decision' => 'pass', 'scores' => phase2FullScores(80),
    ])->assertOk();

    $csv = $this->actingAs($deptAdmin)->get("/api/cycles/{$cycle->id}/export?format=csv")->assertOk();
    $content = $csv->streamedContent();
    expect($content)->toContain('Exportable Project')
        ->and($content)->toContain($leader->name)
        ->and($content)->toContain('UCS-210')
        ->and($content)->toContain('80.00')
        ->and($content)->toContain('Pass (published)');

    $json = $this->actingAs($deptAdmin)->getJson("/api/cycles/{$cycle->id}/export?format=json")->assertOk();
    expect($json->json('rows.0.Weighted rubric total'))->toBe('80.00');

    $this->actingAs($otherAdmin)->getJson("/api/cycles/{$cycle->id}/export")->assertForbidden();
});

test('department board returns counts and the project list', function () {
    $dept = phase2Department();
    $admin = User::factory()->create(['role' => 'admin']);
    $deptAdmin = User::factory()->create(['role' => 'department_admin', 'department_id' => $dept->id]);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $cycle = phase2Cycle($dept, $admin);
    [$project] = phase2Project($dept, $cycle, $supervisor, 'UCS-211', 'Board Project');

    $response = $this->actingAs($deptAdmin)->getJson("/api/department/board?cycle_id={$cycle->id}")->assertOk();
    $response->assertJsonPath('total', 1)->assertJsonPath('counts.draft', 1);
    expect($response->json('projects.0.title'))->toBe('Board Project')
        ->and($response->json('projects.0.waitingOver7Days'))->toBeFalse();
});

// ── Audit + publish overrides ───────────────────────────────────────────

test('role change writes an audit log row', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $student = User::factory()->create(['role' => 'user']);

    $this->actingAs($admin)->putJson("/api/admin/users/{$student->id}/role", ['role' => 'supervisor'])->assertOk();

    $log = AuditLog::where('action', 'user.role_changed')->where('subject_id', $student->id)->first();
    expect($log)->not->toBeNull()
        ->and($log->actor_id)->toBe($admin->id)
        ->and($log->meta_json['to'])->toBe('supervisor');

    $this->actingAs($admin)->getJson('/api/audit-logs')->assertOk()->assertJsonFragment(['action' => 'user.role_changed']);
});

test('unpublish hides the confirmed result and publish restores it, both audited', function () {
    $dept = phase2Department();
    $admin = User::factory()->create(['role' => 'admin']);
    $deptAdmin = User::factory()->create(['role' => 'department_admin', 'department_id' => $dept->id]);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $cycle = phase2Cycle($dept, $admin);
    [$project, $leader] = phase2Project($dept, $cycle, $supervisor, 'UCS-212', 'Publish Toggle Project');
    $final = phase2DriveToFinal($this, $project, $leader, $supervisor);
    $this->actingAs($supervisor)->postJson("/api/submissions/{$final->id}/review", [
        'decision' => 'pass', 'scores' => phase2FullScores(70),
    ])->assertOk();
    expect($project->refresh()->status)->toBe('approved_published');

    $this->actingAs($deptAdmin)->postJson("/api/projects/{$project->id}/unpublish")
        ->assertOk()->assertJsonPath('status', 'under_evaluation');
    $this->actingAs($leader)->getJson("/api/projects/{$project->id}/evaluation")
        ->assertOk()->assertJsonPath('resultConfirmed', false);

    $this->actingAs($deptAdmin)->postJson("/api/projects/{$project->id}/publish")
        ->assertOk()->assertJsonPath('status', 'approved_published');

    expect(AuditLog::where('action', 'project.unpublished')->where('subject_id', $project->id)->exists())->toBeTrue()
        ->and(AuditLog::where('action', 'project.published')->where('subject_id', $project->id)->exists())->toBeTrue();
});
