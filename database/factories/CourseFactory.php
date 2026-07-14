<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition(): array
    {
        $subjects = ['Data Structures', 'Algorithms', 'Database Management', 'Web Development', 'Compiler Design', 'Operating Systems', 'Networking'];
        $prefixes = ['CST', 'CS', 'CT', 'CST(SS)', 'CST(SK)'];
        
        // Randomly pick a semester digit pattern (e.g., 11 through 51)
        $semesterDigits = $this->faker->randomElement(['11', '12', '21', '22', '31', '32', '41', '42', '51']);
        
        $prefix = $this->faker->randomElement($prefixes);
        $code = "{$prefix}-{$semesterDigits}" . $this->faker->numberBetween(1, 9); // e.g., CST-115, CS-221

        return [
            'name' => $this->faker->randomElement($subjects) . ' ' . $this->faker->numberBetween(1, 4),
            'code' => $code,
            'department_id' => Department::factory(),
        ];
    }

    /**
     * Helper State to generate code for a specific semester identifier
     */
    public function forSemesterDigits(string $digits): self
    {
        return $this->state(function (array $attributes) use ($digits) {
            $prefixes = ['CST', 'CS', 'CT', 'CST(SS)', 'CST(SK)'];
            $prefix = $this->faker->randomElement($prefixes);
            return [
                'code' => "{$prefix}-{$digits}" . $this->faker->numberBetween(1, 9)
            ];
        });
    }
}