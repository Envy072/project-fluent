# M31 — Implementation Architecture Specification

**Status:** Draft
**Owner:** Architecture / Engineering
**Milestone:** M31
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M30 — High-Fidelity UI Specification](./M30-high-fidelity-ui-specification.md)

---

# Overview

The Implementation Architecture Specification defines how the entire product already documented in M01–M30 will be translated into a production software structure — the concrete implementation modules an engineering team would build, their boundaries, and the rules governing how they depend on one another. It is the final conceptual document before technology-specific decisions begin: it names no language, framework, database, or API, but it gives every future technical decision an unambiguous structure to implement into. Nothing here may be satisfied by inventing capability beyond what M01–M30 already establish.

---

# Implementation Philosophy

- **Documentation precedes implementation, and implementation follows it exactly:** Every module described in this document exists because a corresponding concept was already established — a System Module (M14), a Layer (M16), a Service (M18), a Frontend Layer (M19), a Backend Layer (M20), or the AI Layer (M21). No module here is a new invention.
- **Structure mirrors specification:** The implementation's module boundaries are chosen to make the Service Contracts (M18) and Functional Specification (M13) directly realizable, module for module, rather than requiring translation or reinterpretation during engineering.
- **Minimalism extends to implementation:** Consistent with M01's founding principle, no implementation module may exist unless a genuine, already-documented responsibility requires it.
- **Traceability is non-negotiable:** Every module's behavior must be traceable back through the chain defined in M23 to an original M02 requirement — an untraceable module indicates a specification gap, not a legitimate implementation choice.

---

# System Layers

Implementation responsibility is organized around the same layers already established in M16, elaborated by M19, M20, and M21:

- **Presentation Layer (per M16, M19):** Implementation must realize the View, Interaction, State, and Navigation Layers exactly as defined in M19 — capturing Learner intent, reflecting confirmed state, and governing logical page position, with no business logic implemented here.
- **Application Layer (per M16, M20):** Implementation must realize the gating and sequencing responsibilities defined in M20 — confirming Authentication State and routing requests to the Domain Layer, with no business rule enforcement implemented here.
- **Domain Layer (per M16, M20):** Implementation must realize the five Services and their Operations defined in M18, enforcing every Entity Rule, Business Rule, and Functional Area rule from M07–M13.
- **Persistence Layer (per M16, M20):** Implementation must realize the retention and retrieval of every Logical Data Object defined in M17, acting only on the Domain Layer's instruction.
- **AI Layer (per M21):** Implementation must realize the two AI Interaction Points defined in M21 (Topic Generation, Composition Content Generation), invoked exclusively by the Session Generation module, with no independent decision-making authority over correctness.

---

# Module Organization

Version 1's implementation is organized into exactly nine conceptual modules, each mapping directly to a concept already established in prior milestones.

## 1. Presentation Module
- **Purpose:** Realize the View, Interaction, State, and Navigation Layers defined in M19.
- **Responsibilities:** Rendering confirmed state; capturing and translating Learner interaction into User Actions (M13); tracking logical page position per M04's Site Map.
- **Dependencies:** The Application Orchestration Module only.
- **Boundaries:** Never determines business correctness or business outcomes.
- **Inputs:** Learner interaction; System Responses from the Application Orchestration Module.
- **Outputs:** Requests representing Learner intent; rendered presentation of current state.

## 2. Application Orchestration Module
- **Purpose:** Realize the Application Layer defined in M16 and M20.
- **Responsibilities:** Confirming Authentication State before any further processing; routing a request to the correct Domain module; sequencing multi-step operations (e.g., Session Generation followed by Progress Record creation), per M18's Service Relationships.
- **Dependencies:** The five Domain modules (Identity & Access, Configuration, Session Generation, Session Experience, Progress).
- **Boundaries:** Never enforces a business rule itself.
- **Inputs:** Requests from the Presentation Module.
- **Outputs:** Instructions to Domain modules; System Responses returned to the Presentation Module.

## 3. Identity & Access Module
- **Purpose:** Realize the Identity & Access Service defined in M18.
- **Responsibilities:** Executing CreateAccount, SignIn, SignOut, and VerifySession, enforcing every Business Rule and Failure Condition already defined for each.
- **Dependencies:** The Persistence Module only.
- **Boundaries:** Never determines Configuration, Session, or Progress outcomes.
- **Inputs:** Instructions from the Application Orchestration Module.
- **Outputs:** Authentication State outcomes; instructions to the Persistence Module.

