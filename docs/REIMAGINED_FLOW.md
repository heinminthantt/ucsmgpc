# ucsmgpc Reimagined: From Project Catalog to University Project Lifecycle

Repo: heinminthantt/ucsmgpc (Laravel 13 + Inertia / React 19 + Fortify)
University: University of Computer Studies, Magway (UCS Magway)
Prepared: 2026-11-13

## 1. What the project is today

Today ucsmgpc is a **showcase catalog with a one-step approval gate**:

1. Anyone registers with any email. No roll number, department, or student year on the user account.
2. A student fills one big end-of-project form: title, description, objectives, benefits,
   rich-text report body, department, course, semester, academic year (free text),
   an optional self-chosen supervisor, team members as free-text name + roll in a JSON field,
   tags, a GitHub link, and ZIP files only (max 50 MB).
3. The project lands as `pending`.
4. The assigned supervisor clicks Approve, or Reject with a reason. That is the whole review.
5. Approved projects appear in the public catalog: full-text search, filters by department /
   course / academic year / student year / tags / supervisor / member, plus comments,
   reactions, saved projects, and in-app notifications.
6. Admin manages users, roles, projects, departments, and courses from a dashboard.

Stack strengths to keep: Laravel + Inertia/React is modern and fast to build on, the public
catalog search is genuinely good, supervisor approval and notifications already exist in
embryo, and the journal-style public showcase is distinctive.

## 2. Why this flow will break in real university use

1. **It starts at the end.** Real projects start with a proposal months before the final
   report. There is no proposal stage, no supervisor acceptance, no progress tracking,
   no mid-review, no defense, and no grading. The system only sees a finished project.
2. **Rejection is a dead end.** `ProjectController@update` does not reset `approval_status`,
   so a rejected project that a student edits stays rejected. There is no
   "Changes Requested -> Resubmit" loop, and no version history to compare V1 vs V2.
3. **Identity is unverified.** Anyone on the internet can register and submit as a
   "student". Users have no roll number, department, or cohort, so the university cannot
   check who is real, import a class list, or stop duplicate / fake submissions.
4. **Teams are not real.** Members are free text in `members_json`. A `members` table and
   `Member` model exist but the create flow does not use them. Team members get no account,
   no access to feedback, and no shared workspace.
5. **The supervisor is optional and self-selected.** A project can be submitted with no
   supervisor at all, a student can pick any supervisor regardless of department or load,
   and there is no capacity limit, acceptance step, or reassignment by the department.
6. **No academic cycle.** `academic_year` and `student_year` are free strings. There is no
   semester, submission window, or deadline anywhere, so nothing can open, close, remind,
   or report on time.
7. **No evaluation.** No rubric, no examiner, no marks, no defense record. A university
   cannot use this for assessment, only for display.
8. **Privacy leak in the API.** The public `GET /api/projects/{project}` returns any project
   by ID, including pending and rejected ones. Only the search endpoint filters to approved.
9. **Conflicting structure data.** One seeder creates CS / CT / IS / SE departments, another
   creates Computer Science & Engineering / IT / Electronic Communications, and the create
   form hard-codes course-code prefixes per semester in the frontend. Real departments and
   courses must come from one authoritative admin setup.
10. **Files do not match a real submission.** ZIP only, no separate final report PDF,
    slides, demo video link, or source-vs-archive distinction that examiners actually need.

## 3. The reimagined flow

Core idea: **the catalog is the output, not the input.**
A project earns its place in the public catalog by passing through the university's real
lifecycle. The catalog code you already have becomes the final publishing stage.

### Roles

| Role | Who | Can do |
|---|---|---|
| Student (Team Leader) | Final / course project owner | Create team, submit proposal and stages, resubmit revisions |
| Student (Team Member) | Invited by roll number | View project, feedback, files; comment; help edit drafts |
| Supervisor | Teacher assigned / accepting | Accept teams, review each stage, request changes, score rubric |
| Examiner / Moderator | Second marker, defense panel | Evaluate final submission and defense, confirm result |
| Department Admin (Head / Coordinator) | Department office | Set up cycle, import cohort, assign supervisors, monitor, export records |
| System Admin | IT / maintainer | Departments, courses, users, settings, backups, audit log |
| Public Visitor | Students, employers, other unis | Browse only published projects, no account needed |

### The lifecycle (states)

```
DRAFT
  -> PROPOSAL_SUBMITTED
  -> CHANGES_REQUESTED  <->  PROPOSAL_SUBMITTED   (loop, with versions)
  -> IN_PROGRESS        (proposal approved; logbook / checkpoints open)
  -> MID_REVIEW         (progress report + supervisor check)
  -> FINAL_SUBMITTED    (report PDF + source + slides + demo link, checklist enforced)
  -> UNDER_EVALUATION   (supervisor + examiner rubric scoring)
  -> REVISION_REQUIRED  <-> FINAL_SUBMITTED       (loop, with versions)
  -> APPROVED / PUBLISHED  (appears in public catalog)
  -> ARCHIVED           (end of academic cycle, read-only)
REJECTED is reserved for proposal-stage refusal, with a reason and an appeal / new-proposal path.
```

