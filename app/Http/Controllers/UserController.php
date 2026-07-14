<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function profile(): Response
    {
        return Inertia::render('profile/index');
    }

    public function me(): JsonResponse
    {
        $user = Auth::user();
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar_url' => $user->avatar_url,
            'bio' => $user->bio,
            'role' => strtoupper($user->role),
            'is_active' => $user->is_active,
        ]);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar_url' => $user->avatar_url,
            'bio' => $user->bio,
            'role' => strtoupper($user->role),
        ]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        if ($user->id !== Auth::id() && !Auth::user()->isAdmin()) abort(403);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'bio' => 'nullable|string|max:1000',
            'avatar_url' => 'nullable|string',
        ]);

        $user->update($validated);
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar_url' => $user->avatar_url,
            'bio' => $user->bio,
        ]);
    }

    public function changePassword(Request $request, User $user): JsonResponse
    {
        if ($user->id !== Auth::id()) abort(403);

        $validated = $request->validate([
            'oldPassword' => 'required|string',
            'newPassword' => 'required|string|min:8',
        ]);

        if (!Hash::check($validated['oldPassword'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        $user->update(['password' => Hash::make($validated['newPassword'])]);
        return response()->json(['message' => 'Password changed successfully']);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate(['image' => 'required|image|max:2048']);
        $path = $request->file('image')->store('avatars', 'public');
        return response()->json(['url' => Storage::url($path)]);
    }

    public function destroy(User $user): JsonResponse
    {
        if (!Auth::user()->isAdmin() && $user->id !== Auth::id()) abort(403);
        $user->update(['is_active' => false]);
        return response()->json(['message' => 'User deactivated']);
    }
}
