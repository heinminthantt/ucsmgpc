<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\SavedProjectController;
use App\Http\Controllers\SupervisorController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Welcome / landing
Route::inertia('/', 'welcome')->name('home');

// ─── Public API (no auth required for browsing) ──────────────────────────────
Route::prefix('api')->group(function () {
    Route::get('/projects/search', [ProjectController::class, 'search'])->name('api.projects.search');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('api.projects.show');
    Route::get('/departments', [DepartmentController::class, 'index'])->name('api.departments.index');
    Route::get('/departments/{department}', [DepartmentController::class, 'show']);
    Route::get('/courses', [CourseController::class, 'index'])->name('api.courses.index');
    Route::get('/courses/{course}', [CourseController::class, 'show']);
    Route::get('/departments/{department}/courses', [CourseController::class, 'byDepartment']);
});

// ─── Auth-protected pages ─────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Projects (pages)
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::get('/projects/{project}/view', [ProjectController::class, 'showPage'])->name('projects.show-page');

    // Saved Projects (page)
    Route::get('/saved-projects', [SavedProjectController::class, 'index'])->name('saved.index');

    // Notifications (page)
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');

    // Profile (page)
    Route::get('/profile', [UserController::class, 'profile'])->name('profile');

    // Supervisor Dashboard (page)
    Route::get('/supervisor-dashboard', [SupervisorController::class, 'index'])->name('supervisor.dashboard');

    // Admin Dashboard (page)
    Route::get('/admin-dashboard', [AdminController::class, 'index'])->name('admin.dashboard');

    // ─── Auth-protected API ───────────────────────────────────────────────────
    Route::prefix('api')->group(function () {

        // Current user
        Route::get('/users/me', [UserController::class, 'me'])->name('api.users.me');
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::post('/users/{user}/change-password', [UserController::class, 'changePassword']);
        Route::post('/users/upload-avatar', [UserController::class, 'uploadAvatar']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        Route::get('/users/{userId}/projects', [ProjectController::class, 'userProjects']);

        // Supervisors list
        Route::get('/supervisors', [AdminController::class, 'supervisors']);

        // Projects (CRUD)
        Route::post('/projects', [ProjectController::class, 'store'])->name('api.projects.store');
        Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('api.projects.update');
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('api.projects.destroy');

        // Comments
        Route::get('/comments/project/{project}', [CommentController::class, 'index']);
        Route::post('/comments', [CommentController::class, 'store']);
        Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

        // Reactions
        Route::get('/reactions/{project}/status', [ReactionController::class, 'status']);
        Route::post('/reactions/toggle', [ReactionController::class, 'toggle']);

        // Saved Projects
        Route::get('/saved-projects', [SavedProjectController::class, 'list']);
        Route::get('/saved-projects/check', [SavedProjectController::class, 'check']);
        Route::post('/saved-projects/toggle', [SavedProjectController::class, 'toggle']);

        // Notifications
        Route::get('/notifications', [NotificationController::class, 'list']);
        Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
        Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
        Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllRead']);

        // Departments / Courses (admin write)
        Route::post('/departments', [DepartmentController::class, 'store']);
        Route::put('/departments/{department}', [DepartmentController::class, 'update']);
        Route::delete('/departments/{department}', [DepartmentController::class, 'destroy']);
        Route::post('/courses', [CourseController::class, 'store']);
        Route::put('/courses/{course}', [CourseController::class, 'update']);
        Route::delete('/courses/{course}', [CourseController::class, 'destroy']);

        // Admin
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::get('/admin/projects', [AdminController::class, 'projects']);
        Route::put('/admin/users/{user}/role', [AdminController::class, 'updateUserRole']);
        Route::delete('/admin/users/{user}', [AdminController::class, 'deactivateUser']);

        // Supervisor
        Route::get('/supervisor/projects/pending', [SupervisorController::class, 'pendingProjects']);
        Route::post('/supervisor/projects/{project}/approve', [SupervisorController::class, 'approve']);
        Route::post('/supervisor/projects/{project}/reject', [SupervisorController::class, 'reject']);
    });
});

require __DIR__.'/settings.php';
