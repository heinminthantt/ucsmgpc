<?php

use App\Models\AcademicCycle;
use App\Models\Department;
use App\Models\Project;
use App\Models\Submission;
use App\Models\Team;
use App\Models\TeamUser;
use App\Models\User;
use Illuminate\Http\UploadedFile;

/**
 * Phase 1 acceptance smoke tests (spec section 15, backend parts).
 * Covers: cycle creation, CSV import preview/confirm, team formation with
 * team_max enforcement, the proposal changes-requested -> resubmit loop
 * (the FX1 dead-end fix), the final checklist, publication, and the
 * public-API privacy fix (FX-API1).
 */
function phase1Department(): Department
{
    return Department::create(['name' => 'Computer Science']);
}

function phase1Cycle(Department $dept, User $creator): AcademicCycle
{
    return AcademicCycle::create([
        'department_id' => $dept->id,
        'academic_year' => '2026-2027',
        'semester' => 'Semester VI',
        'project_type' => 'final_year_project',
        'team_min' => 1,
        'team_max' => 2,
        'supervisor_capacity' => 6,
        'proposal_deadline' => now()->addDays(7),
        'final_deadline' => now()->addDays(60),
        'status' => 'open',
        'created_by' => $creator->id,
    ]);
}

test('dept admin can create a cycle and students can list open cycles', function () {
    $dept = phase1Department();
    $deptAdmin = User::factory()->create(['role' => 'department_admin', 'department_id' => $dept->id]);
    $student = User::factory()->create(['role' => 'user', 'department_id' => $dept->id]);

    $this->actingAs($deptAdmin)->postJson('/api/department/cycles', [
        'department_id' => $dept->id,
        'academic_year' => '2026-2027',
        'semester' => 'Semester VI',
        'proposal_deadline' => now()->addDays(7)->toDateTimeString(),
        'final_deadline' => now()->addDays(60)->toDateTimeString(),
        'status' => 'open',
    ])->assertCreated();

    $this->actingAs($student)->getJson('/api/cycles/open')
        ->assertOk()
        ->assertJsonCount(1);
});

test('csv import preview reports bad rows and imports nothing, confirm creates users', function () {
    $dept = phase1Department();
    $admin = User::factory()->create(['role' => 'admin']);

    $bad = UploadedFile::fake()->createWithContent('students.csv',
        "roll_number,name,email,department,student_year\n".
        "UCS-1,Aye Aye,aye@example.com,Computer Science,Final Year\n".
        "UCS-2,Bad Row,not-an-email,Computer Science,Final Year\n".
        "UCS-3,Ghost,ghost@example.com,No Such Dept,Final Year\n");
    $this->actingAs($admin)->postJson('/api/admin/import/preview', ['type' => 'students', 'file' => $bad])
        ->assertOk()
        ->assertJsonPath('validRows', 1)
        ->assertJsonPath('errorRows', 2);
    expect(User::where('email', 'aye@example.com')->exists())->toBeFalse();

    $good = UploadedFile::fake()->createWithContent('students.csv',
        "roll_number,name,email,department,student_year\n".
        "UCS-1,Aye Aye,aye@example.com,Computer Science,Final Year\n");
    $this->actingAs($admin)->postJson('/api/admin/import/confirm', ['type' => 'students', 'file' => $good, 'cohort_year' => 2026])
        ->assertCreated()
        ->assertJsonPath('created', 1);

    $imported = User::where('email', 'aye@example.com')->first();
    expect($imported)->not->toBeNull()
        ->and($imported->roll_number)->toBe('UCS-1')
        ->and($imported->department_id)->toBe($dept->id)
        ->and($imported->cohort_year)->toBe(2026);
});

test('team invite confirm enforces cycle team_max', function () {
    $dept = phase1Department();
    $admin = User::factory()->create(['role' => 'admin']);
    $cycle = phase1Cycle($dept, $admin); // team_max = 2 (leader + 1)

    $leader = User::factory()->create(['department_id' => $dept->id, 'roll_number' => 'UCS-10']);
    $member = User::factory()->create(['department_id' => $dept->id, 'roll_number' => 'UCS-11']);
    $extra = User::factory()->create(['department_id' => $dept->id, 'roll_number' => 'UCS-12']);

    $this->actingAs($leader)->postJson('/api/teams', ['cycle_id' => $cycle->id])->assertCreated();
    $team = Team::where('leader_id', $leader->id)->first();

    $this->actingAs($leader)->postJson("/api/teams/{$team->id}/invite", ['roll_number' => 'UCS-11'])->assertCreated();
    $this->actingAs($leader)->postJson("/api/teams/{$team->id}/invite", ['roll_number' => 'UCS-12'])->assertCreated();

    $invite1 = TeamUser::where('team_id', $team->id)->where('user_id', $member->id)->first();
    $invite2 = TeamUser::where('team_id', $team->id)->where('user_id', $extra->id)->first();

    $this->actingAs($member)->postJson("/api/team-invites/{$invite1->id}/confirm")->assertOk();
    // Team is now full (leader + 1 = team_max 2): the second confirm must fail.
    $this->actingAs($extra)->postJson("/api/team-invites/{$invite2->id}/confirm")->assertStatus(422);
});

