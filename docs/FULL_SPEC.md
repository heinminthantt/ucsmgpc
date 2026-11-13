# ucsmgpc — Full Specification
## University Project Lifecycle & Catalog System for UCS Magway

| Item | Detail |
|---|---|
| Product | ucsmgpc — UCS Magway Project Catalog, reimagined as a full university project lifecycle system |
| Repository | github.com/heinminthantt/ucsmgpc |
| University | University of Computer Studies, Magway (UCS Magway) |
| Version | Spec v1.0, 2026-11-13 |
| Stack (existing, keep) | Laravel 13, PHP 8.3, Inertia.js 3, React 19, TypeScript, Tailwind CSS 4, Laravel Fortify (auth, 2FA, passkeys), MySQL (full-text search), Vite |
| Status | Specification only. No code in this document is implemented yet unless marked [EXISTS]. Defaults are marked [DEFAULT] where the university has not yet decided. |

---

# 1. Purpose and Problem

## 1.1 Purpose
Give UCS Magway one official system where a student project lives its whole life:
proposal, supervision, progress, final submission, evaluation, and publication,
instead of paper forms, Messenger/Viber messages, and files on teachers' laptops.
When a project passes, it is automatically published to the public Project Catalog,
which becomes the university's permanent, searchable archive of student work.

## 1.2 Problems it solves
- Proposals and approvals currently leave no reliable record of who approved what, when.
- Supervisors cannot see all their teams, deadlines, and pending reviews in one place.
- Students do not know their exact stage, deadline, or feedback history.
- Departments cannot report a semester's projects, supervisors, and results without manual work.
- Finished projects disappear after the defense; juniors cannot learn from seniors' work,
  and the university cannot show its work to visitors, employers, or other universities.
- Rejected / unfinished work and approved work are not clearly separated.

## 1.3 Goals
G1. Every project in a pilot department passes through the system end to end for one full cycle.
G2. No approval, change request, or mark exists only outside the system.
G3. A department can export a complete, correct cycle record in under 5 minutes.
G4. A public visitor can find any published project by title, student, supervisor,
    department, course, year, or technology in under 3 searches.
G5. The system reuses the existing ucsmgpc codebase: catalog search, departments/courses,
    notifications, comments/reactions/saves, and the journal-style public theme are kept.

## 1.4 Non-goals (v1)
- Not a general LMS: no lessons, quizzes, attendance, or timetable.
- Not a plagiarism detector: it stores files and links; external checking stays manual [Phase 3 may integrate].
- Not a payment, HR, or student-registry system. Student identity data is imported, not mastered here.
- No native mobile app in v1. The web app must be fully usable on Android phones (responsive).

---

# 2. Scope

## 2.1 In scope — Phase 1 (Pilot MVP)
Cycle setup, CSV cohort import, invite-only accounts, real teams, proposal workflow with
supervisor accept / changes-requested loop and versions, final submission checklist,
publish to catalog on pass, public-API privacy fix, role dashboards (basic),
in-app + email notifications.

## 2.2 In scope — Phase 2 (Assessment)
Logbook and mid-review checkpoint, rubric evaluation with examiner moderation,
deadline reminder emails, cycle export (Excel/PDF), audit log, department monitoring board.

## 2.3 In scope — Phase 3 (Showcase & Scale)
Featured projects, department and supervisor public pages, GitHub link validation,
demo video embeds, department analytics, Burmese language pass, rollout to all departments.

## 2.4 Out of scope
Self-registration for students (removed), public comments on unpublished projects,
reactions during review, direct messaging/chat (feedback is structured, per submission),
multi-university tenancy.

---

# 3. Users and Roles

## 3.1 Role definitions
| Role | Code | Who | Account created by |
|---|---|---|---|
| Student — Team Leader | student (is_leader on team) | Project owner student | CSV import + invite |
| Student — Team Member | student | Invited teammate | CSV import + invite |
| Supervisor | supervisor | Teacher supervising teams | CSV import by Dept Admin |
| Examiner | examiner | Second marker / defense panel member | Assigned per project/cycle by Dept Admin |
| Department Admin | department_admin | Head of department / project coordinator | System Admin |
| System Admin | admin | IT maintainer | Existing admin |
| Public Visitor | (none) | Anyone, no login | n/a |

A user has exactly one system role. Examiner is an assignment on top of a supervisor/staff
account for a cycle or project, not a separate account type [DEFAULT].

## 3.2 User identity fields (new)
Every student/staff account must carry:
- `roll_number` — string, e.g. UCSMG-####. Unique per department + academic cycle cohort.
- `department_id` — required for students, supervisors, department admins.
- `student_year` — for students: Year/Semester label from the cycle (e.g. Final Year, Semester VI).
- `cohort` / entry year — optional, for grouping.
- `email` — must match the imported record for invite activation.
- `is_active`, `role` [EXISTS].

## 3.3 Permissions matrix
Key: ✓ allowed, — not allowed, (own) only own/team's, (dept) only own department.

