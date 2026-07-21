# M11 — UX Principles

**Status:** Draft
**Owner:** Product
**Milestone:** M11
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md), [M02 — Product Requirements](./M02-product-requirements.md), [M03 — User Personas and Stories](./M03-user-personas-and-stories.md), [M04 — Information Architecture](./M04-information-architecture.md), [M05 — User Flows](./M05-user-flows.md), [M06 — Feature Breakdown](./M06-feature-breakdown.md), [M07 — Domain Model](./M07-domain-model.md), [M08 — AI Learning Engine](./M08-ai-learning-engine.md), [M09 — Configuration Model](./M09-configuration-model.md), [M10 — Content Architecture](./M10-content-architecture.md)

---

# Overview

UX Principles define *how the product should feel to use*, independent of any visual design, layout, or interface component. Where M04–M05 defined the product's structure and flows, and M06–M10 defined its features, logic, configuration, and content, this document defines the experience standard every one of those pieces must be built to satisfy. It exists so that future design and implementation work has a consistent, product-approved standard for "does this feel right" — grounded directly in M01's mission that learners should never have to decide what to study next.

---

# Product Experience Goals

- **Simplicity:** The product should always feel like the smallest possible thing standing between the Learner and practicing English — never more.
- **Clarity:** At every point in the journey, the Learner should always understand what is happening and what will happen next, without needing to guess.
- **Low Cognitive Load:** The Learner should never have to hold more than the three Configuration options (M09) in mind at once — nothing else should compete for their attention.
- **Fast Progress:** The path from arriving at the product to actively practicing English should always feel short, direct, and free of unnecessary steps.
- **Consistency:** The experience of generating and completing a Session should feel identical in structure every time, so the Learner can build trust in what to expect.
- **Confidence:** The Learner should always feel that the Session in front of them is the right one for their Level and Goal — never arbitrary, never generic.

---

# Interaction Principles

- **One Clear Primary Action:** At any point in the journey, there should be one obvious next action for the Learner to take — generating a Session, continuing a Session, or signing in — never a competing set of equally weighted choices.
- **Minimal Decisions:** The only decisions a Learner is ever asked to make are those defined in M09's Configuration Model (English Level, Learning Goal, Topic Toggle Preference). No interaction should introduce a decision beyond these three.
- **Predictable Behavior:** The same action should always produce the same kind of outcome — generating a Session always produces one complete Session (per M08); changing a Configuration option always applies to the next Session only (per M09) — with no exceptions or hidden variation.
- **Immediate Feedback:** Every action the Learner takes — setting a Configuration option, generating a Session, completing a part of a Session — should be immediately and clearly acknowledged, so the Learner never wonders whether their action registered.
- **Logical Progression:** The Learner should always move forward through a journey that makes sense in sequence — per M05's User Flows — never backward into a state that contradicts what they just did.

---

# Learning Experience Principles

- **Maintain Focus:** While a Learner is inside a Session, their attention should stay on that Session — nothing should pull them toward reconfiguring settings or reconsidering their Level or Goal mid-session, consistent with M08's rule that a Session's configuration is fixed once generated.
- **Reduce Distractions:** Outside of the Session Composition parts defined in M08 (Reading, Listening, Speaking, Writing, Vocabulary, Grammar, Quiz), nothing should compete for the Learner's attention during Learning.
- **Support Continuity:** The Learner should experience each Session as one continuous thread, especially when the Topic Toggle Preference is enabled (per M08's Topic Consistency Rules) — moving between composition parts should never feel like starting over.
- **Match Learner Level:** At every moment within a Session, the Learner should feel that the difficulty in front of them matches what they declared, never harder or easier than their stated English Level.
- **Encourage Completion:** The experience should make reaching the end of a Session feel like a natural, achievable outcome of continuing forward, not a distant or uncertain goal.
- **Keep Learning Sessions Cohesive:** A Session should always feel like one complete thing a Learner did, not a series of unrelated tasks — this applies to the Session as a whole, regardless of Topic Toggle Preference state.

---

# Content Presentation Principles

- Information should be presented to the Learner only when it is relevant to their current step — Configuration information at the point of configuring, Session content at the point of learning, Progress information at the point of returning.
- The Learner should never be shown more information than is needed to take their next action, consistent with M01's principle that every input and, by extension, every piece of shown information must earn its place.
- Information belonging to different Information Domains (per M10) should never be blended together in a way that confuses the Learner about what they are looking at — Configuration, Session content, and Progress should each be clearly its own thing.
- The origin of generated content (that it is AI-generated, tied to the Learner's current Topic Toggle Preference) should be understandable to the Learner without requiring explanation, so they always trust why they're seeing what they're seeing.

---

# Error Experience Principles

- An error should never leave the Learner in an ambiguous state — per M05's Error Recovery Flows, the Learner should always be returned to a known, valid state (such as the Dashboard) rather than a dead end.
- An error should never cause the Learner to lose Configuration values, in-progress work, or previously recorded Progress.
- An error should be communicated in terms the Learner can act on — what happened and what they can do next — never in a way that requires them to understand why it happened.
- Recovering from an error should never require the Learner to redo more than the specific action that failed.

---

# Accessibility Principles

- The product must be usable by Learners with varying levels of digital literacy, consistent with M02's Non Functional Requirements — no step should assume prior familiarity with similar products.
- Every core journey (M05's First-Time and Returning User Flows) must be completable by a Learner relying on assistive technology, without requiring an alternate path.
- No part of the experience should depend on a single sense (e.g., sight alone or hearing alone) to be understood, especially given that Session Composition includes both audio-oriented (Listening, Speaking) and text-oriented (Reading, Writing) practice.
- Clarity and simplicity, as defined in Product Experience Goals, are themselves accessibility principles — a product that is easy for everyone to understand is inherently more accessible.

---

# UX Constraints

The following must always remain true throughout Version 1:

1. The Learner is never asked to make a decision beyond the three Configuration options defined in M09.
2. The Learner is never shown a page or piece of information not defined in M04's Site Map or M10's Information Domains.
3. A Session, once generated, is never altered mid-experience by a Configuration change (per M08).
4. An error state never results in lost Configuration, lost in-progress work, or lost Progress.
5. Every journey defined in M05 must remain completable without requiring the Learner to understand anything about how the product works internally.
6. No experience principle in this document may be satisfied by adding a new feature, page, or setting — all principles apply to the product exactly as scoped in M01–M10.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined Product Experience Goals (Simplicity, Clarity, Low Cognitive Load, Fast Progress, Consistency, Confidence), scoped to fit the product as already defined.
- Defined Interaction Principles, Learning Experience Principles, Content Presentation Principles, Error Experience Principles, and Accessibility Principles — all as experience philosophy, with no interface, layout, or component design.
- Documented UX Constraints that must hold true throughout Version 1, explicitly prohibiting any principle from being satisfied by adding new scope.

### Files Created
- `docs/milestones/M11-ux-principles.md`

### Files Modified
- None. M01–M10 were not revisited or altered.

### Pending
- No further action pending within M11. Awaiting next milestone instructions.

### Risks
- Every principle in this document was deliberately grounded in a specific, already-approved requirement or rule from M01–M10 (cited inline) to avoid introducing new product behavior under the guise of "experience philosophy." If any principle reads as prescriptive beyond what earlier milestones establish, it should be flagged for correction rather than treated as new scope.

### Open Questions
- None beyond those already raised in M05, M07, M08, and M09, which remain open and are not reintroduced here.

Waiting for the next milestone.
