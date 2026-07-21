# M24 — Development Roadmap & Execution Plan

**Status:** Draft
**Owner:** Product / Architecture
**Milestone:** M24
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M23 — Verification & Testing Strategy](./M23-verification-testing-strategy.md)

---

# Overview

The Development Roadmap defines the conceptual order in which Version 1 should be brought into existence, given everything already established in M01–M23. It does not estimate time, select a methodology, or make any implementation decision — it defines logical execution phases, their dependencies, and the conditions that must be true before and after each one, so that implementation proceeds in an order the architecture itself demands rather than an arbitrary one.

---

# Implementation Principles

- Implementation must follow the dependency order already established by the architecture itself — per M14's Module Relationships, M16's Dependency Rules, and M18's Service Relationships — not an order chosen independently of them.
- Nothing may be implemented that is not already documented in M01–M23; execution realizes the approved specification, it does not extend it.
- Every phase's output must remain traceable back to M02 through the chain defined in M23 — if a piece of planned work cannot be traced this way, it does not belong in Version 1.
- Foundational, gating capability (Identity & Access) must exist before any capability that depends on it, consistent with M14's and M20's rule that Authentication State gates every other module.
- The product's discipline of minimalism (M01) applies to execution as much as to product scope — no phase should produce more than what its corresponding milestones require.

---

# Execution Phases

## Phase 1 — Foundation & Domain Modeling
- **Objective:** Establish the core business concepts and structural rules the rest of the system depends on.
- **Primary Deliverables:** The Domain Layer's representation of the Logical Data Objects defined in M17 (Learner, Authentication State, English Level, Learning Goal, Topic Toggle Preference, Session, Topic, Session Composition, Progress Record) and the Entity Rules, Data Integrity Rules, and Business Rules that govern them, per M07–M09.
- **Dependencies:** None — this phase realizes the Domain Model and Logical Data Model directly.
- **Completion Criteria:** Every Logical Data Object and its Data Integrity Rules (M17) are represented and enforceable; every Entity Rule (M07) can be demonstrated to hold.

## Phase 2 — Identity & Access
- **Objective:** Establish the gating capability every other phase depends on.
- **Primary Deliverables:** The Identity & Access Service and its Operations (CreateAccount, SignIn, SignOut, VerifySession, per M18); the Security Boundaries and Access Responsibilities defined in M22.
- **Dependencies:** Phase 1 (Learner Identity and Authentication State must already be modeled).
- **Completion Criteria:** Every Identity & Access Operation's Preconditions, Postconditions, and Failure Conditions (M18) can be demonstrated; no protected capability is reachable without a Signed In Authentication State, per M22's Security Constraints.

## Phase 3 — Learning Configuration
- **Objective:** Enable a Learner to establish and change their English Level, Learning Goal, and Topic Toggle Preference.
- **Primary Deliverables:** The Configuration Service and its Operations (SetEnglishLevel, SetLearningGoal, SetTopicTogglePreference, GetCurrentConfiguration, per M18), enforcing the Validation Rules and Configuration Constraints defined in M09.
- **Dependencies:** Phase 2 (Configuration Service Operations require a Signed In Learner).
- **Completion Criteria:** Every Configuration Operation's Preconditions, Postconditions, and Failure Conditions (M18) can be demonstrated; a Learner always holds exactly one current value per Configuration option, per M09.

## Phase 4 — Session Generation & AI Integration
- **Objective:** Enable the production of one complete Session from a Learner's current Learning Configuration.
- **Primary Deliverables:** The Session Generation Service and its GenerateSession Operation (M18); the AI Interaction Points, AI Input/Output Concepts, and AI Constraints defined in M21.
- **Dependencies:** Phase 3 (GenerateSession requires current Configuration values).
- **Completion Criteria:** GenerateSession's Preconditions, Postconditions, and Failure Conditions (M18) can be demonstrated; every generated Session satisfies M08's Business Constraints (all seven Session Composition parts present, Topic Consistency Rules honored, Configuration values fixed at creation).

