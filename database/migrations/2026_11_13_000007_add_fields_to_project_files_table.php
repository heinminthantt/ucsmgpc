<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_files', function (Blueprint $table) {
            // Spec 9.1 / section 12 file kinds.
            $table->enum('kind', ['report_pdf', 'source_zip', 'slides', 'image', 'other'])
                ->default('other')->after('original_name');
            $table->foreignId('submission_id')->nullable()->after('kind')
                ->constrained()->nullOnDelete();
            $table->unsignedBigInteger('size_bytes')->nullable()->after('submission_id');
            $table->string('mime_type')->nullable()->after('size_bytes');
        });
    }

    public function down(): void
    {
        Schema::table('project_files', function (Blueprint $table) {
            $table->dropConstrainedForeignId('submission_id');
            $table->dropColumn(['kind', 'size_bytes', 'mime_type']);
        });
    }
};
