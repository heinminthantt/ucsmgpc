<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained()->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->enum('reviewer_role', ['supervisor', 'examiner', 'dept_admin', 'admin'])->default('supervisor');
            $table->enum('decision', ['accept', 'request_changes', 'decline', 'pass', 'revision_required', 'fail']);
            $table->text('comment')->nullable();
            $table->timestamps();

            // Spec 9.2: one review per submission per reviewer.
            $table->unique(['submission_id', 'reviewer_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
