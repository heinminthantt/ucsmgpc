<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

/**
 * CSV cohort import (spec WF1 / section 6.1).
 *
 * Both endpoints take the same upload:
 *   POST /api/admin/import/preview  { type: students|supervisors, file: csv }
 *       Validates every row and imports NOTHING. Returns row-level errors.
 *   POST /api/admin/import/confirm  { type, file, cohort_year? }
 *       Re-validates; if there is any error it imports nothing (422).
 *       Otherwise creates the users in one transaction.
 *
 * Students CSV columns:    roll_number, name, email, department, student_year
 * Supervisors CSV columns: name, email, department, capacity (optional)
 *
 * Account state on import: is_active = true and a random unknown password.
 * There is no invite-mail flow in this foundation pass, so imported users
 * get in through the normal "forgot password" flow (or an admin-set
 * password). See PHASE1_PROGRESS.md.
 * Supervisor `capacity` is validated but not persisted: capacity lives on
 * the academic cycle in this data model (supervisor_capacity), not per user.
 */
class CohortImportController extends Controller
{
    public function template(Request $request): Response
    {
        $type = $request->query('type', 'students');
        $header = $type === 'supervisors'
            ? "name,email,department,capacity\n"
            : "roll_number,name,email,department,student_year\n";

        return response($header, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="cohort-'.$type.'-template.csv"',
        ]);
    }

    public function preview(Request $request): JsonResponse
    {
        [$type, $rows, $errors] = $this->parse($request);

        return response()->json([
            'type' => $type,
            'totalRows' => count($rows) + count($errors),
            'validRows' => count($rows),
            'errorRows' => count($errors),
            'errors' => $errors,
            'rows' => $rows,
        ]);
    }

    public function confirm(Request $request): JsonResponse
    {
        [$type, $rows, $errors] = $this->parse($request);

        if ($errors) {
            return response()->json([
                'message' => 'Import blocked: fix the row errors and upload again. Nothing was imported.',
                'errors' => $errors,
            ], 422);
        }

        $cohortYear = $request->input('cohort_year') ? (int) $request->input('cohort_year') : null;

        $created = DB::transaction(function () use ($rows, $type, $cohortYear) {
            $count = 0;
            foreach ($rows as $row) {
                User::create([
                    'name' => $row['name'],
                    'email' => $row['email'],
                    'password' => Hash::make(Str::random(40)),
                    'role' => $type === 'supervisors' ? 'supervisor' : 'user',
                    'is_active' => true,
                    'roll_number' => $row['roll_number'] ?? null,
                    'department_id' => $row['department_id'],
                    'student_year' => $row['student_year'] ?? null,
                    'cohort_year' => $type === 'students' ? $cohortYear : null,
                    // Imported accounts are created from the university's own
                    // class lists, so they count as verified.
                    'email_verified_at' => now(),
                ]);
                $count++;
            }

            return $count;
        });

        return response()->json([
            'message' => 'Import complete.',
            'type' => $type,
            'created' => $created,
        ], 201);
    }

    /**
     * Parse + validate the uploaded CSV.
     *
     * @return array{0: string, 1: array<int, array<string, mixed>>, 2: array<int, array{row: int, errors: string[]}>}
     */
    private function parse(Request $request): array
    {
        $request->validate([
            'type' => 'required|in:students,supervisors',
            'file' => 'required|file|max:5120',
        ]);

        $type = $request->input('type');
        $handle = fopen($request->file('file')->getRealPath(), 'r');
        if ($handle === false) {
            abort(422, 'Could not read the uploaded file.');
        }

        $header = null;
        $rows = [];
        $errors = [];
        $seenEmails = [];
        $seenRolls = [];
        $line = 0;

        while (($raw = fgetcsv($handle)) !== false) {
            $line++;
            if ($raw === [null] || (count($raw) === 1 && trim((string) $raw[0]) === '')) {
                continue; // blank line
            }
            $raw = array_map(fn ($v) => trim((string) $v), $raw);

            if ($header === null) {
                $header = array_map(fn ($h) => strtolower(trim($h)), $raw);

                continue;
            }

            $data = [];
            foreach ($header as $i => $column) {
                $data[$column] = $raw[$i] ?? '';
            }

            [$row, $rowErrors] = $this->validateRow($data, $type, $seenEmails, $seenRolls);
            if ($rowErrors) {
                $errors[] = ['row' => $line, 'errors' => $rowErrors];
            } else {
                $rows[] = $row;
                $seenEmails[strtolower($row['email'])] = true;
                if (! empty($row['roll_number'])) {
                    $seenRolls[strtolower($row['roll_number'])] = true;
                }
            }
        }
        fclose($handle);

        if ($header === null) {
            abort(422, 'The CSV file is empty.');
        }

        return [$type, $rows, $errors];
    }

    /**
     * @param  array<string, string>  $data
     * @param  array<string, bool>  $seenEmails
     * @param  array<string, bool>  $seenRolls
     * @return array{0: ?array<string, mixed>, 1: string[]} [normalised row, errors]
     */
    private function validateRow(array $data, string $type, array $seenEmails, array $seenRolls): array
    {
        $rules = $type === 'students'
            ? [
                'roll_number' => 'required|string|max:50',
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'department' => 'required|string|max:255',
                'student_year' => 'required|string|max:50',
            ]
            : [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'department' => 'required|string|max:255',
                'capacity' => 'nullable|integer|min:1|max:100',
            ];

        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
            return [null, $validator->errors()->all()];
        }

        $errors = [];

        $department = Department::where('name', $data['department'])->first();
        if (! $department) {
            $errors[] = 'Unknown department "'.$data['department'].'". Create the department first.';
        }

        if (isset($seenEmails[strtolower($data['email'])])) {
            $errors[] = 'Duplicate email inside this file.';
        } elseif (User::where('email', $data['email'])->exists()) {
            $errors[] = 'A user with this email already exists.';
        }

        if ($type === 'students') {
            if (isset($seenRolls[strtolower($data['roll_number'])])) {
                $errors[] = 'Duplicate roll number inside this file.';
            } elseif ($department && User::where('roll_number', $data['roll_number'])
                ->where('department_id', $department->id)->exists()) {
                $errors[] = 'A user with this roll number already exists in that department.';
            }
        }

        if ($errors) {
            return [null, $errors];
        }

        return [[
            'roll_number' => $data['roll_number'] ?? null,
            'name' => $data['name'],
            'email' => $data['email'],
            'department_id' => $department->id,
            'department_name' => $department->name,
            'student_year' => $data['student_year'] ?? null,
        ], []];
    }
}
