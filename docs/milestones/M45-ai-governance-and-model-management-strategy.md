# M45 — AI Governance and Model Management Strategy

**Status:** Draft
**Owner:** Product / Architecture / AI Governance
**Milestone:** M45
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M44 — Observability and Product Intelligence Strategy](./M44-observability-and-product-intelligence-strategy.md)

---

# Overview

The AI Governance and Model Management Strategy defines how the AI capability described in M21 is governed throughout its entire lifecycle, applying M42's Product Governance and M43's Evolution Strategy specifically to AI behavior. It ensures the AI Layer's output remains consistent, reliable, safe, and maintainable as it operates and evolves, without ever naming a provider, model, prompt, or machine learning framework. This document governs the AI Layer's behavior, not its technical realization.

---

# AI Governance Philosophy

- **Responsible AI:** The AI Layer only ever performs what is explicitly documented in M21 — Topic Generation and Composition Content Generation — never more.
- **Predictability:** Regardless of variation in generated content, the AI Layer's structural output remains predictable, per M21's Structural Determinism and Configuration Adherence Constraints.
- **Transparency:** Consistent with M12's User Transparency principle, the origin of AI-generated content remains understandable to the Learner without requiring technical explanation.
- **Human-Centred Design:** The AI Layer exists to serve M01's Mission for the Learner — never to demonstrate AI capability for its own sake, extending M01's minimalism specifically to AI.
- **Reliability:** AI Layer output must reliably satisfy M08's Business Constraints for every valid Learning Configuration, per M15 and M08.
- **Continuous Evaluation:** Consistent with M44's Continuous Learning, AI Behaviour observability continuously confirms the AI Layer still satisfies its documented Constraints.
- **Controlled Evolution:** Any change to AI capability follows M42's Change Lifecycle and M43's Evolution Assessment, exactly like any other product change — never evolving silently.
- **Quality First:** AI output quality, defined below, is never traded for novelty or speed, mirroring M34's Quality Standards.

---

# AI Capability Lifecycle

1. **Definition:** An AI capability is defined exactly as M21 defines the two AI Interaction Points — its Purpose, Input Concepts, Output Concepts, and Constraints — before it is considered to exist.
2. **Validation:** The defined capability is confirmed, per M34's Quality Gates, to satisfy its AI Constraints, per M21, and AI Interaction Security, per M35, before Introduction.
3. **Introduction:** The capability becomes available to Learners only through the Release Lifecycle already defined in M37 — never introduced outside that governed process.
4. **Operational Use:** The capability operates exactly per M21's AI Orchestration — invoked exclusively by the Session Generation Module, per M31, with its output always confirmed against M08's Business Constraints before being treated as successful.
5. **Continuous Evaluation:** Per M44's AI Behaviour Observability Domain, the capability's real-world output is continuously confirmed against its documented Constraints.
6. **Improvement:** Any refinement to the capability's behavior is a governed change, per M42, classified per M43's Version Classification — most often Adaptive or Evolutionary, since the AI Layer's fundamental Purpose, per M21, rarely changes.
7. **Retirement:** If an AI capability is ever superseded, its retirement follows M43's Documentation Evolution Principles — the historical milestone defining it remains an accurate record, while a new milestone documents its replacement. The AI Layer is never silently altered without this record.

---

# AI Behaviour Principles