test('proposal changes-requested loop resubmits as a new version (FX1)', function () {
    $dept = phase1Department();
    $admin = User::factory()->create(['role' => 'admin']);
    $cycle = phase1Cycle($dept, $admin);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $leader = User::factory()->create(['department_id' => $dept->id, 'roll_number' => 'UCS-20']);

    $team = Team::create(['cycle_id' => $cycle->id, 'leader_id' => $leader->id, 'status' => 'active']);
    TeamUser::create(['team_id' => $team->id, 'user_id' => $leader->id, 'role' => 'leader',
        'invite_status' => 'confirmed', 'invited_at' => now(), 'confirmed_at' => now()]);

    $project = Project::create([
        'title' => 'Smart Attendance',
        'description' => 'Face recognition attendance',
        'objectives' => 'Automate attendance',
        'user_id' => $leader->id,
        'department_id' => $dept->id,
        'supervisor_id' => $supervisor->id,
        'cycle_id' => $cycle->id,
        'team_id' => $team->id,
        'approval_status' => 'pending',
        'status' => 'draft',
    ]);

    // Submit proposal V1
    $this->actingAs($leader)->postJson("/api/projects/{$project->id}/submit", ['stage' => 'proposal'])
        ->assertCreated()->assertJsonPath('version', 1);
    expect($project->refresh()->status)->toBe('proposal_submitted');

    // Supervisor requests changes (comment required)
    $v1 = Submission::where('project_id', $project->id)->where('stage', 'proposal')->first();
    $this->actingAs($supervisor)->postJson("/api/submissions/{$v1->id}/review", ['decision' => 'request_changes'])
        ->assertStatus(422);
    $this->actingAs($supervisor)->postJson("/api/submissions/{$v1->id}/review",
        ['decision' => 'request_changes', 'comment' => 'Narrow the scope.'])
        ->assertOk();
    expect($project->refresh()->status)->toBe('proposal_changes_requested');

    // Resubmit: must succeed and become V2 in the supervisor queue again.
    $this->actingAs($leader)->postJson("/api/projects/{$project->id}/submit", ['stage' => 'proposal'])
        ->assertCreated()->assertJsonPath('version', 2);
    expect($project->refresh()->status)->toBe('proposal_submitted');

    // Accept V2 -> in_progress, team locked.
    $v2 = Submission::where('project_id', $project->id)->where('version', 2)->first();
    $this->actingAs($supervisor)->postJson("/api/submissions/{$v2->id}/review", ['decision' => 'accept'])
        ->assertOk();
    expect($project->refresh()->status)->toBe('in_progress')
        ->and($team->refresh()->status)->toBe('locked');
});

test('final checklist blocks an incomplete package, then publish makes it public', function () {
    $dept = phase1Department();
    $admin = User::factory()->create(['role' => 'admin']);
    $cycle = phase1Cycle($dept, $admin);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $leader = User::factory()->create(['department_id' => $dept->id]);

    $project = Project::create([
        'title' => 'Library System',
        'description' => '', // no abstract yet
        'objectives' => 'Catalogue books',
        'user_id' => $leader->id,
        'department_id' => $dept->id,
        'supervisor_id' => $supervisor->id,
        'cycle_id' => $cycle->id,
        'approval_status' => 'pending',
        'status' => 'in_progress',
    ]);

    // Public API must not leak the unpublished project.
    $this->getJson("/api/projects/{$project->id}")->assertNotFound();

    // Final submit blocked: no abstract, no report, no source.
    $this->actingAs($leader)->postJson("/api/projects/{$project->id}/submit", ['stage' => 'final'])
        ->assertStatus(422)->assertJsonStructure(['missing']);

    // Complete the checklist through the draft endpoint + github link.
    $this->actingAs($leader)->putJson("/api/projects/{$project->id}/draft", [
        'description' => 'A library catalogue and borrowing system.',
        'body' => '<p>Full report body</p>',
        'github_link' => 'https://github.com/example/library',
    ])->assertOk();

    $this->actingAs($leader)->postJson("/api/projects/{$project->id}/submit", ['stage' => 'final'])
        ->assertCreated();
    expect($project->refresh()->status)->toBe('final_submitted');

    // Supervisor passes the final submission -> published.
    $final = Submission::where('project_id', $project->id)->where('stage', 'final')->first();
    $this->actingAs($supervisor)->postJson("/api/submissions/{$final->id}/review", ['decision' => 'pass'])
        ->assertOk();
    expect($project->refresh()->status)->toBe('approved_published')
        ->and($project->isPublished())->toBeTrue();

    // Now the public API serves it.
    $this->getJson("/api/projects/{$project->id}")->assertOk();

    // Reactions are open only now that it is published.
    $this->actingAs($leader)->postJson('/api/reactions/toggle', ['project_id' => $project->id])
        ->assertOk()->assertJsonPath('reacted', true);
});
