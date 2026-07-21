# M34 — Testing and Quality Strategy

**Status:** Draft
**Owner:** Architecture / Engineering / QA
**Milestone:** M34
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M33 — Development Standards Specification](./M33-development-standards-specification.md)

---

# Overview

The Testing and Quality Strategy defines how quality is achieved, measured, verified, and maintained across Project Fluent's entire lifecycle. It extends M23's conceptual Verification & Testing Strategy into a complete engineering quality discipline, organized around the Implementation Modules defined in M31 and the Engineering Standards defined in M32 and M33. It names no testing tool, framework, or automation product — it defines the philosophy, hierarchy, and gates that any future testing implementation must satisfy.

---

# Quality Philosophy

Consistent with M15 and M17:

- Quality means the product reliably behaves exactly as documented in M01–M33 — nothing more, nothing less. A capability that does more than documented is as much a quality concern as one that does less.
- A defect is any observed divergence between documented behavior and actual behavior — a Finding, per M23 — not a subjective judgment about what the product "should" do.
- Prevention is preferred over detection: the Engineering Principles and Development Standards defined in M33 exist to reduce the likelihood of defects at their source, not merely to catch them later.
- Quality is measured against Traceability, per M23 — a capability that cannot be traced back to an M02 requirement is not a quality gap to fix, but a scope question to resolve through the milestone process.
- Every Logical Data Object's Data Integrity Rules, per M17, are treated as non-negotiable quality baselines — no verification activity may accept a violation of them as acceptable.

---

# Testing Pyramid

Verification occurs at six conceptual levels, of increasing scope, each mapping to the Verification Levels already defined in M23:

1. **Unit Verification:** Confirms a single Implementation Module's (M31) internal logic satisfies its own documented rules and contracts in isolation from its dependencies. Primarily serves M23's Business Rule Verification.
2. **Module Verification:** Confirms a single Implementation Module fulfills its complete, documented Purpose, Responsibilities, and Boundaries as a whole, including its interaction with the Persistence Module where applicable. Primarily serves M23's Business Rule Verification.
3. **Integration Verification:** Confirms two or more Implementation Modules coordinate correctly according to M31's Dependency Principles and M18's Service Relationships (e.g., the Session Generation Module correctly invoking the Configuration Module and the AI Integration Module). Primarily serves M23's Architecture Verification.
4. **System Verification:** Confirms the complete backend and frontend system upholds the Functional Areas (M13), Architecture Constraints (M16, M20), and Security Constraints (M22) end-to-end. Primarily serves M23's Architecture Verification and Security & Privacy Verification.
5. **End-to-End Verification:** Confirms every User Flow defined in M05 can be carried out exactly as documented, across every layer, from Landing through Progress Saved. Primarily serves M23's Interaction Verification.
6. **User Acceptance Verification:** Confirms the product fulfills M01's Mission and M02's Requirements from the Learner's perspective, using the Acceptance Criteria already defined in M03. Primarily serves M23's Product Verification.

No level in this pyramid substitutes for another — a capability is only considered verified once it has passed every level relevant to it.

---

# Quality Gates

## Gate 1 — Unit & Module Complete
- **Entry Criteria:** The relevant Implementation Module (per M31) exists and is ready for verification.
- **Exit Criteria:** Unit Verification and Module Verification both confirm the module satisfies its documented Purpose, Responsibilities, and Boundaries with no unresolved Finding.
- **Approval Expectations:** Confirmed against the specific Service Operation contracts (M18) the module realizes.

## Gate 2 — Integration Complete
- **Entry Criteria:** Gate 1 is satisfied for every Implementation Module involved in the integration being verified.
- **Exit Criteria:** Integration Verification confirms the involved modules coordinate exactly as described in M18's Service Relationships and M31's Dependency Principles, with no unresolved Finding.
- **Approval Expectations:** Confirmed against M14's and M20's Information Flow and Service Coordination descriptions.

