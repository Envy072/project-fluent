# M14 — Conceptual System Architecture

**Status:** Draft
**Owner:** Product
**Milestone:** M14
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M13 — Functional Specification](./M13-functional-specification.md)

---

# Overview

The Conceptual System Architecture describes Project Fluent as a system of logical modules — the major conceptual units the product is organized into, and how they relate. Where M13's Functional Specification defined precise behavioral contracts, this document steps back one level to ask what the product's logical structure is: what modules exist, what each is responsible for, and how information conceptually moves between them. It contains no technology, deployment, or implementation detail — it exists so that any future technical architecture has an agreed conceptual shape to implement, not to invent one of its own.

---

# System Modules

## 1. Identity & Access Module
- **Purpose:** Establish and govern a Learner's Authentication State.
- **Responsibilities:** Registering new Learners; verifying returning Learners; ending authenticated sessions; recognizing a persisted authenticated state.
- **Inputs:** Account creation details; sign-in credentials; sign-out requests.
- **Outputs:** A current Authentication State (Signed In or Signed Out) for a given Learner.
- **Owned Concepts:** Learner Identity, Authentication State (per M10).
- **Constraints:** Must be the sole conceptual gate through which every other module's access to a Learner is granted, per M13's Functional Interactions.

## 2. Learner Hub Module
- **Purpose:** Serve as the single conceptual point where a Signed In Learner's current state is presented and acted upon.
- **Responsibilities:** Presenting current Learning Configuration; presenting the most recent Progress outcome; providing the entry point into Session Generation.
- **Inputs:** Current Learning Configuration state (from the Configuration Module); most recent Progress outcome (from the Progress Module); the Learner's current Authentication State (from the Identity & Access Module).
- **Outputs:** A single, coherent presentation combining these three inputs, and a request to generate a Session.
- **Owned Concepts:** The Dashboard concept as defined in M04 and M10.
- **Constraints:** Must never present anything beyond Learning Configuration, Progress reflection, and the Session Generation entry point (per M02's FR-DASH-06 and FR-SET-04).

## 3. Configuration Module
- **Purpose:** Capture, store, and expose the Learner's English Level, Learning Goal, and Topic Toggle Preference.
- **Responsibilities:** Accepting and validating changes to any of the three Configuration options; always holding exactly one current value per option; making current values available to the Session Generation Module.
- **Inputs:** A Learner's selection of a Level, Goal, or Toggle value.
- **Outputs:** The current value of each Configuration option.
- **Owned Concepts:** English Level, Learning Goal, Topic Toggle Preference (per M09).
- **Constraints:** Must never determine or influence Session content itself — it only holds and exposes values for the Session Generation Module to consume.

## 4. Session Generation Module
- **Purpose:** Produce one complete Session from a Learner's current Learning Configuration.
- **Responsibilities:** Selecting Topic(s) according to the Topic Toggle Preference; assembling all seven Session Composition parts; fixing the Session's Configuration values and Topic(s) at the moment of creation.
- **Inputs:** Current English Level, Learning Goal, and Topic Toggle Preference (from the Configuration Module).
- **Outputs:** One complete, self-contained Session, ready for the Session Experience Module.
- **Owned Concepts:** Session, Topic, Session Composition (per M07, M08, M10).
- **Constraints:** Must never produce a partial Session; must never allow manual topic selection (per FR-SESS-07); must never generate a new Session while another is already In Progress for the same Learner.

## 5. Session Experience Module
- **Purpose:** Let the Learner work through a generated Session to a defined end.
- **Responsibilities:** Presenting the Session's composition parts in sequence; tracking the Learner's progression through them; determining whether the Session reaches Completed or Abandoned.
- **Inputs:** A complete Session (from the Session Generation Module); the Learner's engagement with each composition part.
- **Outputs:** A final Session state — Completed or Abandoned — passed to the Progress Module.
- **Owned Concepts:** Session states (Generated, In Progress, Completed, Abandoned), per M07.
- **Constraints:** Must never alter the Session's Configuration values or Topic(s) once received; must never present more than one Session at a time.

## 6. Progress Module
- **Purpose:** Record and reflect the outcome of a Learner's engagement with each Session.
- **Responsibilities:** Creating a Progress Record when a Session begins; finalizing that Progress Record's outcome when the Session ends; making the most recent outcome available to the Learner Hub Module.
- **Inputs:** A final Session state (from the Session Experience Module).
- **Outputs:** A Recorded Progress Record with an outcome of Completed or Incomplete.
- **Owned Concepts:** Progress Record (per M07).
- **Constraints:** Must never produce more or fewer than one Progress Record per Session; must never allow a Recorded outcome to change afterward.

---

# Module Relationships

- The **Identity & Access Module** is a prerequisite for every other module — the Learner Hub, Configuration, Session Generation, Session Experience, and Progress Modules only operate for a Learner whose Authentication State is Signed In.
- The **Learner Hub Module** is the conceptual meeting point of the **Configuration Module** and the **Progress Module** — it does not generate or record anything itself, but presents what those modules currently hold.
- The **Configuration Module** logically precedes the **Session Generation Module** — the latter cannot act without current values from the former.
- The **Session Generation Module** logically precedes the **Session Experience Module** — the latter has no independent starting point and always begins from a Session the former produced.
- The **Session Experience Module** logically precedes the **Progress Module** — the latter's behavior is entirely reactive to outcomes the former produces.
- The **Progress Module** logically feeds back into the **Learner Hub Module**, closing the conceptual loop described in M05's Returning User Flow.

---

# Information Flow

1. A Learner's Authentication State, established by the Identity & Access Module, permits entry into the Learner Hub Module.
2. The Learner Hub Module reads current values from the Configuration Module and the most recent outcome from the Progress Module, and presents them together.
3. A change made at the Learner Hub Module is passed to the Configuration Module, which updates its held current values accordingly.
4. A Session Generation request made at the Learner Hub Module is passed, together with the Configuration Module's current values, to the Session Generation Module.
5. The Session Generation Module produces a complete Session and passes it to the Session Experience Module.
6. The Learner's engagement, tracked by the Session Experience Module, results in a final Session state, which is passed to the Progress Module.
7. The Progress Module finalizes a Progress Record and makes it available for the Learner Hub Module to present on the Learner's next visit.

Information flows in one logical direction through this sequence for any single Session; there is no step in which a later module sends information back to alter an earlier module's already-used state (e.g., the Session Experience Module never modifies the Configuration Module).

---

# Responsibility Boundaries

| Module | Responsible For | Explicitly Not Responsible For |
|---|---|---|
| Identity & Access | Establishing and governing Authentication State. | Holding Learning Configuration, Session, or Progress information. |
| Learner Hub | Presenting current state and providing the Session Generation entry point. | Storing Configuration values or Progress outcomes itself; generating Sessions itself. |
| Configuration | Holding and validating the three Configuration option values. | Determining Session content or difficulty directly. |
| Session Generation | Producing one complete Session from current Configuration. | Presenting the Session to the Learner or tracking engagement with it. |
| Session Experience | Presenting a Session and tracking the Learner's progression through it. | Altering the Session's Configuration values or Topic(s); recording the final Progress outcome itself. |
| Progress | Recording and exposing Session outcomes. | Determining Session content, difficulty, or engagement — it only reacts to outcomes it receives. |

---

# Cross-Cutting Concerns

- **Authentication:** Every module other than Identity & Access depends on a valid, Signed In Authentication State to operate at all, per M13's Functional Constraints.
- **Configuration Consistency:** The Configuration Module's values must remain consistent (exactly one current value per option) regardless of which other module is reading them at a given moment, per M09.
- **Progress Tracking:** The Progress Module's behavior must remain consistent across every Session, ensuring no Session is ever left without a corresponding, eventually Recorded Progress Record, per M07.
- **Validation:** Every module that accepts a Learner-provided value (Identity & Access for credentials, Configuration for Level/Goal/Toggle) must reject values outside their defined valid sets, per M09's Validation Rules.
- **Consistency:** The same concept must behave identically no matter which module is currently referencing it, reinforcing M11's and M12's Consistency principles at the system level.

---

# Architecture Constraints

The following must remain true regardless of how Version 1 is eventually implemented:

1. No module may bypass the Identity & Access Module to act on behalf of a Learner.
2. The Configuration Module is the single source of truth for a Learner's current Learning Configuration; no other module may hold or expose a conflicting value.
3. The Session Generation Module is the only module permitted to create a Session; no other module may create one independently.
4. Once a Session is produced, its Configuration values and Topic(s) are fixed and may not be altered by any module, including the Configuration Module itself.
5. The Progress Module is the only module permitted to finalize a Progress Record; the Session Experience Module may only supply the final Session state that triggers it.
6. Information flows in the sequence defined in Information Flow above for any single Session; no module may act out of this sequence (e.g., Progress Recording cannot precede a Session's Session Experience outcome).

---

# Conceptual Glossary

- **System Module:** A major, logically self-contained unit of the product's conceptual structure, with defined responsibilities and boundaries.
- **Responsibility:** A behavior or piece of state a module is accountable for.
- **Boundary:** The explicit limit of what a module is, and is not, accountable for.
- **Owned Concept:** A concept from M07's Domain Model or M10's Content Architecture that a given module is the conceptual home of.
- **Information Flow:** The logical sequence in which information moves between modules to accomplish a product outcome (e.g., generating and completing a Session).
- **Cross-Cutting Concern:** A behavior or rule that applies across multiple modules rather than belonging to any single one.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined six System Modules (Identity & Access, Learner Hub, Configuration, Session Generation, Session Experience, Progress), each with Purpose, Responsibilities, Inputs, Outputs, Owned Concepts, and Constraints.
- Documented Module Relationships, a directional Information Flow across the full Session lifecycle, and a Responsibility Boundaries table.
- Identified Cross-Cutting Concerns (Authentication, Configuration Consistency, Progress Tracking, Validation, Consistency) already established in prior milestones.
- Documented Architecture Constraints that must hold regardless of implementation technology, and a Conceptual Glossary.

### Files Created
- `docs/milestones/M14-conceptual-system-architecture.md`

### Files Modified
- None. M01–M13 were not revisited or altered.

### Pending
- No further action pending within M14. Awaiting next milestone instructions.

### Risks
- The six System Modules map closely to M13's six Functional Areas and M06's feature categories, by design — this document intentionally reframes existing, approved product structure into conceptual modules rather than introducing new structure. Any future technical architecture should treat this module boundary as a starting point, not a final technical decomposition.
- The one-directional Information Flow (Configuration → Session Generation → Session Experience → Progress → Learner Hub) is presented as the only conceptual sequence; this is consistent with every prior milestone's flows (M05, M08, M13) but has been made explicit here for the first time as an architectural constraint, and should be validated as intentional.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
