# M17 — Logical Data Model

**Status:** Draft
**Owner:** Product / Architecture
**Milestone:** M17
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M16 — Technical Architecture](./M16-technical-architecture.md)

---

# Overview

The Logical Data Model defines the data Project Fluent must be able to represent, described purely as business concepts and their relationships. It draws directly from the Domain Model (M07) and Content Architecture (M10) already established, and restates them here in the specific shape a future data design will need: named objects, their conceptual attributes, their relationships, and the rules that must always hold. It contains no data types, identifiers, tables, or storage technology — only the logical shape of the information itself.

---

# Logical Data Objects

### 1. Learner
- **Purpose:** Represents a distinct, registered person using the product.
- **Description:** The anchor object of the entire data model; every other object exists in relation to a Learner.
- **Owned By:** Itself.
- **Lifecycle:** Registered → Active, per M07.

### 2. Authentication State
- **Purpose:** Represents whether a Learner is currently recognized as signed in.
- **Description:** A single, always-current indicator of a Learner's access status.
- **Owned By:** The Learner.
- **Lifecycle:** Signed Out → Signed In → Signed Out, per M10.

### 3. English Level
- **Purpose:** Represents the Learner's declared proficiency.
- **Description:** One value among the six defined Levels (A1–C2).
- **Owned By:** The Learner.
- **Lifecycle:** Unconfigured → Configured → Reconfigured, per M09.

### 4. Learning Goal
- **Purpose:** Represents the Learner's declared purpose for practicing.
- **Description:** One value among the six defined Goals.
- **Owned By:** The Learner.
- **Lifecycle:** Unconfigured → Configured → Reconfigured, per M09.

### 5. Topic Toggle Preference
- **Purpose:** Represents whether the Learner wants a single shared Topic across a Session.
- **Description:** A single Enabled/Disabled value.
- **Owned By:** The Learner.
- **Lifecycle:** Defaulted → Changed, per M09.

### 6. Session
- **Purpose:** Represents one complete, generated unit of English practice.
- **Description:** The central data object produced each time a Learner generates practice content.
- **Owned By:** The Learner it was generated for.
- **Lifecycle:** Generated → In Progress → Completed or Abandoned, per M07 and M08.

### 7. Topic
- **Purpose:** Represents the AI-generated subject matter a Session, or part of a Session, is built around.
- **Description:** Exists only in relation to the Session that produced it.
- **Owned By:** The Session.
- **Lifecycle:** Generated → Assigned, per M07.

### 8. Session Composition
- **Purpose:** Represents the seven required parts that together make up a complete Session.
- **Description:** The structural body of a Session — Reading, Listening, Speaking, Writing, Vocabulary, Grammar, and Quiz — per M08.
- **Owned By:** The Session.
- **Lifecycle:** Created with the Session; each part is engaged with during Learning and reaches its own end, per M10.

### 9. Progress Record
- **Purpose:** Represents the recorded outcome of a Learner's engagement with a specific Session.
- **Description:** The single record of whether a Session was ultimately Completed or left Incomplete.
- **Owned By:** The Learner, through the Session it corresponds to.
- **Lifecycle:** Pending → Recorded (Completed or Incomplete), per M07.

No other logical data object exists in Version 1; this list is exhaustive and reflects only what M01–M16 have already established.

---

# Logical Attributes

### Learner
- Identity (the fact of being a distinct, registered individual)
- Account Status (Registered or Active)

### Authentication State
- Current Status (Signed In or Signed Out)

### English Level
- Value (one of A1, A2, B1, B2, C1, C2)
- Configuration Status (Unconfigured, Configured, or Reconfigured)

### Learning Goal
- Value (one of General English, IELTS, Business, Travel, University, Job Interviews)
- Configuration Status (Unconfigured, Configured, or Reconfigured)

### Topic Toggle Preference
- Value (Enabled or Disabled)
- Preference Status (Defaulted or Changed)

