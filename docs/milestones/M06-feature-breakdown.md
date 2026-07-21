# M06 — Feature Breakdown

**Status:** Draft
**Owner:** Product
**Milestone:** M06
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md), [M02 — Product Requirements](./M02-product-requirements.md), [M03 — User Personas and Stories](./M03-user-personas-and-stories.md), [M04 — Information Architecture](./M04-information-architecture.md), [M05 — User Flows](./M05-user-flows.md)

---

# Overview

The Feature Breakdown translates the requirements, personas, structure, and flows defined in M01–M05 into a discrete inventory of product features. Each feature represents one identifiable unit of product capability, with its own purpose, boundaries, and success criteria. This document exists so that every subsequent milestone — including future technical and design work — can be traced back to a single, unambiguous feature definition rather than reinterpreting requirements independently. No feature introduced here expands beyond what M01–M05 have already established.

---

# Feature Inventory

| Feature ID | Feature Name | Purpose | Priority | Dependencies (Product Only) |
|---|---|---|---|---|
| F-01 | Account Creation | Allows a visitor to become a registered learner. | Must Have | None |
| F-02 | Sign In | Allows a registered learner to authenticate on return. | Must Have | Account Creation (F-01) must have occurred previously. |
| F-03 | Sign Out | Allows a learner to end their authenticated session. | Must Have | Requires an active authenticated session (F-02 or Session Persistence, F-04). |
| F-04 | Session Persistence | Keeps a learner authenticated across visits without re-entering credentials. | Should Have | Requires prior successful authentication (F-01 or F-02). |
| F-05 | Dashboard (Central Hub) | Serves as the single starting point for an authenticated learner. | Must Have | Requires an authenticated learner (F-02 or F-04). |
| F-06 | English Level Selection | Lets the learner set the Level used to generate sessions. | Must Have | Requires the Dashboard (F-05). |
| F-07 | Learning Goal Selection | Lets the learner set the Goal used to generate sessions. | Must Have | Requires the Dashboard (F-05). |
| F-08 | Topic Toggle Control | Lets the learner enable or disable a single shared topic across all skills. | Must Have | Requires the Dashboard (F-05). |
| F-09 | Session Generation | Produces one complete AI-generated session from the learner's current Level, Goal, and toggle state. | Must Have | Requires Level Selection (F-06) and Goal Selection (F-07); reads current Topic Toggle Control (F-08) state. |
| F-10 | Learning Session Experience | Lets the learner work through a generated session to a clear completion state. | Must Have | Requires a session produced by Session Generation (F-09). |
| F-11 | Progress Recording | Records whether a session was completed or left incomplete, and reflects this back to the learner. | Must Have | Requires the Learning Session Experience (F-10) to have started. |

---

# Feature Details

## F-01 — Account Creation
- **Objective:** Allow a new visitor to become a registered learner.
- **Scope:** Creation of a single learner account per visitor.
- **Inputs:** The information a visitor provides to establish an account.
- **Outputs:** A registered, authenticated learner directed to the Dashboard.
- **Business Rules:** No onboarding questionnaire, study-time setup, or additional configuration may be requested during account creation (per M01). Successful account creation results in immediate authentication.
- **Success Criteria:** A visitor who completes account creation becomes an authenticated learner and reaches the Dashboard without additional steps.
- **Out of Scope:** Placement testing, profile customization, or collection of any information beyond what is required to establish an account.

## F-02 — Sign In
- **Objective:** Allow a returning, registered learner to authenticate.
- **Scope:** Authentication of an existing account.
- **Inputs:** Credentials associated with an existing account.
- **Outputs:** An authenticated learner directed to the Dashboard.
- **Business Rules:** Successful authentication must lead directly to the Dashboard, with no intermediate setup step, per M04's Navigation Structure.
- **Success Criteria:** A learner with valid credentials reaches the Dashboard on their first attempt.
- **Out of Scope:** Account recovery mechanisms, alternate authentication methods, or multi-step verification (not specified in M01–M05).

## F-03 — Sign Out
- **Objective:** Allow a learner to end their authenticated session deliberately.
- **Scope:** Termination of the current authenticated session.
- **Inputs:** A learner's explicit decision to sign out.
- **Outputs:** Return to the Landing Page as an unauthenticated visitor, per M04's Global Navigation Rules.
- **Business Rules:** Sign Out must be available from every authenticated page (Dashboard, Learning Session Page).
- **Success Criteria:** After signing out, the learner can no longer access authenticated pages until they authenticate again.
- **Out of Scope:** Automatic sign-out policies or session expiration rules (not defined in prior milestones).

