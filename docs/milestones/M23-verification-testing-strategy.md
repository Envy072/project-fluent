# M23 — Verification & Testing Strategy

**Status:** Draft
**Owner:** Product / Architecture
**Milestone:** M23
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M22 — Security & Privacy Architecture](./M22-security-privacy-architecture.md)

---

# Overview

The Verification & Testing Strategy defines how Project Fluent's documented behavior — its business rules, architecture, and system behavior — will be conceptually confirmed as correct. It does not select tools, frameworks, or automation approaches; it defines what "verified" means for this product, at what conceptual levels verification occurs, and how every verification activity remains traceable back to an approved milestone. Nothing in this document may be satisfied by testing behavior that was never specified in M01–M22.

---

# Verification Objectives

- Confirm that every journey defined in M05 (First-Time User Flow, Returning User Flow, and their variants) can be completed exactly as documented.
- Confirm that every Business Rule established across M07, M08, and M09 holds true under every condition described in those milestones.
- Confirm that every Functional Area's Preconditions, Postconditions, Success Conditions, and Failure Conditions, as defined in M13, are observed exactly as specified.
- Confirm that every Service Operation's contract, as defined in M18, is honored — that it produces its Postconditions when its Preconditions are met, and its Failure Conditions when they are not.
- Confirm that the Architecture Constraints (M14, M16, M20) and Security Constraints (M22) hold at every point where they apply.
- Confirm that the product upholds the Quality Attributes defined in M15 (Usability, Reliability, Availability, Scalability, Security, Privacy, Accessibility, Observability).

---

# Verification Scope

The following conceptual areas, all already established in prior milestones, require verification:

- **Business Rules** — the Entity Rules (M07), Configuration rules (M09), and Learning Rules (M08) that govern correct product behavior.
- **User Flows** — the First-Time, Returning, Learning Session, Settings Change, Authentication, and Error Recovery flows defined in M05.
- **Configuration** — the behavior of English Level, Learning Goal, and Topic Toggle Preference, per M09.
- **Session Generation** — the behavior of the Session Generation Service and its AI Interaction Points, per M08, M18, and M21.
- **Progress Recording** — the creation and finalization of Progress Records, per M07 and M18.
- **Architecture Constraints** — the layering, dependency, and boundary rules defined in M16, M19, and M20.
- **Security Constraints** — the access, identity, and data protection guarantees defined in M22.
- **AI Constraints** — the Configuration Adherence, Level Alignment, Goal Alignment, Topic Consistency, and Structural Determinism rules defined in M21.

No area outside this list is in scope for verification, since no area outside this list has been defined by M01–M22.

---

# Verification Levels

Verification occurs at four conceptual levels, each answering a different question about the product:

## 1. Product Verification
- **Question Answered:** Does the product, experienced end-to-end as a Learner would experience it, fulfill M01's Mission and M02's Requirements?
- **Focus:** Complete journeys (per M05), from Landing through Progress Saved, evaluated as a Learner would encounter them.

## 2. Architecture Verification
- **Question Answered:** Does the system's logical structure honor the layers, boundaries, and dependency rules already defined?
- **Focus:** The Presentation, Application, Domain, and Persistence Layers (M16, M19, M20), and their permitted and forbidden dependencies.

## 3. Business Rule Verification
- **Question Answered:** Does every Entity Rule, Business Rule, and Functional Area rule hold true under every documented condition?
- **Focus:** The rules defined in M07, M08, M09, and M13 — including both their Success Conditions and their Failure Conditions.

## 4. Interaction Verification
- **Question Answered:** Does every defined User Action produce its defined System Response?
- **Focus:** The User Actions and System Responses catalogued in M13, confirmed as observable, correct behavior from a single interaction.

## 5. Security & Privacy Verification
- **Question Answered:** Do the access, identity, and data protection guarantees defined in M22 hold under every documented condition?
- **Focus:** That no Learner's information is ever reachable by another Learner, and that Authentication State gating cannot be circumvented.

---

# Verification Principles

- Every verification activity must trace back to a specific rule, condition, or requirement already documented in M01–M22 — verification never evaluates behavior that was never specified.
- Verification must cover both Success Conditions and Failure Conditions for every Functional Area (M13) and Service Operation (M18) — confirming only the success path is insufficient.
- Verification must remain independent of any specific technology, framework, or implementation choice — it evaluates whether documented behavior holds, not how it was built.
- Verification must never itself introduce new product behavior; if a verification activity reveals a gap, the gap is resolved by revisiting the appropriate milestone through the established process, not by inventing new scope during verification.
- Verification applies equally to every layer defined in M16, M19, and M20 — no layer is exempt from having its documented responsibilities confirmed.