| Action | Student Leader | Student Member | Supervisor | Examiner | Dept Admin | Sys Admin | Public |
|---|---|---|---|---|---|---|---|
| Browse/search published catalog | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View unpublished project | (own team) | (own team) | (assigned) | (assigned) | (dept) | ✓ | — |
| Create team | ✓ | — | — | — | — | — | — |
| Invite/remove team members | ✓ (before proposal locks team) | — | — | — | ✓ (dept, fix disputes) | ✓ | — |
| Edit draft proposal/final | ✓ | ✓ (draft sections only) | — | — | — | — | — |
| Submit / resubmit a stage | ✓ | — | — | — | — | — | — |
| Request a supervisor | ✓ | — | — | — | — | — | — |
| Accept/decline team, request changes | — | — | ✓ (requested/assigned) | — | ✓ (dept, override) | ✓ | — |
| Reassign supervisor | — | — | — | — | ✓ (dept) | ✓ | — |
| Write logbook entry | ✓ | ✓ | comment only | — | — | — | — |
| Score rubric | — | — | ✓ (own teams) | ✓ (assigned) | — | — | — |
| Confirm final result | — | — | propose | ✓ confirm | ✓ (dept, resolve dispute) | — | — |
| Publish / unpublish catalog entry | — | — | — | — | ✓ (dept) | ✓ | — |
| Create/edit academic cycle | — | — | — | — | ✓ (dept) | ✓ | — |
| Import students/supervisors (CSV) | — | — | — | — | ✓ (dept) | ✓ | — |
| Manage departments/courses | — | — | — | — | — | ✓ | — |
| Change user roles, deactivate users | — | — | — | — | — | ✓ [EXISTS] | — |
| Export cycle records | — | — | ✓ (own teams list) | — | ✓ (dept) | ✓ | — |
| View audit log | — | — | — | — | ✓ (dept) | ✓ | — |
| Comment/react/save published project | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — (login required [EXISTS]) |

## 3.4 Account rules
- AR1. Public self-registration is disabled for students and staff. Accounts are created
  by CSV import; the user activates by an invite email link and sets a password.
- AR2. [DEFAULT] If import is impossible for a late student, Dept Admin can create a
  single account manually with roll, department, and cycle; it appears in the audit log.
- AR3. One person = one account. Duplicate roll number in the same department+cohort is rejected on import with a row-level error report.
- AR4. Deactivated users keep their historical records (submissions, approvals, marks);
  they cannot log in [is_active EXISTS].
- AR5. Password, 2FA, and passkey features from Fortify are kept as-is [EXISTS].

---

# 4. Core Concepts

## 4.1 Academic Cycle
One cycle = one project run for one department in one term.
Fields: department, academic year (e.g. 2026-2027), semester label, project type
(`course_project` | `final_year_project`), team size min/max, supervisor team capacity,
proposal deadline, mid-review deadline [Phase 2], final deadline, rubric template,
publication policy (report PDF public or university-only), status
(`setup` | `open` | `in_progress` | `evaluation` | `closed` | `archived`).
Rules:
- CY1. A student team belongs to exactly one cycle. A student can lead only one team per cycle.
- CY2. Deadlines are date + time in Asia/Yangon timezone, displayed everywhere with the date.
- CY3. Only Dept Admin (own dept) / Sys Admin can create or edit a cycle. Editing a deadline
  after submissions exist is allowed, is audit-logged, and notifies affected teams.
- CY4. Closing a cycle freezes all its projects read-only. Archiving hides it from
  day-to-day dashboards but never deletes records or published catalog entries.

## 4.2 Team
Fields: cycle, leader (user), name (optional, defaults to project title later),
status (`forming` | `active` | `locked`).
Rules:
- TM1. Size must be within the cycle min/max before a proposal can be submitted.
- TM2. Members are invited by roll number; the invitee must confirm. Pending invites are visible to the leader.
- TM3. A student can be a member of only one team per cycle.
- TM4. Once a proposal is submitted, membership is locked. Changes need Dept Admin action (audit-logged).
- TM5. The old `members_json` free text is migrated: names/rolls become real members where a
  matching user exists; unmatched names are kept as display-only legacy members, clearly marked.

## 4.3 Project
One project belongs to one team and one cycle.
Fields carried from today [EXISTS]: title, description/abstract, objectives, benefits,
body/report content, cover image, github_link, department, course, tags.
New: cycle_id, team_id, supervisor_id (now required before proposal review),
examiner_id (nullable), status (state machine, §5), current_stage, published_at,
is_featured [Phase 3], late flags per stage.
Rules:
- PJ1. Department and course are inherited from the cycle/team by default; course must
  belong to the department (no frontend hard-coded course-code prefixes; the server validates this).
- PJ2. Title uniqueness is not enforced, but the system warns on an exact title match
  inside the same department in the last 5 cycles ("a similar project exists", with a link).

## 4.4 Submission (Version)
Every stage submission is an immutable version:
Fields: project, stage (`proposal` | `mid_review` | `final`), version number (1,2,3… per stage),
payload (structured fields for that stage), files, submitted_by, submitted_at, is_late,
status (`submitted` | `changes_requested` | `accepted` | `declined`/`rejected`).
Rules:
- SB1. Editing after submit never overwrites a version; resubmission creates version+1.
- SB2. Reviewers always see the latest version, with one-click access to earlier versions and a field-level summary of what changed (at minimum: version list + timestamps + files).
- SB3. Only the leader can submit. Any team member can edit a draft.
- SB4. A submission after its deadline is accepted but flagged `is_late` with the delay shown,
  unless the cycle is closed [DEFAULT; Dept Admin can hard-close a stage instead].

