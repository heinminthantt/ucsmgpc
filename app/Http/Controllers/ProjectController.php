<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectNotification;
use App\Rules\DemoVideoUrlRule;
use App\Rules\GitHubLink;
use App\Services\AuditLogger;
use App\Services\DemoVideoUrl;
use App\Services\GitHubLinkChecker;
use Illuminate\Support\Facades\Gate;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('projects/index');
    }

    public function search(Request $request): JsonResponse
    {
        $query = Project::with(['user', 'department', 'course', 'supervisor', 'tags', 'files'])->withCount('reactions')->approved();

        // Keyword search. Full-text is MySQL-only; other drivers (PostgreSQL
        // on Neon, SQLite in tests) fall back to a LIKE match per column.
        if ($request->filled('keyword')) {
            $kw = $request->keyword;
            if ($query->getConnection()->getDriverName() === 'mysql') {
                $query->whereFullText(['title', 'description', 'body', 'objectives'], $kw);
            } else {
                $query->where(function ($q) use ($kw) {
                    foreach (['title', 'description', 'body', 'objectives'] as $col) {
                        $q->orWhere($col, 'like', '%'.$kw.'%');
                    }
                });
            }
        }

        if ($request->filled('departmentId')) {
            $query->where('department_id', $request->departmentId);
        }

        if ($request->filled('courseId')) {
            $query->where('course_id', $request->courseId);
        }

        if ($request->filled('academicYear')) {
            $query->where('academic_year', $request->academicYear);
        }

        if ($request->filled('studentYear')) {
            $query->where('student_year', $request->studentYear);
        }

        // Phase 3 (S7): semester filter. A project matches when its cycle
        // runs in that semester, or (legacy projects without a cycle) when
        // its student_year label is that semester.
        if ($request->filled('semester')) {
            $semester = $request->semester;
            $query->where(function ($q) use ($semester) {
                $q->whereHas('cycle', fn ($c) => $c->where('semester', $semester))
                    ->orWhere('student_year', $semester);
            });
        }

        // Phase 3: featured-only listing for the catalog Featured section.
        if ($request->filled('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->filled('tags')) {
            $tagName = $request->tags;
            $query->whereHas('tags', fn($q) => $q->where('name', 'like', "%$tagName%"));
        }

        if ($request->filled('supervisor')) {
            $sup = $request->supervisor;
            $query->whereHas('supervisor', fn($q) => $q->where('name', 'like', "%$sup%"));
        }

        if ($request->filled('members')) {
            $mem = $request->members;
            $query->where('members_json', 'like', "%$mem%");
        }

        // Sort. Featured projects always come first (Phase 3, S7).
        $sortBy = in_array($request->sortBy, ['created_at', 'title', 'updated_at']) ? $request->sortBy : 'created_at';
        $sortDir = $request->sortDirection === 'asc' ? 'asc' : 'desc';
        $query->orderByDesc('is_featured')->orderBy($sortBy, $sortDir);

        $size = min((int) ($request->size ?? 9), 50);
        $page = max((int) ($request->page ?? 0), 0) + 1;

        $paginated = $query->paginate($size, ['*'], 'page', $page);

        return response()->json([
    'content' => collect($paginated->items())->map(fn($p) => $this->formatProject($p)),
    'totalPages' => $paginated->lastPage(),
    'number' => $paginated->currentPage() - 1,
    'first' => $paginated->onFirstPage(),
    'last' => !$paginated->hasMorePages(),
    'totalElements' => $paginated->total(),
]);
    }

    public function show(Project $project): JsonResponse
    {
        // Spec FX-API1: the public API returns published projects only.
        // Unpublished projects 404 here so their existence is not leaked.
        if (!$project->isPublished()) {
            abort(404);
        }
        $project->load(['user', 'department', 'course', 'supervisor', 'tags', 'files', 'approvedBy']);
        return response()->json($this->formatProject($project));
    }

    public function showPage(Project $project): Response
    {
        // Published projects are public; unpublished ones are visible only
        // to their team and assigned staff (spec 3.3). Everyone else gets a
        // 404 rather than a 403 for the same no-leak reason as the API.
        if (!$project->canBeViewedBy(Auth::user())) {
            abort(404);
        }
        $project->load(['user', 'department', 'course', 'supervisor', 'tags', 'files', 'approvedBy']);
        return Inertia::render('projects/show', [
            'project' => $this->formatProject($project),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('projects/create');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'objectives' => 'required|string',
            'benefits' => 'nullable|string',
            'body' => 'nullable|string',
            'github_link' => ['nullable', 'url', new GitHubLink],
            'demo_video_url' => ['nullable', 'string', 'max:500', new DemoVideoUrlRule],
            'academic_year' => 'required|string',
            'student_year' => 'required|string',
            'department_id' => 'required|exists:departments,id',
            'course_id' => 'required|exists:courses,id',
            'supervisor_id' => 'nullable|exists:users,id',
            'members_json' => 'nullable|json',
            'cycle_id' => 'nullable|exists:academic_cycles,id',
            'team_id' => 'nullable|exists:teams,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'project_files.*' => 'nullable|file|mimes:zip|max:51200',
        ]);

        $user = Auth::user();

        if (! empty($validated['team_id'])) {
            $team = \App\Models\Team::with('cycle')->find($validated['team_id']);
            $isTeamMember = $team
                && ((int) $team->leader_id === (int) $user->id
                    || $team->memberships()->where('user_id', $user->id)->where('invite_status', 'confirmed')->exists());
            if (! $isTeamMember && ! $user->isAdmin()) {
                return response()->json(['message' => 'You can only create a project for a team you belong to.'], 403);
            }
            if ($team && $team->project()->exists()) {
                return response()->json(['message' => 'This team already has a project.'], 422);
            }
            if ($team && ! empty($validated['cycle_id']) && (int) $team->cycle_id !== (int) $validated['cycle_id']) {
                return response()->json(['message' => 'The selected team does not belong to this cycle.'], 422);
            }
            $validated['cycle_id'] = $validated['cycle_id'] ?? $team?->cycle_id;
            $validated['department_id'] = $team?->cycle?->department_id ?? $validated['department_id'];
        }

        // Phase 3: GitHub reachability. A confirmed 404 blocks the save;
        // a network failure does not (offline-safe). See GitHubLinkChecker.
        $validated['github_verified_at'] = app(GitHubLinkChecker::class)
            ->verifiedAtFor($validated['github_link'] ?? null, null, null);

        $project = Project::create([
            ...$validated,
            'user_id' => $user->id,
            // Legacy form = a finished-project submission, so the legacy
            // approval flag stays 'pending' for the old screens, while the
            // new lifecycle status starts at proposal_submitted to match
            // what the old 'pending' meant (waiting for a supervisor).
            'approval_status' => 'pending',
            'status' => 'proposal_submitted',
        ]);

        // Handle tags
        if (!empty($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tag = Tag::firstOrCreate(['name' => strtolower(trim($tagName))]);
                $tagIds[] = $tag->id;
            }
            $project->tags()->sync($tagIds);
        }

        // Handle file uploads
        if ($request->hasFile('project_files')) {
            foreach ($request->file('project_files') as $file) {
                $path = $file->store('project-files', 'public');
                ProjectFile::create([
                    'project_id' => $project->id,
                    'file_path' => Storage::url($path),
                    'original_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        // Notify supervisor if assigned
        if ($project->supervisor_id) {
            ProjectNotification::create([
                'recipient_user_id' => $project->supervisor_id,
                'message' => Auth::user()->name . ' submitted a project for your review.',
                'project_id' => $project->id,
                'notification_type' => 'submission',
                'project_title' => $project->title,
            ]);
        }

        return response()->json(['id' => $project->id], 201);
    }

    public function edit(Project $project): Response
    {
        Gate::authorize('update', $project);
        $project->load(['tags', 'files', 'department', 'course', 'supervisor']);
        return Inertia::render('projects/edit', [
            'project' => $this->formatProject($project),
        ]);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('update', $project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'objectives' => 'required|string',
            'benefits' => 'nullable|string',
            'body' => 'nullable|string',
            'github_link' => ['nullable', 'url', new GitHubLink],
            'demo_video_url' => ['nullable', 'string', 'max:500', new DemoVideoUrlRule],
            'academic_year' => 'required|string',
            'student_year' => 'required|string',
            'department_id' => 'required|exists:departments,id',
            'course_id' => 'required|exists:courses,id',
            'supervisor_id' => 'nullable|exists:users,id',
            'members_json' => 'nullable|json',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'project_files.*' => 'nullable|file|mimes:zip|max:51200',
        ]);

        if (array_key_exists('github_link', $validated)) {
            $validated['github_verified_at'] = app(GitHubLinkChecker::class)
                ->verifiedAtFor($validated['github_link'], $project->github_link, $project->github_verified_at);
        }

        $project->update($validated);

        // Sync tags
        if (isset($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tag = Tag::firstOrCreate(['name' => strtolower(trim($tagName))]);
                $tagIds[] = $tag->id;
            }
            $project->tags()->sync($tagIds);
        }

        // Handle new file uploads
        if ($request->hasFile('project_files')) {
            foreach ($request->file('project_files') as $file) {
                $path = $file->store('project-files', 'public');
                ProjectFile::create([
                    'project_id' => $project->id,
                    'file_path' => Storage::url($path),
                    'original_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        return response()->json(['id' => $project->id]);
    }

    public function destroy(Project $project): JsonResponse
    {
        \Illuminate\Support\Facades\Gate::authorize('delete', $project);
        $project->delete();
        return response()->json(['message' => 'Project deleted']);
    }

    public function userProjects(Request $request): JsonResponse
    {
        $userId = $request->route('userId') ?? Auth::id();
        $projects = Project::with(['tags', 'department', 'course', 'supervisor', 'files'])
            ->where('user_id', $userId)
            ->latest()
            ->get();
        return response()->json($projects->map(fn($p) => $this->formatProject($p)));
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|max:10240',
        ]);

        $path = $request->file('image')->store('project-images', 'public');

        return response()->json([
            'url' => \Illuminate\Support\Facades\Storage::url($path)
        ]);
    }

    /**
     * POST /api/projects/{project}/feature { is_featured } (Phase 3, spec 2.3).
     * Dept admin of the department or system admin only, and only published
     * projects can be featured. Audit logged.
     */
    public function feature(Request $request, Project $project, AuditLogger $audit): JsonResponse
    {
        $actor = Auth::user();
        $allowed = $actor->isAdmin()
            || ($actor->isDepartmentAdmin() && (int) $actor->department_id === (int) $project->department_id);
        if (! $allowed) {
            abort(403, 'Only a department admin of this department (or an admin) can feature a project.');
        }

        $validated = $request->validate(['is_featured' => 'required|boolean']);

        if ($validated['is_featured'] && ! $project->isPublished()) {
            return response()->json(['message' => 'Only a published project can be featured.'], 422);
        }

        $previous = (bool) $project->is_featured;
        $project->update(['is_featured' => $validated['is_featured']]);

        $audit->log($actor, $validated['is_featured'] ? 'project.featured' : 'project.unfeatured', $project, [
            'from' => $previous, 'to' => $validated['is_featured'],
        ], $request);

        return response()->json(['id' => $project->id, 'isFeatured' => (bool) $project->is_featured]);
    }

    public function formatProjectPublic(Project $project): array
    {
        return $this->formatProject($project);
    }

    private function formatProject(Project $project): array
    {
        $project->loadMissing(['tags', 'files', 'department', 'course', 'supervisor', 'cycle:id,semester']);
        $coverImageUrl = $project->cover_image_url;
        if (!$coverImageUrl && !empty($project->body)) {
            preg_match('/<img[^>]+src=[\'"]([^\'"]+)[\'"][^>]*>/i', $project->body, $matches);
            if (!empty($matches[1])) {
                $coverImageUrl = $matches[1];
            }
        }

        return [
            'id' => $project->id,
            'title' => $project->title,
            'description' => $project->description,
            'benefits' => $project->benefits,
            'body' => $project->body,
            'excerpt' => $project->excerpt,
            'contentFormat' => $project->content_format,
            'githubLink' => $project->github_link,
            'githubVerifiedAt' => $project->github_verified_at?->toISOString(),
            'demoVideoUrl' => $project->demo_video_url,
            'demoVideoEmbedUrl' => DemoVideoUrl::embedUrl($project->demo_video_url),
            'isFeatured' => (bool) $project->is_featured,
            'semester' => $project->cycle?->semester,
            'coverImageUrl' => $coverImageUrl,
            'academic_year' => $project->academic_year,
            'student_year' => $project->student_year,
            'objectives' => $project->objectives,
            'membersJson' => $project->members_json,
            'userId' => $project->user_id,
            'submittedByName' => $project->user?->name,
            'departmentId' => $project->department_id,
            'departmentName' => $project->department?->name,
            'courseId' => $project->course_id,
            'courseName' => $project->course?->name,
            'courseCode' => $project->course?->code,
            'supervisorId' => $project->supervisor_id,
            'supervisorName' => $project->supervisor?->name,
            'approvalStatus' => strtoupper($project->approval_status),
            'status' => $project->status,
            'cycleId' => $project->cycle_id,
            'teamId' => $project->team_id,
            'examinerId' => $project->examiner_id,
            'publishedAt' => $project->published_at?->toISOString(),
            'approvedAt' => $project->approved_at?->toISOString(),
            'approvedById' => $project->approved_by,
            'approvedByName' => $project->approvedBy?->name,
            'projectFiles' => $project->files->map(fn($f) => $f->file_path)->toArray(),
            'tags' => $project->tags->pluck('name')->toArray(),
            'createdAt' => $project->created_at?->toISOString(),
            'reactionCount' => $project->reactions()->count(),
        ];
    }
}