---

# Acceptance Principles

- A capability is accepted only when its documented Preconditions, Postconditions, and Success Conditions (per M13 and M18) are demonstrably satisfied.
- A capability fails acceptance if any of its documented Failure Conditions do not result in the documented, safe outcome (e.g., the Learner remaining at the Dashboard with Configuration intact, per M13's Error Recovery Flows).
- Acceptance is never partial — per M08's and M13's Business Constraints, a Session either is complete (all seven Session Composition parts present) or it does not count as successfully generated; the same all-or-nothing standard applies to acceptance of any capability with a defined complete outcome.
- Acceptance criteria for any given capability are exactly the Acceptance Criteria already defined for it in M03, and the Success/Failure Conditions defined in M13 and M18 — no additional or different criteria are introduced here.

---

# Traceability

Every capability in Version 1 must remain traceable through the following chain, so that verification always has a documented origin to confirm against:

1. **M02 — Product Requirements:** The original Functional Requirement (e.g., FR-SESS-06).
2. **M06 — Feature Breakdown:** The Feature that fulfills it (e.g., F-09 Session Generation), per the MVP Coverage Matrix.
3. **M07/M08/M09 — Domain, Logic, Configuration:** The Business Rules and Entity Rules that govern it.
4. **M13 — Functional Specification:** The precise Preconditions, Postconditions, Success and Failure Conditions.
5. **M18 — Service Contracts:** The Service Operation that implements the behavior (e.g., GenerateSession).
6. **M23 — Verification & Testing Strategy:** The verification activity that confirms the entire chain holds true in practice.

No verification activity is valid unless it can be traced through this chain back to an original M02 requirement, or to an architectural rule established in M14, M16, M20, or M22. A verification activity that cannot be traced this way indicates either an undocumented requirement (which must be resolved by revisiting M02 or another appropriate milestone) or an invalid test of unspecified behavior.

---

# Verification Constraints

The following must always remain true:

1. No verification activity may treat behavior as correct or incorrect unless that behavior is explicitly documented somewhere in M01–M22.
2. Every Functional Area (M13) and every Service Operation (M18) must have verification coverage for both its Success Conditions and its Failure Conditions.
3. Verification of Architecture Constraints (M16, M20) must confirm that forbidden dependencies never occur, not merely that permitted ones work.
4. Verification of Security Constraints (M22) must confirm that one Learner's information is never reachable through another Learner's request.
5. No verification activity may modify, reinterpret, or expand any immutable milestone (M01–M22) — a discrepancy found during verification is a finding to be resolved through the established milestone process, never a silent correction.

---

# Verification Glossary

- **Verification:** The conceptual confirmation that documented product behavior holds true in practice.
- **Verification Level:** One of the five conceptual perspectives from which verification occurs — Product, Architecture, Business Rule, Interaction, or Security & Privacy.
- **Verification Scope:** The set of areas, already established in prior milestones, that verification is responsible for confirming.
- **Acceptance:** The determination that a capability's documented Preconditions, Postconditions, and Success Conditions are fully satisfied.
- **Traceability:** The unbroken chain connecting a specific product requirement (M02) through its architectural and functional definition (M06–M18) to its verification (M23).
- **Finding:** A discrepancy discovered during verification between documented behavior and observed behavior, to be resolved through the established milestone process.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined Verification Objectives and Verification Scope, both drawn exclusively from areas already established across M05–M22.
- Defined five conceptual Verification Levels (Product, Architecture, Business Rule, Interaction, Security & Privacy), with no reference to unit or integration testing.
- Documented Verification Principles, Acceptance Principles, and a Traceability chain connecting M02's requirements through M06, M07–M09, M13, M18, and back to M23's verification.
- Documented Verification Constraints and a Verification Glossary.

### Files Created
- `docs/milestones/M23-verification-testing-strategy.md`

### Files Modified
- None. M01–M22 were not revisited or altered.

### Pending
- No further action pending within M23. Awaiting next milestone instructions.

### Risks
- This document adds a fifth Verification Level (Security & Privacy Verification) beyond the four examples listed in the milestone's instructions (Product, Architecture, Business Rule, Interaction). This was added because M22's Security Constraints were explicitly named as in-scope in the milestone's own Verification Scope example list, and omitting a corresponding verification level would have left that scope area without a verification perspective. This should be confirmed as an acceptable, non-inventive addition rather than new scope.
- The Traceability chain introduces a specific six-step sequence (M02 → M06 → M07/M08/M09 → M13 → M18 → M23) as the standard path every capability must follow. This is a synthesis of relationships already implied across those milestones, not a new rule, but it is the first time this exact chain has been stated explicitly and should be validated as accurate.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
