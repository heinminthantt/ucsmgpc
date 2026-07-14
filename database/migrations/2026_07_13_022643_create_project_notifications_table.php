<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipient_user_id')->constrained('users')->onDelete('cascade');
            $table->string('message');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('comment_id')->nullable()->constrained('comments')->nullOnDelete();
            $table->string('notification_type', 50)->default('comment');
            $table->string('project_title')->nullable();
            $table->text('comment_text')->nullable();
            $table->string('commenter_name')->nullable();
            $table->string('approver_name')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_notifications');
    }
};
