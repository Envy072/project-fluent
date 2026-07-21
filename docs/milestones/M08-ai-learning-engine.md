# M08 — Product Logic for the AI Learning Engine

**Status:** Draft
**Owner:** Product
**Milestone:** M08
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md), [M02 — Product Requirements](./M02-product-requirements.md), [M03 — User Personas and Stories](./M03-user-personas-and-stories.md), [M04 — Information Architecture](./M04-information-architecture.md), [M05 — User Flows](./M05-user-flows.md), [M06 — Feature Breakdown](./M06-feature-breakdown.md), [M07 — Domain Model](./M07-domain-model.md)

---

# Overview

The AI Learning Engine is the product logic responsible for turning a Learner's English Level, Learning Goal, and Topic Toggle Preference into one complete Session (per M07's Domain Model). This document defines the *product behavior* of that logic — what a Session must contain, how it is logically assembled, and what rules govern it — so that the "engine" can later be built to a precise, agreed specification. It does not define how generation is technically performed; it defines what the generated result must be, and why, from a product standpoint.

---

# Learning Session Definition

A **Learning Session** is one complete, self-contained unit of English practice, generated for a specific Learner from their current English Level, Learning Goal, and Topic Toggle Preference, and built around one or more AI-generated Topics (per M07).

A Learning Session **is**:
- A single, ready-to-use unit of practice the Learner can start and finish in one sitting.
- Composed of every part defined in Session Composition below, every time it is generated.
- Bound permanently to the settings that produced it, regardless of later changes to those settings.

A Learning Session **is NOT**:
- A menu, library, or catalog of exercises for the Learner to choose from.
- A partial or fragmentary exercise — it is never missing a composition part.
- A multi-day or multi-part curriculum; it is a single, complete unit, consistent with M02's exclusion of multi-session learning paths.
- Editable or reconfigurable by the Learner once generated.

---

# Session Composition

Every generated Session is composed of the following logical parts. These parts are always present together — a Session is not considered complete unless all of them are included.

- **Reading:** Practice built around comprehending written English text related to the Session's Topic(s).
- **Listening:** Practice built around comprehending spoken English related to the Session's Topic(s).
- **Speaking:** Practice built around producing spoken English related to the Session's Topic(s).
- **Writing:** Practice built around producing written English related to the Session's Topic(s).
- **Vocabulary:** Practice built around words and phrases relevant to the Session's Topic(s), Level, and Goal.
- **Grammar:** Practice built around grammatical structures appropriate to the Learner's Level.
- **Quiz:** A concluding set of questions that checks the Learner's understanding across the Session's content.

Each part is a distinct component of the Session, but all parts belong to and are scoped by the same Session — they are not independent exercises the Learner could access outside of a generated Session.

---

# Session Generation Logic

The logical sequence by which a Session comes into being:

1. **User Configuration** — The Learner's current English Level, Learning Goal, and Topic Toggle Preference are read as they stand at this moment (per M07's Entity Rules).
2. **Topic Selection** — One Topic is selected if the Topic Toggle Preference is enabled, or multiple Topics (one per composition part, as applicable) are selected if it is disabled (see Topic Consistency Rules).
3. **Session Creation** — A complete Session is assembled, containing all seven Session Composition parts, each shaped by the selected Topic(s), the Learner's Level, and the Learner's Goal.
4. **Learning** — The Learner works through the Session's composition parts.
5. **Completion** — The Learner reaches the end of the Session (see Session Completion Rules).
6. **Progress Update** — The outcome of the Session is recorded against the Learner, per M07's Progress Record entity, and reflected back on the Learner's next visit to the Dashboard.

This sequence occurs identically every time a Learner generates a Session, whether it is their first or a repeat generation.

---

# Topic Consistency Rules

### When "Use One Topic for All Skills" Is Enabled
- Exactly one Topic is selected for the Session.
- Every Session Composition part (Reading, Listening, Speaking, Writing, Vocabulary, Grammar, Quiz) is built around that same Topic.
- The Learner experiences one coherent subject running through the entire Session.

### When "Use One Topic for All Skills" Is Disabled
- More than one Topic may be selected for the Session.
- Each Session Composition part may be built around a different Topic, independent of the others.
- The Learner experiences variety across the Session rather than a single connecting thread.

In both cases, the Topic(s) used are fixed once the Session is created; the Session does not re-select or vary its Topic(s) partway through, consistent with M07's rule that a Session's generating conditions never change after generation.

---

# Personalization Rules

- **English Level** governs the difficulty of every Session Composition part — the complexity of language, structures, and material presented must align with the Learner's declared Level (A1–C2), so that a Session neither overwhelms nor under-challenges the Learner.
- **Learning Goal** governs the context and framing of every Session Composition part — the situations, scenarios, and material used must reflect the Learner's declared Goal (e.g., IELTS-style material for the IELTS Goal, workplace scenarios for the Business Goal, practical scenarios for the Travel Goal, academic contexts for the University Goal, interview scenarios for the Job Interviews Goal, and everyday material for General English).
- Level and Goal apply jointly to every part of a Session — neither overrides the other; a Session must simultaneously respect the Learner's stated difficulty (Level) and stated purpose (Goal).
- Personalization is re-evaluated fresh at each Session Creation step using the Learner's current Level and Goal at that moment — it is never based on stale or previously used values.

---

