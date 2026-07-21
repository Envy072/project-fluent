# M39 — Production Support and Service Management Specification

**Status:** Draft
**Owner:** Architecture / Engineering / Operations
**Milestone:** M39
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M38 — Production Deployment Strategy](./M38-production-deployment-strategy.md)

---

# Overview

The Production Support and Service Management Specification defines how the live production service is supported once deployed, extending M36's Operational Incident Principles and M37's and M38's Recovery Principles into a complete support discipline. It intentionally resolves the conceptual gap left open by M35 and M36 regarding a future support capability — by defining what that capability does and how it behaves, without ever defining who performs it, what permissions it holds, or how it is organizationally structured. Production support in Version 1 is described entirely as a set of principles and a lifecycle, not a team.

---

# Service Management Philosophy

- **Service Continuity:** The product remains usable by Learners without interruption to already-completed Configuration or Progress, even while an issue affecting another part of the system is being addressed, per M15's Availability expectations and M36's Graceful Degradation.
- **User-Centric Operations:** Every support activity is ultimately judged by its effect on the Learner's experience, per M11, not by the completion of internal process alone.
- **Rapid Detection:** Relies on M36's Monitoring and Observability Principles — an issue is detected as soon as it is knowable, not only after a Learner is affected badly enough to notice.
- **Controlled Resolution:** Every resolution respects the Fail Securely principle defined in M35 and the Data Integrity Rules defined in M17 — a resolution is never rushed at the cost of correctness.
- **Continuous Learning:** Every supported issue becomes a Finding, per M23, that strengthens future prevention through M33's Development Standards and M34's Testing Strategy — never treated as an isolated, disconnected event.
- **Operational Excellence:** Support activity itself is held to the same quality standards defined in M34 as the product it supports.

---

# Support Lifecycle

1. **Issue Detection:** An issue is detected through M36's Monitoring and Observability Principles, or surfaces through the product's own documented Error Handling, per M13 and M26.
2. **Initial Assessment:** Confirms whether the detected issue constitutes a genuine Finding, per M23 — a real divergence from documented behavior — as opposed to a defined Failure Condition working exactly as intended.
3. **Impact Assessment:** Determines which Learners, Functional Areas (M13), and Implementation Modules (M31) are affected, and assigns severity according to M31's Dependency Map, consistent with M34's, M37's, and M38's existing prioritization logic.
4. **Investigation:** Traces the issue through M23's Traceability chain to determine whether it reflects an implementation gap or a specification gap.
5. **Resolution:** An implementation gap is corrected consistent with M33's Development Standards and the relevant Service Contract in M18; a specification gap is routed to a new, explicit milestone via M24's Change Management Principles — never silently patched around.
6. **Validation:** The resolution is confirmed against the relevant Verification Level, per M23 and M34, before being considered effective.
7. **Closure:** The issue is closed only once Validation confirms the documented Success Condition holds again; Closure includes updating the relevant Traceability record if the issue revealed something not previously understood.
8. **Continuous Improvement:** The resolved issue feeds the Operational Improvement Principles below and, where it reveals a preventable pattern, prompts a review of M33's Development Standards or M34's Testing Strategy.

---

# Service Continuity Principles

- Consistent with M36's Graceful Degradation, Learners retain access to unaffected capability while an issue affecting one Functional Area is being addressed.
- Configuration and Progress data integrity, per M17, is preserved throughout any support activity, consistent with M35's Fail Securely principle and M38's Recovery Principles.
- Continuity is prioritized over speed of resolution — a correct, slightly slower resolution is always preferred over a fast one that risks correctness, echoing M34's Quality Standards.

---

# User Impact Management

- Impact is assessed by which Learners are affected and which stage of the Core User Journey, per M02, they are affected at — an issue blocking Session Generation affects every Learner attempting to begin practice, while an issue confined to Progress reflection affects a narrower, less consequential experience.
- Minimizing impact means preserving a Learner's ability to complete every part of their journey unaffected by the issue, consistent with M36's Graceful Degradation.
- Impact is communicated to affected Learners in terms they can understand and act on, per M11's Error Experience Principles and M35's Communication principle — never in technical terms disconnected from what the Learner actually experiences.
- No Learner's data or access is used more broadly than necessary to assess impact — the Data Minimization principles defined in M22 and M35 apply equally during impact assessment itself.

---

# Operational Communication Principles

