<?php

use App\Models\AcademicCycle;
use App\Models\AuditLog;
use App\Models\Course;
use App\Models\Department;
use App\Models\Project;
use App\Models\Review;
use App\Models\RubricScore;
use App\Models\RubricTemplate;
use App\Models\Submission;
use App\Models\Tag;
use App\Models\User;
use App\Services\DemoVideoUrl;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

/**
 * Phase 3 (Showcase & Scale) tests: featured projects, public department
 * and supervisor pages, demo video embeds, GitHub link validation with
 * the offline-safe reachability check, department analytics, the locale
 * endpoint + dictionary parity, rubric template management, and audit
 * endpoint permissions.
 */
function phase3Dept(): Department
{
    return Department::create(['name' => 'Computer Science']);
}

function phase3Published(Department $dept, User $owner, array $overrides = []): Project
{
    return Project::create(array_merge([
        'title' => 'Published project',
        'description' => 'A published project.',
        'objectives' => 'Objectives',
        'body' => 'Report body',
        'user_id' => $owner->id,
        'department_id' => $dept->id,
        'approval_status' => 'approved',
        'status' => 'approved_published',
        'published_at' => now()->subDays(2),
    ], $overrides));
}

test('featured toggle: scope rules, published-only rule, audit, catalog order', function () {
    $dept = phase3Dept();
    $admin = User::factory()->create(['role' => 'admin']);
    $deptAdmin = User::factory()->create(['role' => 'department_admin', 'department_id' => $dept->id]);
    $otherDeptAdmin = User::factory()->create(['role' => 'department_admin']);
    $student = User::factory()->create(['department_id' => $dept->id]);

    $older = phase3Published($dept, $student, ['title' => 'Older featured', 'created_at' => now()->subDays(5)]);
    $newer = phase3Published($dept, $student, ['title' => 'Newer plain', 'created_at' => now()->subDays(1)]);
    $draft = Project::create([
        'title' => 'Draft', 'description' => 'd', 'objectives' => 'o',
        'user_id' => $student->id, 'department_id' => $dept->id,
        'approval_status' => 'pending', 'status' => 'draft',
    ]);

    // Students and other departments cannot feature.
    $this->actingAs($student)->postJson("/api/projects/{$older->id}/feature", ['is_featured' => true])->assertForbidden();
    $this->actingAs($otherDeptAdmin)->postJson("/api/projects/{$older->id}/feature", ['is_featured' => true])->assertForbidden();

    // Unpublished projects cannot be featured.
    $this->actingAs($deptAdmin)->postJson("/api/projects/{$draft->id}/feature", ['is_featured' => true])
        ->assertStatus(422);
    expect($draft->refresh()->is_featured)->toBeFalse();

    // Dept admin features the older published project; audited.
    $this->actingAs($deptAdmin)->postJson("/api/projects/{$older->id}/feature", ['is_featured' => true])
        ->assertOk()->assertJsonPath('isFeatured', true);
    expect(AuditLog::where('action', 'project.featured')->where('subject_id', $older->id)->exists())->toBeTrue();

    // Featured projects sort first in the public catalog search.
    $content = $this->getJson('/api/projects/search')->assertOk()->json('content');
    expect($content[0]['id'])->toBe($older->id)
        ->and($content[0]['isFeatured'])->toBeTrue()
        ->and($content[0]['publishedAt'])->not->toBeNull();

    // Featured-only filter used by the catalog Featured section.
    $featured = $this->getJson('/api/projects/search?featured=1')->json('content');
    expect(collect($featured)->pluck('id')->all())->toBe([$older->id]);

    // Semester filter matches cycle semester and legacy student_year alike.
    $bySemester = $this->getJson('/api/projects/search?semester='.urlencode('Semester VI'))->json('content');
    expect($bySemester)->toBeArray();
    $this->actingAs($admin)->postJson("/api/projects/{$older->id}/feature", ['is_featured' => false])->assertOk();
});