- **Consistency:** Restating M21's Configuration Adherence, Level Alignment, Goal Alignment, and Topic Consistency Constraints — the same inputs always produce output honoring the same rules, even as specific generated content varies, per M21's Freshness principle.
- **Instruction Following:** The AI Layer only ever acts on instructions originating from the Session Generation Module's own logic, per M21's Prompt Integrity principle — never on unvalidated, external input.
- **Safety:** AI output must never violate M08's Business Constraints or present content inconsistent with the Learner's declared Level or Goal. "Safety" in Version 1 is scoped exactly to product correctness and appropriateness for a self-declared Level and Goal, since M01–M44 define no separate content-safety policy beyond this scope.
- **Appropriate Responses:** Output content and difficulty must always match the Level Alignment and Goal Alignment Constraints already defined in M21.
- **Graceful Failure:** Restating M21's Failure Handling Principles and M35's Safe Failure Behaviour, invalid AI output never reaches a Learner as a partial or corrupted Session.
- **Explainability Expectations:** Consistent with M12's Transparency principle, a Learner should be able to understand, conceptually, why a Session looks the way it does — built from their Level, Goal, and Topic — without needing a technical explanation of how the AI Layer works internally.
- **User Trust:** Restating M01's Confidence experience goal, consistent and correctly scoped AI behavior over time is what earns the Learner's trust in the product's decisions made on their behalf.

---

# AI Quality Governance

- **Output Quality:** AI output must satisfy M08's Session Composition requirements — all seven parts, appropriate to Level, Goal, and Topic — with quality defined entirely by conformance to already-documented product requirements, not by an independent, AI-specific quality bar.
- **Reliability:** Restating M15 and M21, AI output reliably passes Output Validation for every valid Learning Configuration.
- **Consistency:** Restating the Consistency principle already defined in AI Behaviour Principles above.
- **Relevance:** Generated content must be demonstrably tied to the supplied Topic(s), Level, and Goal, per M08's Personalization Rules — never generic or disconnected from the Learner's Configuration.
- **Accuracy Expectations:** Since Session content is English-learning material, per M08, it must be linguistically sound for its stated Level and Goal — a quality expectation restated from M08's Personalization and Learning Rules, not a new requirement.
- **User Value:** AI Quality Governance ultimately exists to serve M02's Product Success Metrics — perceived relevance, session completion rate — quality is measured by its effect on the Learner, never by an internal AI benchmark disconnected from that outcome.

---

# AI Evaluation Principles

Aligned with M34 and M44:

- **Before Release:** An AI capability passes the same Quality Gates defined in M34 as any other capability, plus specific confirmation of the AI Constraints defined in M21 and the AI Interaction Security defined in M35.
- **After Release:** AI Behaviour observability, per M44, continuously confirms the capability's real-world output remains within its documented Constraints — evaluation does not stop at release, consistent with M44's Continuous Learning.
- Evaluation Findings, per M23, that reveal a Constraint violation are treated exactly like any other defect, per M34's Defect Management Principles.

---

# AI Risk Governance

Aligned with M35 and M42:

- An AI-related risk is any plausible way the AI Layer's output could fail to satisfy M08's Business Constraints or M21's AI Constraints, or could expose more Learner information than M21's AI Input Concepts allow.
- AI risks are prioritized using the same logic already established in M35's Threat Management and M42's Impact Analysis — a risk affecting the Session Generation Module, being foundational per M31, is prioritized accordingly.
- Mitigation of an AI risk must never involve relaxing Output Validation, per M21, or exposing more Learner information to the AI Layer than already defined — a mitigation requiring either is invalid, and signals that the AI capability itself needs to be redefined through M42's Change Lifecycle rather than patched around.

---

# AI Evolution Principles

Aligned with M43:

- Any change to the AI Layer's Purpose, Input Concepts, Output Concepts, or Constraints is classified per M43's Version Classification. Most refinements are Adaptive, serving the existing Purpose more completely. Introducing an entirely new AI Interaction Point beyond the two defined in M21 would be Evolutionary. Changing what information the AI Layer may receive would require the highest scrutiny, mirroring Transformational-level Evolution Assessment, given its direct bearing on the Privacy guarantees defined in M21 and M35.
- Backward Consistency, per M43, applies to AI evolution specifically: a Learner's already-generated Sessions are never retroactively altered by a change to how future Sessions' AI content is generated.
- AI Evolution Assessment always includes AI Risk Governance and AI Quality Governance as required dimensions, in addition to the eight dimensions already listed in M43's Evolution Assessment Principles.

