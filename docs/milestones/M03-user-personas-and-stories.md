# M03 — User Personas and User Stories

**Status:** Draft
**Owner:** Product
**Milestone:** M03
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md), [M02 — Product Requirements](./M02-product-requirements.md)

---

# Introduction

Personas and User Stories translate the Product Vision (M01) and Product Requirements (M02) into concrete, human terms. Personas describe *who* we are building for, grounded in the Target Users already defined in M02. User Stories describe *what those people need to be able to do*, grouped by the same functional categories used in M02, so that every story is traceable back to an approved requirement.

This document does not introduce new capabilities. Its purpose is to make the already-approved MVP scope easier to reason about from the learner's point of view, and to define acceptance criteria precise enough to later verify that Version 1 fulfills M01 and M02.

---

# Primary Personas

### Persona 1 — Mira, the IELTS Candidate

- **Name:** Mira
- **Age Range:** 22–28
- **English Level:** B2
- **Learning Goal:** IELTS
- **Motivation:** Mira needs a strong IELTS score within a few months to apply for a graduate program abroad. She has limited free time between work and preparation and doesn't want to spend it deciding what to practice.
- **Pain Points:** Overwhelmed by the number of IELTS prep resources available; unsure which are actually appropriate for her level; loses momentum when she has to plan her own study session before she can start.
- **Success Criteria:** She can open the app and immediately start a session that feels relevant to IELTS preparation at her level, without first having to search for or evaluate material.
- **Typical Session:** Signs in, confirms her Level and Goal are already set to B2 / IELTS, generates a session, and works through it in one sitting during a lunch break.

### Persona 2 — Davide, the Business Traveler

- **Name:** Davide
- **Age Range:** 35–45
- **English Level:** B1
- **Learning Goal:** Business
- **Motivation:** Davide's company is expanding internationally, and he needs to be able to confidently participate in English-language meetings and emails.
- **Pain Points:** Finds generic English courses irrelevant to his day-to-day work context; has very little spare time and abandons tools that require setup or planning.
- **Success Criteria:** Every time he opens the app, he gets a session that feels applicable to real business situations, without needing to configure anything beyond his Level and Goal.
- **Typical Session:** Opens the app between meetings, generates a session tied to his Business goal, and completes it in a short, focused burst.

### Persona 3 — Yuna, the University-Bound Student

- **Name:** Yuna
- **Age Range:** 17–20
- **English Level:** B1
- **Learning Goal:** University
- **Motivation:** Yuna is preparing to study at an English-speaking university and wants consistent practice with academic-style English.
- **Pain Points:** Easily distracted by too many choices; tends to procrastinate when she has to decide what to study, and disengages from tools that feel like more schoolwork to plan.
- **Success Criteria:** She can rely on the app to always hand her something appropriate to do next, so consistency comes from the app rather than her own discipline.
- **Typical Session:** Signs in most evenings, generates a new session with her Level and Goal already set from before, and completes it as part of a simple daily habit.

### Persona 4 — Carlos, the General Learner

- **Name:** Carlos
- **Age Range:** 28–50
- **English Level:** A2
- **Learning Goal:** General English
- **Motivation:** Carlos wants to steadily improve his everyday English without a specific test or deadline driving him.
- **Pain Points:** Has tried apps before but lost interest once the novelty wore off or the content stopped feeling relevant; doesn't want to manage a curriculum himself.
- **Success Criteria:** Sessions consistently feel fresh and appropriately challenging, keeping him engaged without requiring him to track his own progress or plan.
- **Typical Session:** Opens the app occasionally, sometimes a few times a week, generates a General English session, and completes it before returning to other tasks.

---

# Secondary Personas

### Persona 5 — Anh, the Traveler

- **Name:** Anh
- **Age Range:** 25–60
- **English Level:** A1–A2 (varies)
- **Learning Goal:** Travel
- **Why Secondary:** Anh represents a real but narrower use case defined in M01/M02 — practical, short-term, trip-driven learning rather than sustained regular practice. The core loop (Level, Goal, Generate, Complete) still serves Anh, but Anh is less likely to be a frequent, returning user compared to Personas 1–4, making this persona secondary rather than primary for shaping Version 1 priorities.

### Persona 6 — Priya, the Job Seeker

- **Name:** Priya
- **Age Range:** 24–35
- **English Level:** B1–B2
- **Learning Goal:** Job Interviews
- **Why Secondary:** Priya's need is real and covered by the Job Interviews goal defined in M01, but her usage is likely to be short-term and concentrated around a specific event (an upcoming interview) rather than the sustained, repeated engagement the product is primarily optimized for. She is secondary because her success criteria overlap heavily with Personas 1–4 rather than requiring anything distinct.