# Learning Rules

- **Consistency:** Every generated Session must include all seven Session Composition parts, every time, regardless of Level, Goal, or Topic Toggle state.
- **Difficulty Alignment:** All material within a single Session must be consistent with the Learner's declared English Level — no composition part may be pitched at a materially different difficulty than the others within the same Session.
- **Skill Coverage:** A single Session must give the Learner practice across all seven composition parts; no Session may omit a part or substitute a different one.
- **Topic Coherence:** A Session must respect the Learner's current Topic Toggle Preference at the moment of generation, per the Topic Consistency Rules above.
- **Learning Continuity:** Within a single Session, composition parts should relate to one another through their shared Topic(s), so the Session reads as one coherent unit of practice rather than disconnected fragments — this applies most strongly when the Topic Toggle Preference is enabled.
- **Progression:** Within a single Session, composition parts should be experienced in a logical order that supports learning (e.g., building familiarity with the Topic before being asked to produce language about it), rather than being presented in an arbitrary order. This refers only to structuring within one Session — Version 1 defines no progression, sequencing, or difficulty adjustment across multiple Sessions over time, consistent with M02's exclusion of multi-session learning paths.

---

# Session Completion Rules

- **Complete:** A Session is Complete when the Learner has worked through all seven Session Composition parts to their end. This corresponds to the Session state "Completed" and the Progress Record outcome "Recorded (Completed)" defined in M07.
- **Incomplete:** A Session is Incomplete at any point after it has started but before all seven Session Composition parts have been finished. This is the ongoing condition of a Session that is currently "In Progress" (per M07) — it is not itself a final outcome, since an Incomplete Session may still become Complete.
- **Abandoned:** A Session becomes Abandoned when the Learner leaves it while it is Incomplete and does not return to finish it before generating a new one. This corresponds to the Session state "Abandoned" and the Progress Record outcome "Recorded (Incomplete)" defined in M07 — that is, an Abandoned Session is the final, recorded form of an Incomplete Session that was never finished.

---

# Business Constraints

The following must always remain true for every Session generated in Version 1:

1. Every Session includes all seven Session Composition parts — Reading, Listening, Speaking, Writing, Vocabulary, Grammar, and Quiz — with no exceptions and no partial Sessions.
2. A Session's Topic(s) are determined once, at Session Creation, by the Learner's Topic Toggle Preference at that moment, and do not change afterward.
3. A Session's difficulty is governed entirely by the Learner's English Level at the moment of generation, and remains fixed for that Session regardless of later Level changes.
4. A Session's context and framing are governed entirely by the Learner's Learning Goal at the moment of generation, and remain fixed for that Session regardless of later Goal changes.
5. No Session may be generated without a Configured English Level and a Configured Learning Goal, per M07's Entity Rules.
6. A Session's completion status can only ever resolve to Complete or Abandoned — there is no third final outcome.
7. Version 1 defines no personalization, sequencing, or difficulty adjustment that spans multiple Sessions; all Learning Rules in this document apply within a single Session only.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined the Learning Session Definition, including what a Session is and is not, consistent with M01, M02, and M07.
- Defined Session Composition across all seven required parts (Reading, Listening, Speaking, Writing, Vocabulary, Grammar, Quiz) as product concepts only.
- Documented the Session Generation Logic sequence from User Configuration through Progress Update.
- Defined Topic Consistency Rules for both toggle states, Personalization Rules for Level and Goal, and Learning Rules covering Consistency, Difficulty Alignment, Skill Coverage, Topic Coherence, Learning Continuity, and Progression.
- Defined Session Completion Rules distinguishing Complete, Incomplete, and Abandoned, explicitly mapped back to the Session and Progress Record states already established in M07.
- Documented Business Constraints that must always hold true for every generated Session.

### Files Created
- `docs/milestones/M08-ai-learning-engine.md`

### Files Modified
- None. M01–M07 were not revisited or altered.

### Pending
- No further action pending within M08. Awaiting next milestone instructions.

### Risks
- The seven Session Composition parts were specified directly in this milestone's instructions and are treated here as the definitive, fixed composition of every Version 1 Session. If any future milestone intends variation in composition (e.g., by Level or Goal), that would be a scope change requiring explicit instruction, since this document establishes fixed, universal coverage as a Business Constraint.
- "Progression" was deliberately scoped to within-Session ordering only, to avoid conflicting with M02's exclusion of multi-session curricula. This is an interpretation of the word as used in this milestone's instructions, not a redefinition of M02's scope, and should be confirmed.
- "Incomplete" is defined here as a transient, non-final condition distinct from "Abandoned," to remain consistent with M07's Session and Progress Record states without contradicting them. This reconciliation was necessary because M07 does not use "Incomplete" as a Session state name (it uses "Abandoned" for the final state and "Recorded (Incomplete)" for the Progress Record outcome); this document's mapping should be validated as the correct reading.

### Open Questions
- Should the relative order of the seven Session Composition parts be fixed (e.g., always Reading before Speaking) or determined freshly each time within the bounds of the Progression rule? This document intentionally left the specific ordering undefined, describing only that a logical order must exist.
- Is there a minimum amount of engagement within a composition part required for it to count toward "Complete" (e.g., must the Quiz be answered, or merely reached)? Not specified in M01–M07, and left open here as a product decision for a future milestone.

Waiting for the next milestone.