### Session
- Generating English Level (the Level value fixed at the moment of creation)
- Generating Learning Goal (the Goal value fixed at the moment of creation)
- Generating Topic Toggle Preference (the toggle value fixed at the moment of creation)
- Session State (Generated, In Progress, Completed, or Abandoned)

### Topic
- Subject Matter (the conceptual subject the Topic represents)
- Assignment Scope (whether it applies to the whole Session or to a specific Session Composition part, per the Topic Toggle Preference used at generation)

### Session Composition
- Parts (Reading, Listening, Speaking, Writing, Vocabulary, Grammar, Quiz)
- Engagement Status per part (Not Started, In Progress, or Reached End)

### Progress Record
- Outcome (Completed or Incomplete)
- Record Status (Pending or Recorded)

No attribute listed here implies a data type, identifier, or storage format — each is a conceptual property only.

---

# Relationships

- A **Learner** has exactly one **Authentication State**.
- A **Learner** has exactly one current **English Level**.
- A **Learner** has exactly one current **Learning Goal**.
- A **Learner** has exactly one current **Topic Toggle Preference**.
- A **Learner** relates to many **Sessions** over time, though at most one may be In Progress at a time, per M07.
- A **Session** is generated from a specific English Level, Learning Goal, and Topic Toggle Preference — captured as fixed values on the Session itself, not as a live link to the Learner's current configuration.
- A **Session** relates to one or more **Topics**, depending on the Topic Toggle Preference used at generation.
- A **Session** relates to exactly one **Session Composition**.
- A **Session** relates to exactly one **Progress Record**.
- A **Topic** relates to exactly one **Session**.
- A **Progress Record** relates to exactly one **Session**, and through it, to exactly one **Learner**.

These are business relationships only; no cardinality notation, foreign key, or storage mechanism is implied.

---

# Data Lifecycle

### Learner
- **Created:** At Account Creation.
- **Updated:** Not applicable beyond Account Status changes already covered by Authentication State.
- **Read:** Whenever any other object needs to confirm its owning Learner.
- **Retired:** Not applicable in Version 1 — no deletion or deactivation behavior is defined.

### Authentication State
- **Created:** At Account Creation, as Signed In.
- **Updated:** On every Sign In or Sign Out.
- **Read:** Before any protected data object may be accessed.
- **Retired:** Not applicable — it persists for the life of the Learner.

### English Level / Learning Goal / Topic Toggle Preference
- **Created:** Learning Goal and English Level are created (Unconfigured) at first Dashboard visit; Topic Toggle Preference is created (Defaulted) at the same moment.
- **Updated:** Whenever the Learner sets or changes the value.
- **Read:** Whenever the Dashboard is presented, and whenever a Session is generated.
- **Retired:** Not applicable — a current value always exists once first configured.

### Session
- **Created:** At Session Generation.
- **Updated:** As it moves from Generated to In Progress to Completed or Abandoned.
- **Read:** Whenever the Learner is engaged in the Learning Session Experience, and whenever its outcome is needed for Progress Recording.
- **Retired:** Not applicable — a Session remains part of the Learner's data indefinitely once created, per M07's exclusion of an archival state.

### Topic
- **Created:** At Session Generation, together with the Session.
- **Updated:** Not applicable — a Topic does not change after assignment.
- **Read:** Whenever its Session's composition parts are presented.
- **Retired:** Not applicable — it persists as part of its Session indefinitely.

### Session Composition
- **Created:** At Session Generation, together with the Session.
- **Updated:** As the Learner engages with each part during the Learning Session Experience.
- **Read:** Whenever the Session is presented or its completion is evaluated.
- **Retired:** Not applicable — it persists as part of its Session indefinitely.

### Progress Record
- **Created:** The moment a Session becomes In Progress (as Pending).
- **Updated:** Once, when the Session reaches Completed or Abandoned (moving to Recorded).
- **Read:** Whenever the Dashboard reflects the Learner's most recent outcome.
- **Retired:** Not applicable — once Recorded, it remains part of the Learner's data indefinitely.

