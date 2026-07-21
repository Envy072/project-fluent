# Project Fluent — Engineering Execution Plan

**Programme:** Engineering Program, Phase 1
**Status:** Draft
**Owner:** Engineering / Architecture
**Source of Truth:** M01 through M56 (the closed Version 1 Documentation Programme). This plan invents no requirement, feature, or architecture; every section below cites the specific milestone it derives from.

---

# Executive Overview

The Version 1 documentation programme is closed (M55). This document is the bridge from that closed documentation to actual engineering work: it converts M01–M56 into an executable plan a development team can pick up and run with, without needing to re-derive structure from fifty-six milestones themselves. It adds no new product decision. Where documentation left something explicitly deferred (per M47's Gap Assessment) or explicitly out of scope (per M02's Out of Scope, M35's Privilege Management), this plan says so plainly rather than quietly filling the gap.

This plan does not replace M24's Development Roadmap — it operationalizes it, translating M24's seven Execution Phases into concrete subsystems, dependencies, deliverables, and quality gates, using the full body of architecture and governance documentation produced since M24 was written (M31–M46).

---

# Engineering Philosophy

- **Documentation-Driven Engineering:** Every engineering decision traces to M01–M56, per M23's Traceability chain and M53's Documentation Authority. Implementation realizes documentation; it never reinterprets or extends it informally.
- **Incremental Delivery:** Work proceeds in the dependency order established by M24's Execution Phases and M31's Dependency Principles — never all at once, never out of order.
- **Maintainability:** Each Implementation Module, per M31, has exactly one responsibility and low coupling to the others; this discipline is preserved throughout the build, not only at the end.
- **Testability:** Every Quality Gate defined in M34 applies before work moves between phases — nothing is "done" without passing the gate for its scope.
- **Simplicity:** Build exactly what M01–M56 document — nothing more, restating M01's founding principle at the engineering level.
- **Scalability:** An individual Learner's experience never degrades as the number of Learners grows, per M15.
- **Architectural Integrity:** The Presentation, Application, Domain, and Persistence layering and Dependency Rules defined in M16 and M20 are never violated for expedience, per M31's Extension Principles.
- **Security by Design:** Access, ownership, and data minimization, per M22 and M35, are built in from the first implementation of the Identity & Access Module — never retrofitted.
- **AI-First Engineering:** The AI Layer, per M21 and M45, is a first-class, governed subsystem with strict input and output boundaries — never a bolt-on integration added late.

---

# Implementation Roadmap

Ten phases, mapped onto M24's seven Execution Phases and the practical groupings requested for this plan. No phase is time-estimated or staffed, per this plan's constraints.

## 1. Platform Foundation
- **Realizes:** M24 Phase 1 (Foundation & Domain Modeling).
- **Objective:** Stand up the Domain Layer's core concepts — the nine Logical Data Objects (M17), Entity Rules (M07), and Business Rules (M08, M09) — and the four-layer Technical Architecture skeleton (M16).
- **Deliverable:** A Domain Layer capable of representing Learner, Authentication State, English Level, Learning Goal, Topic Toggle Preference, Session, Topic, Session Composition, and Progress Record, with their Data Integrity Rules enforceable.

## 2. Authentication
- **Realizes:** M24 Phase 2 (Identity & Access).
- **Objective:** Implement the Identity & Access Service and its four Operations (CreateAccount, SignIn, SignOut, VerifySession, per M18), and the Security Boundaries defined in M22.
- **Deliverable:** A working Identity & Access Module (M31) that gates every other subsystem, exactly as required before any other phase can begin.

## 3. Core Product (Learning Configuration)
- **Realizes:** M24 Phase 3 (Learning Configuration).
- **Objective:** Implement the Configuration Service and its four Operations (SetEnglishLevel, SetLearningGoal, SetTopicTogglePreference, GetCurrentConfiguration, per M18), enforcing M09's Validation Rules.
- **Deliverable:** A working Configuration Module (M31), and the Dashboard screen's Configuration Region (M04, M28) able to present and change all three Configuration options.

## 4. AI Layer
- **Realizes:** Part of M24 Phase 4 (Session Generation & AI Integration).
- **Objective:** Implement the AI Integration Module (M31) realizing M21's two AI Interaction Points — Topic Generation and Composition Content Generation — strictly bounded to the AI Input Concepts defined in M21, with Output Validation against M08's Business Constraints.
- **Deliverable:** A working AI Integration Module invoked exclusively by the Session Generation Module, never directly reachable by any other subsystem, per M21's and M45's boundaries.

## 5. Learning Engine (Session Generation, Experience, and Progress)
- **Realizes:** The remainder of M24 Phase 4, plus Phase 5 (Session Experience & Progress).
- **Objective:** Implement the Session Generation Service's GenerateSession Operation; the Session Experience Service's three Operations (RecordCompositionPartEngagement, CompleteSession, AbandonSession); and the Progress Service's three Operations (CreateProgressRecord, RecordOutcome, GetMostRecentOutcome) — all per M18.
- **Deliverable:** A complete, working path from a Session Generation request through to a Completed or Abandoned Session and a Recorded Progress outcome, satisfying every Success and Failure Condition defined in M13.

## 6. Dashboard and Presentation
- **Realizes:** M24 Phase 6 (Presentation).
- **Objective:** Implement the Presentation Module's four internal layers (View, Interaction, State, Navigation, per M19) and all five screens (Landing, Sign Up, Sign In, Dashboard, Learning Session Page, per M04, M25–M30).
- **Deliverable:** Every User Flow defined in M05 completable end-to-end through the Presentation Layer, wired to the backend modules from Phases 2–5.

## 7. Analytics
- **Scope Note:** Version 1 defines no Learner-facing analytics feature — M02's Requirements and Out of Scope explicitly exclude "detailed analytics." This roadmap category is fulfilled entirely by **operational instrumentation**, not a new product capability.
- **Realizes:** M36's Monitoring and Observability Principles and M44's Observability and Product Intelligence Strategy.
- **Objective:** Instrument the seven Observability Domains defined in M44 (User Experience, Product Behaviour, Business Flows, AI Behaviour, Service Health, Operational Health, Information Quality) so that every business outcome listed in M15's Observability Expectations is determinable.
- **Deliverable:** Business-outcome-level observability sufficient to support M42's Evidence-Based Decisions — never a Learner-visible analytics dashboard, which is not documented anywhere in M01–M56.

## 8. Administration
- **Scope Note:** Version 1 defines no administrative role, permission, or organizational capability anywhere in M01–M56 — M35's Privilege Management explicitly states this, and M39 addresses any future support function only at the level of principle, never structure.
- **Deliverable:** None. This phase is intentionally empty for Version 1. If a future need for an administrative capability arises, it is a Transformational-or-higher scope question, per M43's Version Classification, requiring its own explicit milestone before any engineering work begins here — never an assumption made during this execution plan.

## 9. Infrastructure
- **Objective:** Select an actual technology stack against M32's Technology Selection Strategy criteria (Engineering Goals, Evaluation Criteria, Preferred Architectural Characteristics), then establish deployment per M38's Production Deployment Strategy.
- **Deliverable:** A concrete technology decision, documented and evaluated against M32, and a working Deployment Lifecycle (Preparation, Environment Validation, Execution, Verification, Operational Validation, Completion, per M38). No specific technology is named by this plan; that decision is this phase's own deliverable.

## 10. Production Readiness
- **Realizes:** M24 Phase 7 (Verification & Readiness), M34's Quality Gates, and M37's Release Management.
- **Objective:** Confirm every Functional Area, Service Operation, and User Flow has passed all four Quality Gates (M34); confirm Security & Privacy Verification (M35); confirm Operational Readiness (M36); and satisfy every Release Readiness Criterion (M37).
- **Deliverable:** A release-ready system, with a confirmed rollback path (M37, M38), ready for the first production deployment.

---

# System Breakdown

The nine Implementation Modules defined in M31 are the authoritative subsystem decomposition. Restated here for engineering use:

| Subsystem | Purpose | Responsibilities | Dependencies | Documentation References |
|---|---|---|---|---|
| Presentation Module | Realize the View, Interaction, State, and Navigation Layers. | Render confirmed state; capture Learner intent; track logical page position. | Application Orchestration Module only. | M19, M04, M25–M30 |
| Application Orchestration Module | Gate and sequence every request. | Confirm Authentication State; route requests; sequence multi-step operations. | The five Domain modules. | M16, M20 |
| Identity & Access Module | Establish and govern Authentication State. | CreateAccount, SignIn, SignOut, VerifySession. | Persistence Module only. | M18, M22 |
| Configuration Module | Capture and expose Learning Configuration. | SetEnglishLevel, SetLearningGoal, SetTopicTogglePreference, GetCurrentConfiguration. | Persistence Module only. | M09, M18 |
| Session Generation Module | Produce one complete Session. | GenerateSession; invoke AI Integration Module; validate output against M08. | Configuration Module, AI Integration Module, Persistence Module. | M08, M18, M21 |
| Session Experience Module | Track Learner engagement to completion. | RecordCompositionPartEngagement, CompleteSession, AbandonSession. | Persistence Module, Progress Module. | M08, M18 |
| Progress Module | Record and expose Session outcomes. | CreateProgressRecord, RecordOutcome, GetMostRecentOutcome. | Persistence Module only. | M07, M18 |
| AI Integration Module | Generate Topic and Session Composition content. | Topic Generation; Composition Content Generation. | None among the other eight; invoked only by Session Generation Module. | M21, M45 |
| Persistence Module | Retain and return every Logical Data Object. | Store and return exactly as instructed by the Domain modules. | None. | M17, M16, M20 |

No subsystem beyond these nine exists in Version 1. No subsystem may be added without a new, explicit milestone, per M31's Extension Principles and M42's Change Lifecycle.

---

# Engineering Dependencies

Implementation ordering follows M31's Dependency Principles and M24's Dependency Map exactly:

1. **Persistence Module** has no dependencies and may be stood up first, in skeletal form.
2. **Identity & Access Module** depends only on Persistence, and must exist before any other Domain module can be meaningfully used, since every other module assumes a Signed In Learner.
3. **Configuration Module** depends on Identity & Access being functional.
4. **AI Integration Module** has no dependency on the other eight, but produces no value until invoked.
5. **Session Generation Module** depends on Configuration (for current values) and AI Integration (for content) both being functional.
6. **Session Experience Module** and **Progress Module** depend on Session Generation having produced a Session.
7. **Application Orchestration Module** must exist in parallel with the Domain modules it sequences — it cannot be meaningfully tested until at least Identity & Access exists.
8. **Presentation Module** depends on Application Orchestration and, transitively, on every Domain module it surfaces — it is necessarily the last subsystem to reach full functionality, though its skeleton (screens and navigation shape) can be built in parallel with backend work.

No subsystem may be built in an order that violates this chain; per M31, no module may depend on a module positioned after it in this list.

---

# Build Strategy

- **Walking Skeleton First:** Rather than building each subsystem to full completeness in isolation, establish a thin, end-to-end path through the Request Lifecycle (M16) as early as possible — Sign Up through a minimal Dashboard through a minimal Session Generation — even before every Business Rule and Failure Condition is fully implemented. This surfaces integration problems early, consistent with M34's Quality Philosophy that prevention is preferred over detection.
- **Deployable at Every Increment:** Every increment of the Build Strategy must remain deployable, per M38's Deployment Philosophy — a partially featured but internally consistent system is always preferable to a fully featured but broken one. This directly supports M37's Release Lifecycle, which assumes a system can be evaluated for Readiness at any point, not only at a single, final moment.
- **Layer Before Breadth:** Within each Implementation Roadmap phase, complete a module's Domain Layer behavior (per M18's contracts) before extending its Presentation surface — correctness of business logic takes priority over UI completeness at every step, consistent with M16's Separation of Concerns.
- **No Phase Skipping:** Per M24's Dependency Map and this plan's Engineering Dependencies above, a later phase is never started ahead of an earlier one it depends on, even if it appears easier or more urgent.
- **Continuous Regression:** As each new phase is added, the Regression Strategy defined in M34 is applied — every previously passed Quality Gate for earlier phases is re-confirmed, not assumed to remain valid.

