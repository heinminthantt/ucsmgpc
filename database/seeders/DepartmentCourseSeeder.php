<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Course;
use Illuminate\Database\Seeder;

class DepartmentCourseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Establish concrete Departments
        $departments = collect([
            'Computer Science & Engineering',
            'Information Technology',
            'Electronic Communications'
        ])->map(function ($name) {
            return Department::create(['name' => $name]);
        });

        // 2. Map structural semester prefix suffixes
        $semesterSuffixDigits = ['11', '12', '21', '22', '31', '32', '41', '42', '51'];

        // 3. Populate matching data matrix across every single department
        $departments->each(function ($department) use ($semesterSuffixDigits) {
            foreach ($semesterSuffixDigits as $digits) {
                // Generates 2 courses for each structural semester category grouping
                Course::factory()
                    ->count(2)
                    ->forSemesterDigits($digits)
                    ->create([
                        'department_id' => $department->id,
                    ]);
            }

            // Explicitly handle Semester X values
            Course::factory()->create([
                'name' => 'Professional Core Internship',
                'code' => 'Internship-' . rand(100, 999),
                'department_id' => $department->id,
            ]);

            Course::factory()->create([
                'name' => 'In Campus Capstone Project',
                'code' => 'In Compus-' . rand(100, 999),
                'department_id' => $department->id,
            ]);
        });
    }
}