## F-04 — Session Persistence
- **Objective:** Reduce friction for returning learners by keeping them authenticated across visits.
- **Scope:** Recognition of a previously authenticated learner without requiring re-entry of credentials.
- **Inputs:** A prior successful authentication.
- **Outputs:** Direct access to the Dashboard on return, bypassing Sign In.
- **Business Rules:** This behavior must not persist for a learner who has explicitly signed out.
- **Success Criteria:** A learner who has not signed out returns directly to the Dashboard without being asked to authenticate again.
- **Out of Scope:** Any specific duration of persistence (not defined in prior milestones; flagged as an open question in M03).

## F-05 — Dashboard (Central Hub)
- **Objective:** Provide the single, consistent starting point for every authenticated learner.
- **Scope:** Presentation of current Level, Goal, and topic-toggle state; the entry point to generate a session; and reflection of the learner's last session outcome.
- **Inputs:** The learner's current settings and last recorded session state.
- **Outputs:** A single screen from which the learner can review settings and initiate session generation.
- **Business Rules:** No setting beyond Level, Goal, and the topic toggle may ever be presented here (per FR-SET-04). This is always the first page reached after authentication.
- **Success Criteria:** Every authenticated learner, on every visit, reaches this single hub with no alternate authenticated starting point.
- **Out of Scope:** Any topic library, lesson catalog, or manual browsing capability.

## F-06 — English Level Selection
- **Objective:** Let the learner declare the English Level their session should be built for.
- **Scope:** Selection and storage of exactly one Level from A1–C2.
- **Inputs:** The learner's choice of one Level.
- **Outputs:** A current Level value used by Session Generation (F-09).
- **Business Rules:** Exactly one Level must be set at all times once a learner has made a first selection; no placement test determines this value.
- **Success Criteria:** The learner can view and change their current Level at any time, and the value set is what Session Generation subsequently uses.
- **Out of Scope:** Level assessment, recommendation, or automatic adjustment.

## F-07 — Learning Goal Selection
- **Objective:** Let the learner declare the purpose their session should serve.
- **Scope:** Selection and storage of exactly one Goal from the six defined in M01 (General English, IELTS, Business, Travel, University, Job Interviews).
- **Inputs:** The learner's choice of one Goal.
- **Outputs:** A current Goal value used by Session Generation (F-09).
- **Business Rules:** Exactly one Goal must be set at all times once a learner has made a first selection.
- **Success Criteria:** The learner can view and change their current Goal at any time, and the value set is what Session Generation subsequently uses.
- **Out of Scope:** Any Goal not among the six defined in M01.

## F-08 — Topic Toggle Control
- **Objective:** Let the learner decide whether one shared topic threads through their whole session or topics may vary by skill.
- **Scope:** Enabling or disabling the "use one topic for all skills" setting.
- **Inputs:** The learner's choice to enable or disable the toggle.
- **Outputs:** A current toggle state used by Session Generation (F-09) to determine single-topic vs. varied-topic behavior.
- **Business Rules:** The toggle may be changed at any time (per M01) and always reflects its most recently set state; a change does not retroactively affect a session already generated (per M05).
- **Success Criteria:** The toggle's state is always visible and changeable from the Dashboard, and the next generated session correctly reflects it.
- **Out of Scope:** Per-skill topic control beyond a single, global toggle.

## F-09 — Session Generation
- **Objective:** Produce one complete, ready-to-use learning session from the learner's current settings.
- **Scope:** Generation of a single session using the current Level, Goal, and topic-toggle state, built around an AI-generated topic (or topics).
- **Inputs:** Current Level (F-06), current Goal (F-07), current topic-toggle state (F-08).
- **Outputs:** One complete session, ready for the Learning Session Experience (F-10).
- **Business Rules:** Generation must not require any input beyond Level, Goal, and the toggle (per FR-DASH-06). The learner must never manually browse or select a topic (per FR-SESS-07). A learner may request generation again at any time (per FR-SESS-09).
- **Success Criteria:** For any valid combination of Level, Goal, and toggle state, exactly one complete session is produced.
- **Out of Scope:** Multiple simultaneous sessions, saved/draft sessions, or a history of previously generated (but not started) sessions.

## F-10 — Learning Session Experience
- **Objective:** Let the learner work through a generated session to a clear, identifiable end.
- **Scope:** Presentation and progression through a single generated session.
- **Inputs:** A session produced by Session Generation (F-09).
- **Outputs:** A completed or incomplete session outcome, passed to Progress Recording (F-11).
- **Business Rules:** The Level, Goal, and toggle state that produced the session remain fixed for its duration (per M05); only one session is ever presented at a time.
- **Success Criteria:** A learner who starts a session can always reach a clear completion state, or can leave at any point with their state preserved.
- **Out of Scope:** Editing or customizing the session content once generated; resuming an abandoned session at the exact point of departure (not specified in M01–M05).