---

# Quality Gates

Reusing M34's four Quality Gates exactly, applied at the close of each Implementation Roadmap phase relevant to it:

- **Gate 1 — Unit & Module Complete:** Each Implementation Module's own Service Operation contracts (M18) are satisfied in isolation.
- **Gate 2 — Integration Complete:** Modules that depend on one another (per Engineering Dependencies above) are confirmed to coordinate correctly, per M18's Service Relationships.
- **Gate 3 — System Complete:** Each Functional Area (M13) is confirmed end-to-end, including its Architecture Constraints (M16, M20) and Security Constraints (M22).
- **Gate 4 — End-to-End & Acceptance Complete:** Each User Flow (M05) is confirmed completable exactly as documented, and User Acceptance Verification confirms alignment with M03's Acceptance Criteria and M01's Mission.

No phase in the Implementation Roadmap is considered finished until every Gate relevant to its scope has passed. Production Readiness (Phase 10) additionally requires all four Gates to have passed across the entire system, per M34's Release Readiness Principles.

---

# Traceability Strategy

- Every engineering task, however it is tracked, must cite the specific milestone (or milestones) it realizes — a task with no citation back to M01–M56 is not valid Version 1 scope, per M53's Absence of Prohibition principle.
- Where a task appears to require something not documented, it is raised as a Finding, per M23, and routed through M42's Change Lifecycle — never implemented on the basis of engineering judgment alone.
- The chain established in M23 — M02 requirement → M06 feature → M07–M09 rules → M13 functional contract → M18 service contract → M31 implementation module — is the exact path every engineering task should be traceable through, in both directions.
- Deviations discovered during implementation (a rule that cannot be satisfied as written, an ambiguity in a contract) are documented as Findings and resolved via M42 — never silently resolved in code without a corresponding record.

