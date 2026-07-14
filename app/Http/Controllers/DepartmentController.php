<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DepartmentController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Department::orderBy('name')->get());
    }

    public function show(Department $department): JsonResponse
    {
        return response()->json($department);
    }

    public function store(Request $request): JsonResponse
    {
        if (!Auth::user()->isAdmin()) abort(403);
        $validated = $request->validate(['name' => 'required|string|max:100|unique:departments,name']);
        return response()->json(Department::create($validated), 201);
    }

    public function update(Request $request, Department $department): JsonResponse
    {
        if (!Auth::user()->isAdmin()) abort(403);
        $validated = $request->validate(['name' => 'required|string|max:100|unique:departments,name,' . $department->id]);
        $department->update($validated);
        return response()->json($department);
    }

    public function destroy(Department $department): JsonResponse
    {
        if (!Auth::user()->isAdmin()) abort(403);
        $department->delete();
        return response()->json(['message' => 'Department deleted']);
    }
}