## 4. Configuration Module
- **Purpose:** Realize the Configuration Service defined in M18.
- **Responsibilities:** Executing SetEnglishLevel, SetLearningGoal, SetTopicTogglePreference, and GetCurrentConfiguration, enforcing M09's Validation Rules.
- **Dependencies:** The Persistence Module only.
- **Boundaries:** Never determines Session content or Authentication outcomes.
- **Inputs:** Instructions from the Application Orchestration Module.
- **Outputs:** Current Configuration values; instructions to the Persistence Module.

## 5. Session Generation Module
- **Purpose:** Realize the Session Generation Service defined in M18.
- **Responsibilities:** Executing GenerateSession, invoking the AI Integration Module for Topic Generation and Composition Content Generation, and confirming the result satisfies M08's Business Constraints before treating generation as successful.
- **Dependencies:** The Configuration Module (to obtain current values), the AI Integration Module, and the Persistence Module.
- **Boundaries:** Never treats AI Layer output as automatically authoritative — always confirms it against GenerateSession's Postconditions, per M21.
- **Inputs:** Instructions from the Application Orchestration Module; current Configuration values; AI Layer output.
- **Outputs:** A complete, generated Session; instructions to the Persistence Module and to the Progress Module (to trigger Progress Record creation, per M18).

## 6. Session Experience Module
- **Purpose:** Realize the Session Experience Service defined in M18.
- **Responsibilities:** Executing RecordCompositionPartEngagement, CompleteSession, and AbandonSession, enforcing M08's rule that a Session's contents are fixed after generation.
- **Dependencies:** The Persistence Module and the Progress Module (to trigger outcome recording).
- **Boundaries:** Never alters a Session's generating Configuration values or Topic(s).
- **Inputs:** Instructions from the Application Orchestration Module; the Learner's engagement with Session Composition parts.
- **Outputs:** A final Session State (Completed or Abandoned); instructions to the Progress Module.

## 7. Progress Module
- **Purpose:** Realize the Progress Service defined in M18.
- **Responsibilities:** Executing CreateProgressRecord, RecordOutcome, and GetMostRecentOutcome, enforcing M07's rule that exactly one immutable Progress Record exists per Session.
- **Dependencies:** The Persistence Module only.
- **Boundaries:** Never determines Session content, Configuration, or engagement — purely reactive to outcomes it receives.
- **Inputs:** Instructions from the Session Generation Module and the Session Experience Module.
- **Outputs:** Progress Record state; instructions to the Persistence Module.

## 8. AI Integration Module
- **Purpose:** Realize the AI Layer defined in M21.
- **Responsibilities:** Performing Topic Generation and Composition Content Generation from the minimal Configuration and Topic inputs it is given, per M21's AI Input Concepts.
- **Dependencies:** None among the other eight modules — it is invoked by, and returns output to, the Session Generation Module only.
- **Boundaries:** Never receives Learner identity or any information beyond M21's defined AI Input Concepts; never determines whether its own output constitutes a successful generation.
- **Inputs:** Current English Level, Learning Goal, Topic Toggle Preference, and (for Composition Content Generation) already-generated Topic(s).
- **Outputs:** Generated Topic(s) and Session Composition content, proposed to the Session Generation Module.

## 9. Persistence Module
- **Purpose:** Realize the Persistence Layer defined in M16 and M20.
- **Responsibilities:** Retaining and returning every Logical Data Object defined in M17, exactly as instructed by the Domain modules that own them.
- **Dependencies:** None — it depends on no other module.
- **Boundaries:** Never determines an outcome or applies a business rule.
- **Inputs:** Information to retain, and requests to retrieve previously retained information, from the Identity & Access, Configuration, Session Generation, Session Experience, and Progress Modules.
- **Outputs:** Retained information, returned to the requesting Domain module.

---

# Data Flow Responsibilities

- Learner intent flows from the Presentation Module to the Application Orchestration Module, which routes it to the appropriate Domain module (Identity & Access, Configuration, Session Generation, Session Experience, or Progress).
- The Session Generation Module is the only module that invokes the AI Integration Module, and it does so only after obtaining current values from the Configuration Module.
- The Session Generation Module and the Session Experience Module are the only modules that trigger the Progress Module, corresponding exactly to M18's Service Relationships (Session Generation triggers CreateProgressRecord; Session Experience triggers RecordOutcome).
- Every Domain module (Identity & Access, Configuration, Session Generation, Session Experience, Progress) communicates with the Persistence Module directly, but never with each other's underlying stored data except through its own defined Operations.
- Outcomes flow back from the invoked Domain module through the Application Orchestration Module to the Presentation Module, exactly following the Request Lifecycle defined in M16.

---

# Dependency Principles

