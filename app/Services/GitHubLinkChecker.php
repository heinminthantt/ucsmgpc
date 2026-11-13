<?php

namespace App\Services;

use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

/**
 * GitHub link validation (Phase 3, spec 6.6): the format must be
 * https://github.com/{owner}/{repo}, and a reachability check confirms
 * the repository exists. The check is offline-safe: a network failure or
 * timeout yields "unknown" and never blocks saving. Only a confirmed
 * 404 blocks, with a clear message. A confirmed success stamps
 * projects.github_verified_at; changing the link clears the stamp until
 * the new link is verified.
 */
class GitHubLinkChecker
{
    public const FORMAT_MESSAGE = 'The GitHub link must look like https://github.com/owner/repository.';

    public const NOT_FOUND_MESSAGE = 'That GitHub repository could not be found (the server returned 404). Check the owner and repository name, or make the repository public.';

    /** @return array{owner: string, repo: string}|null */
    public static function parse(?string $url): ?array
    {
        if (blank($url)) {
            return null;
        }

        if (preg_match('#^https://github\.com/([A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)/([A-Za-z0-9._-]+?)(?:\.git)?/?$#', trim($url), $m)) {
            return ['owner' => $m[1], 'repo' => $m[2]];
        }

        return null;
    }

    public static function isValidFormat(?string $url): bool
    {
        return blank($url) || self::parse($url) !== null;
    }

    /** @return string 'exists' | 'not_found' | 'unknown' */
    public function check(?string $url): string
    {
        if (self::parse($url) === null) {
            return 'unknown';
        }

        try {
            $response = Http::timeout(4)
                ->withHeaders(['User-Agent' => 'ucsmgpc-link-check'])
                ->head(trim($url));

            if ($response->status() === 405) {
                $response = Http::timeout(4)
                    ->withHeaders(['User-Agent' => 'ucsmgpc-link-check'])
                    ->get(trim($url));
            }

            if ($response->successful()) {
                return 'exists';
            }

            return $response->status() === 404 ? 'not_found' : 'unknown';
        } catch (\Throwable) {
            // Offline, DNS failure, timeout: never block a save on the network.
            return 'unknown';
        }
    }

    /**
     * The github_verified_at value to store for a save. Throws a
     * ValidationException for a bad format or a confirmed 404.
     * An unchanged, already verified link is not re-checked.
     */
    public function verifiedAtFor(?string $newLink, ?string $oldLink, ?CarbonInterface $oldVerifiedAt): ?CarbonInterface
    {
        if (blank($newLink)) {
            return null;
        }

        if (self::parse($newLink) === null) {
            throw ValidationException::withMessages(['github_link' => self::FORMAT_MESSAGE]);
        }

        if ($newLink === $oldLink && $oldVerifiedAt !== null) {
            return $oldVerifiedAt;
        }

        return match ($this->check($newLink)) {
            'exists' => now(),
            'not_found' => throw ValidationException::withMessages(['github_link' => self::NOT_FOUND_MESSAGE]),
            default => $newLink === $oldLink ? $oldVerifiedAt : null,
        };
    }
}
