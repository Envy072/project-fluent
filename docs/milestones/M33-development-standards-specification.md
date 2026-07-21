# M33 — Development Standards Specification

**Status:** Draft
**Owner:** Architecture / Engineering
**Milestone:** M33
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M32 — Technology Selection Strategy](./M32-technology-selection-strategy.md)

---

# Overview

The Development Standards Specification defines the universal engineering practices every implementation of Project Fluent must follow, regardless of which technology is eventually selected under M32's criteria. It exists to ensure that the Implementation Architecture defined in M31 is realized with the consistency, readability, and long-term sustainability expected of a world-class engineering organization. It contains no language, framework, or code — only the standards a future engineer must satisfy, in any technology.

---

# Engineering Principles

- **Simplicity:** Every implementation decision must reflect M01's founding principle that every addition must earn its place — the simplest structure that correctly satisfies a documented requirement is always preferred.
- **Readability:** Implementation must communicate its intent clearly enough that its correctness can be judged by reading it, without requiring external explanation.
- **Maintainability:** Implementation must keep the mapping to its documented specification (M13, M18, M31) unambiguous, so future changes can be made with confidence rather than archaeology.
- **Explicitness:** Behavior, dependencies, and failure modes must never be hidden or implicit — every Precondition, Postcondition, and Failure Condition already defined in M18 must be visible in how the corresponding implementation is structured.
- **Separation of Concerns:** Implementation must preserve the layer boundaries defined in M16 and elaborated in M19, M20, and M21 — no responsibility may leak across a layer boundary.
- **Single Responsibility:** Each of the nine Implementation Modules defined in M31 must do exactly one thing, matching its single documented Purpose.
- **Low Coupling:** Implementation must honor the Dependency Principles defined in M31 — a module depends only on what it is explicitly permitted to depend on.
- **High Cohesion:** Everything within a single Implementation Module must serve that module's one documented Purpose; unrelated logic never accumulates inside it.
- **Consistency:** The same business concept must be represented and named the same way everywhere it appears in the implementation, mirroring the Consistency Principles already established for the product in M11, M12, and M28.
- **Defensive Design:** The Domain Layer must never trust that a request has already been validated elsewhere — every request is fully re-validated, per M16's and M20's rule that backend validation is always authoritative regardless of upstream checks.

---

# Code Organization Principles

- **Logical Organization:** Implementation structure mirrors the nine Implementation Modules defined in M31, one-to-one — a module's implementation is never split across unrelated locations, and unrelated modules are never combined into one.
- **Feature Boundaries:** Implementation is organized around each module's documented Boundaries (M31), never around a technical category that cuts across multiple modules' responsibilities.
- **Shared Functionality:** Logic is only extracted into a shared, reusable form when it is genuinely needed by more than one module and doing so does not violate any module's Boundaries — premature sharing that blurs a Boundary is avoided, consistent with M01's minimalism.
- **Layer Separation:** The Presentation, Application, Domain, Persistence, and AI Layers (per M16 and M21) remain organizationally distinct in the implementation structure, never interleaved.
- **Naming Consistency:** Organizational naming reflects the business vocabulary already established in M07, M09, M17, and M18, rather than introducing new technical vocabulary for concepts that already have a documented name.

---

# Naming Standards

