<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Dedupe for the reminders:send command (spec section 8): one row
        // per project + stage + days-before offset, ever.
        Schema::create('deadline_reminders_sent', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('stage'); // proposal | mid_review | final
            $table->unsignedTinyInteger('days_before'); // 3 or 1
            $table->date('sent_on');
            $table->timestamps();

            $table->unique(['project_id', 'stage', 'days_before']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deadline_reminders_sent');
    }
};
