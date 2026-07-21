# M05 — User Flows

**Status:** Draft
**Owner:** Product
**Milestone:** M05
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md), [M02 — Product Requirements](./M02-product-requirements.md), [M03 — User Personas and Stories](./M03-user-personas-and-stories.md), [M04 — Information Architecture](./M04-information-architecture.md)

---

# Overview

User Flows describe the complete, logical sequence of steps a learner takes through Project Fluent, from first arrival through repeated use. Where M04 defined the pages that exist and how they connect, this document defines *when* and *why* a learner moves between them — the journeys, decisions, and product states involved. This document does not define interface, layout, or implementation; it defines behavior and sequence only, and stays strictly within the pages, requirements, and rules already established in M01–M04.

---

# First-Time User Flow

1. **Landing** — A new visitor arrives at the Landing Page and understands what the product offers.
2. **Sign Up** — The visitor proceeds to the Sign Up Page and creates an account (FR-AUTH-01).
3. **Authentication** — Account creation authenticates the visitor; they are now a signed-in learner.
4. **Dashboard** — The learner is taken directly to the Dashboard, per M04's navigation rules — there is no intermediate page.
5. **Configure Learning** — Because this is a first-time learner, no Level, Goal, or topic-toggle state exists yet. The learner sets their English Level (FR-DASH-02) and Learning Goal (FR-DASH-03), and may set the "use one topic for all skills" toggle (FR-DASH-04); the toggle has a default state until the learner changes it.
6. **Generate First Session** — With Level and Goal set, the learner generates a session (FR-DASH-05, FR-SESS-06). This is the first point at which the Learning Session Page becomes reachable, per M04's Page Dependency Matrix.
7. **Complete Learning Session** — The learner works through the generated session to its end state (FR-SESS-06–08).
8. **Progress Saved** — Completion is recorded against the learner's account (FR-PROG-01). The learner returns to the Dashboard, which now reflects a completed session (FR-PROG-02).

---

# Returning User Flow

1. **Entry** — The learner either returns already authenticated (per FR-AUTH-04, session persistence) or begins at the Landing Page and proceeds to the Sign In Page to authenticate (FR-AUTH-02).
2. **Dashboard** — The learner arrives at the Dashboard. Their previously set Level, Goal, and topic-toggle state are already reflected — they are not asked to reconfigure anything unless they choose to.
3. **Progress Reflected** — The Dashboard reflects the outcome of their last session: completed (FR-PROG-02) or incomplete (FR-PROG-03).
4. **Decision** — The learner decides whether to keep their existing Level, Goal, and toggle state or change any of them (see Settings Change Flow).
5. **Generate Session** — The learner generates a new session using their current settings (FR-SESS-08).
6. **Complete Learning Session** — The learner works through the session to its end state.
7. **Progress Saved** — Completion is recorded, and the Dashboard reflects the updated state on the learner's next visit.

The Returning User Flow differs from the First-Time User Flow only in that Configure Learning is optional rather than required, since prior settings already exist.

---

# Learning Session Flow