## Gate 3 — System Complete
- **Entry Criteria:** Gate 2 is satisfied for every integration required by a given Functional Area (M13).
- **Exit Criteria:** System Verification confirms the Functional Area's full behavior, Architecture Constraints, and Security Constraints hold, with no unresolved Finding.
- **Approval Expectations:** Confirmed against M13's Preconditions, Postconditions, Success Conditions, and Failure Conditions.

## Gate 4 — End-to-End & Acceptance Complete
- **Entry Criteria:** Gate 3 is satisfied for every Functional Area involved in a given User Flow (M05).
- **Exit Criteria:** End-to-End Verification confirms the User Flow completes exactly as documented; User Acceptance Verification confirms the outcome satisfies M03's Acceptance Criteria and M01's Mission.
- **Approval Expectations:** Confirmed against the Acceptance Principles already defined in M23.

No gate may be entered before the prior gate's Exit Criteria are fully satisfied.

---

# Functional Verification Strategy

- Every Service Operation defined in M18 is verified at Unit and Module level against its own Preconditions, Postconditions, and Failure Conditions.
- Every Functional Area defined in M13 is verified at Integration and System level against its documented Business Rules and Failure Conditions.
- Every User Action and System Response catalogued in M13 is verified at End-to-End level, confirming the observable behavior a Learner would encounter matches what is documented.
- Every capability's functional verification remains traceable through M23's chain back to its originating M02 requirement — no functional verification activity tests behavior that chain cannot resolve.

---

# Non-Functional Verification Strategy

Each Quality Attribute defined in M15 is verified conceptually as follows:

- **Performance:** Verified by confirming that Session Generation and every other Learner-facing action remain responsive, consistent with M15's Performance expectations; no numeric target is defined here, consistent with M15.
- **Reliability:** Verified by confirming Session Generation always produces a complete Session (per M08) and that Learner data is never lost across repeated, normal use.
- **Availability:** Verified by confirming authenticated access remains uninterrupted across normal use, and that temporary Session Generation unavailability never affects the integrity of Configuration or Progress, per M13's Error Recovery Flows.
- **Security:** Verified per M22's Security & Privacy Verification — confirming no Learner's information is ever reachable by another Learner, and that Authentication State gating cannot be circumvented.
- **Scalability:** Verified by confirming that a growing number of Learners never alters any individual Learner's documented experience, per M15.
- **Accessibility:** Verified against M11's and M15's Accessibility Principles — confirming every core journey remains completable via assistive technology.
- **Observability:** Verified by confirming every business outcome listed in M15's Observability Expectations remains determinable.
- **Maintainability:** Verified by confirming Traceability (M23) holds for every module and that the Development Standards defined in M33 are upheld throughout the implementation.

---

# Regression Strategy

- Any new capability introduced through M24's Execution Phases, or any extension introduced under M31's Extension Principles, must re-verify that every previously passed Success Condition and Constraint still holds for the modules it depends on, per M31's Dependency Map.
- Regression verification is scoped to every module downstream of a change, per the Dependency Map — a change to a foundational module (e.g., Identity & Access) requires re-verification of every module that depends on it.
- A Finding introduced by a new change is never accepted as a permanent "known issue" without going through the Defect Management Principles below.
- Regression verification is expected to run consistently and repeatably alongside every change, so that quality is maintained continuously rather than only checked periodically.

---

# Defect Management Principles

- **Classification:** A defect is any observed divergence from a documented Success Condition or Postcondition — a Finding, per M23 — classified by the Verification Level at which it was discovered and the Implementation Module or Functional Area it affects.
- **Prioritization:** Defects are prioritized by how foundational the affected module is within M31's Dependency Map — a defect in the Identity & Access Module outranks a defect confined to the Presentation Module alone, mirroring M24's Risk Management Principles.
- **Investigation:** Every defect is investigated by tracing it through M23's Traceability chain to determine whether it reflects an implementation gap (the documented behavior was not correctly realized) or a specification gap (the documented behavior itself needs revisiting).
- **Verification:** A defect is only considered resolved once the relevant Verification Level's Success Condition is re-confirmed, per M23's Acceptance Principles — not merely once a fix has been made.
- **Resolution:** A defect stemming from a specification gap is never resolved by silently changing documented behavior; it requires a new, explicit milestone, per M24's Change Management Principles.

