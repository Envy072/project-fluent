# M02 — Product Requirements Document (PRD)

**Status:** Draft
**Owner:** Product
**Milestone:** M02
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md)

---

# Product Overview

Project Fluent is an AI-powered English learning platform that removes the burden of deciding what to study. A learner selects only their English Level (A1–C2) and Learning Goal (General English, IELTS, Business, Travel, University, or Job Interviews), optionally chooses whether a single AI-generated topic should thread through every skill in the session, and receives one complete, ready-to-use learning session. Version 1 delivers this core loop — select, generate, complete — with no onboarding questionnaire, no study-time setup, and no unnecessary configuration.

---

# Target Users

## Primary Users
- Self-directed adult English learners (approximately teen through adult) who want to practice regularly without planning their own study material.
- Learners with a specific, nameable goal — passing IELTS, preparing for business use, traveling, studying at a university, or interviewing for a job — who want practice relevant to that goal.
- Learners who want to begin practicing immediately, without progressing through setup steps first.

## Secondary Users
- General English learners without a specialized goal who want consistent, varied practice.
- Learners returning after a gap who want to resume practicing without reconstructing a study plan.

## Who This Product Is NOT For
- Absolute beginners with no foundation who require structured, sequential curricula (e.g. formal pre-A1 literacy instruction).
- Learners who want full control over topic selection, lesson sequencing, or curriculum design.
- Classrooms, teachers, or institutions requiring cohort management, grading, or multi-learner administration.
- Learners seeking certification, formal assessment, or official test scoring.

---

# User Goals

## What Users Want to Achieve
- Practice English regularly with minimal friction between opening the app and starting meaningful practice.
- Receive practice content relevant to their stated level and goal without having to search for it.
- Experience a session that feels coherent and purposeful rather than a random assortment of exercises.
- Return to practice without having to remember or reconstruct settings, plans, or prior context.

## What Success Looks Like
- A learner can go from opening the app to actively practicing in a small number of steps, with no unnecessary decisions along the way.
- A learner completes the session they start.
- A learner feels the session matched their level and goal.
- A learner returns to start another session without being prompted or reminded.

---

# Core User Journey

The Version 1 journey follows a single, linear path:

1. **Landing Page** — A new visitor arrives and understands what the product offers.
2. **Sign Up** — The visitor creates an account to access the product.
3. **Dashboard** — The learner arrives at a central starting point after signing in.
4. **Choose Level** — The learner selects their English Level (A1–C2).
5. **Choose Goal** — The learner selects their Learning Goal (General English, IELTS, Business, Travel, University, or Job Interviews).
6. **Enable/Disable "Use one topic for all skills"** — The learner decides whether a single topic should thread through the entire session, or whether topics may vary by skill. This choice can be changed at any time.
7. **Generate Session** — The learner requests a session, and the platform produces one complete session built around an AI-generated topic (or topics), matched to the chosen Level and Goal.
8. **Complete Learning Session** — The learner works through the full session as presented.
9. **Save Progress** — The learner's completion of the session is recorded so it is reflected the next time they return.

This journey is the entirety of the Version 1 experience. There is no branching path, no intermediate configuration screen, and no additional decision point beyond Level, Goal, and the topic toggle.

---

# Functional Requirements

Priority key: **Must Have** (required for Version 1 to ship) · **Should Have** (strongly desired, not launch-blocking) · **Could Have** (acceptable to defer within Version 1 scope).

## Authentication

| ID | Title | Description | Priority |
|---|---|---|---|
| FR-AUTH-01 | Account Creation | A visitor must be able to create an account to use the product. | Must Have |
| FR-AUTH-02 | Sign In | A returning learner must be able to sign in to access their account and saved progress. | Must Have |
| FR-AUTH-03 | Sign Out | A learner must be able to sign out of their account. | Must Have |
| FR-AUTH-04 | Session Persistence | A signed-in learner should remain signed in across visits without needing to sign in every time. | Should Have |

## Dashboard

