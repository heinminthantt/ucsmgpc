<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Phase 3 (spec 2.3, S7, S8): featured flag for the public
            // catalog, an optional demo video (YouTube/Vimeo only, validated
            // in App\Services\DemoVideoUrl), and the last successful GitHub
            // reachability check for the repo link.
            $table->boolean('is_featured')->default(false)->after('evaluation_conflict');
            $table->string('demo_video_url')->nullable()->after('github_link');
            $table->timestamp('github_verified_at')->nullable()->after('demo_video_url');
        });

        Schema::table('users', function (Blueprint $table) {
            // UI language preference for the Burmese pass (spec D10):
            // 'en' or 'my'. Guests fall back to a browser localStorage value.
            $table->string('locale', 5)->default('en')->after('bio');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['is_featured', 'demo_video_url', 'github_verified_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('locale');
        });
    }
};
