<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Review;
use App\Models\RubricScore;
use App\Models\Submission;
use App\Models\User;

/**
 * Final-evaluation rules (spec 6.7 and 7, defaults D2/D3).
 *
 * The supervisor scores and proposes a result through the normal review
 * endpoint. When an examiner is assigned, the result is only confirmed once
 * the examiner has also reviewed the same final submission:
 *   both pass -> approved_published, either/both revision ->
 *   revision_required, both fail -> not_passed.
 * A pass vs fail disagreement does NOT auto-transition: the project is
 * flagged evaluation_conflict and dept admins are notified; a dept admin
 * resolves it through resolveConflict().
 *
 * With no examiner assigned, the supervisor's final decision stands alone
 * (Phase 1 behaviour). A dept admin or admin reviewing directly also
 * confirms immediately: they are the escalation authority.
 */
class EvaluationService
{
    public function __construct(private ProjectLifecycle $lifecycle) {}

    /** Normalised review decisions: pass | revision | fail | other. */
    public static function decisionFamily(string $decision): string
    {
        return match ($decision) {
            'accept', 'pass' => 'pass',
            'request_changes', 'revision_required' => 'revision',
            'decline', 'fail' => 'fail',
            default => 'other',
        };
    }

    public static function familyTargetStatus(string $family): ?string
    {
        return match ($family) {
            'pass' => 'approved_published',
            'revision' => 'revision_required',
            'fail' => 'not_passed',
            default => null,
        };
    }

    public static function familySubmissionStatus(string $family): ?string
    {
        return match ($family) {
            'pass' => 'accepted',
            'revision' => 'changes_requested',
            'fail' => 'declined',
            default => null,
        };
    }

    /**
     * Persist rubric scores for a review, validating against the project's
     * rubric template. Scores outside 0..max or for unknown criteria are
     * rejected by throwing InvalidArgumentException (controller -> 422).
     *
     * @param  array<int, array{criterion_key?: string, score?: mixed, comment?: ?string}>  $scores
     */
    public function storeScores(Review $review, Project $project, array $scores): void
    {
        $criteria = $project->rubricTemplate()->criteriaByKey();

        foreach ($scores as $entry) {
            $key = $entry['criterion_key'] ?? null;
            if (! $key || ! isset($criteria[$key])) {
                throw new \InvalidArgumentException('Unknown rubric criterion: '.($key ?? '(missing)'));
            }
            $score = $entry['score'] ?? null;
            $max = (float) ($criteria[$key]['max'] ?? 100);
            if (! is_numeric($score) || (float) $score < 0 || (float) $score > $max) {
                throw new \InvalidArgumentException("Score for {$key} must be between 0 and {$max}.");
            }

            RubricScore::updateOrCreate(
                ['review_id' => $review->id, 'criterion_key' => $key],
                ['score' => (float) $score, 'comment' => $entry['comment'] ?? null]
            );
        }
    }

