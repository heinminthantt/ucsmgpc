<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Full-text indexes are a MySQL feature. On other drivers (SQLite in
     * tests/CI, PostgreSQL) this migration is a clean no-op so the suite
     * can migrate:fresh everywhere; the catalog search endpoint itself
     * still requires MySQL in production.
     */
    private function supportsFullText(): bool
    {
        return Schema::getConnection()->getDriverName() === 'mysql';
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! $this->supportsFullText()) {
            return;
        }

        Schema::table('projects', function (Blueprint $table) {
            $table->fullText(['title', 'description', 'body', 'objectives']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! $this->supportsFullText()) {
            return;
        }

        Schema::table('projects', function (Blueprint $table) {
            $table->dropFullText(['title', 'description', 'body', 'objectives']);
        });
    }
};
