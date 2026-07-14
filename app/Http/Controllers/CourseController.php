<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Course::with('department')->orderBy('code')->get()
        );
    }

    public function byDepartment(Department $department): JsonResponse
    {
        return response()->json(
            $department->courses()->orderBy('code')->get()
        );
    }

    public function show(Course $course): JsonResponse
    {
        return response()->json($course->load('department'));
    }

    public function store(Request $request): JsonResponse
    {
        if (!Auth::user()->isAdmin()) abort(403);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:20|unique:courses,code',
            'department_id' => 'required|exists:departments,id',
        ]);
        return response()->json(Course::create($validated)->load('department'), 201);
    }

    public function update(Request $request, Course $course): JsonResponse
    {
        if (!Auth::user()->isAdmin()) abort(403);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:20|unique:courses,code,' . $course->id,
            'department_id' => 'required|exists:departments,id',
        ]);
        $course->update($validated);
        return response()->json($course->load('department'));
    }

    public function destroy(Course $course): JsonResponse
    {
        if (!Auth::user()->isAdmin()) abort(403);
        $course->delete();
        return response()->json(['message' => 'Course deleted']);
    }
}