---

# Users We Are NOT Designing For

Consistent with M02's Target Users section, Version 1 is explicitly not designed for:

- **Absolute beginners with no foundation** who require structured, sequential, pre-A1 literacy instruction before self-directed practice is appropriate.
- **Learners who want manual control** over topic selection, lesson sequencing, or curriculum design — this contradicts the product's core premise that learners never have to decide what to study next.
- **Institutions, teachers, or classroom administrators** requiring cohort management, grading, or multi-learner oversight.
- **Learners seeking certification or official test scoring** — the product supports practice and preparation, not formal assessment.

---

# User Stories

Each story is grouped by the same functional category used in M02, and maps to that category's requirements.

## Authentication

- **US-AUTH-01:** As a new visitor, I want to create an account, so that I can access the product and have my progress saved.
- **US-AUTH-02:** As a returning learner, I want to sign in to my account, so that I can pick up where I left off.
- **US-AUTH-03:** As a signed-in learner, I want to sign out of my account, so that I can protect my account on a shared device.
- **US-AUTH-04:** As a returning learner, I want to stay signed in between visits, so that I don't have to sign in every single time I want to practice.

## Dashboard

- **US-DASH-01:** As a signed-in learner, I want to land on a single starting screen, so that I always know where to begin without searching for what to do.
- **US-DASH-02:** As a learner, I want to see and set my English Level from the dashboard, so that my session matches my ability.
- **US-DASH-03:** As a learner, I want to see and set my Learning Goal from the dashboard, so that my session matches what I'm trying to achieve.
- **US-DASH-04:** As a learner, I want to see and control the "use one topic for all skills" toggle from the dashboard, so that I can decide whether I want a unified or varied topic experience.
- **US-DASH-05:** As a learner, I want a clear way to generate my session from the dashboard, so that I can move straight from selection to practice.

## Learning Session

- **US-SESS-01:** As a learner, I want to choose exactly one English Level, so that my session is appropriately leveled.
- **US-SESS-02:** As a learner, I want to choose exactly one Learning Goal, so that my session is relevant to what I actually need.
- **US-SESS-03:** As a learner, I want to enable "use one topic for all skills," so that my whole session feels coherent and connected.
- **US-SESS-04:** As a learner, I want to disable "use one topic for all skills," so that I can get variety across the skills in my session if I prefer that.
- **US-SESS-05:** As a learner, I want to generate one complete session with a single action, so that I don't have to assemble it myself.
- **US-SESS-06:** As a learner, I want to work through my generated session from start to finish, so that I get a full, self-contained practice experience.
- **US-SESS-07:** As a learner, I want to know when I've reached the end of a session, so that I have a clear sense of completion.
- **US-SESS-08:** As a learner, I want to generate a new session at any time, so that I can practice again whenever I choose.

## Progress

- **US-PROG-01:** As a learner, I want my completed sessions to be saved, so that my effort isn't lost.
- **US-PROG-02:** As a returning learner, I want to see that my previous session was recorded as complete, so that I feel confident my progress is being kept.
- **US-PROG-03:** As a learner who left a session unfinished, I want the app to recognize that I have an incomplete session, so that I'm not confused about my own state when I return.

## Settings

- **US-SET-01:** As a learner, I want to change my English Level at any time, so that my sessions stay accurate as my ability changes.
- **US-SET-02:** As a learner, I want to change my Learning Goal at any time, so that my sessions stay relevant if my purpose for learning changes.
- **US-SET-03:** As a learner, I want to change the topic toggle at any time, so that I can adjust how my sessions feel without any other setup.
- **US-SET-04:** As a learner, I want the product to avoid showing me any settings beyond Level, Goal, and the topic toggle, so that I never feel burdened by configuration.

---

# Acceptance Criteria

## Authentication

- **US-AUTH-01:** Given a new visitor without an account, when they complete account creation, then an account exists and they are recognized as a signed-in learner.
- **US-AUTH-02:** Given a learner with an existing account, when they provide valid credentials, then they are signed in and reach the dashboard.
- **US-AUTH-03:** Given a signed-in learner, when they choose to sign out, then their session ends and they are no longer recognized as signed in.
- **US-AUTH-04:** Given a learner who has previously signed in, when they return within a reasonable period, then they are not required to sign in again.

## Dashboard

- **US-DASH-01:** Given a signed-in learner, when they arrive at the app, then they land on one consistent dashboard with no alternate entry points.
- **US-DASH-02:** Given a learner on the dashboard, when they view or change their Level, then exactly one Level from A1–C2 is set as current.
- **US-DASH-03:** Given a learner on the dashboard, when they view or change their Goal, then exactly one Goal from the six defined goals is set as current.
- **US-DASH-04:** Given a learner on the dashboard, when they toggle "use one topic for all skills," then the toggle's current state is clearly reflected and takes effect on the next generated session.
- **US-DASH-05:** Given a learner with a Level and Goal set, when they choose to generate a session, then a session generation request is initiated with no further input required.