---

# AI Governance Verification

- Confirms every AI capability change was governed per this document's AI Capability Lifecycle and M42's Change Lifecycle — an ungoverned AI change is treated as a governance failure, per M42's Governance Verification.
- Confirms the AI Behaviour Principles and AI Quality Governance continue to hold across the full range of valid Learning Configurations, per M09, not merely a sample.
- Complements M35's Security Verification, confirming the AI Layer receives no more than its permitted inputs, and M44's Observability Governance, confirming AI Behaviour remains measurable.

---

# AI Governance Constraints

1. No AI capability may exist or change outside the AI Capability Lifecycle defined above.
2. No AI capability may receive more Learner information than M21's AI Input Concepts define, regardless of any proposed improvement's intent.
3. No AI output may be treated as a successful Session unless it passes Output Validation, per M21, against M08's Business Constraints.
4. No AI-related risk may be mitigated by relaxing Output Validation or expanding AI input beyond M21's defined concepts.
5. Every AI capability change must remain traceable to a justified need, per M23, and must pass through M42's Change Lifecycle before release, per M37.

---

# AI Governance Glossary

- **AI Governance:** The discipline of managing the AI Layer's behavior, quality, risk, and evolution throughout its lifecycle.
- **AI Capability:** A defined AI Interaction Point, per M21, with its own Purpose, Input Concepts, Output Concepts, and Constraints.
- **AI Capability Lifecycle:** The seven-stage conceptual process — Definition through Retirement — every AI capability follows.
- **Responsible AI:** The principle that the AI Layer only ever performs its explicitly documented Purpose.
- **Graceful Failure:** The principle that invalid AI output never reaches a Learner as a partial or corrupted Session.
- **AI Risk:** A plausible way the AI Layer's output could fail to satisfy its documented Constraints or expose more Learner information than permitted.
- **AI Quality:** The combined property of AI output being correct, reliable, relevant, and valuable to the Learner, defined entirely by conformance to already-documented product requirements.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented an AI Governance Philosophy (Responsible AI, Predictability, Transparency, Human-Centred Design, Reliability, Continuous Evaluation, Controlled Evolution, Quality First) and a seven-stage AI Capability Lifecycle (Definition through Retirement), grounding every stage in M21, M34, M35, M37, M42, and M43.
- Documented AI Behaviour Principles (Consistency, Instruction Following, Safety, Appropriate Responses, Graceful Failure, Explainability Expectations, User Trust) and AI Quality Governance, both defined entirely by conformance to product requirements already documented in M08 and M21.
- Documented AI Evaluation Principles (aligned with M34 and M44), AI Risk Governance (aligned with M35 and M42), AI Evolution Principles (aligned with M43), AI Governance Verification, AI Governance Constraints, and an AI Governance Glossary.

### Files Created
- `docs/milestones/M45-ai-governance-and-model-management-strategy.md`

### Files Modified
- None. M01–M44 were not revisited or altered.

### Pending
- No further action pending within M45. Awaiting next milestone instructions.

### Risks
- "Safety," under AI Behaviour Principles, is explicitly scoped to product correctness and Level/Goal appropriateness only, since no broader content-safety policy exists anywhere in M01–M44. If a future milestone determines a broader safety policy is needed (e.g., addressing harmful or inappropriate generated content beyond difficulty/relevance mismatch), that would require its own explicit milestone rather than being assumed from this document.
- AI Evolution Principles classify a change to the AI Layer's permitted Input Concepts as requiring Transformational-level scrutiny, the highest tier defined in M43. This is a deliberate, conservative choice given the direct privacy implications of expanding what the AI Layer may receive, and should be confirmed as appropriately strict.

### Open Questions
- Should a future milestone define a broader AI content-safety policy beyond product correctness and Level/Goal appropriateness, given that none currently exists in M01–M44?
- None else beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