| ID | Title | Description | Priority |
|---|---|---|---|
| FR-DASH-01 | Central Starting Point | After signing in, the learner must land on a single dashboard that serves as the starting point for a new session. | Must Have |
| FR-DASH-02 | Access to Level Selection | The dashboard must provide the learner a way to choose their English Level. | Must Have |
| FR-DASH-03 | Access to Goal Selection | The dashboard must provide the learner a way to choose their Learning Goal. | Must Have |
| FR-DASH-04 | Access to Topic Toggle | The dashboard must provide the learner a way to enable or disable "Use one topic for all skills." | Must Have |
| FR-DASH-05 | Session Generation Entry Point | The dashboard must provide a clear way for the learner to generate a new session once Level and Goal are set. | Must Have |
| FR-DASH-06 | No Additional Setup | The dashboard must not require any input beyond Level, Goal, and the topic toggle before a session can be generated. | Must Have |

## Learning Session

| ID | Title | Description | Priority |
|---|---|---|---|
| FR-SESS-01 | Level Selection | The learner must be able to select exactly one English Level from A1–C2. | Must Have |
| FR-SESS-02 | Goal Selection | The learner must be able to select exactly one Learning Goal from: General English, IELTS, Business, Travel, University, Job Interviews. | Must Have |
| FR-SESS-03 | Topic Toggle | The learner must be able to enable or disable "Use one topic for all skills" at any time, including before generating a session. | Must Have |
| FR-SESS-04 | Single Topic Behavior | When the topic toggle is enabled, the generated session must use one AI-generated topic across all included skills. | Must Have |
| FR-SESS-05 | Varied Topic Behavior | When the topic toggle is disabled, the generated session may use different topics across included skills. | Must Have |
| FR-SESS-06 | Complete Session Generation | The platform must generate one complete, ready-to-use session in response to the learner's Level, Goal, and topic-toggle selection. | Must Have |
| FR-SESS-07 | No Manual Topic Browsing | The learner must not be required or able to manually browse, search, or select topics from a library. | Must Have |
| FR-SESS-08 | Session Completion | The learner must be able to work through and reach a clear end state for a generated session. | Must Have |
| FR-SESS-09 | Regenerate Session | The learner should be able to request a new session at any time from the dashboard, using their current Level, Goal, and topic-toggle selection. | Should Have |

## Progress

| ID | Title | Description | Priority |
|---|---|---|---|
| FR-PROG-01 | Save Session Completion | The platform must record when a learner completes a session. | Must Have |
| FR-PROG-02 | Reflect Progress on Return | When a learner returns, the platform must reflect that a prior session was completed. | Must Have |
| FR-PROG-03 | Resume Awareness | If a learner leaves a session before completing it, the platform should be able to indicate that an incomplete session exists. | Should Have |

## Settings

| ID | Title | Description | Priority |
|---|---|---|---|
| FR-SET-01 | Change Level | The learner must be able to change their selected Level at any time before generating a session. | Must Have |
| FR-SET-02 | Change Goal | The learner must be able to change their selected Goal at any time before generating a session. | Must Have |
| FR-SET-03 | Change Topic Toggle | The learner must be able to change the "Use one topic for all skills" toggle at any time. | Must Have |
| FR-SET-04 | No Additional Settings | Version 1 must not expose settings beyond Level, Goal, and the topic toggle. | Must Have |

---

# Non Functional Requirements

## Performance
- Session generation must complete within a time that feels responsive and does not cause the learner to lose engagement or abandon the request.
- Navigation between the landing page, sign up, dashboard, and session must feel immediate, with no perceptible unnecessary delay.

## Reliability
- The platform must reliably generate a complete session for every valid combination of Level, Goal, and topic-toggle state.
- Learner progress, once saved, must not be lost or silently corrupted.

## Accessibility
- The product must be usable by learners with varying levels of digital literacy, consistent with its goal of removing friction and decision-making.
- Core flows (sign up, select Level/Goal, generate and complete a session) must be operable by users relying on assistive technology.

## Usability
- The Version 1 journey must be completable by a first-time learner without external instructions or a tutorial.
- No step in the journey should require the learner to make a decision beyond Level, Goal, and the topic toggle.

