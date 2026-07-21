# M21 — AI Integration Architecture

**Status:** Draft
**Owner:** Product / Architecture
**Milestone:** M21
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M20 — Backend Architecture](./M20-backend-architecture.md)

---

# Overview

The AI Integration Architecture defines how AI capability conceptually fits within the backend architecture already established in M20 — specifically, how it participates in the Session Generation Service defined in M18 and the Session Generation Logic defined in M08. It exists to draw a clear, durable boundary between what AI is responsible for (producing generative content) and what remains deterministic application logic (enforcing structure and correctness) — a boundary that must hold regardless of which AI capability is eventually used to fulfill it. No provider, model, or prompt is named or implied anywhere in this document.

---

# AI Responsibilities

**Belongs to the AI Layer:**
- Generating the subject matter of a Topic, per M08's Topic Consistency Rules and M17's Topic object.
- Generating the content of each Session Composition part (Reading, Listening, Speaking, Writing, Vocabulary, Grammar, Quiz), shaped by the Topic(s), English Level, and Learning Goal in effect at the moment of generation, per M08's Personalization Rules.

**Must never belong to the AI Layer:**
- Enforcing that a Session contains all seven Session Composition parts — this structural requirement is enforced by the Domain Layer, per M08's Business Constraints and M20's Business Processing Responsibilities, regardless of what the AI Layer produces.
- Determining Session state transitions (Generated, In Progress, Completed, Abandoned) — these are governed by the Session Experience Service, per M18.
- Determining Authentication State, Learning Configuration values, or Progress Record outcomes — these belong exclusively to their respective Services, per M18.
- Deciding whether a Session Generation request ultimately succeeds — that determination is always made by the Domain Layer against GenerateSession's Postconditions, per M18 and M20, even after the AI Layer has produced content.
- Accessing or requiring any Learner information beyond the Configuration values defined as AI Input Concepts below, consistent with M15's Privacy Principles.

---

# AI Interaction Points

Version 1 has exactly two conceptual points at which the product interacts with AI, both occurring within the Session Generation Service's GenerateSession operation (per M18), corresponding to the Topic Selection and Session Creation steps of M08's Session Generation Logic:

1. **Topic Generation:** Occurs during the Topic Selection step. Produces one Topic (if the Topic Toggle Preference is Enabled) or multiple Topics (if Disabled), per M08's Topic Consistency Rules.
2. **Composition Content Generation:** Occurs during the Session Creation step. Produces the content for each of the seven Session Composition parts, shaped by the Topic(s) already generated.

No other Functional Area (Authentication, Dashboard, Learning Configuration, Session Experience, Progress) interacts with AI in Version 1. Once a Session is generated, the Session Experience Service tracks the Learner's engagement with already-generated content — it does not invoke AI again during that Session, consistent with M08's rule that a Session's contents are fixed at creation.

---

# AI Input Concepts

The AI Layer may only be provided the following business concepts, and nothing else:

