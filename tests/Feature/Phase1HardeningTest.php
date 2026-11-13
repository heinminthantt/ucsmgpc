<?php

use App\Mail\ProjectNotificationMail;
use App\Mail\UserInviteMail;
use App\Models\AcademicCycle;
use App\Models\Department;
use App\Models\Project;
use App\Models\ProjectNotification;
use App\Models\Submission;
use App\Models\Team;
use App\Models\TeamUser;
use App\Models\User;
use App\Models\UserInvite;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;

/**
 * Phase 1 hardening tests:
 *  - the fulltext migration must run (as a no-op) on SQLite, so the suite
 *    migrates fresh without setting the migration aside
 *  - lifecycle transitions queue an email copy of each in-app notification
 *  - CSV-imported users activate through an invite token (spec WF2)
 *  - supervisor capacity blocks a proposal accept at the limit (spec 6.4)
 */
function hardeningDepartment(): Department
{
    return Department::create(['name' => 'Computer Science']);
}

function hardeningCycle(Department $dept, User $creator, int $capacity = 1): AcademicCycle
{
    return AcademicCycle::create([
        'department_id' => $dept->id,
        'academic_year' => '2026-2027',
        'semester' => 'Semester VI',
        'project_type' => 'final_year_project',
        'team_min' => 1,
        'team_max' => 3,
        'supervisor_capacity' => $capacity,
        'proposal_deadline' => now()->addDays(7),
        'final_deadline' => now()->addDays(60),
        'status' => 'open',
        'created_by' => $creator->id,
    ]);
}

/** A draft project with a confirmed leader-only team, ready to submit a proposal. */
function hardeningProject(Department $dept, AcademicCycle $cycle, User $supervisor, string $roll, string $title): Project
{
    $leader = User::factory()->create(['department_id' => $dept->id, 'roll_number' => $roll]);
    $team = Team::create(['cycle_id' => $cycle->id, 'leader_id' => $leader->id, 'status' => 'active']);
    TeamUser::create(['team_id' => $team->id, 'user_id' => $leader->id, 'role' => 'leader',
        'invite_status' => 'confirmed', 'invited_at' => now(), 'confirmed_at' => now()]);

    return Project::create([
        'title' => $title,
        'description' => 'Problem statement for '.$title,
        'objectives' => 'Objectives for '.$title,
        'user_id' => $leader->id,
        'department_id' => $dept->id,
        'supervisor_id' => $supervisor->id,
        'cycle_id' => $cycle->id,
        'team_id' => $team->id,
        'approval_status' => 'pending',
        'status' => 'draft',
    ]);
}

test('fulltext migration runs as a no-op on sqlite instead of crashing', function () {
    // RefreshDatabase has already run every migration on SQLite (:memory:)
    // by the time this test executes; before the driver guard this threw
    // "This database driver does not support fulltext index creation".
    expect(DB::connection()->getDriverName())->toBe('sqlite')
        ->and(DB::table('migrations')
            ->where('migration', '2026_07_15_085952_add_fulltext_index_to_projects_table')
            ->exists())->toBeTrue()
        ->and(Schema::hasTable('projects'))->toBeTrue();
});

test('proposal submission queues a notification email to the supervisor', function () {
    Mail::fake();

    $dept = hardeningDepartment();
    $admin = User::factory()->create(['role' => 'admin']);
    $cycle = hardeningCycle($dept, $admin);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $project = hardeningProject($dept, $cycle, $supervisor, 'UCS-100', 'Mail Project');
    $leader = $project->user;

    $this->actingAs($leader)->postJson("/api/projects/{$project->id}/submit", ['stage' => 'proposal'])
        ->assertCreated();

    Mail::assertQueued(ProjectNotificationMail::class, fn ($mail) => $mail->hasTo($supervisor->email));
    // The in-app notification still exists alongside the email.
    expect(ProjectNotification::where('recipient_user_id', $supervisor->id)
        ->where('project_id', $project->id)->exists())->toBeTrue();
});

