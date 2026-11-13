<?php

namespace Database\Seeders;

use App\Models\RubricTemplate;
use Illuminate\Database\Seeder;

/**
 * Seeds the spec section 7 default rubric template. Safe to run anywhere
 * (firstOrCreate on the template name); tests can also call
 * RubricTemplate::defaultTemplate() directly.
 */
class RubricTemplateSeeder extends Seeder
{
    public function run(): void
    {
        RubricTemplate::defaultTemplate();
    }
}