## Scalability
- The product must support a growing number of learners and sessions without a change in the product experience.

## Maintainability
- Product requirements and behavior must remain traceable to this PRD and to M01 as the product evolves, so future changes can be evaluated against the original vision.

## Privacy
- Learner account information and progress data must be handled in a way that respects learner privacy and is not exposed to other learners or unauthorized parties.

---

# Out of Scope

- Onboarding questionnaires or placement tests.
- Study-time scheduling or planning tools.
- Any learner-facing setting beyond Level, Goal, and the "use one topic for all skills" toggle.
- Manual topic browsing, search, or a topic/lesson catalog.
- Progress tracking beyond recording session completion (e.g. streaks, gamification, detailed analytics, mastery scoring).
- Multi-session curricula or long-term learning paths.
- Social or cohort features (e.g. sharing, leaderboards, classroom/educator tools).
- Speaking or pronunciation feedback.
- Offline access.
- Certification, formal assessment, or official test scoring.
- Any additional Learning Goals beyond the six defined in M01.

---

# Product Success Metrics

- **Time to first session:** elapsed time from account creation to starting a first session.
- **Session completion rate:** proportion of generated sessions that are completed.
- **Return usage:** proportion of learners who generate a second session without prompting.
- **Perceived relevance:** learner-reported sense that a generated session matched their selected Level and Goal.
- **Topic coherence preference:** observed or reported learner preference between the topic toggle enabled and disabled.
- **Zero-setup adherence:** confirmation that no learner is required to interact with anything beyond Level, Goal, and the topic toggle to reach a session.

---

# Assumptions

- Learners are willing to create an account before using the product; no anonymous or guest usage path is assumed for Version 1.
- Learners self-report an accurate English Level and Goal; no placement testing is assumed or required.
- A "complete session" is a single, self-contained unit of practice that can be started and finished in one sitting.
- The six Learning Goals defined in M01 are sufficient to represent the target users' needs for Version 1.
- Learners value receiving one generated session over being able to choose among multiple options.

---

# Dependencies

- This PRD depends on M01 — Product Vision as its single source of truth for mission, scope, and product principles.
- Delivery of the Core User Journey depends on all Must Have functional requirements across Authentication, Dashboard, Learning Session, Progress, and Settings being satisfied together, since the journey is a single linear path with no alternate route.
- Product Success Metrics depend on Progress requirements (FR-PROG-01, FR-PROG-02) being in place to measure completion and return usage.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Product Requirements Document drafted covering Product Overview, Target Users, User Goals, Core User Journey, Functional Requirements, Non Functional Requirements, Out of Scope, Product Success Metrics, Assumptions, and Dependencies.
- All requirements kept consistent with M01; no new features, settings, or scope introduced beyond what M01 and this milestone's instructions specify.

### Files Created
- `docs/milestones/M02-product-requirements.md`

### Files Modified
- None. M01 was not revisited or altered.

### Pending
- No further action pending within M02. Awaiting next milestone instructions.

### Risks
- The Core User Journey includes Sign Up, Dashboard, and Save Progress, which were not explicitly detailed in M01's MVP Boundaries. They are included here strictly because they were explicitly specified in this milestone's instructions; their scope should be confirmed as intentional before downstream milestones build on them.
- "Complete session" is treated as a self-contained, definable unit per M01 Success Metrics, but Version 1's precise definition of session structure/content is not yet specified and will need clarification in a future milestone.
- No definition yet exists for what happens if a learner changes Level or Goal mid-session (not addressed, as it would constitute an assumption beyond current scope).

### Open Questions
- Should account creation support only direct sign-up, or is any form of alternate access (e.g. social sign-in) in scope for Version 1 — or is this a technical/implementation decision to defer?
- Is "progress" in Version 1 limited strictly to session-completion status, or should the next milestone define this more precisely?
- Should the "Resume Awareness" requirement (FR-PROG-03) be considered Must Have given the linear journey, or is Should Have correct for Version 1?

Waiting for the next milestone.