    /**
     * Apply a final-stage review that has just been saved.
     *
     * @return string 'confirmed' | 'pending_confirmation' | 'conflict'
     */
    public function applyFinalReview(Project $project, Submission $submission, Review $review, User $reviewer): string
    {
        $project->refresh();

        // The project enters evaluation as soon as the first final review
        // lands (Phase 1 behaviour); the result itself may still pend.
        if ($project->status === 'final_submitted') {
            $this->lifecycle->transition($project, 'under_evaluation', $reviewer);
            $project->refresh();
        }

        $isAuthority = $reviewer->isAdmin()
            || ($reviewer->isDepartmentAdmin() && (int) $reviewer->department_id === (int) $project->department_id);
        $family = self::decisionFamily($review->decision);

        if ($isAuthority) {
            $this->confirmResult($project, $submission, $family, $reviewer, $review->comment);

            return 'confirmed';
        }

        // No examiner assigned: the (supervisor's) decision stands alone.
        if (empty($project->examiner_id)) {
            $this->confirmResult($project, $submission, $family, $reviewer, $review->comment);

            return 'confirmed';
        }

        $supervisorReview = $this->finalReviewBy($submission, (int) $project->supervisor_id);
        $examinerReview = $this->finalReviewBy($submission, (int) $project->examiner_id);

        if (! $supervisorReview || ! $examinerReview) {
            return 'pending_confirmation';
        }

        $supFamily = self::decisionFamily($supervisorReview->decision);
        $exFamily = self::decisionFamily($examinerReview->decision);

        $pair = [$supFamily, $exFamily];
        sort($pair);

        if ($pair === ['fail', 'pass']) {
            $this->flagConflict($project, $submission);

            return 'conflict';
        }

        // pass+pass -> pass; any revision (without a pass/fail clash) ->
        // revision; fail+fail -> fail; fail+revision -> revision (the
        // project is not passed and gets a chance to fix, per 6.7 step 5
        // only pass/fail clashes escalate).
        $agreed = match (true) {
            $supFamily === 'pass' && $exFamily === 'pass' => 'pass',
            $supFamily === 'fail' && $exFamily === 'fail' => 'fail',
            default => 'revision',
        };

        $this->confirmResult($project, $submission, $agreed, $reviewer, $review->comment);

        return 'confirmed';
    }

    /** Transition the project to the confirmed result and settle the submission. */
    public function confirmResult(Project $project, Submission $submission, string $family, User $actor, ?string $note = null): void
    {
        $target = self::familyTargetStatus($family);
        if ($target === null) {
            return;
        }

        if ($project->evaluation_conflict) {
            $project->evaluation_conflict = false;
            $project->save();
        }

        if ($project->status !== $target && $this->lifecycle->canTransition($project, $target)) {
            $this->lifecycle->transition($project, $target, $actor, $note);
        }

        $submissionStatus = self::familySubmissionStatus($family);
        if ($submissionStatus !== null && $submission->status !== $submissionStatus) {
            $submission->update(['status' => $submissionStatus]);
        }
    }

    /** Flag a pass/fail disagreement and notify the department's admins. */
    public function flagConflict(Project $project, Submission $submission): void
    {
        $project->evaluation_conflict = true;
        $project->save();

        $message = "The supervisor and examiner disagree (pass vs fail) on \"{$project->title}\". A department admin must resolve the evaluation.";

        $admins = User::query()
            ->where('department_id', $project->department_id)
            ->where('is_active', true)
            ->get()
            ->filter(fn (User $u) => $u->isDepartmentAdmin());
        $admins = $admins->merge(User::query()->where('is_active', true)->get()->filter(fn (User $u) => $u->isAdmin()));

        foreach ($admins->unique('id') as $admin) {
            Notifier::notifyUser($project, $admin, $message, 'evaluation_conflict');
        }
    }

    /** Dept admin forces a final result on a conflicted project (spec 6.7 step 5). */
    public function resolveConflict(Project $project, User $admin, string $result, ?string $comment): Review
    {
        $family = self::decisionFamily($result);
        $submission = $project->submissions()->where('stage', 'final')->orderByDesc('id')->first();
        if ($submission === null) {
            throw new \InvalidArgumentException('This project has no final submission to resolve.');
        }

        $review = Review::updateOrCreate(
            ['submission_id' => $submission->id, 'reviewer_id' => $admin->id],
            [
                'reviewer_role' => 'dept_admin',
                'decision' => match ($family) {
                    'pass' => 'pass',
                    'fail' => 'fail',
                    default => 'revision_required',
                },
                'comment' => $comment,
            ]
        );

        $this->confirmResult($project, $submission, $family, $admin, $comment);

        return $review;
    }

    private function finalReviewBy(Submission $submission, int $reviewerId): ?Review
    {
        return $submission->reviews()->where('reviewer_id', $reviewerId)->first();
    }
}
