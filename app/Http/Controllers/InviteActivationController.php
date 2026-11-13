<?php

namespace App\Http\Controllers;

use App\Concerns\PasswordValidationRules;
use App\Models\UserInvite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Invite activation for CSV-imported accounts (spec WF2).
 *
 *   GET  /invite/activate/{token}   (name: invite.activate)
 *        Shows the set-password page, or the reason the link is unusable.
 *   POST /invite/activate/{token}   (name: invite.activate.store)
 *        Sets the password, marks the token used, verifies the email,
 *        logs the user in and redirects to the dashboard.
 */
class InviteActivationController extends Controller
{
    use PasswordValidationRules;

    public function show(string $token): Response
    {
        $invite = UserInvite::findByPlainToken($token);
        $reason = $invite === null
            ? 'This invite link is not valid. Please ask your department admin to send a new invite.'
            : $invite->invalidReason();

        return Inertia::render('auth/activate-account', [
            'token' => $token,
            'email' => $reason === null ? $invite->user?->email : null,
            'name' => $reason === null ? $invite->user?->name : null,
            'invalidReason' => $reason,
        ]);
    }

    public function store(Request $request, string $token): RedirectResponse
    {
        $invite = UserInvite::findByPlainToken($token);
        $reason = $invite === null
            ? 'This invite link is not valid.'
            : $invite->invalidReason();

        if ($reason !== null) {
            return back()->withErrors(['token' => $reason]);
        }

        $validated = $request->validate([
            'password' => $this->passwordRules(),
        ]);

        $user = $invite->user;
        $user->update([
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
        $invite->markUsed();

        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
