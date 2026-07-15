<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectNotification;
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

        // Keyword search
        if ($request->filled('keyword')) {
            $kw = $request->keyword;
            $query->whereFullText(['title', 'description', 'body', 'objectives'], $kw);
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

        // Sort
        $sortBy = in_array($request->sortBy, ['created_at', 'title', 'updated_at']) ? $request->sortBy : 'created_at';
        $sortDir = $request->sortDirection === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDir);

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
        $project->load(['user', 'department', 'course', 'supervisor', 'tags', 'files', 'approvedBy']);
        return response()->json($this->formatProject($project));
    }

    public function showPage(Project $project): Response
    {
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
            'github_link' => 'nullable|url',
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

        $project = Project::create([
            ...$validated,
            'user_id' => Auth::id(),
            'approval_status' => 'pending',
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
            'github_link' => 'nullable|url',
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
        $user = Auth::user();
        if ($project->user_id !== $user->id && !$user->isAdmin()) {
            abort(403);
        }
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

    public function formatProjectPublic(Project $project): array
    {
        return $this->formatProject($project);
    }

    private function formatProject(Project $project): array
    {
        $project->loadMissing(['tags', 'files', 'department', 'course', 'supervisor']);
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
