<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Spec 9.2 / WF7 step 3: one row per scheduled defense; the latest
        // row is the current record for the project.
        Schema::create('defense_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->dateTime('scheduled_at');
            $table->string('venue')->nullable();
            $table->json('panel_json')->nullable(); // examiner/panel user ids
            $table->text('note')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['project_id', 'scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('defense_records');
    }
};