## Learning Session

- **US-SESS-01/02:** Given a learner selecting Level and Goal, when they confirm their selection, then the session generated reflects exactly that Level and Goal.
- **US-SESS-03:** Given the topic toggle is enabled, when a session is generated, then a single AI-generated topic is used across all skills included in that session.
- **US-SESS-04:** Given the topic toggle is disabled, when a session is generated, then skills in the session may use different topics.
- **US-SESS-05:** Given valid Level, Goal, and toggle state, when the learner requests generation, then exactly one complete session is produced without requiring additional input.
- **US-SESS-06/07:** Given a generated session, when the learner progresses through it, then they can reach a final point that is clearly identifiable as the end of the session.
- **US-SESS-08:** Given a learner has completed or abandoned a session, when they choose to generate again, then a new session is created using their current Level, Goal, and toggle state.

## Progress

- **US-PROG-01:** Given a learner completes a session, when completion occurs, then that completion is saved and associated with their account.
- **US-PROG-02:** Given a learner has a previously completed session, when they return to the dashboard, then an indication of that completed session is available to them.
- **US-PROG-03:** Given a learner leaves a session before finishing, when they return, then the app is able to indicate that an incomplete session exists for them.

## Settings

- **US-SET-01/02/03:** Given a learner changes Level, Goal, or the topic toggle, when the change is made, then the new value is saved as their current setting and used for the next generated session.
- **US-SET-04:** Given any point in the Version 1 experience, when a learner looks for configurable settings, then only Level, Goal, and the topic toggle are ever presented.

---

# Edge Cases

- **First-time user:** A learner with no account and no prior Level/Goal selection must be able to reach account creation and then set a Level and Goal before any session can be generated — there is no default session generated without these selections.
- **Returning user:** A learner who previously set a Level, Goal, and toggle state should have those settings remembered on return, rather than needing to reselect them each time.
- **Incomplete learning session:** A learner who leaves a session before reaching its end must have that state distinguishable from a completed session when they return (per US-PROG-03).
- **No generated session yet:** A learner who has set Level and Goal but has not yet generated a session must be presented with a clear path to generate one, not an empty or ambiguous state.
- **Changed English Level:** A learner who changes their Level after previously completing sessions must have future generated sessions reflect the new Level; past completed sessions and their saved progress remain unaffected.
- **Changed Learning Goal:** A learner who changes their Goal after previously completing sessions must have future generated sessions reflect the new Goal; past completed sessions and their saved progress remain unaffected.
- **Toggle changed mid-cycle:** A learner who changes the "use one topic for all skills" toggle after a session has already been generated does not retroactively affect that already-generated session — the new toggle state applies only to the next generated session.
- **Repeated generation without completion:** A learner who repeatedly generates new sessions without completing prior ones should still have each individual session's completion status tracked independently, consistent with US-PROG-01–03.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined four Primary Personas and two Secondary Personas grounded in the Target Users from M02.
- Restated Users We Are NOT Designing For, consistent with M02.
- Wrote User Stories grouped into Authentication, Dashboard, Learning Session, Progress, and Settings, mirroring M02's functional requirement categories.
- Defined Acceptance Criteria for every User Story.
- Documented Edge Cases covering first-time use, returning use, incomplete sessions, no-session state, and changes to Level, Goal, and the topic toggle.

### Files Created
- `docs/milestones/M03-user-personas-and-stories.md`

### Files Modified
- None. M01 and M02 were not revisited or altered.

### Pending
- No further action pending within M03. Awaiting next milestone instructions.

### Risks
- Personas assume a mostly self-directed, individual learner base consistent with M01/M02; if future milestones introduce institutional or classroom use, personas would need revisiting (out of scope per current exclusions).
- Edge cases around "changed Level/Goal mid-cycle" and "toggle changed mid-cycle" assume past sessions are unaffected by later changes; this is a reasonable product assumption but has not been explicitly confirmed in M01 or M02 and should be validated before implementation.

### Open Questions
- Should returning learners with an incomplete session (US-PROG-03) be able to resume that exact session, or only be made aware one exists? M02 does not specify resumption behavior, and this document intentionally avoided deciding it.
- Is there a maximum time a learner can remain signed in before re-authentication is required (relevant to US-AUTH-04)? This is a policy decision not yet addressed in M01 or M02.

Waiting for the next milestone.
