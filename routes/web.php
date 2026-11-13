<?php

use App\Http\Controllers\AcademicCycleController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CohortImportController;
use App\Http\Controllers\InviteActivationController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\SavedProjectController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\SupervisorController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Welcome / landing
Route::inertia('/', 'welcome')->name('home');

// Invite activation for CSV-imported accounts (spec WF2). Public on purpose:
// the unguessable token in the link is the credential at this step.
Route::get('/invite/activate/{token}', [InviteActivationController::class, 'show'])->name('invite.activate');
Route::post('/invite/activate/{token}', [InviteActivationController::class, 'store'])->name('invite.activate.store');

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

    // Phase 1: My project (stage draft/submit + submission history)
    Route::inertia('/projects/my', 'projects/my')->name('projects.my');

    // Saved Projects (page)
    Route::get('/saved-projects', [SavedProjectController::class, 'index'])->name('saved.index');

    // Notifications (page)
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');

    // Profile (page)
    Route::get('/profile', [UserController::class, 'profile'])->name('profile');

    // Supervisor Dashboard (page)
    Route::middleware('role:supervisor')->group(function () {
        Route::get('/supervisor-dashboard', [SupervisorController::class, 'index'])->name('supervisor.dashboard');
    });

    // Admin Dashboard (page)
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin-dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    });

    // Phase 1: Department page (cycles + CSV cohort import)
    Route::middleware('role:department_admin')->group(function () {
        Route::inertia('/department', 'department/index')->name('department.index');
    });

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
        Route::post('/projects/upload-image', [ProjectController::class, 'uploadImage'])->name('api.projects.upload-image');
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
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('/users', [AdminController::class, 'users']);
            Route::get('/projects', [AdminController::class, 'projects']);
            Route::put('/users/{user}/role', [AdminController::class, 'updateUserRole']);
            Route::delete('/users/{user}', [AdminController::class, 'deactivateUser']);

            // Phase 1 aliases: cycles + cohort import are also available to
            // system admins under /api/admin/* (the canonical department
            // routes are in the role:department_admin group below).
            Route::get('/cycles', [AcademicCycleController::class, 'index']);
            Route::post('/cycles', [AcademicCycleController::class, 'store']);
            Route::get('/cycles/{cycle}', [AcademicCycleController::class, 'show']);
            Route::put('/cycles/{cycle}', [AcademicCycleController::class, 'update']);
            Route::post('/cycles/{cycle}/close', [AcademicCycleController::class, 'close']);
            Route::get('/import/template', [CohortImportController::class, 'template']);
            Route::post('/import/preview', [CohortImportController::class, 'preview']);
            Route::post('/import/confirm', [CohortImportController::class, 'confirm']);
        });

        // ─── Phase 1: Academic cycles (Dept Admin; admins pass via EnsureRole) ───
        Route::middleware('role:department_admin')->prefix('department')->group(function () {
            Route::get('/cycles', [AcademicCycleController::class, 'index']);
            Route::post('/cycles', [AcademicCycleController::class, 'store']);
            Route::get('/cycles/{cycle}', [AcademicCycleController::class, 'show']);
            Route::put('/cycles/{cycle}', [AcademicCycleController::class, 'update']);
            Route::post('/cycles/{cycle}/close', [AcademicCycleController::class, 'close']);

            // CSV cohort import (spec WF1)
            Route::get('/import/template', [CohortImportController::class, 'template']);
            Route::post('/import/preview', [CohortImportController::class, 'preview']);
            Route::post('/import/confirm', [CohortImportController::class, 'confirm']);
        });

        // Cycles opened for students of the department
        Route::get('/cycles/open', [AcademicCycleController::class, 'openCycles']);

        // ─── Phase 1: Teams ──────────────────────────────────────────────────
        Route::get('/teams/mine', [TeamController::class, 'mine']);
        Route::post('/teams', [TeamController::class, 'store']);
        Route::post('/teams/{team}/invite', [TeamController::class, 'invite']);
        Route::get('/team-invites/mine', [TeamController::class, 'myInvites']);
        Route::post('/team-invites/{invite}/confirm', [TeamController::class, 'confirmInvite']);
        Route::post('/team-invites/{invite}/decline', [TeamController::class, 'declineInvite']);

        // ─── Phase 1: Stage submissions and reviews ──────────────────────────
        Route::put('/projects/{project}/draft', [SubmissionController::class, 'saveDraft']);
        Route::post('/projects/{project}/submit', [SubmissionController::class, 'submit']);
        Route::post('/projects/{project}/reopen', [SubmissionController::class, 'reopen']);
        Route::get('/projects/{project}/submissions', [SubmissionController::class, 'index']);
        Route::post('/submissions/{submission}/review', [SubmissionController::class, 'review']);

        // Supervisor
        Route::middleware('role:supervisor')->prefix('supervisor')->group(function () {
            Route::get('/projects/pending', [SupervisorController::class, 'pendingProjects']);
            Route::post('/projects/{project}/approve', [SupervisorController::class, 'approve']);
            Route::post('/projects/{project}/reject', [SupervisorController::class, 'reject']);
        });
    });
});

require __DIR__.'/settings.php';