test('imported user activates the account through the invite token', function () {
    Mail::fake();

    $dept = hardeningDepartment();
    $admin = User::factory()->create(['role' => 'admin']);

    $csv = UploadedFile::fake()->createWithContent('students.csv',
        "roll_number,name,email,department,student_year\n".
        "UCS-200,Invite Me,invite@example.com,Computer Science,Final Year\n");
    $this->actingAs($admin)->postJson('/api/admin/import/confirm', ['type' => 'students', 'file' => $csv, 'cohort_year' => 2026])
        ->assertCreated()
        ->assertJsonPath('created', 1)
        ->assertJsonPath('invites_sent', 1);

    Mail::assertQueued(UserInviteMail::class, fn ($mail) => $mail->hasTo('invite@example.com'));

    $imported = User::where('email', 'invite@example.com')->first();
    expect($imported)->not->toBeNull()
        ->and($imported->email_verified_at)->toBeNull();

    // Fresh token for the activation assertions (the import's plain token
    // only exists inside the queued email).
    [$invite, $plainToken] = UserInvite::issueFor($imported);

    $this->get("/invite/activate/{$plainToken}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('auth/activate-account')
            ->where('email', 'invite@example.com')
            ->where('invalidReason', null));

    $this->post("/invite/activate/{$plainToken}", [
        'password' => 'Str0ng!Pass',
        'password_confirmation' => 'Str0ng!Pass',
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($imported);
    $imported->refresh();
    expect($imported->email_verified_at)->not->toBeNull()
        ->and(Hash::check('Str0ng!Pass', $imported->password))->toBeTrue()
        ->and($invite->refresh()->used_at)->not->toBeNull();

    // The same token cannot be used twice.
    auth()->logout();
    $this->post("/invite/activate/{$plainToken}", [
        'password' => 'An0ther!Pass',
        'password_confirmation' => 'An0ther!Pass',
    ])->assertSessionHasErrors('token');
    expect(Hash::check('Str0ng!Pass', $imported->refresh()->password))->toBeTrue();
});

test('an expired invite token is rejected', function () {
    $user = User::factory()->create(['email_verified_at' => null]);
    [$invite, $plainToken] = UserInvite::issueFor($user);
    $invite->update(['expires_at' => now()->subDay()]);

    $oldPasswordHash = $user->password;

    $this->post("/invite/activate/{$plainToken}", [
        'password' => 'Str0ng!Pass',
        'password_confirmation' => 'Str0ng!Pass',
    ])->assertSessionHasErrors('token');

    expect($user->refresh()->password)->toBe($oldPasswordHash)
        ->and($user->email_verified_at)->toBeNull()
        ->and($invite->refresh()->used_at)->toBeNull();
});

test('supervisor capacity blocks a second proposal accept, admin can override', function () {
    $dept = hardeningDepartment();
    $admin = User::factory()->create(['role' => 'admin']);
    $cycle = hardeningCycle($dept, $admin, capacity: 1);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);

    $first = hardeningProject($dept, $cycle, $supervisor, 'UCS-300', 'First Project');
    $second = hardeningProject($dept, $cycle, $supervisor, 'UCS-301', 'Second Project');

    foreach ([$first, $second] as $project) {
        $this->actingAs($project->user)->postJson("/api/projects/{$project->id}/submit", ['stage' => 'proposal'])
            ->assertCreated();
    }

    $sub1 = Submission::where('project_id', $first->id)->where('stage', 'proposal')->first();
    $sub2 = Submission::where('project_id', $second->id)->where('stage', 'proposal')->first();

    // First accept fills the single capacity slot.
    $this->actingAs($supervisor)->postJson("/api/submissions/{$sub1->id}/review", ['decision' => 'accept'])
        ->assertOk();
    expect($first->refresh()->status)->toBe('in_progress');

    // Second accept by the supervisor is blocked with a clear 422.
    $this->actingAs($supervisor)->postJson("/api/submissions/{$sub2->id}/review", ['decision' => 'accept'])
        ->assertStatus(422)
        ->assertJsonPath('message', fn ($m) => str_contains($m, 'capacity'));
    expect($second->refresh()->status)->toBe('proposal_submitted');

    // A system admin reviewing the same submission is the override path.
    $this->actingAs($admin)->postJson("/api/submissions/{$sub2->id}/review", ['decision' => 'accept'])
        ->assertOk();
    expect($second->refresh()->status)->toBe('in_progress');
});
