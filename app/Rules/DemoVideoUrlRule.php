<?php

namespace App\Rules;

use App\Services\DemoVideoUrl;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/** Only YouTube and Vimeo video URLs may be saved as a demo video. */
class DemoVideoUrlRule implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! blank($value) && ! DemoVideoUrl::isValid((string) $value)) {
            $fail('The demo video must be a YouTube or Vimeo video URL.');
        }
    }
}
