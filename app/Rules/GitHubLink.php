<?php

namespace App\Rules;

use App\Services\GitHubLinkChecker;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/** Format-only check for github_link fields (reachability is separate). */
class GitHubLink implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! blank($value) && ! GitHubLinkChecker::isValidFormat((string) $value)) {
            $fail(GitHubLinkChecker::FORMAT_MESSAGE);
        }
    }
}