- **Modules:** Named to clearly and unambiguously reflect the specific Implementation Module (per M31) they realize — no module's name may be generic or ambiguous about which of the nine it corresponds to.
- **Components:** Named after the Component role defined in M29 (e.g., Primary Action, Selection Control, Feedback Component, Navigation Element) — a component's name never changes depending on which screen hosts it.
- **Services:** Named using the exact Service and Operation names already established in M18 (e.g., the Identity & Access Service's CreateAccount operation) — implementation never invents an alternate name for an already-documented operation.
- **Interfaces:** Named to describe the contract they expose — their Preconditions and Postconditions, per M18 — never named after the technology used to implement them.
- **Data Structures:** Named after the Logical Data Objects defined in M17 (Learner, English Level, Session, Topic, Progress Record, and so on) — no data structure introduces a name not already established there.
- **Files:** Organized and named to correspond one-to-one with the module or data object they implement, avoiding generic names that could refer to more than one concept.
- **Directories:** Mirror the nine-module structure defined in M31 at the top level of organization.
- **Configuration:** Product Configuration (English Level, Learning Goal, Topic Toggle Preference, per M09) is named exactly as it is in M09, and kept clearly distinct in naming from any technical or environment-level configuration.
- **Constants:** Named to describe their meaning (e.g., the six defined Learning Goal values, per M01) rather than their raw value, so their purpose is clear without needing to trace back to documentation.

---

# Documentation Standards

- **Clarity:** Engineering documentation describes intent and behavior — why a piece of implementation exists and what it guarantees — never merely restating what the implementation literally does.
- **Accuracy:** Engineering documentation must never contradict M01–M32; any divergence discovered is treated as a Finding, per M23, and resolved through the established milestone process.
- **Traceability:** Every module and component's documentation includes a reference back to the M02 requirement it ultimately fulfills, following the chain defined in M23.
- **Maintainability:** Documentation is updated in lockstep with any approved change, per M24's Change Management Principles — it is never left stale after a change is made.
- **Version Alignment:** Documentation always reflects the currently approved set of milestones; behavior that is no longer accurate is removed rather than marked as historical within active engineering documentation.

---

# Error Handling Standards

Consistent with M18's Error Contract Principles:

- Every operation either completes fully according to its documented Postconditions, or fails entirely according to a documented Failure Condition — no operation may produce a partial or ambiguous outcome.
- Every error encountered during implementation must be attributable to a specific, already-documented Failure Condition from M13 or M18 — an implementation must never introduce an undocumented failure mode.
- An error must never be silently swallowed or hidden; if a Failure Condition is met, its consequence must be visible to whichever layer is responsible for handling it, per M16's Request Lifecycle.
- The Domain Layer's determination of failure is always authoritative, regardless of any check already performed by the Presentation Layer, per M19's and M20's dual-validation model.

---

# Logging Principles

- Logging exists to make the business-level Observability Expectations defined in M15 verifiable — whether Authentication succeeded, a Configuration changed, a Session was generated, completed, or abandoned, and a Progress Record was recorded.
- Logging captures only what is necessary to determine these business outcomes — no Learner personal information beyond what is strictly necessary is ever logged, consistent with M22's Data Minimization principle.
- Logging is never used as a substitute for, or a way to bypass, the Domain Layer's authoritative validation — a logged event reflects what happened, it never determines what should happen.
- No specific logging tool, format, or vendor is named or implied in this document.

---

# Configuration Standards

- Product Configuration (English Level, Learning Goal, Topic Toggle Preference, per M09) is treated as fundamentally distinct from technical or environment-level configuration; the two are never conflated in naming or handling.
- Technical or environment-level configuration must never be used to alter, disable, or bypass a Business Rule or Entity Rule already defined in M07, M08, or M09 — a documented rule is never conditionally toggled by a deployment setting.
- Any configuration mechanism that would affect documented product behavior must be evaluated through M24's Change Management Principles before being introduced.

---

# Reusability Principles

- A piece of implementation is made reusable only when it is genuinely needed by more than one Implementation Module, per M31, and doing so does not violate either module's Boundaries.
- Reusable logic must never blur the Separation of Concerns already established across the Presentation, Application, Domain, and Persistence Layers, per M16 and M20.
- Extracting shared logic must never introduce a hidden dependency that violates the Dependency Principles defined in M31 — reusability is never achieved at the cost of an undocumented coupling.
- Reusability is a means of avoiding duplication, not a goal in itself; premature abstraction in the name of reusability is avoided, consistent with M01's minimalism.

---

# Quality Standards

- Every module's implemented behavior must be confirmed against the Verification Levels defined in M23 before being considered complete.
- Implementation must satisfy the Engineering Goals defined in M32 — Reliability, Scalability, Security, Maintainability, Performance, Developer Experience, Testability, Extensibility, and Operational Simplicity.
- Quality is never traded for speed of delivery in a way that violates any constraint already documented in M01–M32 — a shortcut that breaks a Business Rule, Architecture Constraint, or Security Constraint is never acceptable regardless of schedule pressure.
- Every piece of implementation must remain traceable to an M02 requirement through the chain defined in M23; untraceable implementation is treated as unapproved scope.

---

# Development Constraints

1. No Implementation Module, per M31, may combine responsibilities that belong to more than one of the nine documented modules.
2. No naming used in the implementation may diverge from the business vocabulary already established in M07, M09, M17, and M18.
3. No engineering documentation may exist that is not traceable to M01–M32 or a future, explicitly approved milestone.
4. No error may be silently swallowed; every failure must be attributable to a Failure Condition already documented in M13 or M18.
5. No configuration mechanism, technical or otherwise, may override a Business Rule or Entity Rule defined in M07, M08, or M09.

---

# Development Standards Glossary

- **Engineering Principle:** A guiding standard (e.g., Simplicity, Explicitness) that every implementation decision must reflect.
- **Cohesion:** The degree to which everything within a single module serves that module's one documented Purpose.
- **Coupling:** The degree to which one module depends on another; kept low and only along permitted paths, per M31.
- **Defensive Design:** The practice of never trusting that validation has already occurred elsewhere, and always re-validating authoritatively.
- **Traceability:** The property of every piece of implementation and documentation being connected back to an approved M02 requirement, per M23.
- **Reusability:** The deliberate, need-driven sharing of implementation across modules, without violating their Boundaries.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented Engineering Principles (Simplicity, Readability, Maintainability, Explicitness, Separation of Concerns, Single Responsibility, Low Coupling, High Cohesion, Consistency, Defensive Design), each grounded in a specific prior milestone.
- Documented Code Organization Principles and Naming Standards for Modules, Components, Services, Interfaces, Data Structures, Files, Directories, Configuration, and Constants, all mapped to vocabulary already established in M07, M09, M17, M18, M29, and M31.
- Documented Documentation Standards, Error Handling Standards (consistent with M18), Logging Principles, Configuration Standards, Reusability Principles, Quality Standards, Development Constraints, and a Development Standards Glossary.

### Files Created
- `docs/milestones/M33-development-standards-specification.md`

### Files Modified
- None. M01–M32 were not revisited or altered.

### Pending
- No further action pending within M33. Awaiting next milestone instructions.

### Risks
- This document establishes naming and organizational standards that presuppose the nine-module structure defined in M31; if a future milestone were to revise that module count, this document's Naming Standards and Code Organization Principles would need to be revisited accordingly.
- Logging Principles are deliberately restricted to business-outcome visibility (per M15's Observability Expectations) rather than general-purpose technical logging, consistent with this document's conceptual, technology-agnostic scope — a future, more technical milestone will need to define logging in operational detail.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