- **Before Generation:** The learner is on the Dashboard with a Level and Goal set (and a topic-toggle state, defaulted or chosen). No session yet exists. The Learning Session Page is not reachable in this state, per M04.
- **Generation:** The learner initiates generation from the Dashboard (FR-DASH-05). The platform produces one complete session built around an AI-generated topic (or topics, depending on the toggle state), per FR-SESS-04–06. Upon successful generation, the learner moves to the Learning Session Page.
- **In Progress:** The learner is actively working through the generated session on the Learning Session Page. The Level, Goal, and topic-toggle state that produced this session remain fixed for its duration, per M04's Screen Responsibilities ("must never allow the learner to alter Level, Goal, or the topic toggle mid-session in a way that changes the session already generated").
- **Completed:** The learner reaches the defined end state of the session (FR-SESS-07). Completion is saved (FR-PROG-01), and the learner returns to the Dashboard.
- **Abandoned:** The learner leaves the Learning Session Page before reaching the end state (e.g., via sign-out or by navigating away, per M04's Exit Points). The session is recorded as incomplete rather than completed (FR-PROG-03), and the learner returns to the Dashboard on their next visit with that state reflected.

---

# Settings Change Flow

## English Level
When a learner changes their English Level (FR-SET-01), the new Level becomes their current setting immediately. It has no effect on any session already generated or completed — those remain associated with the Level under which they were generated (per M03's Edge Cases). The new Level takes effect the next time the learner generates a session.

## Learning Goal
When a learner changes their Learning Goal (FR-SET-02), the same behavior applies: the new Goal becomes current immediately, does not retroactively affect past sessions, and takes effect on the next generated session.

## "Use One Topic for All Skills" Toggle
When a learner changes the toggle (FR-SET-03), the new state becomes current immediately and can be changed at any time, consistent with M01. It does not affect a session already generated or in progress; it takes effect only on the next generated session, per M04's Screen Responsibilities.

In all three cases, the change is a Dashboard-level action and does not require the learner to leave the Dashboard, generate a session, or take any additional step for the new setting to be saved (FR-SET-01–03).

---

# Authentication Flow

- **Sign Up Journey:** Unauthenticated visitor → Sign Up Page → account created → authenticated → Dashboard (FR-AUTH-01).
- **Sign In Journey:** Unauthenticated visitor → Sign In Page → credentials verified → authenticated → Dashboard (FR-AUTH-02).
- **Persistent Session Journey:** Previously authenticated learner returns → recognized as still signed in → Dashboard directly, without passing through Sign Up or Sign In (FR-AUTH-04).
- **Sign Out Journey:** Authenticated learner (on Dashboard or Learning Session Page) signs out → session ends → learner returns to the Landing Page (FR-AUTH-03, per M04's Global Navigation Rules).
- **Cross-Navigation Between Sign Up and Sign In:** An unauthenticated visitor on the Sign Up Page who already has an account may move to the Sign In Page, and vice versa, without needing to return to the Landing Page first (per M04's Screen Responsibilities).

---

# Error Recovery Flows

- **Session Generation Unavailable:** If a session cannot be generated when requested, the learner remains on the Dashboard with their Level, Goal, and toggle state unchanged and intact. No partial or broken session is created or presented, and the learner is able to attempt generation again.
- **User Exits Before Completion:** If a learner exits the Learning Session Page before completion (see Learning Session Flow — Abandoned), the platform records the session as incomplete rather than losing the learner's account state. The learner returns to a valid, known state (the Dashboard) rather than an error state.
- **Unauthenticated Access:** If an unauthenticated visitor attempts to reach the Dashboard or Learning Session Page directly, per M04's Authentication Flow, they are redirected to a public page (Landing Page or Sign In Page) rather than being shown protected content.
- **No Generated Session:** If a learner reaches the Dashboard without ever having generated a session (e.g., a first-time learner who has only just set Level and Goal), the Dashboard clearly presents Generate Session as the next available action rather than showing an empty or ambiguous state, per M03's "No generated session yet" edge case.

---

# Decision Points

The following are every point in Version 1 at which the learner makes a decision:

1. **Landing Page:** Sign Up vs. Sign In.
2. **Sign Up Page:** Proceed with account creation vs. move to Sign In (already has an account).
3. **Sign In Page:** Proceed with authentication vs. move to Sign Up (does not yet have an account).
4. **Dashboard — Level:** Which English Level (A1–C2) to set or keep.
5. **Dashboard — Goal:** Which Learning Goal (of the six defined) to set or keep.
6. **Dashboard — Toggle:** Enable or disable "use one topic for all skills."
7. **Dashboard — Generate:** Whether to generate a session now.
8. **Learning Session Page:** Continue through the session to completion vs. leave before completion.
9. **Any authenticated page:** Continue the session/browsing vs. sign out.
10. **Dashboard (returning learner):** Keep existing settings vs. change Level, Goal, or toggle before generating again.

No other decision points exist in Version 1, consistent with M01's principle that every input must earn its place.

---

# State Transitions

| From State | Trigger | To State |
|---|---|---|
| Unauthenticated | Completes Sign Up | Authenticated, No Session Generated |
| Unauthenticated | Completes Sign In | Authenticated, [Prior Session State] |
| Authenticated, No Session Generated | Sets Level and Goal, generates session | Session In Progress |
| Authenticated, Session Completed (past) | Generates new session | Session In Progress |
| Authenticated, Session Incomplete (past) | Generates new session | Session In Progress |
| Session In Progress | Reaches session end state | Authenticated, Session Completed |
| Session In Progress | Leaves before end state | Authenticated, Session Incomplete |
| Authenticated (any sub-state) | Signs out | Unauthenticated |
| Authenticated, any session state | Changes Level, Goal, or toggle | Authenticated, same session-completion state, updated settings (no session in progress affected) |

"Authenticated, [Prior Session State]" reflects whichever of "No Session Generated," "Session Completed," or "Session Incomplete" was true for that learner at last save, per FR-PROG-02 and FR-PROG-03. There is no state in which a learner is authenticated without one of these three session states being true, and there is no state in which an unauthenticated visitor holds any session or settings state.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented the First-Time User Flow and Returning User Flow as complete step sequences consistent with M02's Core User Journey and M04's Site Map.
- Documented the full Learning Session Flow across its five states: Before Generation, Generation, In Progress, Completed, Abandoned.
- Documented the Settings Change Flow for English Level, Learning Goal, and the topic toggle, describing product behavior only.
- Documented the Authentication Flow across Sign Up, Sign In, Persistent Session, Sign Out, and cross-navigation journeys.
- Documented Error Recovery Flows for generation unavailability, early exit, unauthenticated access, and no-session states.
- Enumerated all Decision Points and defined a complete State Transition table for Version 1.

### Files Created
- `docs/milestones/M05-user-flows.md`

### Files Modified
- None. M01–M04 were not revisited or altered.

### Pending
- No further action pending within M05. Awaiting next milestone instructions.

### Risks
- The State Transitions table introduces three named session-completion states (No Session Generated, Session Completed, Session Incomplete) to make transitions precise. These are behavioral descriptions consistent with FR-PROG-01–03, not new features, but they have not been named as explicit "states" in any prior milestone and should be confirmed as an accurate reading rather than an invention.
- "Session Generation Unavailable" in Error Recovery Flows assumes generation can, at least in principle, fail or be temporarily unavailable. M01–M04 do not discuss failure modes directly; this section describes only the product-level recovery behavior expected, without assuming any technical cause.

### Open Questions
- When a learner changes Level or Goal while a session is in progress (rather than beforehand), should this be prevented outright, or simply have no effect until the next generation? This document assumes the latter (no effect until next generation), consistent with M04, but this has not been explicitly confirmed.
- Is redirect-on-unauthenticated-access (Error Recovery Flows) the intended behavior, or should an unauthenticated visitor instead see a generic "please sign in" state? Both are product-level (not implementation) choices, and M01–M04 do not specify which.

Waiting for the next milestone.
