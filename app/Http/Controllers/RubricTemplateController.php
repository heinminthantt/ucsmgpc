<?php

namespace App\Http\Controllers;

use App\Models\RubricTemplate;
use App\Services\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

/**
 * Rubric template management (Phase 3, spec section 7). Templates are
 * shared (a cycle picks one); dept admins and system admins can list,
 * create and edit them. Editing a template that a cycle already uses is
 * allowed here, but the spec advises creating a corrected template for
 * the next cycle once evaluation has started.
 */
class RubricTemplateController extends Controller
{
    public function index(): JsonResponse
    {
        $this->assertManager();

        return response()->json(RubricTemplate::orderBy('name')->get()->map(fn ($t) => $this->payload($t)));
    }

    public function store(Request $request, AuditLogger $audit): JsonResponse
    {
        $this->assertManager();
        $validated = $this->validateTemplate($request);

        $template = RubricTemplate::create([
            'name' => $validated['name'],
            'criteria_json' => $validated['criteria'],
            'pass_threshold' => $validated['pass_threshold'],
            'created_by' => Auth::id(),
        ]);

        $audit->log(Auth::user(), 'rubric_template.created', $template, ['name' => $template->name], $request);

        return response()->json($this->payload($template), 201);
    }

    public function update(Request $request, RubricTemplate $template, AuditLogger $audit): JsonResponse
    {
        $this->assertManager();
        $validated = $this->validateTemplate($request, $template);

        $template->update([
            'name' => $validated['name'],
            'criteria_json' => $validated['criteria'],
            'pass_threshold' => $validated['pass_threshold'],
        ]);

        $audit->log(Auth::user(), 'rubric_template.updated', $template, ['name' => $template->name], $request);

        return response()->json($this->payload($template));
    }

    private function assertManager(): void
    {
        $user = Auth::user();
        if (! $user->isAdmin() && ! $user->isDepartmentAdmin()) {
            abort(403, 'Only a department admin or an admin can manage rubric templates.');
        }
    }

    /** @return array{name: string, criteria: array, pass_threshold: mixed} */
    private function validateTemplate(Request $request, ?RubricTemplate $existing = null): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('rubric_templates', 'name')->ignore($existing?->id)],
            'pass_threshold' => 'required|numeric|min:0|max:100',
            'criteria' => 'required|array|min:1',
            'criteria.*.key' => 'required|string|max:60|distinct',
            'criteria.*.label' => 'required|string|max:255',
            'criteria.*.weight' => 'required|numeric|gt:0',
            'criteria.*.max' => 'required|numeric|gt:0',
        ]);

        $totalWeight = collect($validated['criteria'])->sum(fn ($c) => (float) $c['weight']);
        if ($totalWeight <= 0) {
            abort(response()->json(['message' => 'The criteria weights must add up to more than 0.', 'errors' => ['criteria' => ['The criteria weights must add up to more than 0.']]], 422));
        }

        return $validated;
    }

    /** @return array<string, mixed> */
    private function payload(RubricTemplate $t): array
    {
        return [
            'id' => $t->id,
            'name' => $t->name,
            'criteria' => $t->criteria_json,
            'passThreshold' => (float) $t->pass_threshold,
            'createdBy' => $t->created_by,
        ];
    }
}