- The Presentation Module may depend only on the Application Orchestration Module.
- The Application Orchestration Module may depend only on the five Domain modules (Identity & Access, Configuration, Session Generation, Session Experience, Progress).
- The Session Generation Module may additionally depend on the Configuration Module and the AI Integration Module, per its specific Responsibilities.
- The Session Experience Module and the Session Generation Module may additionally depend on the Progress Module, per M18's Service Relationships.
- Every Domain module may depend only on the Persistence Module for retention and retrieval.
- The AI Integration Module and the Persistence Module depend on no other module.
- No module may depend on the Presentation Module — dependency direction never flows backward toward Presentation.
- No module may bypass the Application Orchestration Module's Authentication State gating.

---

# Extension Principles

- A new capability is added by introducing a new Domain module (following the same pattern as the five already defined), wired into the Application Orchestration Module, without requiring any existing module's internal behavior to change.
- A new Domain module must depend only on the Persistence Module (and, if relevant, the AI Integration Module), exactly as the existing five do — no new module may introduce a dependency pattern not already established here.
- Extension must never require the Presentation Module to bypass the Application Orchestration Module, nor require any Domain module to access another Domain module's Owned Concepts directly.
- Any extension must remain traceable through M23's chain back to an approved product requirement; a module that cannot be so traced does not belong in this architecture.

---

# Maintainability Principles

- Each of the nine modules maps to exactly one already-documented responsibility (a Service, a Layer, or the AI Layer) — no module carries more than one such responsibility, keeping the mapping between specification and implementation unambiguous.
- A change to any single module's internal behavior should never require a change to another module's Boundaries, provided the Dependency Principles above are respected.
- Every module's Inputs and Outputs are already fixed by the Service Contracts (M18) and Functional Specification (M13); maintainability is achieved by preserving these contracts even as internal behavior evolves.
- Documentation and implementation must remain in lockstep: any change to a module's Purpose, Responsibilities, Dependencies, or Boundaries requires a new, explicit milestone, per M24's Change Management Principles — never a silent implementation-only change.

---

# Implementation Constraints

1. Exactly nine implementation modules exist in Version 1, each mapped one-to-one to a concept already established in M14, M16, M18, M19, M20, or M21 — no additional module may be introduced without a new milestone.
2. No module may violate the Dependency Principles defined above, in either direction.
3. No module other than the five Domain modules may enforce a Business Rule, Entity Rule, or Functional Area rule.
4. The Persistence Module and the AI Integration Module never determine business outcomes — they only retain/return information or propose generated content, respectively.
5. Every module's behavior must remain traceable to M02 through the chain defined in M23.

---

# Implementation Glossary

- **Implementation Module:** A concrete, engineering-realized unit of the system, mapped one-to-one to a Service, Layer, or the AI Layer already defined in prior milestones.
- **Engineering Boundary:** The explicit limit of what an Implementation Module may and may never do, mirroring the Responsibility Boundaries already established in M14 and M20.
- **Dependency Principle:** A rule governing which modules may depend on which others.
- **Extension:** The addition of a new module following the same pattern as existing modules, without altering their internal behavior.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented an Implementation Philosophy grounding every future engineering decision in already-approved documentation.
- Restated the System Layers (Presentation, Application, Domain, Persistence, AI) in implementation terms, consistent with M16, M19, M20, and M21.
- Defined nine Implementation Modules (Presentation, Application Orchestration, Identity & Access, Configuration, Session Generation, Session Experience, Progress, AI Integration, Persistence), each with Purpose, Responsibilities, Dependencies, Boundaries, Inputs, and Outputs, mapped one-to-one to concepts already established in M14–M21.
- Documented Data Flow Responsibilities, Dependency Principles, Extension Principles, Maintainability Principles, Implementation Constraints, and an Implementation Glossary — all technology-agnostic.

### Files Created
- `docs/milestones/M31-implementation-architecture-specification.md`

### Files Modified
- None. M01–M30 were not revisited or altered.

### Pending
- No further action pending within M31. Awaiting next milestone instructions.

### Risks
- This document introduces nine named Implementation Modules as a specific engineering decomposition. Each maps one-to-one to a concept already established (the five M18 Services, M19's Presentation Layer, M20's Application Layer, M21's AI Layer, and M16/M20's Persistence Layer), so no new capability was invented — but this is the first document to commit to this exact module count and naming, and should be confirmed as the intended engineering shape before any technology-specific milestone builds on it.
- The Session Generation Module is defined with dependencies on both the Configuration Module and the AI Integration Module, which is a slightly richer dependency set than the other Domain modules. This directly reflects M18's and M21's already-established relationships (GenerateSession needs current Configuration values and invokes the AI Layer), not a new architectural decision.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
