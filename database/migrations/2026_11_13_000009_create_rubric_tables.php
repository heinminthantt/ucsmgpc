<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Spec 9.2 / section 7: rubric templates are copied into a cycle at
        // creation; scores hang off the review that produced them.
        Schema::create('rubric_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // [{key, label, weight, max}] — weights are percentages, max is
            // the per-criterion score ceiling (100 in the spec default).
            $table->json('criteria_json');
            $table->decimal('pass_threshold', 5, 2)->default(50);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('rubric_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('review_id')->constrained()->cascadeOnDelete();
            $table->string('criterion_key');
            $table->decimal('score', 5, 2);
            $table->text('comment')->nullable();
            $table->timestamps();

            $table->unique(['review_id', 'criterion_key']);
        });

        // academic_cycles.rubric_template_id was a plain nullable id in
        // Phase 1; make it a real foreign key now that the table exists.
        if (Schema::hasTable('academic_cycles') && Schema::hasColumn('academic_cycles', 'rubric_template_id')) {
            Schema::table('academic_cycles', function (Blueprint $table) {
                $table->foreign('rubric_template_id')->references('id')->on('rubric_templates')->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('academic_cycles') && Schema::hasColumn('academic_cycles', 'rubric_template_id')) {
            Schema::table('academic_cycles', function (Blueprint $table) {
                $table->dropForeign(['rubric_template_id']);
            });
        }
        Schema::dropIfExists('rubric_scores');
        Schema::dropIfExists('rubric_templates');
    }
};
