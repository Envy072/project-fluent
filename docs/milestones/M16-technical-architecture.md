# M16 — Technical Architecture

**Status:** Draft
**Owner:** Product / Architecture
**Milestone:** M16
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M15 — Quality Attributes](./M15-quality-attributes.md)

---

# Overview

The Technical Architecture defines the logical layers that will carry out the System Modules described in M14, in service of the product behavior defined in M13, while upholding the quality expectations set in M15. It exists to give the previously defined Product Architecture a technology-agnostic shape — a set of layers, responsibilities, and rules that any future technical implementation must conform to, regardless of which specific technologies are eventually chosen. Nothing in this document names a technology, language, framework, database, protocol, or deployment model; it describes structure and responsibility only.

---

# Architecture Layers

## 1. Presentation Layer
- **Purpose:** Mediate between the Learner and the system's logical behavior.
- **Responsibilities:** Capturing the Learner's actions (per M13's User Actions); presenting information and outcomes back to the Learner (per M13's System Responses); reflecting the pages and navigation defined in M04.
- **Inputs:** Learner actions; outcomes returned from the Application Layer.
- **Outputs:** Requests representing a Learner's intent, sent to the Application Layer; presented information for the Learner.
- **Constraints:** Must never determine whether a request succeeds or fails — it only captures and presents, per M14's and M16's Separation of Concerns.

## 2. Application (Orchestration) Layer
- **Purpose:** Coordinate the sequence of logical operations needed to fulfill a Learner's request.
- **Responsibilities:** Confirming the Learner's Authentication State before proceeding (per M14's Architecture Constraints); routing a request to the correct Domain behavior; sequencing multi-step operations, such as a Session Generation request that leads into the Session Experience and then Progress Recording (per M14's Information Flow).
- **Inputs:** Requests from the Presentation Layer.
- **Outputs:** Instructions to the Domain Layer; results returned to the Presentation Layer.
- **Constraints:** Must never embody business rules itself — it only sequences and directs; all rule enforcement belongs to the Domain Layer.

## 3. Domain Layer
- **Purpose:** Embody the business entities, rules, and logic that define correct product behavior.
- **Responsibilities:** Enforcing the Entity Rules (M07), Business Rules (M08, M09), and Functional Area rules (M13) for every System Module described in M14 — Identity & Access, Configuration, Session Generation, Session Experience, and Progress; representing Learner, English Level, Learning Goal, Topic Toggle Preference, Session, Topic, and Progress Record as the concepts they truly are.
- **Inputs:** Instructions from the Application Layer; information retrieved from the Persistence Layer.
- **Outputs:** Outcomes (success or failure, per M13's Success and Failure Conditions) to the Application Layer; instructions to the Persistence Layer to retain or retrieve information.
- **Constraints:** Must never be aware of how information is presented or how it is technically stored — it depends only on the concepts and rules already defined in M07–M13.

## 4. Persistence Layer
- **Purpose:** Retain and provide back domain information across time, so it survives beyond a single interaction.
- **Responsibilities:** Retaining current Learning Configuration values, Session records, and Progress Records on behalf of the Domain Layer; returning previously retained information when the Domain Layer requests it.
- **Inputs:** Information to retain, and requests to retrieve previously retained information, both from the Domain Layer.
- **Outputs:** Retained information, returned to the Domain Layer on request.
- **Constraints:** Must never determine outcomes or apply business rules — it only retains and returns exactly what the Domain Layer instructs, nothing more.

---

# Technical Responsibilities

| Responsibility | Belongs To |
|---|---|
| Capturing a Learner's action | Presentation Layer |
| Presenting an outcome or piece of information to the Learner | Presentation Layer |
| Verifying the Learner is Signed In before proceeding | Application Layer |
| Sequencing a multi-step operation (e.g., Generation → Experience → Progress) | Application Layer |
| Enforcing that a Configuration value is among its valid set | Domain Layer |
| Enforcing that a Session always contains all seven Session Composition parts | Domain Layer |
| Enforcing that a Session's Configuration values are fixed after generation | Domain Layer |
| Enforcing that exactly one Progress Record exists per Session | Domain Layer |
| Retaining a Learner's current Configuration across visits | Persistence Layer |
| Retaining a generated Session and its outcome | Persistence Layer |
| Returning previously retained information when asked | Persistence Layer |

---

# Request Lifecycle

The conceptual lifecycle of a single Learner request:

1. **Beginning:** The Learner takes an action (per M13's User Actions). The Presentation Layer captures it and forwards it as a request to the Application Layer.
2. **Validation:** The Application Layer confirms the Learner's Authentication State permits the request, and that the request is well-formed (e.g., references a valid Configuration option). Requests that fail this step proceed no further.
3. **Business Processing:** The Application Layer passes the request to the Domain Layer, which applies the relevant Entity Rules, Business Rules, and Functional Area logic to determine the correct outcome.
4. **Result:** The Domain Layer produces a definitive outcome, matching one of the Success or Failure Conditions already defined in M13 for the relevant Functional Area.
5. **Persistence:** Where the outcome changes information that must be remembered later (a new Configuration value, a newly generated Session, a Recorded Progress Record), the Domain Layer instructs the Persistence Layer to retain it.
6. **Presentation:** The outcome travels back through the Application Layer to the Presentation Layer, which presents the corresponding System Response to the Learner, per M13.

Every request in Version 1 follows this exact sequence; no step is skipped and no step occurs out of order.

---

# Data Flow

- Information representing a Learner's intent flows downward: Presentation Layer → Application Layer → Domain Layer → (where needed) Persistence Layer.
- Information representing an outcome flows upward: Persistence Layer → Domain Layer → Application Layer → Presentation Layer.
- At no point does information move directly between the Presentation Layer and the Domain Layer, or between the Presentation Layer and the Persistence Layer — it must always pass through the Application Layer and, where relevant, the Domain Layer.
- Information retained by the Persistence Layer is only ever read or written at the Domain Layer's instruction; it never moves on its own initiative.

---

# Dependency Rules

- The **Presentation Layer** may depend on the **Application Layer** only.
- The **Application Layer** may depend on the **Domain Layer** only.
- The **Domain Layer** may depend on the **Persistence Layer** only, for retaining and retrieving information.
- The **Persistence Layer** depends on no other layer.

**Explicitly forbidden dependencies:**
- The Presentation Layer must never depend directly on the Domain Layer or the Persistence Layer.
- The Application Layer must never depend directly on the Persistence Layer.
- The Domain Layer must never depend on the Presentation Layer or the Application Layer.
- The Persistence Layer must never depend on the Domain Layer, the Application Layer, or the Presentation Layer.

---

# Separation of Concerns

- The Presentation Layer is concerned only with capturing intent and presenting outcomes — never with deciding what the outcome should be.
- The Application Layer is concerned only with sequencing and gating — never with the business rules that determine correctness.
- The Domain Layer is concerned only with correctness according to the rules already established in M07–M13 — never with how information is displayed or technically stored.
- The Persistence Layer is concerned only with faithfully retaining and returning information — never with deciding whether that information is valid or what it means.
- Each layer's concern is isolated such that a change in one layer's responsibility (e.g., how information is presented) has no bearing on another layer's responsibility (e.g., what the business rules require).

---

# Extension Principles

- A new capability should be introduced by extending the Domain Layer with new rules or concepts, and the Application Layer with new orchestration, without requiring existing Domain rules, Persistence responsibilities, or unrelated Presentation behavior to change.
- Each System Module defined in M14 maps onto this same four-layer shape; a future module would be expected to introduce its own Domain rules and Persistence needs while reusing the same Presentation and Application patterns already established.
- Growth in the number of Learners, Sessions, or Progress Records (per M15's Scalability expectations) must be absorbable by the Persistence Layer without requiring any change to the Domain Layer's rules or the Application Layer's sequencing.
- New Learner-facing capability must still be evaluated against M01's principle that every input must earn its place — this architecture supports extension, but does not itself justify adding scope beyond what product milestones approve.

---

# Architecture Constraints

The following must always remain true, regardless of implementation:

1. Every request follows the full Request Lifecycle sequence — Beginning, Validation, Business Processing, Result, Persistence (where applicable), Presentation — with no step skipped or reordered.
2. The Domain Layer is the only layer permitted to enforce Entity Rules, Business Rules, or Functional Area rules.
3. The Persistence Layer never determines an outcome — it only retains and returns exactly what the Domain Layer instructs.
4. The Presentation Layer never determines an outcome — it only captures Learner intent and presents results.
5. A Learner's Authentication State is validated before any Domain processing occurs for that Learner, per M14.
6. No layer may be bypassed — the dependency direction defined in Dependency Rules must hold for every request, without exception.

---

# Technical Glossary

- **Layer:** A logically self-contained division of responsibility within the technical architecture (Presentation, Application, Domain, Persistence).
- **Presentation Layer:** The layer responsible for capturing Learner intent and presenting outcomes.
- **Application (Orchestration) Layer:** The layer responsible for sequencing and gating requests before they reach business logic.
- **Domain Layer:** The layer responsible for enforcing the product's business rules and representing its core concepts.
- **Persistence Layer:** The layer responsible for retaining and returning information across time.
- **Request Lifecycle:** The fixed conceptual sequence a Learner's request follows from initiation to presented outcome.
- **Dependency Rule:** A rule defining which layers are permitted to rely on which other layers.
- **Separation of Concerns:** The principle that each layer is responsible for exactly one kind of concern, and no other.
- **Extension:** The addition of new capability to the architecture without altering the correctness of existing, unrelated capability.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined four Architecture Layers (Presentation, Application/Orchestration, Domain, Persistence), each with Purpose, Responsibilities, Inputs, Outputs, and Constraints, entirely in technology-agnostic terms.
- Documented a Technical Responsibilities table mapping specific rules and behaviors from earlier milestones to the layer responsible for them.
- Documented the Request Lifecycle (Beginning → Validation → Business Processing → Result → Persistence → Presentation), Data Flow, Dependency Rules (including explicitly forbidden dependencies), Separation of Concerns, and Extension Principles.
- Documented Architecture Constraints that must always hold, and a Technical Glossary.

### Files Created
- `docs/milestones/M16-technical-architecture.md`

### Files Modified
- None. M01–M15 were not revisited or altered.

### Pending
- No further action pending within M16. Awaiting next milestone instructions.

### Risks
- This document introduces a four-layer architecture (Presentation, Application, Domain, Persistence) as the technology-agnostic shape for Version 1. This is a standard, conservative layering choice consistent with M14's System Modules, but it is the first milestone to impose a specific architectural pattern; any future technical milestone should treat this as the agreed shape rather than proposing a competing one without revisiting this document.
- Authentication/Identity & Access, treated as its own System Module in M14, is here folded into the Application Layer (for gating) and Domain Layer (for the Authentication State concept itself) rather than kept as a separate layer. This is a reasonable architectural mapping but is a first-time interpretation and should be confirmed as intended.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