---

# Risk Areas

Referencing existing governance rather than inventing new policy:

- **Identity & Access (Highest Risk):** As the single most foundational module, per M31's Dependency Map, any defect here has the widest possible blast radius. Governed by M35's Threat Management Principles and M46's Enterprise Risk Domain for Engineering and Information Risk.
- **Session Generation and AI Integration:** The most architecturally complex subsystem, spanning the Domain Layer and the AI Layer, and the area with the most unresolved, intentionally deferred questions (per M47's Gap Assessment — composition part ordering, minimum engagement thresholds). Governed by M45's AI Governance and M21's AI Constraints; any risk here is evaluated per M46's Risk Lifecycle, never resolved by relaxing Output Validation.
- **Data Integrity Across Session and Progress:** Given M17's Data Integrity Rules and M07's immutability of Recorded Progress outcomes, any defect that corrupts this data is high severity by definition. Governed by M41's Information Governance and M40's Business Continuity Data Continuity Principles.
- **Security Boundary Enforcement:** The dual-validation model (frontend format checks, backend authoritative validation, per M19 and M20) is a common source of drift if not implemented carefully at every Domain module. Governed by M22 and M35.

No new risk policy is introduced here; every risk area above is managed through the Threat Management, Risk Lifecycle, and Governance mechanisms M01–M56 already define.

---

# Engineering Deliverables

- A functioning Identity & Access Module satisfying all four of its Service Operations (M18).
- A functioning Configuration Module satisfying all four of its Service Operations (M18) and M09's Validation Rules.
- A functioning Session Generation Module, including a functioning AI Integration Module bounded exactly by M21's AI Input and Output Concepts.
- A functioning Session Experience Module and Progress Module, together producing a Recorded Progress outcome for every Session.
- A functioning Presentation Module realizing all five screens and their documented Screen Specifications (M26), Interaction Flows (M27), and High-Fidelity UI Specification (M30).
- A functioning Persistence Module retaining all nine Logical Data Objects (M17) with their Data Integrity Rules enforced.
- Documented evidence that all four Quality Gates (M34) have passed for every Functional Area and User Flow.
- Documented evidence of Security & Privacy Verification (M35) and Operational Readiness (M36).
- A confirmed technology selection, evaluated against M32, and a working Deployment Lifecycle (M38).
- A Release satisfying every Release Readiness Criterion defined in M37.

---

# Success Criteria

The Engineering Execution Plan is successfully completed when:

- Every Functional Area (M13) and Service Operation (M18) is implemented and has passed Quality Gates 1 through 3, per M34.
- Every User Flow (M05) is completable end-to-end through the Presentation Module, and has passed Quality Gate 4.
- Security & Privacy Verification (M35) confirms no Learner's information is reachable by another Learner, and Authentication State gating cannot be circumvented.
- Operational Readiness (M36) confirms Monitoring and Observability are functioning for every business outcome listed in M15.
- Every Release Readiness Criterion defined in M37 is satisfied, and a confirmed rollback path exists, per M37 and M38.
- The distinction M48 drew between Documentation Readiness (already confirmed) and Implementation Readiness (previously unassessed) is finally closed — this plan's completion is what satisfies Implementation Readiness, for the first time, on the basis of real, verified engineering work rather than documentation alone.

---

# Constraints

- This plan does not rewrite, modify, or reinterpret any content within M01–M56.
- This plan does not redefine any requirement established in M02, nor any rule established in M07, M08, or M09.
- This plan invents no feature, subsystem, or capability beyond what M01–M56 already document — including explicitly declining to invent Learner-facing Analytics or an Administration capability, per the Implementation Roadmap above.
- M01 through M56 remain the only source of truth for what Version 1 is; this plan is a translation of that truth into executable structure, never a second source of it.

---

## End Report

### Phase Status
Complete.

### Completed
- Documented an Engineering Philosophy connecting nine engineering principles directly to their originating milestones.
- Documented a ten-phase Implementation Roadmap, explicitly flagging that "Analytics" and "Administration" — two categories named in this phase's own instructions — correspond to no new Learner-facing capability anywhere in M01–M56, and scoping them accordingly (operational instrumentation only, and an intentionally empty phase, respectively) rather than inventing product scope to fill them.
- Documented a System Breakdown table for all nine Implementation Modules (M31), Engineering Dependencies following M31's and M24's ordering, a Build Strategy emphasizing a deployable walking skeleton, the four Quality Gates from M34 applied per phase, a Traceability Strategy, Risk Areas referencing existing governance only, Engineering Deliverables, Success Criteria, and Constraints.

### Files Created
- `docs/engineering/engineering-execution-plan.md`

### Files Modified
- None. M01–M56 were not revisited or altered.

### Pending
- Actual engineering work has not begun; this plan makes it executable but does not itself constitute implementation. The Infrastructure phase (technology selection, per M32) is the first concrete decision this plan identifies as still outstanding before Phase 1 (Platform Foundation) can be built in a specific technology.

### Risks
- The "Analytics" and "Administration" categories, as named in this phase's instructions, could easily be misread as implying Version 1 should have a Learner-facing analytics dashboard or an administrative role. Neither exists anywhere in M01–M56 (M02's Out of Scope explicitly excludes detailed analytics; M35 explicitly states no administrative role exists). This plan deliberately scopes both categories down to what is actually documented, rather than inventing scope to satisfy the category names — this interpretation should be confirmed as correct before engineering work begins against this plan.
- This plan references M47's Gap Assessment items (e.g., composition part ordering, minimum engagement thresholds) as elevated risk specifically because they remain unresolved; engineering work touching the Learning Engine phase should expect to raise Findings against these rather than resolving them independently.

### Open Questions
- None new. Every open item referenced in this plan (Risk Areas, System Breakdown) was already raised in M35, M45, or M47 and is cited, not reopened, here.