## F-11 — Progress Recording
- **Objective:** Preserve and reflect whether a learner's session was completed or left incomplete.
- **Scope:** Recording of session outcome (completed or incomplete) and reflecting it to the learner on their next visit to the Dashboard.
- **Inputs:** The outcome of a Learning Session Experience (F-10) — completed or abandoned.
- **Outputs:** An updated progress state visible on the Dashboard (F-05).
- **Business Rules:** Every session outcome must be recorded; a learner must never lose a completed result. Incomplete sessions must be distinguishable from completed ones (per FR-PROG-03).
- **Success Criteria:** A learner can always tell, upon return, whether their last session was completed or left incomplete.
- **Out of Scope:** Streaks, gamification, detailed analytics, or mastery scoring (excluded per M02's Out of Scope).

---

# Feature Relationships

- **Account Creation (F-01)** is the origin point for **Sign In (F-02)** and **Session Persistence (F-04)** — a learner cannot sign in or persist a session without first having created an account.
- **Sign In (F-02)** and **Session Persistence (F-04)** are both prerequisites for reaching the **Dashboard (F-05)**; there is no path to the Dashboard without one of them succeeding.
- **Sign Out (F-03)** ends the authenticated state established by Sign In (F-02) or Session Persistence (F-04), and returns the learner outside the reach of the Dashboard (F-05) and Learning Session Experience (F-10).
- **Dashboard (F-05)** is the shared home for **English Level Selection (F-06)**, **Learning Goal Selection (F-07)**, and **Topic Toggle Control (F-08)** — none of these three features exist independently of the Dashboard.
- **Session Generation (F-09)** depends on current values from Level Selection (F-06), Goal Selection (F-07), and Topic Toggle Control (F-08); it cannot occur without all three having a current value.
- **Learning Session Experience (F-10)** exists only as a direct output of Session Generation (F-09); it has no independent entry point.
- **Progress Recording (F-11)** depends entirely on outcomes produced by the Learning Session Experience (F-10); it has no independent input.
- **Progress Recording (F-11)** feeds back into the **Dashboard (F-05)**, which displays the recorded outcome — closing the loop described in M05's Returning User Flow.

---

# Feature Lifecycle

- **F-01 Account Creation:** Available → Completed. (One-time; not repeated for a given learner.)
- **F-02 Sign In:** Available → Active (per authentication attempt). Repeats every time a learner returns without a persisted session.
- **F-03 Sign Out:** Available (whenever authenticated) → Completed (per invocation).
- **F-04 Session Persistence:** Active (from successful authentication) → Ended (upon Sign Out). Otherwise remains Active indefinitely across visits.
- **F-05 Dashboard:** Available → Active (whenever an authenticated learner is present). Not a feature with a completion state — it is always available while authenticated.
- **F-06 English Level Selection:** Unconfigured (first-time learner) → Configured → Reconfigured (any time the learner changes it).
- **F-07 Learning Goal Selection:** Unconfigured → Configured → Reconfigured (mirrors F-06).
- **F-08 Topic Toggle Control:** Configured (defaulted) → Reconfigured (any time the learner changes it).
- **F-09 Session Generation:** Available → Active (during generation) → Completed (session produced) or Unavailable (generation could not complete, per M05's Error Recovery Flows).
- **F-10 Learning Session Experience:** Available (after generation) → In Progress → Completed or Abandoned.
- **F-11 Progress Recording:** Pending (session in progress) → Recorded (completed or incomplete) → Archived is not applicable — recorded progress persists indefinitely as the learner's current state, consistent with M02's exclusion of long-term historical analytics.

---

# Functional Boundaries

| Feature | Responsible For | Must Never Be Responsible For |
|---|---|---|
| F-01 Account Creation | Establishing a new learner account. | Collecting Level, Goal, or any onboarding information. |
| F-02 Sign In | Authenticating an existing learner. | Creating new accounts or altering learner settings. |
| F-03 Sign Out | Ending an authenticated session. | Deleting account data or progress. |
| F-04 Session Persistence | Recognizing a previously authenticated learner. | Bypassing Sign Out or extending access after explicit sign-out. |
| F-05 Dashboard | Presenting current settings and the generation entry point. | Presenting a topic library, lesson catalog, or any setting beyond Level, Goal, and the toggle. |
| F-06 English Level Selection | Capturing and storing exactly one Level. | Determining session content directly, or assessing the learner's true ability. |
| F-07 Learning Goal Selection | Capturing and storing exactly one Goal. | Determining session content directly, or introducing Goals beyond the six defined. |
| F-08 Topic Toggle Control | Capturing and storing the shared-topic preference. | Selecting or influencing the specific topic content itself. |
| F-09 Session Generation | Producing one complete session from current settings. | Allowing manual topic selection or producing more than one session at a time. |
| F-10 Learning Session Experience | Presenting and progressing a single session to completion. | Modifying Level, Goal, or the toggle, or altering the session already generated. |
| F-11 Progress Recording | Recording and reflecting session completion state. | Producing analytics, streaks, gamification, or mastery scoring. |

---

# MVP Coverage Matrix

Every functional requirement defined in M02 maps to at least one feature defined in this document.

| M02 Requirement ID | Requirement Title | Covered By Feature(s) |
|---|---|---|
| FR-AUTH-01 | Account Creation | F-01 |
| FR-AUTH-02 | Sign In | F-02 |
| FR-AUTH-03 | Sign Out | F-03 |
| FR-AUTH-04 | Session Persistence | F-04 |
| FR-DASH-01 | Central Starting Point | F-05 |
| FR-DASH-02 | Access to Level Selection | F-05, F-06 |
| FR-DASH-03 | Access to Goal Selection | F-05, F-07 |
| FR-DASH-04 | Access to Topic Toggle | F-05, F-08 |
| FR-DASH-05 | Session Generation Entry Point | F-05, F-09 |
| FR-DASH-06 | No Additional Setup | F-05 |
| FR-SESS-01 | Level Selection | F-06 |
| FR-SESS-02 | Goal Selection | F-07 |
| FR-SESS-03 | Topic Toggle | F-08 |
| FR-SESS-04 | Single Topic Behavior | F-08, F-09 |
| FR-SESS-05 | Varied Topic Behavior | F-08, F-09 |
| FR-SESS-06 | Complete Session Generation | F-09 |
| FR-SESS-07 | No Manual Topic Browsing | F-09 |
| FR-SESS-08 | Session Completion | F-10 |
| FR-SESS-09 | Regenerate Session | F-09 |
| FR-PROG-01 | Save Session Completion | F-11 |
| FR-PROG-02 | Reflect Progress on Return | F-11, F-05 |
| FR-PROG-03 | Resume Awareness | F-11 |
| FR-SET-01 | Change Level | F-06 |
| FR-SET-02 | Change Goal | F-07 |
| FR-SET-03 | Change Topic Toggle | F-08 |
| FR-SET-04 | No Additional Settings | F-05 |

All 26 functional requirements from M02 are covered by the 11 features defined in this document. No feature exists without at least one corresponding M02 requirement, and no M02 requirement is left unmapped.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined a Feature Inventory of 11 features spanning Authentication, Dashboard, Level/Goal/Toggle configuration, Session Generation, the Learning Session Experience, and Progress Recording.
- Documented full Feature Details (Objective, Scope, Inputs, Outputs, Business Rules, Success Criteria, Out of Scope) for every feature.
- Documented Feature Relationships, Feature Lifecycle states, and Functional Boundaries for every feature.
- Built the MVP Coverage Matrix confirming all 26 functional requirements from M02 map to at least one feature, with no gaps.

### Files Created
- `docs/milestones/M06-feature-breakdown.md`

### Files Modified
- None. M01–M05 were not revisited or altered.

### Pending
- No further action pending within M06. Awaiting next milestone instructions.

### Risks
- Some features (e.g., F-06 Level Selection, F-07 Goal Selection, F-08 Topic Toggle Control) are defined as distinct features even though M02 treats them as requirements shared across the Dashboard, Learning Session, and Settings categories. This granularity was chosen to keep the Coverage Matrix precise, but should be confirmed as the right level of decomposition rather than over-splitting.
- Feature Lifecycle for F-09 Session Generation includes an "Unavailable" state drawn from M05's Error Recovery Flows; this is a behavioral state, not a new capability, but is flagged for consistency review.

### Open Questions
- Should F-06, F-07, and F-08 remain three separate features, or would a future milestone prefer they be treated as a single "Session Configuration" feature with three parts? Both are valid readings of M02; this document chose separation for coverage-matrix clarity.
- F-04 Session Persistence is marked Should Have (per M02) rather than Must Have — should its absence from a strict MVP cut be considered acceptable, given F-02 Sign In alone satisfies core access?

Waiting for the next milestone.