- The Learner's current **English Level**, to govern difficulty (per M08's Personalization Rules).
- The Learner's current **Learning Goal**, to govern context and framing (per M08's Personalization Rules).
- The current **Topic Toggle Preference** state, to govern whether one Topic or multiple Topics are produced (per M08's Topic Consistency Rules).
- For Composition Content Generation, the **Topic(s)** already produced by Topic Generation, so that content can be built around them.

No other Learner information — account details, Authentication State, past Session history, or Progress outcomes — is ever provided to the AI Layer, consistent with M15's Privacy Principles and M09's Configuration Dependencies (which establish that configuration is independent of Session history). No manual topic input is ever provided, consistent with FR-SESS-07.

---

# AI Output Concepts

The AI Layer is expected to produce exactly the following business concepts:

- One or more **Topics**, each representing a coherent subject matter, per M08's Topic Consistency Rules.
- Content for each of the seven **Session Composition** parts (Reading, Listening, Speaking, Writing, Vocabulary, Grammar, Quiz), appropriate to the supplied English Level, Learning Goal, and Topic(s).

No other output is expected from or accepted by the AI Layer. The AI Layer never produces Configuration values, Authentication State, Session state, or Progress outcomes — those remain entirely the responsibility of their respective Services, per M18.

---

# AI Orchestration

- The **Session Generation Service** (Domain Layer, per M20) is the sole caller of the AI Layer. It invokes Topic Generation first, then supplies the resulting Topic(s) to Composition Content Generation.
- The AI Layer's output is treated as proposed content, not as an automatically accepted outcome — the Session Generation Service remains responsible for confirming that the output satisfies GenerateSession's Postconditions (a complete Session with all seven Session Composition parts, per M18) before the operation is considered successful.
- If the AI Layer's output does not constitute a complete, valid Session (e.g., a part is missing or the Topic Consistency Rules were not followed), the Session Generation Service treats this as GenerateSession's Failure Condition being met, per M18 — the same failure handling already defined for a missing Configuration value or a Session already In Progress.
- The AI Layer operates only within the single request lifecycle already defined in M16 — it is invoked during the Business Processing step and its output is incorporated into the Result before Persistence occurs; it does not operate outside of or independently from that lifecycle.

---

# AI Constraints

The following constraints govern every AI interaction, drawn directly from rules already established in M01–M20:

- **Configuration Adherence:** Every AI output must reflect the exact English Level, Learning Goal, and Topic Toggle Preference supplied for that generation — never a different or inferred configuration, per M08's Business Constraints.
- **Level Alignment:** The difficulty of all AI-generated content within a single Session must be consistent with the supplied English Level, per M08's Personalization Rules.
- **Goal Alignment:** The context and framing of all AI-generated content within a single Session must be consistent with the supplied Learning Goal, per M08's Personalization Rules.
- **Topic Consistency:** AI output must follow the Topic Toggle Preference exactly — one shared Topic across all parts when Enabled, potentially varied Topics when Disabled — per M08.
- **Structural Determinism:** Regardless of variation in generated content, the AI Layer must always produce output for all seven Session Composition parts — never fewer, never more — per M08's Business Constraint that every Session includes all seven parts.
- **Freshness Without Repetition Requirement:** Consistent with M01's Vision that Sessions should never feel stale, no constraint in this document requires identical output for identical inputs — variation in generated content across separate generations is expected and acceptable, so long as Configuration Adherence, Level Alignment, Goal Alignment, and Topic Consistency are always satisfied.

---

# Failure Handling Principles

- If the AI Layer cannot produce a complete, valid Topic and Composition Content set, this is treated as GenerateSession's Failure Condition being met, per M18 — no Session is created, and no Learner-facing state changes as a result.
- A failed AI interaction must never result in a partial or incomplete Session being presented to the Learner, consistent with M08's Business Constraints and M13's Business Constraints on all-or-nothing generation.
- Following a failed AI interaction, the Learner remains at the Dashboard with their Configuration intact, consistent with M13's Error Recovery Flows for "Session Generation Unavailable."
- No retry strategy, fallback behavior, or recovery mechanism is defined in this document — those are implementation-level decisions outside the scope of a conceptual architecture document.

---

# AI Boundaries

| Concern | AI Layer Responsibility | Deterministic Application Logic Responsibility |
|---|---|---|
| Generating Topic subject matter | Yes. | No. |
| Generating Session Composition content | Yes. | No. |
| Enforcing all seven Session Composition parts are present | No. | Yes — the Domain Layer, per M08 and M20. |
| Enforcing Topic Toggle Preference behavior (single vs. multiple Topics) | Partially — AI produces Topics according to the instruction it is given, but the Domain Layer determines and supplies which behavior applies. | Yes — determining which behavior applies. |
| Determining whether GenerateSession succeeds or fails | No. | Yes — the Domain Layer, per M18. |
| Determining Session state transitions after generation | No. | Yes — the Session Experience Service, per M18. |
| Determining Authentication, Configuration, or Progress outcomes | No. | Yes — their respective Services, per M18. |

---

# AI Glossary

- **AI Layer:** The conceptual layer responsible for generating Topic subject matter and Session Composition content, invoked exclusively by the Session Generation Service.
- **AI Interaction Point:** A defined moment at which the product invokes the AI Layer — Topic Generation or Composition Content Generation.
- **Generative Output:** Content produced by the AI Layer, treated as proposed rather than automatically authoritative.
- **Deterministic Application Logic:** The rules and structure enforced by the Domain Layer that every AI output must satisfy, regardless of the specific content generated.
- **Configuration Adherence:** The requirement that AI output always reflects the exact Configuration values supplied for that generation.
- **Structural Determinism:** The requirement that the AI Layer always produces all seven Session Composition parts, even though the content within each part may vary.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined AI Responsibilities, distinguishing what belongs to the AI Layer (Topic and Session Composition content generation) from what must never belong to it (structural enforcement, state transitions, Configuration/Authentication/Progress decisions).
- Identified exactly two AI Interaction Points (Topic Generation, Composition Content Generation), both scoped within the Session Generation Service's GenerateSession operation, per M18.
- Defined AI Input Concepts and AI Output Concepts strictly as business concepts already established in M08 and M09, with no prompt or message structure.
- Documented AI Orchestration, AI Constraints (Configuration Adherence, Level Alignment, Goal Alignment, Topic Consistency, Structural Determinism, and a Freshness principle drawn from M01), Failure Handling Principles, an AI Boundaries table, and an AI Glossary.

### Files Created
- `docs/milestones/M21-ai-integration-architecture.md`

### Files Modified
- None. M01–M20 were not revisited or altered.

### Pending
- No further action pending within M21. Awaiting next milestone instructions.

### Risks
- This document explicitly does not require deterministic (identical) output for identical inputs, only adherence to Configuration, Level, Goal, and Topic Consistency. This "Freshness Without Repetition Requirement" was inferred from M01's Vision (Sessions should never feel stale) reconciled against this milestone's example constraint of "Determinism where required" — the resolution taken is that determinism applies to structure (all seven parts), not content, and this should be confirmed as the intended reading.
- No provider, model, or technical mechanism is named anywhere in this document, per the milestone's rules; this means the AI Layer is described purely by its responsibilities and boundaries, and a future technical milestone will need to determine how those responsibilities are actually fulfilled.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