Every transition: timestamp, actor, comment, and a notification (in-app + email).
Every submission is a **version** (Proposal V1, V2... Final V1, V2) so feedback is anchored
to a version and nothing is silently overwritten.

### Step by step

1. **Cycle setup (Department Admin, once per semester)**
   Create an Academic Cycle: academic year, semester, project type (course project /
   final-year project), proposal deadline, mid-review date, final deadline.
   Import students and supervisors by CSV (roll, name, department, year, email).
   The system creates / invites accounts. No public self-registration for students.

2. **Team formation (Student)**
   Leader creates a team, invites members by roll number (real user accounts, they confirm).
   Team size limits are set by the cycle (e.g. 3 to 5).

3. **Proposal (Team -> Supervisor)**
   Short structured proposal: title, problem, objectives, scope, method / tech, expected
   outcome, chosen supervisor request.
   Supervisor **accepts, requests changes, or declines** (decline frees the team to request
   another supervisor; capacity shown, e.g. max 6 teams per supervisor).

4. **In progress (Team + Supervisor)**
   Simple logbook: dated progress entries, meeting notes, file uploads.
   Supervisor can comment at any time. One mid-review checkpoint with a progress report.

5. **Final submission (Team)**
   Checklist enforced before submit: final report PDF, source ZIP or GitHub repo,
   presentation slides, demo video link (optional), abstract for the catalog.
   Submission locks at the deadline; late submission is flagged, not silently accepted.

6. **Evaluation (Supervisor + Examiner)**
   Rubric scoring: Problem & Objectives, Implementation, Documentation, Presentation /
   Defense, each with weight set by the department. Examiner confirms or moderates.
   Result: Pass / Revision Required / Fail, recorded against the cycle. Marks are private;
   only the published project is public.

7. **Publication (System, automatic on pass)**
   The approved final version becomes the catalog entry you already built: abstract,
   team, supervisor, department, course, year, tags, GitHub, report PDF download
   (public or university-only, set by department policy).
   Comments / reactions / saves stay, but only on published projects.

8. **Records & archive (Department Admin)**
   Export the whole cycle to Excel / PDF: teams, supervisors, marks, status.
   This is the document the department office actually needs for its files.
   Cycle closes, projects archive read-only, a new cycle can be opened.

### Cross-cutting

- Notifications: in-app + email at every transition and 3 days / 1 day before deadlines.
- Dashboard per role: student sees "my stage, my deadline, my feedback"; supervisor sees
  "teams waiting on me, by stage"; department sees a board of the whole cycle by stage.
- Audit log: who approved / changed what, when. Important when marks are disputed.
- Burmese + English UI labels for student-facing screens (university decision).
- Public API fix from day one: public endpoints return published projects only.

## 4. What changes in the code

Keep: Laravel/Inertia/React stack, catalog search, comments/reactions/saves, notifications
table, department/course models, journal-style public theme.

Add:
- `academic_cycles` (year, semester, type, deadlines, team size, rubric weights)
- `teams` + real `team_user` membership (replaces `members_json`; keep Member only for
  external / alumni names if needed)
- `project_stages` / `submissions` (stage, version, payload, files, status, feedback, actor, timestamps)
- `reviews` (rubric scores, examiner, result)
- `users`: `roll_number`, `department_id`, `student_year / cohort`, unique roll per cycle
- State machine for project status (enum above), with a resubmit action that creates a new
  version and returns the project to the reviewer queue
- Role set: student, supervisor, examiner, department_admin, admin
- CSV import (students, supervisors) and cycle export (Excel/PDF)
- Registration closed / invite-only for students and staff

Change:
- Project create becomes a wizard per stage (proposal is short; final is a checklist),
  not one giant form.
- Supervisor is requested and accepts; assignment can be changed by Department Admin.
- Project files split by type: report (PDF), source (ZIP / GitHub), slides, other.

Remove / demote:
- Reactions and comments from the review process. They belong only on published projects.

## 5. Rollout plan

**Phase 1: Usable for one real semester (the MVP that matters)**
Cycle setup + CSV cohort import, real teams, proposal -> changes-requested loop with
versions, supervisor accept / capacity, final submission checklist, publish to the
existing catalog, public-API privacy fix, role dashboards (basic).
*Test: one department, one semester, real students.*

**Phase 2: Assessment**
Mid-review checkpoint + logbook, rubric evaluation + examiner moderation, deadline
reminders by email, cycle export for department records, audit log.

**Phase 3: Showcase and scale**
Public showcase polish (featured projects, supervisor / department pages), GitHub link
validation, demo video embeds, analytics for the department, Burmese UI pass,
roll out to all departments.

## 6. Decisions Min needs from the university (or to decide as defaults)

1. Final-year projects only, or course projects for every semester? (Default if unsure:
   build the cycle model for both, pilot with final-year.)
2. Who has the final say: supervisor alone, or supervisor + examiner? (Default: both,
   supervisor proposes the result, examiner confirms.)
3. Are marks recorded in the system, or only pass / fail? (Default: rubric marks recorded,
   private to staff and the team.)
4. Is the final report PDF public, or university-login only? (Default: abstract public,
   PDF university-only.)
5. Student accounts: CSV import by the department (recommended) or self-register with a
   university email / roll that an admin must approve?
6. Language: English only, or Burmese + English for student screens?

