<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academic_cycles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->string('academic_year'); // e.g. 2026-2027
            $table->string('semester'); // e.g. Semester VI
            $table->enum('project_type', ['course_project', 'final_year_project'])->default('final_year_project');
            $table->unsignedTinyInteger('team_min')->default(1);
            $table->unsignedTinyInteger('team_max')->default(5);
            $table->unsignedTinyInteger('supervisor_capacity')->default(6);
            $table->dateTime('proposal_deadline');
            $table->dateTime('mid_deadline')->nullable();
            $table->dateTime('final_deadline');
            // Spec 9.2 references a rubric_templates table (Phase 2). Kept as a
            // plain nullable id here so no Phase 2 table is faked in Phase 1.
            $table->unsignedBigInteger('rubric_template_id')->nullable();
            $table->enum('report_pdf_visibility', ['public', 'university'])->default('university');
            $table->enum('status', ['setup', 'open', 'in_progress', 'evaluation', 'closed', 'archived'])->default('setup');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['department_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_cycles');
    }
};
