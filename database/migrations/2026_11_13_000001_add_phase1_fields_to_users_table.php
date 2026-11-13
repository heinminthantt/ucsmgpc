<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('roll_number')->nullable()->after('role');
            $table->foreignId('department_id')->nullable()->after('roll_number')
                ->constrained()->nullOnDelete();
            $table->string('student_year')->nullable()->after('department_id');
            $table->unsignedSmallInteger('cohort_year')->nullable()->after('student_year');
            // Spec 9.1: a roll number identifies one student per department + cohort.
            $table->unique(['department_id', 'roll_number', 'cohort_year'], 'users_roll_dept_cohort_unique');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique('users_roll_dept_cohort_unique');
            $table->dropConstrainedForeignId('department_id');
            $table->dropColumn(['roll_number', 'student_year', 'cohort_year']);
        });
    }
};
