<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->enum('stage', ['proposal', 'mid_review', 'final']);
            $table->unsignedInteger('version')->default(1);
            $table->json('payload_json')->nullable();
            $table->foreignId('submitted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('submitted_at')->nullable();
            $table->boolean('is_late')->default(false);
            $table->enum('status', ['submitted', 'changes_requested', 'accepted', 'declined'])->default('submitted');
            $table->timestamps();

            // Spec 9.2: one row per project + stage + version (immutable versions).
            $table->unique(['project_id', 'stage', 'version']);
            $table->index(['project_id', 'stage', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
