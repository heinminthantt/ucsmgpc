<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('benefits')->nullable();
            $table->text('body')->nullable();
            $table->string('content_format', 20)->default('html');
            $table->string('cover_image_url')->nullable();
            $table->string('excerpt', 500)->nullable();
            $table->string('academic_year')->nullable();
            $table->string('student_year')->nullable();
            $table->text('objectives')->nullable();
            $table->string('github_link')->nullable();
            $table->text('members_json')->nullable(); // JSON array of {name, rollNumber}
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('supervisor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
