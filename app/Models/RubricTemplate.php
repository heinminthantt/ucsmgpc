<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RubricTemplate extends Model
{
    public const DEFAULT_NAME = 'Default rubric (spec v1)';

    protected $fillable = [
        'name',
        'criteria_json',
        'pass_threshold',
        'created_by',
    ];

    protected $casts = [
        'criteria_json' => 'array',
        'pass_threshold' => 'decimal:2',
    ];

    /**
     * The spec section 7 default criteria: key, label, weight (%), max.
     *
     * @return array<int, array{key: string, label: string, weight: float, max: float}>
     */
    public static function defaultCriteria(): array
    {
        return [
            ['key' => 'problem_objectives', 'label' => 'Problem definition & objectives', 'weight' => 15, 'max' => 100],
            ['key' => 'implementation', 'label' => 'Implementation / technical quality', 'weight' => 35, 'max' => 100],
            ['key' => 'documentation', 'label' => 'Documentation (report quality)', 'weight' => 20, 'max' => 100],
            ['key' => 'presentation_defense', 'label' => 'Presentation & defense', 'weight' => 20, 'max' => 100],
            ['key' => 'teamwork_process', 'label' => 'Teamwork & process', 'weight' => 10, 'max' => 100],
        ];
    }

    /** The shared default template, created on first use (seeder + cycle creation + tests). */
    public static function defaultTemplate(): self
    {
        return static::firstOrCreate(
            ['name' => self::DEFAULT_NAME],
            ['criteria_json' => self::defaultCriteria(), 'pass_threshold' => 50]
        );
    }

    /** @return array<string, array{key: string, label: string, weight: float, max: float}> criteria keyed by criterion key */
    public function criteriaByKey(): array
    {
        $byKey = [];
        foreach ($this->criteria_json ?? [] as $criterion) {
            if (! empty($criterion['key'])) {
                $byKey[$criterion['key']] = $criterion;
            }
        }

        return $byKey;
    }

    /**
     * Weighted total on a 0-100 scale for a set of raw scores.
     *
     * @param  array<string, float|int>  $scoresByKey  raw score per criterion key
     * @return float|null null when no known criterion has a score.
     *                    Criteria without a score are excluded and the
     *                    remaining weights are renormalised, so a partially
     *                    scored rubric still yields a comparable total.
     */
    public function weightedTotal(array $scoresByKey): ?float
    {
        $weightedSum = 0.0;
        $weightTotal = 0.0;

        foreach ($this->criteriaByKey() as $key => $criterion) {
            if (! array_key_exists($key, $scoresByKey) || $scoresByKey[$key] === null) {
                continue;
            }
            $max = (float) ($criterion['max'] ?? 100);
            $weight = (float) ($criterion['weight'] ?? 0);
            if ($max <= 0 || $weight <= 0) {
                continue;
            }
            $weightedSum += ((float) $scoresByKey[$key] / $max) * $weight;
            $weightTotal += $weight;
        }

        if ($weightTotal <= 0) {
            return null;
        }

        // Renormalise to a 0-100 scale over the scored criteria's weights.
        return round($weightedSum / $weightTotal * 100, 2);
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return HasMany<AcademicCycle, $this> */
    public function cycles(): HasMany
    {
        return $this->hasMany(AcademicCycle::class, 'rubric_template_id');
    }
}
