<?php

namespace App\Http\Controllers;

use App\Models\AcademicCycle;
use App\Models\Team;
use App\Models\TeamUser;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamController extends Controller
{
    /** Teams I lead or belong to, optionally within one cycle. */
    public function mine(Request $request): JsonResponse
    {
        $teamIds = TeamUser::where('user_id', Auth::id())->pluck('team_id');

        $query = Team::with(['cycle', 'leader:id,name,roll_number', 'memberships.user:id,name,roll_number,email'])
            ->where(function ($q) use ($teamIds) {
                $q->whereIn('id', $teamIds)->orWhere('leader_id', Auth::id());
            });

        if ($request->filled('cycle_id')) {
            $query->where('cycle_id', $request->cycle_id);
        }

        return response()->json($query->latest()->get()->map(fn ($t) => $this->formatTeam($t)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cycle_id' => 'required|exists:academic_cycles,id',
            'name' => 'nullable|string|max:255',
        ]);

        $cycle = AcademicCycle::where('id', $validated['cycle_id'])->firstOrFail();

        if (! $cycle->isOpenForTeams()) {
            return response()->json(['message' => 'This cycle is not open for team formation.'], 422);
        }

        // TM3 / CY1: one team per student per cycle (as leader or confirmed member).
        $alreadyInTeam = TeamUser::where('user_id', Auth::id())
            ->where('invite_status', 'confirmed')
            ->whereHas('team', fn ($q) => $q->where('cycle_id', $cycle->id))
            ->exists();
        if ($alreadyInTeam) {
            return response()->json(['message' => 'You already belong to a team in this cycle.'], 422);
        }

        $team = Team::create([
            'cycle_id' => $cycle->id,
            'leader_id' => Auth::id(),
            'name' => $validated['name'] ?? null,
            'status' => 'forming',
        ]);

        TeamUser::create([
            'team_id' => $team->id,
            'user_id' => Auth::id(),
            'role' => 'leader',
            'invite_status' => 'confirmed',
            'invited_at' => now(),
            'confirmed_at' => now(),
        ]);

        return response()->json($this->formatTeam($team->load(['cycle', 'memberships.user:id,name,roll_number,email'])), 201);
    }

    /** Invite a student to a team by roll number (spec WF3 / TM2). */
    public function invite(Request $request, Team $team): JsonResponse
    {
        if ($team->leader_id !== Auth::id() && ! Auth::user()->isAdmin() && ! Auth::user()->isDepartmentAdmin()) {
            abort(403);
        }
        if ($team->status === 'locked') {
            return response()->json(['message' => 'This team is locked because its proposal was accepted. Ask a department admin to change membership.'], 422);
        }

        $validated = $request->validate([
            'roll_number' => 'required|string|max:50',
        ]);

        $cycle = $team->cycle;

        // Same-department rule: the invitee's department must match the cycle's.
        $invitee = User::where('roll_number', $validated['roll_number'])
            ->where('department_id', $cycle->department_id)
            ->first();
        if (! $invitee) {
            return response()->json(['message' => 'No student with that roll number in this department.'], 422);
        }
        if ($invitee->id === $team->leader_id) {
            return response()->json(['message' => 'The team leader is already a member.'], 422);
        }

        $existing = TeamUser::where('team_id', $team->id)->where('user_id', $invitee->id)->first();
        if ($existing && $existing->invite_status !== 'declined') {
            return response()->json(['message' => 'That student is already invited to this team.'], 422);
        }

        // TM3: cannot already be confirmed in another team of this cycle.
        $inOtherTeam = TeamUser::where('user_id', $invitee->id)
            ->where('invite_status', 'confirmed')
            ->where('team_id', '!=', $team->id)
            ->whereHas('team', fn ($q) => $q->where('cycle_id', $cycle->id))
            ->exists();
        if ($inOtherTeam) {
            return response()->json(['message' => 'That student already belongs to another team in this cycle.'], 422);
        }

        $membership = TeamUser::updateOrCreate(
            ['team_id' => $team->id, 'user_id' => $invitee->id],
            ['role' => 'member', 'invite_status' => 'pending', 'invited_at' => now(), 'confirmed_at' => null]
        );

        // Note: no in-app notification is created for invites because
        // project_notifications.project_id is NOT NULL (a team has no
        // project yet). The invite is visible via GET /team-invites/mine.

        return response()->json([
            'id' => $membership->id,
            'teamId' => $team->id,
            'userId' => $invitee->id,
            'userName' => $invitee->name,
            'rollNumber' => $invitee->roll_number,
            'invite_status' => $membership->invite_status,
        ], 201);
    }

    /** Invites addressed to me. */
    public function myInvites(): JsonResponse
    {
        $invites = TeamUser::with(['team.cycle', 'team.leader:id,name'])
            ->where('user_id', Auth::id())
            ->where('invite_status', 'pending')
            ->latest('invited_at')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'teamId' => $m->team_id,
                'teamName' => $m->team?->name,
                'cycleId' => $m->team?->cycle_id,
                'leaderName' => $m->team?->leader?->name,
                'invitedAt' => $m->invited_at?->toISOString(),
            ]);

        return response()->json($invites);
    }

    public function confirmInvite(int $invite): JsonResponse
    {
        $membership = $this->ownPendingInvite($invite);
        $team = $membership->team;
        $cycle = $team->cycle;

        // Team size is enforced on confirm (spec 15 / A2): leader + confirmed
        // members may not exceed the cycle's team_max.
        if ($team->confirmedMemberCount() >= (int) $cycle->team_max) {
            return response()->json(['message' => 'This team is already full for this cycle.'], 422);
        }

        // TM3 guard at confirm time as well (state may have changed since invite).
        $inOtherTeam = TeamUser::where('user_id', Auth::id())
            ->where('invite_status', 'confirmed')
            ->where('team_id', '!=', $team->id)
            ->whereHas('team', fn ($q) => $q->where('cycle_id', $cycle->id))
            ->exists();
        if ($inOtherTeam) {
            return response()->json(['message' => 'You already belong to another team in this cycle.'], 422);
        }

        $membership->update(['invite_status' => 'confirmed', 'confirmed_at' => now()]);

        if ($team->confirmedMemberCount() >= (int) $cycle->team_min && $team->status === 'forming') {
            $team->update(['status' => 'active']);
        }

        return response()->json(['message' => 'Invite confirmed', 'id' => $membership->id]);
    }

    public function declineInvite(int $invite): JsonResponse
    {
        $membership = $this->ownPendingInvite($invite);
        $membership->update(['invite_status' => 'declined', 'confirmed_at' => null]);

        return response()->json(['message' => 'Invite declined', 'id' => $membership->id]);
    }

    private function ownPendingInvite(int $invite): TeamUser
    {
        $membership = TeamUser::findOrFail($invite);
        if ($membership->user_id !== Auth::id()) {
            abort(403);
        }
        if ($membership->invite_status !== 'pending') {
            abort(422, 'This invite is no longer pending.');
        }

        return $membership;
    }

    /** @return array<string, mixed> */
    private function formatTeam(Team $team): array
    {
        return [
            'id' => $team->id,
            'name' => $team->name,
            'status' => $team->status,
            'cycleId' => $team->cycle_id,
            'leaderId' => $team->leader_id,
            'leaderName' => $team->leader?->name,
            'members' => $team->memberships->map(fn ($m) => [
                'inviteId' => $m->id,
                'userId' => $m->user_id,
                'userName' => $m->user?->name,
                'rollNumber' => $m->user?->roll_number,
                'role' => $m->role,
                'invite_status' => $m->invite_status,
            ])->values(),
            'createdAt' => $team->created_at?->toISOString(),
        ];
    }
}
