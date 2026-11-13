<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Set when supervisor and examiner disagree pass vs fail on the
            // final evaluation (spec 6.7 step 5). A dept admin resolves it.
            $table->boolean('evaluation_conflict')->default(false)->after('published_at');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('evaluation_conflict');
        });
    }
};