---

# Data Integrity Rules

- A Learner must exist before any Authentication State, English Level, Learning Goal, Topic Toggle Preference, Session, or Progress Record can exist for them.
- A Learner has exactly one current value for Authentication State, English Level, Learning Goal, and Topic Toggle Preference at any time — never zero, never more than one.
- A Session's Generating English Level, Generating Learning Goal, and Generating Topic Toggle Preference are fixed at creation and never change afterward, regardless of later changes to the Learner's current configuration.
- A Session always has exactly one Session Composition, containing all seven Parts — never partial.
- Every Topic belongs to exactly one Session and is never shared across Sessions.
- Every Session has exactly one Progress Record; every Progress Record corresponds to exactly one Session.
- A Progress Record's Outcome, once Recorded, is immutable.
- A Learner may have at most one Session with a Session State of In Progress at any given time.

---

# Data Ownership

| Logical Data Object | Owned By |
|---|---|
| Learner | Itself |
| Authentication State | Learner |
| English Level | Learner |
| Learning Goal | Learner |
| Topic Toggle Preference | Learner |
| Session | Learner |
| Topic | Session |
| Session Composition | Session |
| Progress Record | Learner (via Session) |

---

# Logical Data Constraints

1. Every logical data object in Version 1 belongs to exactly one of the nine objects defined in this document — no additional data object exists.
2. No English Level, Learning Goal, Topic Toggle Preference, Session, Topic, Session Composition, or Progress Record can exist without an associated Learner.
3. A Session's fixed generating values are permanently disconnected from the Learner's current configuration once the Session is created.
4. No data object in Version 1 is deleted or archived by defined product behavior; all retained data persists indefinitely once created.
5. Attributes described in this document represent conceptual properties only and carry no implied data type, identifier, or storage structure.

---

# Data Glossary

- **Logical Data Object:** A named, conceptual unit of information the product must be able to represent (e.g., Learner, Session).
- **Logical Attribute:** A conceptual property of a data object, described in business terms without a data type.
- **Relationship:** A logical connection between two data objects, described without cardinality notation or storage mechanism.
- **Data Lifecycle:** The conceptual sequence of Created, Updated, Read, and Retired states a data object passes through.
- **Data Integrity Rule:** A rule that must always hold true about a data object or its relationships, regardless of implementation.
- **Ownership:** The data object logically responsible for another data object's existence.
- **Fixed Value:** A value captured onto a Session at creation that does not change even if its originating configuration later changes.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Identified nine Logical Data Objects (Learner, Authentication State, English Level, Learning Goal, Topic Toggle Preference, Session, Topic, Session Composition, Progress Record), all already established across M07 and M10.
- Documented Purpose, Description, Owned By, and Lifecycle for each object, and their conceptual Logical Attributes with no data types or identifiers.
- Documented Relationships, Data Lifecycle (Created/Updated/Read/Retired) for each object, Data Integrity Rules, Data Ownership, Logical Data Constraints, and a Data Glossary.

### Files Created
- `docs/milestones/M17-logical-data-model.md`

### Files Modified
- None. M01–M16 were not revisited or altered.

### Pending
- No further action pending within M17. Awaiting next milestone instructions.

### Risks
- No new data objects were introduced; this document is a restatement of M07's Domain Model and M10's Content Architecture in the specific "object/attribute/relationship" shape this milestone requested. Where any apparent difference in wording exists, M07 and M10 remain the governing, immutable source.
- Every object's "Retired" lifecycle state is marked "Not applicable in Version 1," since no prior milestone defines deletion or archival behavior. This should be revisited explicitly if a future milestone introduces data retention or deletion policy.

### Open Questions
- None beyond those already raised in earlier milestones (notably M07's and M10's open question on Session/Progress history retention), which remain outstanding and are not reintroduced here.

Waiting for the next milestone.
