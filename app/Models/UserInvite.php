<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * One invite activation token for an imported user (spec WF2).
 *
 * Create tokens with UserInvite::issueFor($user) and resolve them with
 * UserInvite::findByPlainToken($plainToken).
 *
 * @property int $id
 * @property int $user_id
 * @property string $token_hash
 * @property \Carbon\CarbonImmutable $expires_at
 * @property \Carbon\CarbonImmutable|null $used_at
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserInvite newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserInvite newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserInvite query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserInvite whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserInvite whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserInvite whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserInvite whereTokenHash($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserInvite whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserInvite whereUsedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserInvite whereUserId($value)
 * @mixin \Eloquent
 */
class UserInvite extends Model
{
    public const EXPIRY_DAYS = 7;

    protected $fillable = [
        'user_id',
        'token_hash',
        'expires_at',
        'used_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
    ];

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isUsed(): bool
    {
        return $this->used_at !== null;
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function isValid(): bool
    {
        return ! $this->isUsed() && ! $this->isExpired();
    }

    /** Why the token cannot be used, or null when it is valid. */
    public function invalidReason(): ?string
    {
        if ($this->isUsed()) {
            return 'This invite link has already been used. Please sign in, or use "Forgot password" if you cannot.';
        }
        if ($this->isExpired()) {
            return 'This invite link has expired. Please ask your department admin to send a new invite.';
        }

        return null;
    }

    /**
     * Issue a fresh invite for a user.
     *
     * @return array{0: UserInvite, 1: string} [invite, plain token for the email link]
     */
    public static function issueFor(User $user): array
    {
        $plainToken = Str::random(64);

        $invite = static::create([
            'user_id' => $user->id,
            'token_hash' => hash('sha256', $plainToken),
            'expires_at' => now()->addDays(self::EXPIRY_DAYS),
        ]);

        return [$invite, $plainToken];
    }

    /** Find the invite for a plain token from an activation link. */
    public static function findByPlainToken(string $plainToken): ?static
    {
        if ($plainToken === '') {
            return null;
        }

        $candidate = static::where('token_hash', hash('sha256', $plainToken))->first();
        if (! $candidate) {
            return null;
        }

        // Constant-time re-check so the hash lookup doubles as verification.
        return hash_equals($candidate->token_hash, hash('sha256', $plainToken)) ? $candidate : null;
    }

    public function markUsed(): void
    {
        $this->update(['used_at' => now()]);
    }
}
