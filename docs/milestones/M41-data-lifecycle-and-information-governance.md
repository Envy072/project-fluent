# M41 — Data Lifecycle and Information Governance Specification

**Status:** Draft
**Owner:** Architecture / Engineering / Data Governance
**Milestone:** M41
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M40 — Business Continuity and Disaster Recovery Strategy](./M40-business-continuity-and-disaster-recovery-strategy.md)

---

# Overview

The Data Lifecycle and Information Governance Specification defines how information is governed across its entire lifecycle — beyond the technical retention already described in M17. It directly addresses the governance gap flagged as an Open Question in M35: that no retention or disposal policy currently exists anywhere in M01–M40. This document closes that gap at the level of *principle* — establishing how any future retention, archival, or disposal decision would be made — without setting a specific duration, trigger, or regulation. Concrete retention periods remain a distinct future decision, requiring their own explicit milestone.

---

# Information Governance Philosophy

- **Data as a Product Asset:** Learner information is valuable specifically because it allows the product to fulfill M01's Mission — matching each Learner with the right Session — and is never treated as an incidental byproduct of operation.
- **Accuracy:** Information must always reflect the Learner's true current state, per M09's Configuration Lifecycle, or true historical fact, per M07's Progress Record immutability.
- **Integrity:** M17's Data Integrity Rules are the non-negotiable baseline every governance principle in this document builds upon.
- **Consistency:** The same information must never contradict itself across the Information Domains defined in M10.
- **Traceability:** Every piece of information remains traceable through M23's chain to the documented requirement that justified collecting it.
- **Lifecycle Ownership:** Every piece of information has exactly one owning entity, per M17's Data Ownership table, responsible for its state throughout its life.
- **Minimal Necessary Retention:** Information is retained only as long as it serves a documented purpose, per M09, M15, and M22 — though the specific duration required to satisfy this principle is a future decision, per this document's Constraints.
- **Responsible Disposal:** When information is eventually no longer needed, its disposal must never violate a Data Integrity Rule for any related, still-retained information.

---

# Information Classification

Consistent with M07, M17, M22, and M35, and introducing no new business data, information is classified into exactly four tiers, mapping directly to M17's nine Logical Data Objects:

1. **Identity Information:** Learner Identity, Authentication State — the most sensitive tier, per M22's Identity Responsibilities.
2. **Configuration Information:** English Level, Learning Goal, Topic Toggle Preference — personal information reflecting the Learner's proficiency and goals, per M35.
3. **Session Information:** Session, Topic, Session Composition — non-personal, AI-generated content, owned by the Learner only through the Session it belongs to.
4. **Progress Information:** Progress Record — personal, historical information reflecting the Learner's learning activity.

No information exists in Version 1 outside these four tiers.

---

# Data Lifecycle

Extending M17's per-object lifecycle into a governance-level view, information moves through the following conceptual stages:

- **Creation:** Each Logical Data Object is created per its documented trigger, exactly as defined in M17 — Account Creation, a Configuration change, Session Generation, and so on.
- **Validation:** Information is confirmed against M09's Validation Rules and M17's Data Integrity Rules at the moment of creation and at every update — invalid information never enters the lifecycle.
- **Active Use:** Information is actively used to fulfill its documented purpose — Session Generation personalization, Dashboard reflection, per M13.
- **Update:** Information is updated only through the Configuration Lifecycle and Business Rules already defined in M09, never bypassing them.
- **Protection:** Information is protected throughout its life per M22's and M35's Data Protection Strategy — access scoped exclusively to its owning Learner, minimized to what each module's Purpose requires.
- **Retention:** Information is retained for as long as it continues to serve its documented purpose. Per M17, this is currently indefinite by default, since no retention duration has yet been established; any future retention duration must be set through a new, explicit milestone, evaluated against Minimal Necessary Retention.
- **Archival:** A conceptual stage in which information is no longer in Active Use but remains retained for a documented purpose — for example, a Completed Session's data remaining part of a Learner's history after its immediate relevance to new Session Generation has passed. Version 1 does not currently distinguish Archival from ordinary Retention, since M17 defines no such distinct state; this document establishes the concept so that a future milestone could introduce it without having to define governance from first principles.
- **Disposal:** The conceptual, eventual removal of information once it no longer serves any documented purpose and Minimal Necessary Retention no longer justifies keeping it. Version 1 currently defines no trigger for Disposal, consistent with M17's "Retired: Not applicable" — Disposal only ever occurs through a future, explicit milestone, never silently or by default.

---

# Data Quality Principles

- **Accuracy:** Information reflects true current or historical fact, per M09's and M07's rules.
- **Completeness:** Every required piece of information exists before dependent behavior proceeds — for example, Session Generation requires a Configured English Level and Learning Goal, per M18.
- **Consistency:** No contradiction exists across related information, per M17's Relationships.
- **Integrity:** M17's Data Integrity Rules remain the quality baseline for every piece of information.
- **Recoverability:** Information can always be restored to its last known-correct state, per M38's and M40's Recovery and Data Continuity Principles.
- **Auditability:** Every change to information remains traceable through M23's chain, supporting the Investigation step of M39's Support Lifecycle.

---

# Retention and Disposal Principles

