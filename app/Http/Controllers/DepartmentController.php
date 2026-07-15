<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DepartmentController extends Controller
{
    // Returns ALL departments (no pagination)
    public function index(): JsonResponse
    {
        try {
            $departments = Department::orderBy('name')->get();
            return response()->json($departments);
        } catch (\Exception $e) {
            Log::error('Department index failed: ' . $e->getMessage());
            return response()->json(['message' => 'Could not retrieve departments.'], 500);
        }
    }

    public function show(Department $department): JsonResponse
    {
        try {
            return response()->json($department);
        } catch (\Exception $e) {
            Log::error('Department show failed: ' . $e->getMessage());
            return response()->json(['message' => 'Could not retrieve department details.'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        if (!Auth::user()->isAdmin()) abort(403);
        $validated = $request->validate(['name' => 'required|string|max:100|unique:departments,name']);
        try {
            $department = Department::create($validated);
            return response()->json($department, 201);
        } catch (\Exception $e) {
            Log::error('Department creation failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create department.'], 500);
        }
    }

    public function update(Request $request, Department $department): JsonResponse
    {
        if (!Auth::user()->isAdmin()) abort(403);
        $validated = $request->validate(['name' => 'required|string|max:100|unique:departments,name,' . $department->id]);
        try {
            $department->update($validated);
            return response()->json($department);
        } catch (\Exception $e) {
            Log::error('Department update failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update department.'], 500);
        }
    }

    public function destroy(Department $department): JsonResponse
    {
        if (!Auth::user()->isAdmin()) abort(403);
        if ($department->courses()->exists()) {
            return response()->json(['message' => 'Cannot delete this department because it still has courses assigned.'], 409);
        }
        try {
            $department->delete();
            return response()->json(['message' => 'Department deleted']);
        } catch (\Exception $e) {
            Log::error('Department deletion failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete department.'], 500);
        }
    }
}