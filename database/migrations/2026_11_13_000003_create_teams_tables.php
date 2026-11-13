<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cycle_id')->constrained('academic_cycles')->onDelete('cascade');
            $table->foreignId('leader_id')->constrained('users')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->enum('status', ['forming', 'active', 'locked'])->default('forming');
            $table->timestamps();

            $table->index(['cycle_id', 'leader_id']);
        });

        Schema::create('team_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['leader', 'member'])->default('member');
            $table->enum('invite_status', ['pending', 'confirmed', 'declined'])->default('pending');
            $table->timestamp('invited_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();

            $table->unique(['team_id', 'user_id']);
            $table->index(['user_id', 'invite_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_user');
        Schema::dropIfExists('teams');
    }
};
