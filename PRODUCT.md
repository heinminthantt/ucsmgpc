# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Students** at UCSMGY — a team leader or member forming a team, submitting a proposal, tracking feedback, and submitting the final project package.
- **Supervisors and examiners** — accepting teams, reviewing versioned submissions, scoring rubrics, and confirming results.
- **Department admins** — setting up academic cycles, importing cohorts, assigning supervisors, monitoring progress, and exporting records.
- **System admins** — maintaining departments, courses, users, and roles.
- **Public visitors** — students, employers, and other universities browsing published work without an account.

## Product Purpose

One official system where a UCSMGY student project lives its whole life: proposal, supervision, progress, final submission, evaluation, and publication. It replaces paper forms, Messenger/Viber threads, and files on teachers' laptops.

Success means every project in a cycle passes through the system end to end, every decision is recorded, a department can export a complete cycle record in minutes, and passed projects become a permanent, searchable public archive.

## Positioning

The catalog is the output, not the input. A project earns its catalog entry by passing through the university's real lifecycle — proposal, supervisor acceptance, versioned reviews, final checklist, rubric evaluation — rather than being a form that publishes itself. The archive and the workflow are the same record, so the public showcase cannot drift from the university's assessment record.

## Operating Context

- Work runs in academic cycles: one department, one term, one project type (course project or final-year project), with proposal, mid-review, and final deadlines in Asia/Yangon time.
- Students work in real teams; members are invited by roll number and confirm. Membership locks when a proposal is submitted.
- Every stage submission is an immutable version. Supervisors accept or request changes; examiners evaluate the final version; results are Pass, Revision Required, or Fail.
- Marks are private to staff and the team. Only published projects are public.
- In-app and email notifications fire on transitions and before deadlines.
- An audit log records who approved or changed what, for disputed results.
- Department admins export the cycle record for departmental files.
- The interface is bilingual: English and Burmese. Dates and times use Asia/Yangon.
- In the current build, the published-project API is public while catalog pages require login.

## Capabilities and Constraints

- Roles: student (leader/member), supervisor, examiner (an assignment on a staff account), department admin, system admin, and public visitor.
- Catalog: full-text search; filters by department, course, academic year, student year, tags, supervisor, and member; comments, reactions, saved projects, and featured projects on published entries.
- Lifecycle: cycles, CSV cohort import, teams and invites, versioned submissions, supervisor review, rubric evaluation, examiner queue, defense records, logbook, publishing, cycle export, analytics, and audit log.
- The intended account model is invite-only. Invite activation exists, but public self-registration is still enabled in the current build — an implementation gap, not a product decision.
- Stack: Laravel 13, PHP 8.3, Inertia.js 3, React 19, TypeScript, Tailwind CSS 4, Laravel Fortify, MySQL full-text search, Vite.
- Responsive web only; no native mobile app in v1, but the app must be fully usable on Android phones.
- Not an LMS, plagiarism detector, payment/HR/student-registry system, or multi-university platform.

## Brand Commitments

- The institution is **UCSMGY** — University of Computer Studies, Magway. Product branding must not be shortened to "UCSM".
- Use the official university crest (`public/images/ucsmgy-logo.png`); it is the visual mark, not a generic shield.
- The product should read as an official, premium university system, not a generic SaaS dashboard.
- English and Burmese are both first-class interface languages.

## Evidence on Hand

- `docs/FULL_SPEC.md` — lifecycle specification, roles, permissions, and state machine.
- `docs/REIMAGINED_FLOW.md` — rationale and phased rollout.
- Real seeded projects, departments, courses, users, and cover images in the local database.
- Official crest asset at `public/images/ucsmgy-logo.png`.
- No testimonials, press, customer logos, or benchmarks exist. Do not fabricate them.

## Product Principles

1. **The catalog is the output.** Publication is earned by passing the lifecycle, never granted by a form.
2. **Every decision leaves a record.** Versions, reasons, timestamps, and audit entries replace memory and chat.
3. **Rejection always has a next step.** Every negative decision names why and what the student can do next.
4. **One stage at a time.** A student should always know their current stage, deadline, and next action.
5. **Bilingual and mobile are not add-ons.** Burmese and Android-phone use are part of the primary experience.

## Accessibility & Inclusion

- Burmese and English must both render correctly, with appropriate Myanmar typography.
- The web app must be fully usable on Android phones.
- No formal WCAG level has been established.