- **Retention Decisions:** Any future retention duration is set by evaluating the information against Minimal Necessary Retention and the documented purpose it serves — never set arbitrarily, and never shorter than needed to fulfill an already-documented capability (for example, Progress Records must remain retained long enough to satisfy FR-PROG-02's requirement to reflect progress on return).
- **Archival Decisions:** Information may move to Archival, if a future milestone introduces that distinction, only once it is no longer in Active Use but is still required for a documented purpose — never disposed of prematurely.
- **Secure Disposal:** Any future Disposal action must be conducted without violating a Data Integrity Rule for related, still-retained information, and must be irreversible once complete.
- **User Expectations:** Learners must never be surprised by how their information is retained or eventually disposed of — consistent with M35's Transparency and Consent Awareness principles, any future retention or disposal policy must be communicated to Learners, never applied silently.
- **Business Continuity Alignment:** Retention and disposal decisions must never conflict with the Continuity Objectives defined in M40 — information required for Business Continuity is never disposed of prematurely.

---

# Information Access Principles

- Access to information at every lifecycle stage remains scoped exclusively to its owning Learner, per M07's ownership rules, with no exception for information in an Archival or pending-Disposal state.
- Access for governance purposes — such as confirming Data Quality — must follow the same Data Minimization principles as any other access, per M22 and M35; governance activity is never a backdoor around ownership-scoped access.
- No new access pathway is introduced by this document; governance activity operates entirely within the access boundaries already established in M18, M22, and M35.

---

# Governance Verification

Aligned with M34 and M35:

- Information Governance readiness is verified per M34's Quality Gates, confirming the Data Quality Principles above hold across every Information Domain defined in M10.
- Governance Verification specifically confirms that no information exists outside the Information Classification defined above, and that every piece of information remains traceable to a documented purpose, per M23.
- Security & Privacy Verification, per M35, and Governance Verification are complementary: Security & Privacy Verification confirms information is protected from unauthorized access; Governance Verification confirms information is accurate, complete, and correctly lifecycle-managed.

---

# Continuous Information Governance Improvement

- Every Finding related to data quality, per M23, feeds back into refining the Data Quality Principles and Retention and Disposal Principles over time.
- A recurring information governance issue prompts review of M17's Logical Data Model or M09's Configuration Model, not merely an isolated, one-time fix.
- Governance practice changes are documented explicitly through M24's Change Management Principles — never applied silently.

---

# Information Governance Constraints

1. No new business data is introduced by this document — Information Classification maps exactly to the nine Logical Data Objects already defined in M17.
2. No retention duration, archival trigger, or disposal trigger is defined by this document — each remains a future decision requiring its own explicit milestone.
3. No governance activity may access more information than necessary, per M22's and M35's Data Minimization principles.
4. No Disposal action may violate a Data Integrity Rule, per M17, or a Business Continuity Objective, per M40.
5. Every governance decision must remain traceable to a documented purpose, per M23.

---

# Information Governance Glossary

- **Information Governance:** The discipline of managing information's accuracy, integrity, consistency, and lifecycle across the product.
- **Data as a Product Asset:** The principle that Learner information exists to serve the product's Mission, not as an incidental byproduct.
- **Lifecycle Ownership:** The principle that every piece of information has exactly one owning entity responsible for its state throughout its life.
- **Minimal Necessary Retention:** The principle that information is retained only as long as it serves a documented purpose.
- **Responsible Disposal:** The principle that eventual removal of information must never compromise related, still-retained information's integrity.
- **Archival:** A conceptual lifecycle stage in which information is no longer in Active Use but remains retained for a documented purpose.
- **Disposal:** The conceptual, eventual, irreversible removal of information once it no longer serves any documented purpose.
- **Data Quality:** The combined property of information being accurate, complete, consistent, integral, recoverable, and auditable.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented an Information Governance Philosophy (Data as a Product Asset, Accuracy, Integrity, Consistency, Traceability, Lifecycle Ownership, Minimal Necessary Retention, Responsible Disposal) and a four-tier Information Classification mapping exactly to M17's nine Logical Data Objects, introducing no new business data.
- Documented an eight-stage Data Lifecycle (Creation, Validation, Active Use, Update, Protection, Retention, Archival, Disposal), extending M17's existing per-object lifecycle into a governance-level view.
- Documented Data Quality Principles, Retention and Disposal Principles (with no durations or regulations introduced), Information Access Principles, Governance Verification (aligned with M34 and M35), Continuous Information Governance Improvement, Information Governance Constraints, and a Glossary.
- Directly addressed the Open Question raised in M35 regarding data retention and deletion behavior, at the level of governing principle rather than concrete policy.

### Files Created
- `docs/milestones/M41-data-lifecycle-and-information-governance.md`

### Files Modified
- None. M01–M40 were not revisited or altered.

### Pending
- No further action pending within M41. Awaiting next milestone instructions.

### Risks
- This document introduces "Archival" and "Disposal" as new conceptual lifecycle stages beyond what M17 documents (which only defines Created, Updated, Read, and a universally "Not applicable" Retired state). Consistent with this milestone's explicit rules, no duration, trigger, or regulation is attached to either — they exist here only as governance concepts a future milestone could activate. This should be confirmed as the intended way to close the M35 gap: establishing the framework now, deferring the concrete policy decision.
- The four-tier Information Classification is a new grouping introduced at this milestone, but it maps one-to-one and without remainder onto M17's nine Logical Data Objects and M22's/M35's existing sensitivity tiers — no new category of information was invented.

### Open Questions
- When a future milestone is ready to define concrete retention durations, archival triggers, or disposal triggers, it should evaluate them against the Retention and Disposal Principles established here — this document does not resolve what those concrete values should be, only how they should eventually be decided.
- None else beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
