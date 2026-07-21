# M20 — Backend Architecture

**Status:** Draft
**Owner:** Product / Architecture
**Milestone:** M20
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M19 — Frontend Architecture](./M19-frontend-architecture.md)

---

# Overview

The Backend Architecture defines the internal logical structure of everything behind the Presentation Layer described in M19 — the Application, Domain, and Persistence Layers first introduced in M16. Where M19 opened up the frontend's internal shape, this document does the same for the backend: it describes how the Application, Domain, and Persistence Layers are responsible for business processing, validation, and persistence, and how they coordinate to fulfill the Service Contracts defined in M18. It remains entirely conceptual — no language, framework, database, API, or deployment detail is introduced.

---

# Backend Layers

The backend consists of the three non-Presentation layers already established in M16: Application, Domain, and Persistence. No new layer is introduced here; this document elaborates their internal responsibility rather than redefining their boundaries.

## 1. Application (Orchestration) Layer
- **Purpose:** Coordinate the sequence of logical operations needed to fulfill a request arriving from the Presentation Layer, per M16.
- **Responsibilities:** Confirming the Learner's Authentication State before any further processing; identifying which Service Operation(s), per M18, a request corresponds to; sequencing multi-step operations (e.g., a Session Generation request that also triggers Progress Record creation); returning a System Response to the Presentation Layer.
- **Inputs:** Requests representing a Learner's intent, arriving from the Presentation Layer (per M19's Interaction Layer).
- **Outputs:** Instructions to the Domain Layer; results returned to the Presentation Layer.
- **Constraints:** Must never embody business rules itself — it only verifies access and sequences calls to the Domain Layer, per M16.

## 2. Domain Layer
- **Purpose:** Embody the business entities, rules, and Service Operations that define correct product behavior, per M07–M18.
- **Responsibilities:** Hosting the five logical Services defined in M18 (Identity & Access, Configuration, Session Generation, Session Experience, Progress); enforcing every Entity Rule (M07), Business Rule (M08, M09), and Functional Area rule (M13) as each Service Operation executes; producing outcomes that match a defined Success or Failure Condition for every operation.
- **Inputs:** Instructions from the Application Layer; information retrieved from the Persistence Layer.
- **Outputs:** Outcomes (success or failure, per M13 and M18) to the Application Layer; instructions to the Persistence Layer to retain or retrieve information.
- **Constraints:** Must never be aware of how a request was presented or how information is technically stored, per M16; is the sole layer permitted to determine business correctness.

## 3. Persistence Layer
- **Purpose:** Retain and provide back the Logical Data Objects defined in M17, so they survive beyond a single interaction.
- **Responsibilities:** Retaining current Learning Configuration values, Sessions (with their Topics and Session Composition), and Progress Records on behalf of the Domain Layer; returning previously retained information exactly as requested.
- **Inputs:** Information to retain, and requests to retrieve previously retained information, both from the Domain Layer only.
- **Outputs:** Retained information, returned to the Domain Layer.
- **Constraints:** Must never determine outcomes or apply business rules — it only retains and returns exactly what the Domain Layer instructs, per M16.

---

# Business Processing Responsibilities

**Belongs to Business Processing (the Domain Layer):**
- Enforcing that every Configuration value belongs to its defined valid set, per M09.
- Enforcing that a Session always contains all seven Session Composition parts, per M08.
- Enforcing that a Session's generating values are fixed at creation and never change afterward, per M07.
- Enforcing that exactly one Progress Record exists per Session, and that its outcome is immutable once Recorded, per M07.
- Determining whether any Service Operation defined in M18 succeeds or fails, according to its stated Preconditions and Failure Conditions.

**Must never belong to Business Processing:**
- Capturing raw Learner interaction or rendering any presented information — that belongs to the Presentation Layer, per M19.
- Determining the Learner's logical position or permissible page transitions — that is the Navigation Layer's responsibility, per M19.
- Deciding how or where information is technically retained — that is strictly the Persistence Layer's concern, per M16.
- Performing gating or sequencing on behalf of a request — that belongs to the Application Layer.

---

# Validation Responsibilities

Validation in the backend occurs in two distinct places, consistent with M16's layering:

- **Application Layer validation:** Confirms that the Learner's Authentication State permits the request, and that the request is well-formed enough to be routed (e.g., it references a recognized Service Operation). This is a gating check, not a business judgment.
- **Domain Layer validation:** The authoritative validation of every business rule — that a Configuration value is among its defined set (M09), that a Session Generation request's Preconditions are met (M18), that a Session Composition part's Engagement Status is being updated on an In Progress Session (M18). This validation is final; no request is considered valid until the Domain Layer confirms it.

