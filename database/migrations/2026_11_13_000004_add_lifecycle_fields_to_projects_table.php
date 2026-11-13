<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->foreignId('cycle_id')->nullable()->after('course_id')
                ->constrained('academic_cycles')->nullOnDelete();
            $table->foreignId('team_id')->nullable()->after('cycle_id')
                ->constrained()->nullOnDelete();
            $table->foreignId('examiner_id')->nullable()->after('supervisor_id')
                ->constrained('users')->nullOnDelete();
            // Spec 5.1 states. Stored as a string (not a DB enum) so Phase 2
            // states never need an enum-altering migration; the allowed values
            // are enforced by App\Services\ProjectLifecycle.
            $table->string('status', 40)->default('draft')->after('approval_status');
            $table->timestamp('published_at')->nullable()->after('approved_at');

            $table->unique('team_id');
            $table->index(['status', 'cycle_id']);
            $table->index(['supervisor_id', 'status']);
        });

        // Backfill the new lifecycle status from the legacy approval_status so
        // existing rows keep their meaning (spec 9.1 migration note).
        DB::table('projects')->where('approval_status', 'approved')->update([
            'status' => 'approved_published',
            'published_at' => DB::raw('approved_at'),
        ]);
        DB::table('projects')->where('approval_status', 'pending')->update([
            'status' => 'proposal_submitted',
        ]);
        DB::table('projects')->where('approval_status', 'rejected')->update([
            'status' => 'proposal_declined',
        ]);
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropUnique(['team_id']);
            $table->dropIndex(['status', 'cycle_id']);
            $table->dropIndex(['supervisor_id', 'status']);
            $table->dropConstrainedForeignId('cycle_id');
            $table->dropConstrainedForeignId('team_id');
            $table->dropConstrainedForeignId('examiner_id');
            $table->dropColumn(['status', 'published_at']);
        });
    }
};