## 4.5 Review
One review per submission version per reviewer:
Fields: submission, reviewer, decision (`accept` | `request_changes` | `decline`/`reject`),
comment (required for request_changes and decline), rubric scores [final stage], reviewed_at.
Rules:
- RV1. No decision without opening the submission detail (the pending list links to full detail, files, and team).
- RV2. Request-changes requires a written comment; students see exactly that comment.
- RV3. A supervisor can review only teams assigned/requested to them; Dept Admin can override with audit log.

---

# 5. State Machine (Project Status)

## 5.1 States
| State | Meaning | Visible to public |
|---|---|---|
| draft | Team is preparing a proposal | No |
| proposal_submitted | Waiting for supervisor decision | No |
| proposal_changes_requested | Supervisor asked for fixes; team may edit + resubmit | No |
| proposal_declined | Supervisor declined the team/topic; team may request another supervisor or submit a new proposal | No |
| in_progress | Proposal accepted; work + logbook phase | No |
| mid_review_submitted | [Phase 2] Progress report waiting for supervisor check | No |
| final_submitted | Final package waiting to enter evaluation | No |
| under_evaluation | Supervisor and/or examiner scoring | No |
| revision_required | Evaluation sent it back; team may resubmit final (new version) | No |
| approved_published | Passed and published to catalog | Yes |
| not_passed | Final result recorded as fail; not published | No |
| archived | Cycle closed; read-only record | Only if it was published |

## 5.2 Allowed transitions
| From | To | Actor | Condition |
|---|---|---|---|
| draft | proposal_submitted | Leader | Team size valid, proposal fields complete, supervisor requested |
| proposal_submitted | proposal_changes_requested | Supervisor | Comment required |
| proposal_submitted | in_progress | Supervisor (accept) | Supervisor under capacity, or Dept Admin override |
| proposal_submitted | proposal_declined | Supervisor | Reason required |
| proposal_changes_requested | proposal_submitted | Leader (resubmit) | Creates proposal V+1 |
| proposal_declined | draft | Leader | May change supervisor request and/or topic |
| in_progress | mid_review_submitted | Leader | [Phase 2] Before/at mid deadline |
| mid_review_submitted | in_progress | Supervisor | Feedback required; pass/fail of checkpoint is recorded, project continues |
| in_progress | final_submitted | Leader | Final checklist complete (§6.5) |
| final_submitted | under_evaluation | System / Dept Admin | On final deadline, or manually when cohort is complete |
| under_evaluation | revision_required | Examiner (confirm) or Supervisor+Examiner [DEFAULT both] | Rubric + comment required |
| under_evaluation | approved_published | Examiner confirms pass | Rubric complete; publication fields (abstract, cover, tags) complete |
| under_evaluation | not_passed | Examiner confirms fail | Rubric + reason required |
| revision_required | final_submitted | Leader (resubmit) | Creates final V+1; re-enters evaluation |
| approved_published | archived | System | Cycle closed |
| any non-final state | archived | System | Cycle closed (record kept, marked incomplete) |

## 5.3 Fixes to today's behaviour (explicit requirements)
- FX1. Resubmission must reset the project to the reviewer's queue. (Today, editing a
  rejected project does not reset `approval_status` — that bug class must not exist:
  status changes happen only through the transitions above, never as a side effect of editing.)
- FX2. Approved/published projects cannot be edited by students. Corrections after
  publication are made by Dept/Sys Admin, audit-logged, with the catalog showing "Updated on".
- FX3. Rejection is never a silent dead end: every negative decision carries a reason,
  a named next step for the student, and a path (resubmit, new supervisor, or new proposal).

---

# 6. Workflows in Detail

## 6.1 WF1 — Cycle setup and cohort import (Dept Admin)
1. Create cycle (§4.1). 2. Download the CSV template. 3. Upload students CSV and supervisors CSV.
4. System validates every row (roll format, duplicate roll, unknown department, bad email)
   and shows a preview: X to create, Y to update, Z errors with row numbers. Nothing is imported until confirmed.
5. On confirm, accounts are created inactive-with-invite; invite emails are sent.
6. Dept Admin assigns/approves supervisor list for the cycle and sets capacity per supervisor
   (default from cycle [DEFAULT 6 teams]).
Acceptance: importing the template file with 0 errors creates exactly the listed accounts;
a file with errors imports nothing and reports every bad row.

CSV columns (students): roll_number, name, email, department, student_year.
CSV columns (supervisors): name, email, department, capacity (optional).

## 6.2 WF2 — Account activation (Student/Staff)
Invite link → set password → (optional 2FA/passkey [EXISTS]) → lands on role dashboard
with a first-run checklist: confirm profile, join/create team, start proposal.

## 6.3 WF3 — Team formation (Leader + Members)
Create team in an open cycle → invite by roll → members confirm/decline →
when size ≥ cycle min, "Ready to propose" state. Leader can remove a pending (not yet confirmed)
member freely; confirmed-member removal before proposal needs that member's confirm or Dept Admin.