## Phase 5 — Session Experience & Progress
- **Objective:** Enable a Learner to work through a generated Session to a defined end, and have that outcome recorded.
- **Primary Deliverables:** The Session Experience Service (RecordCompositionPartEngagement, CompleteSession, AbandonSession) and the Progress Service (CreateProgressRecord, RecordOutcome, GetMostRecentOutcome), per M18.
- **Dependencies:** Phase 4 (a Session must exist before it can be experienced; Progress Record creation is triggered by Session Generation and finalized by Session Experience outcomes, per M18's Service Relationships).
- **Completion Criteria:** Every Session Experience and Progress Operation's Preconditions, Postconditions, and Failure Conditions (M18) can be demonstrated; every Session resolves to exactly one Recorded Progress Record, per M07.

## Phase 6 — Presentation
- **Objective:** Enable a Learner to actually interact with everything the prior phases established.
- **Primary Deliverables:** The View, Interaction, State, and Navigation Layers defined in M19, wired to the Application Layer boundary established by Phases 2–5; the pages and navigation structure defined in M04; the UX and Design System Foundations defined in M11 and M12.
- **Dependencies:** Phases 2 through 5 (the Presentation Layer only ever reflects and requests what the backend services already provide).
- **Completion Criteria:** Every journey defined in M05 (First-Time, Returning, Learning Session, Settings Change, Authentication, Error Recovery) can be completed exactly as documented, entirely through the Presentation Layer.

## Phase 7 — Verification & Readiness
- **Objective:** Confirm that everything built across Phases 1–6 matches what M01–M23 document.
- **Primary Deliverables:** Completed verification activity at every level defined in M23 (Product, Architecture, Business Rule, Interaction, Security & Privacy Verification), and a resolved Traceability chain from every M02 requirement through to observed behavior.
- **Dependencies:** Phases 1 through 6 (there is nothing to verify until the system exists).
- **Completion Criteria:** Every Verification Objective in M23 is satisfied; every Acceptance Principle in M23 is met for every capability; no unresolved Finding remains open.

---

# Dependency Map

- Phase 1 has no dependencies and is the origin of every later phase.
- Phase 2 depends on Phase 1 (Learner Identity, Authentication State).
- Phase 3 depends on Phase 2 (Configuration Operations require a Signed In Learner).
- Phase 4 depends on Phase 3 (Session Generation requires current Configuration values).
- Phase 5 depends on Phase 4 (a Session must exist before it can be experienced or its outcome recorded).
- Phase 6 depends on Phases 2 through 5 collectively — the Presentation Layer has no independent capability of its own, per M19, and cannot be meaningfully completed until the backend behavior it reflects exists.
- Phase 7 depends on Phases 1 through 6 collectively — verification requires a complete system to verify against.

This dependency order mirrors the Information Flow already defined in M14 and the Service Relationships defined in M18; it is not a new ordering choice but a direct consequence of dependencies already established.

---

# Entry Criteria

- **Phase 1:** M07, M08, M09, and M17 are complete and immutable (already satisfied as of this milestone).
- **Phase 2:** Phase 1's Completion Criteria are met; M18's Identity & Access Service contracts and M22's Security Boundaries are available to build against.
- **Phase 3:** Phase 2's Completion Criteria are met; M09's Configuration Model and M18's Configuration Service contracts are available.
- **Phase 4:** Phase 3's Completion Criteria are met; M08's Session Generation Logic, M18's Session Generation Service contract, and M21's AI Integration Architecture are available.
- **Phase 5:** Phase 4's Completion Criteria are met; M18's Session Experience and Progress Service contracts are available.
- **Phase 6:** Phases 2–5's Completion Criteria are met; M04's Information Architecture, M05's User Flows, M11's UX Principles, M12's Design System Foundations, and M19's Frontend Architecture are available.
- **Phase 7:** Phases 1–6's Completion Criteria are met; M23's Verification & Testing Strategy is available in full.

---

# Exit Criteria

- No phase may be considered exited until its own Completion Criteria, as stated in Execution Phases above, are fully satisfied.
- No phase may be exited while any of its Service Operations' Failure Conditions (per M18) produce an undocumented or inconsistent outcome.
- No phase may be exited if doing so would require a later phase to modify or contradict work already completed in an earlier one — later phases only add capability, per the Extension Principles in M16.
- Phase 7 — and therefore Version 1 as a whole — may not be considered exited while any Verification Objective in M23 remains unsatisfied.

---

# Risk Management Principles

- A risk is any point where documented behavior (M01–M23) is ambiguous, incomplete, or difficult to realize as written — not a project scheduling concern.
- Every risk identified during execution must be resolved by reference to the existing, immutable milestones first; only if no milestone resolves it should it be raised as a new Open Question for a future milestone to address.
- Risks must never be resolved by silently deviating from an immutable milestone during execution — any deviation is itself a Finding, per M23, and must be surfaced rather than absorbed silently.
- The earlier a phase surfaces a risk, the less later work depends on an unresolved assumption — Phase 1 and Phase 2 risks are inherently more consequential than later-phase risks, given the Dependency Map above.

---

# Change Management Principles

- Any proposed change to previously approved behavior must be evaluated against the entire body of M01–M23 before being accepted, not against a single milestone in isolation.
- A change is only valid if it can be expressed as a new, explicit milestone that documents the change — no immutable milestone is ever edited retroactively to accommodate a change, consistent with the "do not modify prior milestones" instruction that has governed every milestone in this project.
- A change that would alter an already-completed phase's Completion Criteria must be evaluated for its effect on every dependent phase, per the Dependency Map, before being accepted.
- No change may be accepted during execution that expands scope beyond what M01–M23 already define — new scope requires new product milestones, not execution-time decisions.

---

# Readiness Assessment

Version 1 is ready to begin implementation when all of the following are true:

- Every Functional Area defined in M13 has a corresponding Service Contract in M18.
- Every Service Contract in M18 has a corresponding architectural home in M16, M19, or M20.
- The Security & Privacy Architecture (M22) and Verification & Testing Strategy (M23) are both complete.
- The Traceability chain defined in M23 can be completed, at least conceptually, for every Functional Requirement listed in M02.
- No Risk identified against Phase 1 or Phase 2 (per Risk Management Principles) remains unresolved, since these phases are the foundation every later phase depends on.

As of the completion of this milestone, M01–M23 satisfy all of the above, and Version 1 is conceptually ready for implementation to begin at Phase 1.

---

# Roadmap Constraints

1. No phase may begin before its Entry Criteria are met.
2. No phase may be exited before its Completion Criteria are met.
3. No phase may introduce functionality not already documented in M01–M23.
4. The phase order defined in this document must be followed exactly as the Dependency Map describes — no phase may be reordered ahead of a phase it depends on.
5. Every deliverable produced across all seven phases must remain traceable back to M02 through the chain defined in M23.

---

# Roadmap Glossary

- **Execution Phase:** A logically bounded stage of implementation with a defined Objective, Deliverables, Dependencies, and Completion Criteria.
- **Dependency Map:** The description of which phases must precede which others, derived from the architecture's own dependency rules.
- **Entry Criteria:** The conditions that must be true before a phase may begin.
- **Exit Criteria / Completion Criteria:** The conditions that must be true before a phase may be considered finished.
- **Readiness Assessment:** The determination that Version 1, as documented, is sufficiently complete for implementation to begin.
- **Finding:** A discrepancy between documented and observed behavior, surfaced during execution, per M23.
- **Change Management:** The discipline of evaluating any proposed change against the full body of immutable milestones before accepting it as a new, explicit milestone.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined seven Execution Phases (Foundation & Domain Modeling; Identity & Access; Learning Configuration; Session Generation & AI Integration; Session Experience & Progress; Presentation; Verification & Readiness), each with Objective, Primary Deliverables, Dependencies, and Completion Criteria, with no time estimates.
- Documented a Dependency Map, Entry Criteria, and Exit Criteria consistent with that phase order.
- Documented Risk Management Principles and Change Management Principles without invoking any project management methodology.
- Documented a Readiness Assessment concluding that M01–M23 satisfy the conditions required for implementation to begin, Roadmap Constraints, and a Roadmap Glossary.

### Files Created
- `docs/milestones/M24-development-roadmap.md`

### Files Modified
- None. M01–M23 were not revisited or altered.

### Pending
- No further action pending within M24. Awaiting next milestone instructions — implementation itself is not authorized by this document alone and would require explicit direction to begin.

### Risks
- The seven-phase structure is a direct synthesis of dependency relationships already established across M14, M16, M18, and M20, not a new ordering decision — but it is the first document to commit to one specific phase sequence, and should be confirmed as the intended execution order.
- Phase 6 (Presentation) is defined as depending on Phases 2–5 collectively rather than any single one, reflecting M19's description of the frontend as purely reflective of backend-confirmed state. If a future milestone wants Presentation work to begin earlier (e.g., in parallel using placeholder data), that would require revisiting this document's Dependency Map explicitly.

### Open Questions
- None beyond those already raised across M01–M23, which remain open and are not reintroduced here. This roadmap does not resolve them; it notes in Readiness Assessment that none of the outstanding open questions block Phase 1 or Phase 2 specifically.

Waiting for the next milestone.

---

# Overall Documentation Summary

- **M01 — Product Vision:** Establishes the mission, vision, problem statement, product philosophy, principles, MVP objectives and boundaries, success metrics, and future version titles for Project Fluent.
- **M02 — Product Requirements:** Defines the Version 1 product overview, target users, user goals, core user journey, functional and non-functional requirements, out-of-scope items, success metrics, assumptions, and dependencies.
- **M03 — User Personas and Stories:** Defines primary and secondary learner personas, excluded users, and full user stories with acceptance criteria and edge cases for Version 1.
- **M04 — Information Architecture:** Defines the Version 1 site map, navigation structure, screen responsibilities, authentication flow, entry/exit points, protected areas, and page dependencies.
- **M05 — User Flows:** Defines every major journey through the product, including first-time and returning user flows, the learning session flow, settings changes, authentication, error recovery, decision points, and state transitions.
- **M06 — Feature Breakdown:** Defines the complete Version 1 feature inventory, feature details, relationships, lifecycles, functional boundaries, and a coverage matrix mapping every M02 requirement to a feature.
- **M07 — Domain Model:** Defines the core business entities, their responsibilities, relationships, states, rules, constraints, and a domain glossary for Version 1.
- **M08 — AI Learning Engine:** Defines what a learning session is, its composition, the session generation logic, topic consistency and personalization rules, learning rules, and completion rules.
- **M09 — Configuration Model:** Consolidates every learner-facing configuration option (English Level, Learning Goal, Topic Toggle Preference) into a single authoritative reference of behavior and rules.
- **M10 — Content Architecture:** Defines the logical information domains and objects that make up the product's content, independent of any interface.
- **M11 — UX Principles:** Defines the experience philosophy governing how the product should feel to use, without any interface or visual design.
- **M12 — Design System Foundations:** Defines the conceptual visual and interaction design language — philosophy, hierarchy, color, typography, iconography, motion, and feedback principles — with no concrete design values.
- **M13 — Functional Specification:** Defines the precise, observable behavior of every functional area, including preconditions, postconditions, user actions, and system responses.
- **M14 — Conceptual System Architecture:** Defines the product's logical system modules, their relationships, information flow, responsibility boundaries, and cross-cutting concerns.
- **M15 — Quality Attributes:** Defines the required system-level qualities — usability, performance, reliability, availability, maintainability, scalability, security, privacy, accessibility, and observability.
- **M16 — Technical Architecture:** Defines the technology-agnostic layered architecture (Presentation, Application, Domain, Persistence) and the rules governing how they interact.
- **M17 — Logical Data Model:** Defines the logical data objects, their conceptual attributes, relationships, lifecycle, and integrity rules, with no database design.
- **M18 — Service Contracts:** Defines the logical services and operations required by the product, each with inputs, outputs, preconditions, postconditions, and failure conditions, with no API design.
- **M19 — Frontend Architecture:** Opens up the Presentation Layer into View, Interaction, State, and Navigation layers, defining their responsibilities and boundaries.
- **M20 — Backend Architecture:** Elaborates the Application, Domain, and Persistence layers, defining business processing, validation, and persistence responsibilities and their coordination.
- **M21 — AI Integration Architecture:** Defines how AI capability conceptually integrates into session generation, including its responsibilities, inputs, outputs, constraints, and boundaries.
- **M22 — Security & Privacy Architecture:** Defines the conceptual security and privacy responsibilities and boundaries across identity, access, data protection, and AI interactions.
- **M23 — Verification & Testing Strategy:** Defines how the product's behavior, architecture, and rules will be conceptually verified, including verification levels, acceptance principles, and traceability.
- **M24 — Development Roadmap & Execution Plan:** Defines the seven-phase execution order for implementing Version 1, their dependencies, entry/exit criteria, risk and change management principles, and a readiness assessment confirming the documentation foundation is complete.
