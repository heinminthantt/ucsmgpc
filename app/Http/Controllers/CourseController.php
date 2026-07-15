<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
    // Returns ALL courses (no pagination)
    public function index(): JsonResponse
    {
        try {
            $courses = Course::with('department')->orderBy('code')->get();
            return response()->json($courses);
        } catch (\Exception $e) {
            Log::error('Course index failed: ' . $e->getMessage());
            return response()->json(['message' => 'Could not retrieve courses.'], 500);
        }
    }

    public function byDepartment(Department $department): JsonResponse
    {
        try {
            $courses = $department->courses()->orderBy('code')->get();
            return response()->json($courses);
        } catch (\Exception $e) {
            Log::error('Course by department failed: ' . $e->getMessage());
            return response()->json(['message' => 'Could not retrieve courses for the department.'], 500);
        }
    }

    public function show(Course $course): JsonResponse
    {
        try {
            $course->load('department');
            return response()->json($course);
        } catch (\Exception $e) {
            Log::error('Course show failed: ' . $e->getMessage());
            return response()->json(['message' => 'Could not retrieve course details.'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        if (!Auth::user()->isAdmin()) abort(403);
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'code'          => 'nullable|string|max:20|unique:courses,code',
            'department_id' => 'required|exists:departments,id',
        ]);
        try {
            $course = Course::create($validated)->load('department');
            return response()->json($course, 201);
        } catch (\Exception $e) {
            Log::error('Course creation failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create course.'], 500);
        }
    }

    public function update(Request $request, Course $course): JsonResponse
    {
        if (!Auth::user()->isAdmin()) abort(403);
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'code'          => 'nullable|string|max:20|unique:courses,code,' . $course->id,
            'department_id' => 'required|exists:departments,id',
        ]);
        try {
            $course->update($validated);
            return response()->json($course->load('department'));
        } catch (\Exception $e) {
            Log::error('Course update failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update course.'], 500);
        }
    }

    public function destroy(Course $course): JsonResponse
    {
        if (!Auth::user()->isAdmin()) abort(403);
        // Check if course is linked to projects (if relationship exists)
        if (method_exists($course, 'projects') && $course->projects()->exists()) {
            return response()->json(['message' => 'Cannot delete this course because it is linked to existing projects.'], 409);
        }
        try {
            $course->delete();
            return response()->json(['message' => 'Course deleted']);
        } catch (\Exception $e) {
            Log::error('Course deletion failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete course.'], 500);
        }
    }
}