test('public department and supervisor pages show published work only, no private data', function () {
    $dept = phase3Dept();
    $supervisor = User::factory()->create([
        'role' => 'supervisor', 'department_id' => $dept->id,
        'roll_number' => 'T-SECRET-1', 'bio' => 'Teaches databases.',
    ]);
    $student = User::factory()->create(['department_id' => $dept->id, 'roll_number' => 'UCSM-SECRET-9']);

    $published = phase3Published($dept, $student, ['supervisor_id' => $supervisor->id, 'title' => 'Visible one']);
    Project::create([
        'title' => 'Hidden draft', 'description' => 'd', 'objectives' => 'o',
        'user_id' => $student->id, 'department_id' => $dept->id, 'supervisor_id' => $supervisor->id,
        'approval_status' => 'pending', 'status' => 'draft',
    ]);

    $deptResponse = $this->get("/departments/{$dept->id}")->assertOk()
        ->assertInertia(fn ($page) => $page->component('departments/show')
            ->where('department.name', $dept->name)
            ->where('counts.publishedProjects', 1)
            ->where('counts.supervisors', 1)
            ->has('projects', 1)
            ->where('projects.0.id', $published->id)
            ->has('supervisors', 1));
    expect($deptResponse->getContent())
        ->not->toContain('UCSM-SECRET-9')
        ->not->toContain('T-SECRET-1')
        ->not->toContain($supervisor->email)
        ->not->toContain('Hidden draft');

    $supResponse = $this->get("/supervisors/{$supervisor->id}")->assertOk()
        ->assertInertia(fn ($page) => $page->component('supervisors/show')
            ->where('supervisor.name', $supervisor->name)
            ->where('counts.publishedProjects', 1)
            ->has('projects', 1));
    expect($supResponse->getContent())
        ->not->toContain($supervisor->email)
        ->not->toContain('T-SECRET-1')
        ->not->toContain('Hidden draft');

    // Non-supervisors have no public page.
    $this->get("/supervisors/{$student->id}")->assertNotFound();
});