---

# Release Readiness Principles

Extending M24's Readiness Assessment to the quality domain, Version 1 is release-ready when:

- Every Service Operation (M18) and Functional Area (M13) has passed Gate 1 through Gate 3.
- Every User Flow (M05) has passed Gate 4, including User Acceptance Verification.
- Every Quality Attribute defined in M15 has passed its corresponding Non-Functional Verification.
- No unresolved defect exists that affects a foundational module, per M31's Dependency Map.
- Security & Privacy Verification (M22) confirms no Learner's information is reachable by another Learner under any tested condition.

---

# Continuous Quality Principles

- Quality is maintained throughout the product's lifecycle by re-running the relevant portions of the Testing Pyramid on every change, per the Regression Strategy above.
- The Development Standards defined in M33 are enforced continuously during implementation, not only checked at release, reducing the number of defects that reach later Verification Levels.
- Every Finding, once resolved, is treated as an opportunity to strengthen Traceability (M23) and, where relevant, the Development Standards (M33) that could have prevented it — not merely closed and forgotten.
- Continuous quality is a shared responsibility across every Implementation Module owner, per M31 — no single, separate "quality phase" absolves any module of upholding its own documented behavior.

---

# Testing Constraints

1. No release may proceed without every Quality Gate's Exit Criteria fully satisfied.
2. No verification activity may test behavior that is not documented somewhere in M01–M33, per M23's Verification Principles.
3. No defect may be resolved by silently altering documented behavior; a genuine specification gap requires a new milestone.
4. Every Non-Functional Verification activity must map to a Quality Attribute already defined in M15 — no new, undocumented quality dimension may be introduced.
5. No testing activity may be skipped or abbreviated for a foundational module (Identity & Access, Configuration) given its position in M31's Dependency Map.

---

# Testing and Quality Glossary

- **Testing Pyramid:** The six-level conceptual hierarchy of verification, from Unit Verification through User Acceptance Verification.
- **Quality Gate:** A defined checkpoint with Entry Criteria, Exit Criteria, and Approval Expectations that implementation must satisfy before proceeding.
- **Defect / Finding:** An observed divergence between documented and actual behavior, per M23.
- **Regression:** The re-verification of previously passed behavior following a new change, scoped by M31's Dependency Map.
- **Release Readiness:** The state in which every Quality Gate, Functional Area, User Flow, and Quality Attribute has passed its required verification with no unresolved foundational defect.
- **Continuous Quality:** The ongoing, shared discipline of maintaining documented behavior throughout the product's lifecycle, rather than verifying it only once.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented Quality Philosophy consistent with M15 and M17, and a six-level Testing Pyramid (Unit, Module, Integration, System, End-to-End, User Acceptance Verification) mapped explicitly to M23's five Verification Levels.
- Documented four Quality Gates, each with Entry Criteria, Exit Criteria, and Approval Expectations, forming a strict progression through the Testing Pyramid.
- Documented Functional Verification Strategy, Non-Functional Verification Strategy (mapped to every M15 Quality Attribute), Regression Strategy, Defect Management Principles, Release Readiness Principles, Continuous Quality Principles, Testing Constraints, and a Testing and Quality Glossary.

### Files Created
- `docs/milestones/M34-testing-and-quality-strategy.md`

### Files Modified
- None. M01–M33 were not revisited or altered.

### Pending
- No further action pending within M34. Awaiting next milestone instructions.

### Risks
- The six-level Testing Pyramid and four Quality Gates are new structures introduced at this milestone, though every level and gate is explicitly mapped back to M23's existing Verification Levels and M31's module structure. This is the first document to impose a specific gate sequence on verification activity, and should be confirmed as the intended engineering process before any future implementation milestone builds on it.
- Defect Prioritization relies on M31's Dependency Map to rank foundational modules above peripheral ones, directly reusing M24's Risk Management reasoning rather than introducing a new prioritization scheme.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