- Communication during an operational event is calm, clear, and actionable, consistent with M12's Design Philosophy and M11's Error Experience Principles, extended from in-product error messaging to support communication generally.
- Affected Learners are informed of what is affected and, where known, what they can expect next — never left in an ambiguous state, mirroring M13's Error Recovery Flows.
- Internal understanding of an issue always reflects the same facts as what is communicated externally — there is never a divergence between what is known internally and what is conveyed to Learners.
- No specific communication platform, channel, or tool is defined in this document.

---

# Knowledge Management Principles

- Every resolved issue's Investigation and Resolution, per the Support Lifecycle above, is captured in a form that remains traceable through M23's chain, so future investigations can find prior, related Findings.
- Captured knowledge feeds directly into M33's Development Standards and M34's Testing Strategy whenever a pattern indicates a preventable class of issue.
- Knowledge is never siloed to whoever happened to address a given issue — it is captured as part of the documented, traceable record, consistent with M31's Maintainability Principles applied to operational knowledge.

---

# Operational Improvement Principles

- Consistent with M36's Continuous Improvement principle, every issue's resolution strengthens the system's ability to prevent, detect, or recover from the next one.
- A recurring issue affecting the same Implementation Module, per M31, prompts a review of that module's Boundaries and Business Rules — not merely repeated individual fixes to the same symptom.
- The Support Lifecycle itself improves over time through the same Change Management Principles defined in M24 as any other documented process — never changed silently.

---

# Service Governance

- Every support activity is evaluated against the entire body of M01–M38, mirroring the governance principles already established in M24, M37, and M38.
- No support activity may resolve an issue by violating an Architecture Constraint (M16, M20), a Security Constraint (M22, M35), or a Data Integrity Rule (M17).
- No support activity introduces new product scope — a support-driven change that would add capability beyond M01–M38 requires a new, explicit milestone, never a support action alone.
- Service Governance is periodically reviewed against M01's Mission, consistent with M37's Release Governance and M38's Deployment Governance.

---

# Service Constraints

1. No support activity may access more Learner data than necessary to assess and resolve a given issue, per M22 and M35.
2. No issue may be closed without passing Validation against its relevant Verification Level, per M23 and M34.
3. No resolution may violate an Architecture Constraint, Security Constraint, or Data Integrity Rule.
4. No support activity may introduce new product scope without a new, explicit milestone.
5. This document defines no organizational role, permission model, or structure, consistent with M35 and M36, and fulfilling this milestone's specific instruction.

---

# Production Support Glossary

- **Production Support:** The set of principles and lifecycle by which issues affecting the live product are detected, assessed, investigated, resolved, and reviewed.
- **Support Lifecycle:** The eight-step conceptual process — Detection, Initial Assessment, Impact Assessment, Investigation, Resolution, Validation, Closure, Continuous Improvement.
- **Service Continuity:** The principle that unaffected capability remains usable by Learners throughout the handling of an issue.
- **User Impact:** The effect an issue has on Learners, assessed by which stage of the Core User Journey and which Learners are affected.
- **Operational Communication:** The calm, clear, and actionable exchange of information with affected Learners during an operational event.
- **Knowledge Management:** The discipline of capturing resolved issues in a traceable, reusable form rather than as isolated, siloed fixes.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented a Service Management Philosophy (Service Continuity, User-Centric Operations, Rapid Detection, Controlled Resolution, Continuous Learning, Operational Excellence) and an eight-step Support Lifecycle (Detection through Continuous Improvement).
- Documented Service Continuity Principles, User Impact Management, Operational Communication Principles, Knowledge Management Principles, and Operational Improvement Principles — all conceptual, with no roles, permissions, or tools introduced.
- Documented Service Governance, Service Constraints, and a Production Support Glossary, and explicitly resolved the conceptual gap flagged in M35 and M36 regarding a future support function, without introducing any organizational structure.

### Files Created
- `docs/milestones/M39-production-support-and-service-management.md`

### Files Modified
- None. M01–M38 were not revisited or altered.

### Pending
- No further action pending within M39. Awaiting next milestone instructions.

### Risks
- This document deliberately resolves the "future support function" gap from M35 and M36 by defining the function's principles and lifecycle only — it does not, and per this milestone's explicit instruction should not, define who performs these activities, what access they hold, or how they are organized. A future milestone would still be needed if concrete organizational or permission decisions are ever required.
- The Support Lifecycle's steps closely mirror M34's Defect Management Principles and M36's Operational Incident Principles by design, since production support is the natural continuation of both — this is intentional consolidation, not duplication of distinct concepts.

### Open Questions
- None beyond those already raised in earlier milestones. The specific open questions from M35 and M36 regarding a future support function are now addressed at the principle level by this milestone; whether concrete organizational structure is ever needed remains a distinct, future decision outside this document's scope.

Waiting for the next milestone.