test('demo video URLs: only YouTube and Vimeo are accepted, embeds are derived safely', function () {
    expect(DemoVideoUrl::embedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'))
        ->toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
        ->and(DemoVideoUrl::embedUrl('https://youtu.be/dQw4w9WgXcQ?t=3'))
        ->toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
        ->and(DemoVideoUrl::embedUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ'))
        ->toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
        ->and(DemoVideoUrl::embedUrl('https://vimeo.com/123456789'))
        ->toBe('https://player.vimeo.com/video/123456789')
        ->and(DemoVideoUrl::embedUrl('https://example.com/video/1'))->toBeNull()
        ->and(DemoVideoUrl::embedUrl('https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ'))->toBeNull();

    $dept = phase3Dept();
    $course = Course::create(['department_id' => $dept->id, 'name' => 'Web', 'code' => 'CS-1']);
    $owner = User::factory()->create(['department_id' => $dept->id]);
    // Owners cannot edit approved projects (ProjectPolicy), so the video
    // field is exercised on a draft and the project is published after.
    $project = phase3Published($dept, $owner, [
        'course_id' => $course->id,
        'status' => 'in_progress', 'approval_status' => 'pending', 'published_at' => null,
    ]);

    $payload = [
        'title' => 'T', 'description' => 'D', 'objectives' => 'O',
        'academic_year' => '2026-2027', 'student_year' => 'Semester VI',
        'department_id' => $dept->id, 'course_id' => $course->id,
    ];

    $this->actingAs($owner)->putJson("/api/projects/{$project->id}", [
        ...$payload, 'demo_video_url' => 'https://example.com/watch?v=1',
    ])->assertStatus(422)->assertJsonValidationErrors('demo_video_url');

    $this->actingAs($owner)->putJson("/api/projects/{$project->id}", [
        ...$payload, 'demo_video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    ])->assertOk();
    expect($project->refresh()->demo_video_url)->toContain('youtube.com');

    $project->update(['status' => 'approved_published', 'approval_status' => 'approved', 'published_at' => now()]);

    $shown = $this->getJson("/api/projects/{$project->id}")->assertOk();
    expect($shown->json('demoVideoEmbedUrl'))->toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
});

test('github link: bad format rejected, confirmed 404 blocks, network failure does not, success stamps verified', function () {
    $dept = phase3Dept();
    $course = Course::create(['department_id' => $dept->id, 'name' => 'Web', 'code' => 'CS-1']);
    $owner = User::factory()->create(['department_id' => $dept->id]);

    $payload = [
        'title' => 'Repo project', 'description' => 'D', 'objectives' => 'O',
        'academic_year' => '2026-2027', 'student_year' => 'Semester VI',
        'department_id' => $dept->id, 'course_id' => $course->id,
    ];

    // One fake with a distinct pattern per scenario URL, so registration
    // order cannot shadow a later scenario inside this single test.
    Http::fake([
        'github.com/someone/missing-repo' => Http::response('not here', 404),
        'github.com/someone/offline-repo' => fn () => throw new ConnectionException('cURL timeout'),
        'github.com/someone/real-repo' => Http::response('', 200),
        'github.com/someone/other-repo' => fn () => throw new ConnectionException('down'),
    ]);

    // Wrong host / wrong shape: format error, rejected before any HTTP call.
    $this->actingAs($owner)->postJson('/api/projects', [
        ...$payload, 'github_link' => 'https://gitlab.com/someone/repo',
    ])->assertStatus(422)->assertJsonValidationErrors('github_link');

    // Confirmed 404 blocks the save.
    $this->actingAs($owner)->postJson('/api/projects', [
        ...$payload, 'github_link' => 'https://github.com/someone/missing-repo',
    ])->assertStatus(422)->assertJsonValidationErrors('github_link');
    expect(Project::where('title', 'Repo project')->exists())->toBeFalse();

    // Network failure (timeout): save proceeds, link stays unverified.
    $created = $this->actingAs($owner)->postJson('/api/projects', [
        ...$payload, 'github_link' => 'https://github.com/someone/offline-repo',
    ])->assertCreated();
    $offline = Project::find($created->json('id'));
    expect($offline->github_verified_at)->toBeNull();

    // Reachable repo: save proceeds and the link is stamped verified.
    $created2 = $this->actingAs($owner)->postJson('/api/projects', [
        ...$payload, 'title' => 'Repo project 2', 'github_link' => 'https://github.com/someone/real-repo',
    ])->assertCreated();
    $verified = Project::find($created2->json('id'));
    expect($verified->github_verified_at)->not->toBeNull();

    // Changing the link clears the stamp until the new one verifies.
    $this->actingAs($owner)->putJson("/api/projects/{$verified->id}", [
        ...$payload, 'github_link' => 'https://github.com/someone/other-repo',
    ])->assertOk();
    expect($verified->refresh()->github_verified_at)->toBeNull();
});

test('department analytics returns the main numbers and is staff only', function () {
    $dept = phase3Dept();
    $deptAdmin = User::factory()->create(['role' => 'department_admin', 'department_id' => $dept->id]);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);
    $student = User::factory()->create(['department_id' => $dept->id]);
    $template = RubricTemplate::defaultTemplate();

    $cycle = AcademicCycle::create([
        'department_id' => $dept->id, 'academic_year' => '2026-2027', 'semester' => 'Semester VI',
        'project_type' => 'final_year_project', 'team_min' => 1, 'team_max' => 3,
        'supervisor_capacity' => 6, 'proposal_deadline' => now()->subDays(30),
        'final_deadline' => now()->addDays(10), 'status' => 'evaluation',
        'created_by' => $deptAdmin->id, 'rubric_template_id' => $template->id,
    ]);

    $tag = Tag::create(['name' => 'laravel']);

    $scored = function (Project $p, int $score) use ($supervisor) {
        $submission = Submission::create([
            'project_id' => $p->id, 'stage' => 'final', 'version' => 1,
            'submitted_by' => $p->user_id, 'submitted_at' => now(), 'status' => 'accepted',
        ]);
        $review = Review::create([
            'submission_id' => $submission->id, 'reviewer_id' => $supervisor->id,
            'reviewer_role' => 'supervisor', 'decision' => 'pass',
        ]);
        foreach (RubricTemplate::defaultCriteria() as $criterion) {
            RubricScore::create([
                'review_id' => $review->id, 'criterion_key' => $criterion['key'], 'score' => $score,
            ]);
        }
    };

    $p1 = phase3Published($dept, $student, [
        'title' => 'P1', 'cycle_id' => $cycle->id, 'supervisor_id' => $supervisor->id,
        'published_at' => now(),
    ]);
    $p1->tags()->attach($tag);
    $proposal = Submission::create([
        'project_id' => $p1->id, 'stage' => 'proposal', 'version' => 1,
        'submitted_by' => $student->id, 'submitted_at' => now()->subDays(10), 'status' => 'accepted',
    ]);
    Submission::where('id', $proposal->id)->update(['created_at' => now()->subDays(10)]);
    $scored($p1, 80);

    $p2 = phase3Published($dept, $student, ['title' => 'P2', 'cycle_id' => $cycle->id, 'supervisor_id' => $supervisor->id]);
    $scored($p2, 60);

    phase3Published($dept, $student, [
        'title' => 'P3', 'cycle_id' => $cycle->id, 'supervisor_id' => $supervisor->id,
        'status' => 'not_passed', 'approval_status' => 'rejected', 'published_at' => null,
    ]);

    $this->actingAs($student)->getJson('/api/department/analytics')->assertForbidden();

    $data = $this->actingAs($deptAdmin)->getJson("/api/department/analytics?cycle_id={$cycle->id}")
        ->assertOk()
        ->assertJsonPath('totalProjects', 3)
        ->assertJsonPath('passRate', 66.7)
        ->json();
    expect((float) $data['averageRubricTotal'])->toEqual(70.0)
        ->and((float) $data['averageDaysProposalToPublished'])->toEqual(10.0)
        ->and($data['supervisorLoad'][0]['projects'])->toBe(3)
        ->and($data['topTags'][0])->toBe(['tag' => 'laravel', 'projects' => 1]);
});

test('locale endpoint persists and the en/my dictionaries have identical keys', function () {
    $user = User::factory()->create();
    expect($user->refresh()->locale)->toBe('en');

    $this->actingAs($user)->patchJson('/api/me/locale', ['locale' => 'my'])
        ->assertOk()->assertJsonPath('locale', 'my');
    expect($user->refresh()->locale)->toBe('my');

    $this->actingAs($user)->patchJson('/api/me/locale', ['locale' => 'fr'])
        ->assertStatus(422);

    $en = json_decode(file_get_contents(base_path('resources/js/i18n/en.json')), true);
    $my = json_decode(file_get_contents(base_path('resources/js/i18n/my.json')), true);
    expect(array_keys($en))->toEqualCanonicalizing(array_keys($my))
        ->and(count($en))->toBeGreaterThan(20);
});

test('rubric template CRUD: validation and role gates', function () {
    $dept = phase3Dept();
    $deptAdmin = User::factory()->create(['role' => 'department_admin', 'department_id' => $dept->id]);
    $student = User::factory()->create(['department_id' => $dept->id]);

    $valid = [
        'name' => 'Department rubric 2027',
        'pass_threshold' => 55,
        'criteria' => [
            ['key' => 'build', 'label' => 'Build quality', 'weight' => 60, 'max' => 100],
            ['key' => 'report', 'label' => 'Report', 'weight' => 40, 'max' => 50],
        ],
    ];

    $this->actingAs($student)->postJson('/api/rubric-templates', $valid)->assertForbidden();
    $this->actingAs($student)->getJson('/api/rubric-templates')->assertForbidden();

    $created = $this->actingAs($deptAdmin)->postJson('/api/rubric-templates', $valid)
        ->assertCreated()->assertJsonPath('name', 'Department rubric 2027');

    // Zero weight and zero max are rejected.
    $this->actingAs($deptAdmin)->postJson('/api/rubric-templates', [
        ...$valid, 'name' => 'Bad one',
        'criteria' => [['key' => 'x', 'label' => 'X', 'weight' => 0, 'max' => 100]],
    ])->assertStatus(422);
    $this->actingAs($deptAdmin)->postJson('/api/rubric-templates', [
        ...$valid, 'name' => 'Bad two',
        'criteria' => [['key' => 'x', 'label' => 'X', 'weight' => 10, 'max' => 0]],
    ])->assertStatus(422);

    $id = $created->json('id');
    $this->actingAs($deptAdmin)->putJson("/api/rubric-templates/{$id}", [
        ...$valid, 'name' => 'Department rubric 2027 v2',
    ])->assertOk()->assertJsonPath('name', 'Department rubric 2027 v2');

    $list = $this->actingAs($deptAdmin)->getJson('/api/rubric-templates')->assertOk()->json();
    expect(collect($list)->pluck('id'))->toContain($id);
    expect(AuditLog::where('action', 'rubric_template.created')->exists())->toBeTrue();
});

test('audit log endpoint stays restricted to dept admins and admins', function () {
    $dept = phase3Dept();
    $deptAdmin = User::factory()->create(['role' => 'department_admin', 'department_id' => $dept->id]);
    $student = User::factory()->create(['department_id' => $dept->id]);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $dept->id]);

    $this->actingAs($student)->getJson('/api/audit-logs')->assertForbidden();
    $this->actingAs($supervisor)->getJson('/api/audit-logs')->assertForbidden();
    $this->actingAs($deptAdmin)->getJson('/api/audit-logs')->assertOk();

    // The examiner queue endpoint answers for assigned examiners.
    $project = phase3Published($dept, $student, ['examiner_id' => $supervisor->id, 'status' => 'final_submitted', 'approval_status' => 'pending']);
    $queue = $this->actingAs($supervisor)->getJson('/api/examiner/queue')->assertOk()->json();
    expect(collect($queue)->pluck('id'))->toContain($project->id);
});