## 6.4 WF4 — Proposal (Team → Supervisor)
Proposal form (short, structured — replaces today's giant form at this stage):
title*, problem statement*, objectives*, scope & limitations, method/technology*,
expected outcome, supervisor request* (search staff in own department, shows current load
e.g. "4/6 teams", cannot select a full supervisor unless Dept Admin overrides),
course* (from department's real course list), tags (max 5).
Submit → supervisor notified (in-app + email) → supervisor opens full proposal →
Accept / Request Changes (comment*) / Decline (reason*).
- Accept → project in_progress, team locked, supervisor assigned.
- Request changes → team edits draft, resubmits as V2, V3… history preserved.
- Decline → team returns to draft, may pick another supervisor or a new topic.

## 6.5 WF5 — Progress, logbook, mid-review [Phase 2; logbook basic in Phase 1 if time]
- Logbook: dated entries by any member (text + optional file/link). Supervisor can comment on the project timeline at any time. Entries are append-only.
- Mid-review: leader submits a progress report (what is done, what remains, demo link/file)
  by the mid deadline. Supervisor records: on-track / needs-attention + feedback.
  This checkpoint does not pass/fail the project; it is recorded for the department board.

## 6.6 WF6 — Final submission (Leader)
Final checklist — submit is blocked until all required items exist:
| Item | Required | Format |
|---|---|---|
| Abstract (for catalog) | Yes | Text, 100–500 words guide |
| Final report | Yes | PDF, max 50 MB [DEFAULT] |
| Source code | Yes: ZIP or GitHub link (at least one) | ZIP max 100 MB [DEFAULT] or valid github.com URL |
| Presentation slides | Yes | PDF or PPT/PPTX, max 50 MB |
| Demo video link | No | URL (YouTube/Drive etc.) |
| Cover image | No (falls back to first report image / placeholder) | Image max 10 MB [EXISTS upload] |
| Tags | Yes, 1–5 | From input, normalised lower-case [EXISTS behaviour] |
| Member contributions | Yes | Per-member short text (shown only to staff + team, not public) |
Rich-text report body from today's form is kept as an optional online reading version;
the PDF is the official record.
Late: see SB4. After submit, the package is frozen as Final V1.

## 6.7 WF7 — Evaluation and defense (Supervisor + Examiner)
1. Rubric (§7) scored by supervisor. 2. Examiner assigned per project (by Dept Admin, may be
   bulk-assigned) scores/confirms. 3. Defense record: date, venue/panel, result note.
4. Outcome: Pass → publish. Revision Required → comment + which rubric areas to fix,
   team resubmits Final V+1, re-evaluation covers changed areas [DEFAULT full re-score is allowed].
   Fail → not_passed, reason required, Dept Admin notified.
5. Disagreement: if supervisor and examiner results differ (pass vs fail), Dept Admin
   resolves; the resolution and reason are audit-logged.
Privacy: rubric scores and internal comments are visible only to the team and staff.
The public catalog never shows marks.

## 6.8 WF8 — Publication (System, on Pass)
Catalog entry is built from the final version: title, abstract, team (names + rolls are
public [DEFAULT: names yes, roll numbers staff-only — see §10]), supervisor, department,
course, academic year + semester, tags, GitHub link, cover, demo video [Phase 3 embed],
report PDF per cycle publication policy, approved/published date.
Published projects get a stable URL /projects/{id} [show page EXISTS] and appear in public
search [EXISTS]. Comments, reactions, saves apply only here [EXISTS features, restricted to published].

## 6.9 WF9 — Monitoring, export, close (Dept Admin)
- Board: counts and a filterable list by status, supervisor, overdue stage; "waiting on supervisor > 7 days" highlight.
- Export (Excel + PDF summary): cycle, team, members + rolls, supervisor, examiner,
  stage history (dates), rubric totals, result. One file per cycle.
- Close cycle → projects archived (§4.1 CY4), export remains available.

## 6.10 WF10 — Public browsing (Visitor)
Landing [EXISTS journal theme], catalog search with full-text keyword and filters:
department, course, academic year, semester/student year, supervisor, member name, tags [EXISTS].
Project page [EXISTS]. No login needed to read. Login needed to comment/react/save [EXISTS].

---

# 7. Evaluation Rubric [DEFAULT template, editable per cycle]

| Criterion | Weight | Scored by |
|---|---|---|
| Problem definition & objectives | 15% | Supervisor + Examiner |
| Implementation / technical quality | 35% | Supervisor + Examiner |
| Documentation (report quality) | 20% | Supervisor + Examiner |
| Presentation & defense | 20% | Examiner / panel |
| Teamwork & process (logbook, milestones) | 10% | Supervisor |

- Each criterion: 0–100 or a 5-level scale [DEFAULT 0–100], weighted total computed by the system.
- Pass threshold: [DEFAULT 50] and no single criterion at 0 without a comment.
- Rubric template is copied into the cycle at creation; editing it after evaluation starts is prohibited (audit risk) — create a corrected template for the next cycle instead.
- Students see: their criterion scores + comments after the result is confirmed [DEFAULT].
  They never see internal supervisor↔examiner discussion notes.

---

# 8. Notifications

Channels: in-app [EXISTS ProjectNotification] + email. (SMS/Telegram: out of scope.)
Events (recipient → trigger):
- Supervisor: new proposal submitted; proposal resubmitted; mid report submitted; final submitted.
- Team (all members): proposal decision (accept/changes/decline, with comment); supervisor timeline comment; mid feedback; evaluation result confirmed; revision requested; project published (with public link).
- Examiner: assigned to a project; final package ready for evaluation.
- Dept Admin: proposal declined (team needs help); evaluation disagreement; stage overdue report (weekly digest [DEFAULT]).
- Everyone in a cycle: deadline reminders at 3 days and 1 day before proposal/mid/final deadlines (only if that stage is not yet submitted).
Rules: notifications link to the exact project + stage; marking read works per item and
mark-all [EXISTS]; email failure never blocks the in-app notification or the action itself.

---

# 9. Data Model

Existing tables kept: users, departments, courses, projects, tags + project_tags,
project_files, comments, reactions, saved_projects, project_notifications.
Deprecated: members, project_members, projects.members_json (migrate per TM5, then drop in a later release).

## 9.1 Changes to existing tables
users: + roll_number (string, nullable for admin), + department_id (FK, nullable for admin),
+ student_year (string, nullable), + cohort_year (smallint, nullable).
Unique index: (department_id, roll_number, cohort_year) where roll_number is not null.
projects: + cycle_id (FK, required for new projects), + team_id (FK, unique),
+ examiner_id (FK users, nullable), + status (enum §5.1, replaces approval_status —
migrate pending→proposal/final review equivalent by stage, approved→approved_published,
rejected→proposal_declined with a data note), + published_at (timestamp, nullable),
- approval_status, approved_at, approved_by are kept read-only for history during migration, then removed.
project_files: + kind (enum: report_pdf | source_zip | slides | image | other),
+ submission_id (FK, nullable for legacy), + size_bytes, + mime_type.
(Original name and path already exist.)
project_notifications: + submission_id (nullable), keep recipient/message/type fields [EXISTS].
Add indexes: projects(status, cycle_id), projects(supervisor_id, status), full-text on
projects(title, description, body, objectives) [EXISTS].

## 9.2 New tables
academic_cycles: id, department_id FK, academic_year string, semester string,
project_type enum, team_min tinyint, team_max tinyint, supervisor_capacity tinyint,
proposal_deadline datetime, mid_deadline datetime nullable, final_deadline datetime,
rubric_template_id FK nullable, report_pdf_visibility enum(public|university) default university,
status enum §4.1, created_by FK users, timestamps.

teams: id, cycle_id FK, leader_id FK users, name nullable, status enum §4.2, timestamps.
team_user: team_id FK, user_id FK, role enum(leader|member), invite_status enum(pending|confirmed|declined),
invited_at, confirmed_at. Unique (team_id, user_id) and a rule that one confirmed user has one team per cycle (enforced in service layer + partial check).

submissions: id, project_id FK, stage enum(proposal|mid_review|final), version int,
payload_json (stage fields), submitted_by FK users, submitted_at, is_late bool,
status enum(submitted|changes_requested|accepted|declined), timestamps.
Unique (project_id, stage, version).

submission_files: submission_id FK, project_file_id FK (or store file rows directly on
project_files.submission_id — choose one in implementation; this spec assumes project_files.submission_id).

reviews: id, submission_id FK, reviewer_id FK users, reviewer_role enum(supervisor|examiner|dept_admin),
decision enum(accept|request_changes|decline|pass|revision_required|fail),
comment text nullable (required by validation when decision is negative), created_at.
Unique (submission_id, reviewer_id).

rubric_scores: id, review_id FK (final-stage reviews), criterion_key string,
score numeric(5,2), comment nullable. Total is computed, never hand-entered.

rubric_templates: id, name, criteria_json [{key,label,weight,max}], pass_threshold numeric,
created_by, timestamps. academic_cycles.rubric_template_id references it.

logbook_entries: id, project_id FK, author_id FK users, body text, link nullable,
created_at. Append-only (no update/delete for students; admin moderation is audit-logged). [Phase 2]

defense_records: id, project_id FK, scheduled_at, venue string, panel_json (examiner ids),
note text nullable, created_by. [Phase 2]

audit_logs: id, actor_id FK users nullable, action string, subject_type, subject_id,
meta_json (before/after for status, role, deadline, supervisor changes), ip nullable, created_at. [Phase 2, basic status history in Phase 1 via submissions+reviews]

invites: provided by Fortify/password setup flow or a simple token table:
id, user_id FK, token_hash, expires_at, used_at. (Implementation choice; behaviour in WF2 is the requirement.)

## 9.3 Data integrity rules
- No hard deletes for projects, submissions, reviews, or users with history. Soft delete / deactivate only.
- All status changes go through one ProjectLifecycle service (single place enforcing §5.2).
- All timestamps stored in UTC, displayed in Asia/Yangon.

---

# 10. API / Routes Specification

Style [EXISTS]: Inertia pages + JSON endpoints under /api, Fortify auth, role middleware
(EnsureRole [EXISTS]), policy checks (ProjectPolicy [EXISTS, extend]).
All JSON errors use Laravel validation format [EXISTS behaviour in create form].
Pagination format follows the existing search response (content/totalPages/number/first/last/totalElements) [EXISTS].

## 10.1 Public (no auth)
| Method & path | Behaviour | Change |
|---|---|---|
| GET / | Journal landing | [EXISTS] |
| GET /api/projects/search?keyword&departmentId&courseId&academicYear&studentYear&tags&supervisor&members&sortBy&sortDirection&page&size | Published projects only | [EXISTS, keep filters] |
| GET /api/projects/{project} | Published project detail only; 404 for unpublished (do not leak existence) | **FIX FX-API1: today it returns any status** |
| GET /api/departments, /api/courses, /api/departments/{id}/courses | Reference lists | [EXISTS] |

## 10.2 Authenticated — shared
| GET /api/users/me, profile page, settings | [EXISTS] |
| GET /api/notifications, /unread-count, PATCH /{id}/read, POST /mark-all-read | [EXISTS] |
| Comments / reactions / saved-projects endpoints | [EXISTS] — add server check: target project must be approved_published |

## 10.3 Student / Team
| Method & path | Behaviour |
|---|---|
| GET /api/cycles/open | Cycles the student can join (own department) |
| POST /api/teams {cycle_id, name?} | Create team, caller becomes leader |
| POST /api/teams/{team}/invite {roll_number} | Invite by roll (same dept + cycle cohort) |
| POST /api/team-invites/{id}/confirm · /decline | Invitee response |
| DELETE /api/teams/{team}/members/{user} | Per TM4 rules |
| POST /api/projects {cycle_id, team_id} | Create project draft for the team |
| PUT /api/projects/{project}/draft {stage payload} | Save draft (stage-aware validation) |
| POST /api/projects/{project}/submit {stage} | Validate stage checklist → create submission version → transition §5.2 → notify |
| GET /api/projects/{project}/submissions | Version history (team + assigned staff + dept admin) |
| POST /api/projects/{project}/logbook {body, link?} | [Phase 2] Append entry |
| POST /api/projects/upload-image, POST file uploads per kind | [EXISTS image]; extend with kind + size/mime rules §6.6 |

## 10.4 Supervisor / Examiner
| Method & path | Behaviour |
|---|---|
| GET /api/supervisor/queue?stage&status | Everything waiting on me, oldest first, with waiting-days |
| GET /api/supervisor/teams | My teams by status + next deadline |
| POST /api/submissions/{submission}/review {decision, comment?, scores?} | One endpoint for all decisions; validates §5.2 + RV rules; creates review (+ rubric_scores for final); notifies team |
| GET /api/examiner/queue | Projects assigned to me for evaluation |
| POST /api/projects/{project}/defense {scheduled_at, venue, panel, note} | [Phase 2] Dept Admin / Examiner |

## 10.5 Department Admin / Admin
| Method & path | Behaviour |
|---|---|
| CRUD /api/cycles (+ /close, /archive) | §4.1 rules |
| POST /api/cycles/{cycle}/import {type: students\|supervisors, file} | WF1 validate → preview token → POST /import/confirm |
| GET /api/department/board?cycle_id&status&supervisor_id | WF9 monitoring |
| POST /api/projects/{project}/reassign-supervisor {supervisor_id, reason} | Audit-logged |
| POST /api/projects/{project}/assign-examiner {examiner_id} (+ bulk variant) | Evaluation setup |
| GET /api/cycles/{cycle}/export?format=xlsx\|pdf | WF9 export |
| GET /api/admin/users, PUT role, DELETE deactivate; GET /api/admin/projects | [EXISTS, extend filters by cycle/status] |
| CRUD /api/departments, /api/courses (admin write) | [EXISTS] — single authoritative source; remove seeder conflicts |
| POST /api/projects/{project}/publish · /unpublish {reason} | Manual override of WF8, audit-logged |

## 10.6 Pages (Inertia)
Public: welcome [EXISTS], projects/index (catalog) [EXISTS], projects/show [EXISTS, published only].
Student: dashboard (my team, my stage, deadlines, feedback inbox) [dashboard EXISTS, rework],
projects/create → becomes stage wizard (proposal wizard; final checklist wizard),
projects/edit → draft editor per stage, projects/saved [EXISTS], notifications [EXISTS], profile [EXISTS].
Supervisor: supervisor/dashboard [EXISTS, rework to queue + teams + waiting time].
Examiner: examiner/dashboard (new, queue pattern reused from supervisor).
Dept Admin: department/dashboard (new: cycle setup, import, board, export).
Admin: admin/dashboard [EXISTS, add cycle/status filters, audit view Phase 2].
Settings: profile/security/appearance [EXISTS].

---

# 11. Screens — required content (wireframe level)

S1 Student dashboard: cycle name + project type; my project card with current status chip,
next deadline (date + days left, red if ≤3 days), latest feedback (reviewer, decision, comment excerpt),
primary action button that matches the state (Continue Proposal / Resubmit / Submit Final / View Published Project).
Checklist panel for the current stage (§6.4 / §6.6 items, ticked live).
S2 Proposal wizard: 3 steps (1 Basics: title, course, tags, supervisor request with load;
2 Problem: problem, objectives, scope, method, expected outcome; 3 Team & Review: members, summary, submit).
Autosave draft [DEFAULT]. Validation errors inline, in plain language.
S3 Project workspace (the heart, replaces a plain show page for own team): header (title, status, cycle),
timeline of every version + review + logbook entry in date order, files per version,
right rail: team, supervisor, examiner, deadlines, rubric result when released.
S4 Supervisor queue: table/cards sorted by waiting time, stage + version badge (e.g. "Proposal V2"),
team, submitted date, late flag. Review screen: submission content, files, change summary vs previous version,
decision box (Accept / Request Changes / Decline) with comment required logic (§4.5), capacity indicator.
S5 Evaluation screen: rubric table with weights, score inputs, live weighted total, pass-threshold hint,
defense record, confirm result. Shows supervisor score to examiner only after examiner scores [DEFAULT blind first score — decision §14].
S6 Dept board: status columns/counts, filters, overdue highlights, export buttons, cycle settings, import wizard (upload → preview errors → confirm → invites sent summary).
S7 Public catalog [EXISTS]: add semester filter + "Published {date}" + supervisor/department pages [Phase 3].
S8 Public project page [EXISTS]: add abstract block, team list (names), supervisor, cycle/year,
download report button (respecting §4.1 visibility; if university-only, button prompts login),
demo video embed [Phase 3], "Updated on" when admin-corrected (FX2).

Mobile rule: S1–S5 must work at 360px width: single column, sticky primary action,
tables collapse to cards. Most students will use phones.

---

# 12. File Rules
| Kind | Allowed | Max | Notes |
|---|---|---|---|
| report_pdf | .pdf | 50 MB [DEFAULT] | Official record; stored private if cycle policy = university |
| source_zip | .zip | 100 MB [DEFAULT] | Or GitHub URL instead |
| slides | .pdf, .ppt, .pptx | 50 MB | |
| image (cover/inline) | jpg/png/webp | 10 MB [EXISTS] | Inline images in rich text kept |
| other | per stage config | 50 MB | ZIP-only rule from today is removed except for source |

Storage: Laravel public disk for public files [EXISTS pattern]; private disk + signed/
authenticated download route for university-only report PDFs and all unpublished files.
File access check: unpublished project files are downloadable only by team, assigned
supervisor/examiner, dept admin (dept), sys admin. Virus/malware scanning: out of scope v1,
file-type validation is by extension + mime, never by name alone.

---

# 13. Non-Functional Requirements

Performance
- NF1. Public catalog search responds in under 1s for 10,000 published projects on
  university hosting (full-text index [EXISTS], paginate max 50 [EXISTS]).
- NF2. Dashboards load in under 2s on a mid-range Android phone on campus Wi-Fi / 4G.
- NF3. File uploads show progress and never silently fail; failed upload keeps the draft intact.

Reliability & data
- NF4. Daily automated database + file backup, retained 30 days; one documented restore test per semester.
- NF5. No submission is ever lost on a failed request: submit is transactional
  (version + status + notification are created together or not at all).
- NF6. Works on the university's single-server hosting [DEFAULT: one VPS / campus server,
  PHP 8.3 + MySQL + queue worker for email]. Email sent via queue so slow SMTP never blocks a submit.

Security & privacy
- NF7. All unpublished content is server-side authorised on every endpoint (policy per role, §3.3).
  Public endpoints return published only (FX-API1).
- NF8. Marks, rubric internals, and member contribution notes are never exposed in any
  public or student-other-team response. Tested by API tests (§15).
- NF9. Roll numbers: public catalog shows student names only [DEFAULT]. Rolls are visible
  to staff and the own team. (Change only by explicit university decision.)
- NF10. Rate-limit auth + import + upload endpoints (Laravel defaults). Audit log for
  role changes, supervisor reassignment, deadline changes, publish/unpublish, result disputes [Phase 2 full; Phase 1: status history].
- NF11. Session, password, 2FA, passkey behaviour stays as Fortify provides [EXISTS].

Usability & access
- NF12. English UI in v1 [DEFAULT]; all user-facing strings go through translation files
  from day one so a Burmese pass (Phase 3) needs no refactor. Dates/times always Asia/Yangon.
- NF13. Every destructive or final action (submit, decline, fail, publish, close cycle)
  asks for confirmation and states its consequence in plain language.
- NF14. Empty states guide the next action ("No teams yet — create your team"), never a blank page.

Maintainability
- NF15. One lifecycle service owns transitions (§9.3). Controllers never set project status directly.
- NF16. Seeders contain exactly one authoritative department/course set for UCS Magway,
  supplied by the university; demo users (fictional names) exist only in a clearly-named DemoSeeder, never in production seeding.
- NF17. Migrations migrate today's data (§9.1) with a rollback plan; production cutover is
  done in a break between semesters, with the old catalog read-only during migration.

---

# 14. Open Decisions (defaults apply if unanswered)

| # | Decision | Default in this spec | Who decides |
|---|---|---|---|
| D1 | Final-year projects only, or all course projects? | Cycle model supports both; pilot = final-year, one department | University / Min |
| D2 | Who confirms the final result? | Supervisor scores, examiner confirms; Dept Admin resolves disputes | Department |
| D3 | Marks in system? | Yes: rubric 0–100 weighted, pass ≥ 50, private | Department |
| D4 | Examiner sees supervisor score before scoring? | Blind first score, then both visible | Department |
| D5 | Report PDF visibility? | Abstract public; PDF university-login only (per-cycle setting) | Department |
| D6 | Public roll numbers? | No, names only publicly | University |
| D7 | Student accounts? | CSV import + invite only; no self-registration | Dept Admin |
| D8 | Late submissions? | Accepted, flagged late; Dept Admin may hard-close a stage | Department |
| D9 | Student sees own rubric scores? | Yes, after result confirmed | Department |
| D10 | Language? | English v1, translation-ready; Burmese in Phase 3 | University / Min |
| D11 | Supervisor capacity? | 6 teams per cycle, per-supervisor override | Department |
| D12 | Team size? | Set per cycle; suggested final-year default 3–5 | Department |
| D13 | Which department pilots? | [UNDECIDED — needs a name before Phase 1 build] | University / Min |
| D14 | Hosting? | Single server/VPS, MySQL, queued email | Min / IT |

---

# 15. Acceptance Criteria (Phase 1 pilot is "done" when all pass)

A1. Dept Admin creates a cycle, imports 30 students + 5 supervisors from CSV with the
    template; bad rows are reported and block import until fixed; invites arrive by email.
A2. An imported student activates, creates a team, invites 3 teammates by roll; all confirm;
    a 5th invite beyond cycle max is blocked with a clear message.
A3. The leader submits a proposal to a supervisor at capacity: the UI prevents selecting a
    full supervisor; Dept Admin override works and is logged.
A4. Supervisor requests changes with a comment; the team's status, dashboard, in-app
    notification, and email all reflect it; the leader resubmits and the supervisor sees
    "Proposal V2" with V1 still viewable.
A5. Supervisor accepts; the team is locked; a member-removal attempt by the leader is refused with the Dept Admin path explained.
A6. Final submission is blocked until report PDF + (ZIP or GitHub) + slides + abstract +
    contributions all exist; each missing item is named. On submit, files freeze as Final V1.
A7. A public visitor opening the final-submitted (not yet passed) project by direct URL/API
    gets 404; after it passes and publishes, the same URL works and shows no marks anywhere.
A8. Rejected-in-old-system regression test: any changes-requested project that is edited and
    resubmitted appears in the supervisor queue again (FX1/FX3).
A9. A student from Team A cannot read Team B's unpublished project, files, or feedback via
    any page or API endpoint (authorisation test suite).
A10. Supervisor queue shows every waiting item with stage, version, and days waiting; nothing
     pending is invisible because of a status mismatch (case/casing bugs from today's role/status normalisation must be covered by tests using a single enum).
A11. On pass, the catalog entry appears in public search with correct department, course,
     year, semester, supervisor, and tags, and the report PDF follows the cycle visibility policy.
A12. The whole Phase 1 flow completes on a 360px Android screen with no horizontal scrolling
     and no action hidden off-screen.

Phase 2 acceptance adds: mid-review checkpoint recorded, rubric totals computed correctly
from weights, examiner moderation + dispute path, deadline reminder emails sent at 3d/1d,
cycle export matches on-screen counts, audit log shows every privileged action in §13 NF10.

---

# 16. Delivery Plan

Phase 1 — Pilot MVP (build order)
1. Enums + lifecycle service + status migration (projects.approval_status → status/stage model).
2. Users: roll/department/year fields + invite-only registration + CSV import (validate/preview/confirm).
3. Cycles CRUD (Dept Admin) + open-cycle listing.
4. Teams + invites (replaces members_json; migration per TM5).
5. Stage wizard: proposal draft/submit + submissions/versioning + supervisor queue + review endpoint (accept/changes/decline).
6. Final checklist submission (file kinds, GitHub-or-ZIP rule).
7. Publish on pass (simple supervisor-confirmed pass in Phase 1 if examiners are Phase 2
   in the pilot — flag: D2 default says examiner confirms; if the pilot department has no
   examiner step, set cycle flag examiner_required=false rather than faking it).
8. Public API privacy fix + comments/reactions/saves restricted to published.
9. Role dashboards v1 (student S1, supervisor queue, dept board counts).
10. Notifications for all Phase 1 transitions (in-app + queued email).
Pilot: one department (D13), one cycle, real students, with a named Dept Admin owner.

Phase 2 — Assessment: logbook, mid-review, rubric templates + scoring + examiner flow +
defense record, reminders, exports, audit log, dept board full.
Phase 3 — Showcase & scale: featured/department/supervisor pages, video embeds, GitHub
validation, analytics, Burmese UI, all-department rollout, demo seeder cleanup for production.

Risks & mitigations
- Teachers keep reviewing on paper/Messenger → mitigate: queue + email notifications make
  the system the easiest path; Dept Admin monitors "waiting > 7 days".
- Bad cohort data → CSV preview + row errors before anything is created (WF1).
- Deadline-day load/uploads → queued email, upload size limits, pilot on one department first.
- Marks disputes → immutable versions + reviews + audit log; nothing is edited in place.

---

# 17. Glossary
Cycle: one department's project run in one term. Stage: proposal / mid-review / final.
Submission: one versioned attempt at a stage. Review: a staff decision on one submission.
Catalog entry: the public page created from a passed project's final version.
Dept Admin: department head or project coordinator account. Leader: the student who owns team actions.

*End of spec v1.0. Companion document: REIMAGINED_FLOW.md (short proposal version).*
