# M01 — Product Vision

**Status:** Draft
**Owner:** Product
**Milestone:** M01

---

## 1. Mission

Build an AI-powered English learning platform where learners never have to decide what to study next.

## 2. Vision

Project Fluent becomes the place English learners go when they want to make real progress without spending mental energy figuring out what to study. Every time a learner opens the app, the app already knows what to give them: one complete, coherent session, generated fresh, matched to their level and their goal. Over time, the platform earns trust the way a great tutor does — by consistently showing up with exactly the right lesson, no explanation needed.

## 3. Problem Statement

English learners today are overwhelmed by choice, not underserved by content. Existing platforms hand learners a library, a course catalog, or an open-ended chatbot and expect them to know what they need. In practice, this creates friction at the exact moment learners are most vulnerable to giving up:

- **Decision fatigue.** "What should I study today?" is a question most learners cannot confidently answer themselves — that's *why* they need help in the first place.
- **Setup burden.** Onboarding questionnaires, study-plan builders, and settings screens delay the moment a learner actually starts learning, and many abandon before they get there.
- **Fragmented practice.** Learners are often left to separately seek out reading, listening, speaking, and writing material, with no coherent thread tying the skills together.
- **Generic content.** Static courses can't adapt to a learner's specific goal (e.g. an IELTS candidate and a business traveler are given the same material) or stay fresh session after session.

## 4. Proposed Solution

Project Fluent removes the decision entirely. The learner provides only the minimum signal needed to generate a good session:

- **English Level** (A1–C2)
- **Learning Goal** (General English, IELTS, Business, Travel, University, Job Interviews)
- An optional toggle: **"Use one topic for all skills"** — when enabled, a single AI-generated topic threads through every skill in the session; when disabled, the platform is free to vary topics across skills. This can be switched on or off at any time.

From these three inputs, the platform generates one complete session built around an AI-generated topic — with no lesson library to browse, no plan to build, and no additional configuration required. The learner's only job is to show up and do the session in front of them.

## 5. Product Philosophy

- **The best interface is no interface.** Every screen, toggle, or decision we ask a learner to make is a cost. We only ask for what is strictly necessary to generate a good session.
- **One session, fully formed.** The unit of value is a complete session, not a menu of options. Learners should never face a blank state asking "what now?"
- **Freshness by generation, not curation.** Topics are generated, not selected from a finite catalog, so the platform never feels repetitive or stale.
- **Coherence over fragmentation.** Skills (reading, listening, speaking, writing, etc.) are tied together by a shared topic when the learner wants that coherence, rather than existing as disconnected exercises.
- **Trust through consistency.** The platform earns the right to make decisions on the learner's behalf by consistently producing sessions that feel appropriately leveled and relevant to the learner's goal.

## 6. Product Principles

1. **No onboarding questionnaire.** Learners start immediately; the platform does not interrogate them before delivering value.
2. **No study-time setup.** There is no scheduling, planning, or configuration of how/when learners study.
3. **No complicated settings.** The only learner-facing controls are Level, Goal, and the single-topic toggle.
4. **Every input must earn its place.** New settings or choices are added only if the product demonstrably cannot work without them.
5. **Sessions are complete, not partial.** A generated session is ready to use end-to-end; it is never a fragment the learner must assemble themselves.
6. **Consistency builds trust.** The AI's topic and content choices should be reliably appropriate to the stated level and goal every time.

## 7. MVP Objectives

- Validate that a learner can go from opening the app to starting a meaningful learning session with only two required choices (Level and Goal).
- Validate that AI-generated topics can produce learning sessions that feel coherent, relevant, and appropriately leveled.
- Validate that the "one topic for all skills" toggle produces a noticeably more coherent experience than independent, unrelated skill content — and that learners have a clear preference between the two modes.
- Establish a repeatable definition of what a "complete session" contains.

## 8. MVP Boundaries

**In scope:**
- Level selection (A1–C2)
- Goal selection (General English, IELTS, Business, Travel, University, Job Interviews)
- The "use one topic for all skills" toggle
- Generation of a single, complete AI-driven learning session per request

**Out of scope for MVP:**
- Onboarding questionnaires or placement tests
- Study-time scheduling or planning tools
- User-configurable settings beyond Level, Goal, and the topic toggle
- Progress tracking, gamification, streaks, or social features
- Any lesson library, catalog, or manual topic browsing
- Multi-session curricula or long-term learning paths

## 9. Success Metrics

- **Time to first session:** elapsed time from app open to session start (target: as close to immediate as possible).
- **Session completion rate:** proportion of started sessions that learners finish.
- **Return usage:** proportion of learners who start a second session without prompting.
- **Perceived relevance:** learner-reported sense that the session matched their level and goal.
- **Topic coherence preference:** learner preference and satisfaction when the single-topic toggle is enabled vs. disabled.
- **Zero-setup adherence:** confirmation that no learner is required to touch more than Level, Goal, and the toggle to reach a session.

## 10. Future Versions (titles only)

- Adaptive Level Calibration
- Long-Term Progress & Mastery Tracking
- Multi-Session Learning Journeys
- Speaking & Pronunciation Feedback
- Social & Cohort Learning
- Educator/Classroom Mode
- Offline Session Support
- Expanded Goal Types