The backend never assumes a request has already been validated by the frontend (per M19's Interaction Layer) — every request is fully re-validated by the Domain Layer regardless of any check already performed upstream, per M16's Dependency Rules and Separation of Concerns.

---

# Persistence Responsibilities

- The Persistence Layer is responsible for retaining every Logical Data Object defined in M17 for as long as it exists according to that object's Data Lifecycle — indefinitely, since no object in Version 1 is deliberately deleted or archived.
- The Persistence Layer is responsible for returning retained information exactly as it was retained, without alteration, when the Domain Layer requests it.
- The Persistence Layer is responsible for supporting the relationships defined in M17 (e.g., a Session's relationship to its Topic(s), Session Composition, and Progress Record) conceptually, without determining what those relationships mean.
- The Persistence Layer is never responsible for deciding whether information should be retained, updated, or returned — it only acts on the Domain Layer's instruction.

---

# Service Coordination

To fulfill a single logical Service Operation, the backend layers coordinate as follows, using Session Generation as an illustrative example:

1. The Application Layer receives a request corresponding to the GenerateSession operation (per M18) and confirms the Learner's Authentication State.
2. The Application Layer instructs the Domain Layer to execute GenerateSession.
3. The Domain Layer's Configuration Service supplies the current English Level, Learning Goal, and Topic Toggle Preference (retrieved via the Persistence Layer if not already held).
4. The Domain Layer's Session Generation Service evaluates GenerateSession's Preconditions; if met, it assembles the Session, its Topic(s), and its Session Composition.
5. The Domain Layer instructs the Persistence Layer to retain the newly created Session.
6. Per M18's Service Relationships, the Domain Layer's Progress Service executes CreateProgressRecord for the new Session, and instructs the Persistence Layer to retain the new, Pending Progress Record.
7. The Domain Layer returns the completed outcome to the Application Layer, which returns the corresponding System Response to the Presentation Layer.

This coordination pattern — Application gates and sequences, Domain executes and decides, Persistence retains and returns — applies identically to every Service Operation defined in M18.

---

# Backend Boundaries

| Concern | Backend Responsibility | Frontend Responsibility (per M19) |
|---|---|---|
| Determining business correctness (e.g., can a Session be generated) | Yes — exclusively the Domain Layer. | No. |
| Executing a Service Operation (per M18) | Yes — the Domain Layer. | No. |
| Authoritative validation of Configuration, Session, or Progress rules | Yes — the Domain Layer, final and unconditional. | No — the frontend may perform basic format checks, but they are never authoritative. |
| Retaining information long-term | Yes — the Persistence Layer. | No — frontend state is temporary and local, per M19. |
| Gating requests by Authentication State | Yes — the Application Layer, authoritatively. | The frontend's Navigation Layer reflects this gate for positioning, but does not enforce it authoritatively. |
| Displaying information or capturing raw interaction | No. | Yes — the View and Interaction Layers, per M19. |
| Determining the Learner's logical page position | No — this is a Presentation-only concern. | Yes — the Navigation Layer, per M19. |

---

# Backend Constraints

The following must always remain true:

1. The Domain Layer is the only layer permitted to determine whether a Service Operation succeeds or fails.
2. The Persistence Layer never determines an outcome — it only retains and returns exactly what the Domain Layer instructs.
3. The Application Layer never embodies business rules — it only gates and sequences.
4. Every request is fully validated by the Domain Layer regardless of any validation already performed by the frontend, per M19.
5. The backend never depends on how the frontend is internally structured — it only receives requests and returns System Responses across the boundary defined in M16.
6. Every Service Coordination sequence (Application gates and sequences, Domain executes and decides, Persistence retains and returns) occurs in full for every Service Operation; no step is skipped.

---

# Backend Glossary

- **Business Processing:** The determination of business correctness for a request, performed exclusively by the Domain Layer.
- **Authoritative Validation:** The final, unconditional validation performed by the Domain Layer, independent of any prior frontend check.
- **Service Coordination:** The pattern by which the Application, Domain, and Persistence Layers work together to fulfill a single Service Operation.
- **Gating:** The Application Layer's responsibility of confirming a Learner's Authentication State before allowing further processing.
- **Retained Information:** A Logical Data Object (per M17) held by the Persistence Layer across time, on the Domain Layer's instruction.
- **Backend Boundary:** The division between backend responsibility (business correctness, execution, retention) and frontend responsibility (display, capture, local reflection, navigation), as defined in this document and M19.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Elaborated the three non-Presentation layers from M16 (Application, Domain, Persistence) with full Purpose, Responsibilities, Inputs, Outputs, and Constraints, remaining consistent with M16's original definitions.
- Documented Business Processing Responsibilities, Validation Responsibilities (Application-level gating vs. Domain-level authoritative validation), and Persistence Responsibilities.
- Documented Service Coordination using GenerateSession as a worked example spanning all three backend layers, per M18's Service Contracts.
- Documented a Backend Boundaries table mirroring and complementing M19's Frontend Boundaries table, Backend Constraints, and a Backend Glossary.

### Files Created
- `docs/milestones/M20-backend-architecture.md`

### Files Modified
- None. M01–M19 were not revisited or altered.

### Pending
- No further action pending within M20. Awaiting next milestone instructions.

### Risks
- The Service Coordination example (GenerateSession) illustrates the interaction between the Configuration, Session Generation, and Progress Services defined in M18. This is presented as illustrative of the general coordination pattern, not as an exhaustive walkthrough of every Service Operation; other operations follow the same pattern but were not each individually traced.
- This document reinforces M19's note that backend validation is always authoritative regardless of frontend checks. This dual-layer validation model (frontend format check, backend authoritative check) is now stated consistently in both M19 and M20 and should be treated as settled unless a future milestone revisits it.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
