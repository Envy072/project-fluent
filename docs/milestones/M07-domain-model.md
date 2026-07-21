# M07 — Product Domain Model

**Status:** Draft
**Owner:** Product
**Milestone:** M07
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md), [M02 — Product Requirements](./M02-product-requirements.md), [M03 — User Personas and Stories](./M03-user-personas-and-stories.md), [M04 — Information Architecture](./M04-information-architecture.md), [M05 — User Flows](./M05-user-flows.md), [M06 — Feature Breakdown](./M06-feature-breakdown.md)

---

# Overview

The Domain Model defines the logical business entities that make up Project Fluent — the concepts the product is actually *about*, independent of any interface, page, or feature packaging. Where M06 broke the product into features to be built, this document steps back and asks what real-world business concepts those features operate on: who the Learner is, what a Session represents, what a Topic is, and how these concepts relate. This is a conceptual model, not a technical one — it contains no tables, classes, or APIs, and exists so that every future technical decision has a single, consistent business vocabulary to build from.

---

# Core Business Entities

### 1. Learner
- **Purpose:** Represents a person using Project Fluent to practice English.
- **Description:** The Learner is the central entity in the domain. Every other entity in Version 1 — Level, Goal, Topic Toggle Preference, Session, Progress Record — exists in relation to a specific Learner.
- **Lifecycle:** Registered → Active. A Learner becomes Registered upon Account Creation (per M06's F-01) and remains Active for as long as they use the product. Version 1 defines no further lifecycle states (e.g., suspension, deletion).
- **Owner:** The Learner owns themselves — no other entity governs a Learner's existence.

### 2. English Level
- **Purpose:** Represents the Learner's declared English proficiency, used to shape session generation.
- **Description:** One of six values (A1, A2, B1, B2, C1, C2), self-declared by the Learner rather than assessed by the platform.
- **Lifecycle:** Unconfigured (before a Learner's first selection) → Configured → Reconfigured (any time the Learner changes it).
- **Owner:** The Learner. Exactly one English Level belongs to a given Learner at any time.

### 3. Learning Goal
- **Purpose:** Represents the purpose the Learner is practicing for, used to shape session generation.
- **Description:** One of six values defined in M01: General English, IELTS, Business, Travel, University, Job Interviews.
- **Lifecycle:** Unconfigured → Configured → Reconfigured.
- **Owner:** The Learner. Exactly one Learning Goal belongs to a given Learner at any time.

### 4. Topic Toggle Preference
- **Purpose:** Represents whether the Learner wants a single shared topic across all skills in a session, or is willing to have topics vary by skill.
- **Description:** A single business switch: "Use one topic for all skills," enabled or disabled.
- **Lifecycle:** Defaulted (a value exists from the Learner's first visit to the Dashboard) → Changed (any time the Learner adjusts it).
- **Owner:** The Learner. Exactly one Topic Toggle Preference belongs to a given Learner at any time.

### 5. Session
- **Purpose:** Represents one complete, generated unit of English learning practice.
- **Description:** A Session is produced at a single point in time from the Learner's English Level, Learning Goal, and Topic Toggle Preference as they existed at the moment of generation. It is the thing a Learner actually practices with.
- **Lifecycle:** Generated → In Progress → Completed, or Generated → In Progress → Abandoned.
- **Owner:** The Learner for whom it was generated. A Session belongs to exactly one Learner and is never shared.

### 6. Topic
- **Purpose:** Represents the AI-generated subject matter a Session (or part of a Session) is built around.
- **Description:** When the Topic Toggle Preference is enabled, a Session is built around exactly one Topic shared across all its skills. When disabled, a Session may be built around multiple Topics, one per skill area.
- **Lifecycle:** Generated → Assigned (to a Session). A Topic has no independent existence or reuse beyond the Session it was generated for.
- **Owner:** The Session it was generated for.

### 7. Progress Record
- **Purpose:** Represents the recorded outcome of a Learner's engagement with a Session.
- **Description:** Captures whether a given Session was completed or left incomplete, so the Learner's Dashboard can reflect it.
- **Lifecycle:** Pending (Session is In Progress) → Recorded (Completed or Incomplete).
- **Owner:** The Learner, through the Session it corresponds to.

---

# Entity Responsibilities

| Entity | Responsible For | Must Never Be Responsible For |
|---|---|---|
| Learner | Holding a single identity, a single current English Level, Learning Goal, and Topic Toggle Preference, and an ongoing history of Sessions and Progress Records. | Holding more than one current English Level, Learning Goal, or Topic Toggle Preference at once. |
| English Level | Representing exactly one proficiency value for a Learner at a time. | Determining or influencing the specific content of a Session directly — it informs generation but does not generate content itself. |
| Learning Goal | Representing exactly one purpose value for a Learner at a time. | Introducing purposes beyond the six defined in M01. |
| Topic Toggle Preference | Representing exactly one on/off state for a Learner at a time. | Selecting or influencing which Topic is chosen — it only determines whether one Topic or several are used. |
| Session | Representing one complete, self-contained unit of practice tied to the settings that produced it. | Changing its own Level, Goal, or Topic Toggle Preference after generation, or representing more than one concurrent unit of practice per Learner. |
| Topic | Representing the subject matter a Session (or a skill within it) is built around. | Existing independently of a Session, or being reused across multiple Sessions. |
| Progress Record | Representing the completion outcome of exactly one Session. | Representing trends, streaks, historical analytics, or mastery — these are explicitly out of scope per M02. |

---

# Relationships

- A **Learner** has exactly one current **English Level** at any point in time, though this value can be changed.
- A **Learner** has exactly one current **Learning Goal** at any point in time, though this value can be changed.
- A **Learner** has exactly one current **Topic Toggle Preference** at any point in time, though this value can be changed.
- A **Learner** may have many **Sessions** over time — one is produced each time the Learner generates a session — but only one Session may be In Progress for a given Learner at a time (per M04's Screen Responsibilities, which allow only one session to be presented at once).
- A **Session** is generated from exactly one English Level, one Learning Goal, and one Topic Toggle Preference value — the values current for the Learner at the moment of generation. Later changes to these values do not retroactively alter the Session.
- A **Session** is built around either exactly one **Topic** (when the Topic Toggle Preference is enabled) or multiple **Topics** (one per skill, when disabled).
- A **Topic** belongs to exactly one **Session** and has no existence or meaning outside of it.
- A **Session** has exactly one **Progress Record**, created once that Session begins and finalized once it is completed or abandoned.
- A **Progress Record** belongs, through its Session, to exactly one **Learner**.

---

# Entity State Definitions

### Learner
- Registered
- Active

### English Level
- Unconfigured
- Configured

### Learning Goal
- Unconfigured
- Configured

### Topic Toggle Preference
- Defaulted
- Changed

### Session
- Generated
- In Progress
- Completed
- Abandoned

### Topic
- Generated
- Assigned

### Progress Record
- Pending
- Recorded (Completed)
- Recorded (Incomplete)

---

# Entity Rules

- A Learner must exist (be Registered) before any English Level, Learning Goal, Topic Toggle Preference, Session, or Progress Record can exist for them.
- A Learner cannot have more than one current English Level, Learning Goal, or Topic Toggle Preference simultaneously — setting a new value always replaces the prior one rather than adding to it.
- A Session cannot be generated unless the Learner has a Configured English Level and a Configured Learning Goal; the Topic Toggle Preference always has a value (Defaulted or Changed), so it never blocks generation.
- A Session, once Generated, is permanently associated with the specific English Level, Learning Goal, and Topic Toggle Preference values that produced it — these values on the Session itself never change, even if the Learner's current values change afterward.
- A Session may only be In Progress for a Learner if no other Session for that Learner is currently In Progress.
- A Topic is always created as part of Session generation and is never created, changed, or selected independently of that process.
- A Progress Record is created the moment a Session enters the In Progress state and is finalized (Recorded) the moment the Session becomes Completed or Abandoned.
- A Progress Record's outcome (Completed or Incomplete), once Recorded, does not change retroactively.

---

# Domain Constraints

The following must always remain true within Version 1:

1. Every English Level, Learning Goal, Topic Toggle Preference, Session, and Progress Record belongs to exactly one Learner.
2. A Learner never has zero or multiple current English Levels, Learning Goals, or Topic Toggle Preferences once configured — always exactly one.
3. A Session always reflects the settings that existed at the moment of its generation, never the Learner's current settings after the fact.
4. A Learner has at most one Session In Progress at any given time.
5. Every Topic belongs to exactly one Session; no Topic is ever shared across Sessions or Learners.
6. Every Session has exactly one corresponding Progress Record — never zero, never more than one.
7. A Progress Record's recorded outcome is immutable once set.
8. No entity in this model may exist or be modified without an associated, authenticated Learner — there is no anonymous or ownerless data in Version 1.

---

# Domain Glossary

- **Learner:** A registered person using Project Fluent to practice English.
- **English Level:** The Learner's self-declared proficiency, one of A1, A2, B1, B2, C1, C2.
- **Learning Goal:** The Learner's self-declared purpose for practicing, one of General English, IELTS, Business, Travel, University, Job Interviews.
- **Topic Toggle Preference ("Use one topic for all skills"):** The Learner's choice of whether a single topic threads through an entire Session or topics may vary by skill.
- **Session:** One complete, generated unit of English learning practice, built from a Learner's English Level, Learning Goal, and Topic Toggle Preference at a single point in time.
- **Topic:** The AI-generated subject matter a Session, or a skill within a Session, is built around.
- **Skill:** An individual area of English practice (e.g., reading, listening, speaking, writing) included within a Session. Referenced by M01 and M02 as the unit that a Topic may or may not be shared across; not separately defined as its own entity in this model since Version 1 treats it as a component of a Session rather than an independently owned business object.
- **Progress Record:** The recorded outcome of a Learner's engagement with a specific Session — Completed or Incomplete.
- **Completed Session:** A Session the Learner has worked through to its defined end state.
- **Abandoned / Incomplete Session:** A Session the Learner left before reaching its defined end state.
- **Generation:** The act of producing a new Session from a Learner's current English Level, Learning Goal, and Topic Toggle Preference.
- **Dashboard:** The Learner-facing concept (defined structurally in M04) representing the current state of a Learner's English Level, Learning Goal, Topic Toggle Preference, and most recent Progress Record — not a separate domain entity itself, but the point where these entities are made visible to the Learner.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Identified seven Core Business Entities: Learner, English Level, Learning Goal, Topic Toggle Preference, Session, Topic, and Progress Record.
- Documented Purpose, Description, Lifecycle, and Owner for each entity.
- Documented Entity Responsibilities (including explicit "must never" boundaries), Relationships, Entity State Definitions, Entity Rules, and Domain Constraints.
- Compiled a Domain Glossary defining every business term used across M01–M07, including a note on "Skill" as a referenced but non-entity concept.

### Files Created
- `docs/milestones/M07-domain-model.md`

### Files Modified
- None. M01–M06 were not revisited or altered.

### Pending
- No further action pending within M07. Awaiting next milestone instructions.

### Risks
- English Level, Learning Goal, and Topic Toggle Preference are modeled as entities owned by the Learner (each with its own lifecycle) rather than as simple attributes, mirroring the granularity M06 used for features. This is a defensible domain-modeling choice but is more granular than some domain models would use; it should be confirmed as the intended level of detail.
- The model asserts "a Learner has at most one Session In Progress at any given time" as a Domain Constraint. This is inferred from M04's Screen Responsibilities ("present more than one session at a time" is prohibited) rather than stated as an explicit business rule in M01–M03, and should be validated.
- "Skill" is referenced in the Domain Glossary (since Topics relate to skills per M01) but was deliberately not modeled as its own entity, since no prior milestone defines it with independent lifecycle or ownership. This interpretation should be confirmed before any future milestone assumes otherwise.

### Open Questions
- Does a Learner's Session history (past Completed/Abandoned Sessions) need to remain queryable indefinitely as individual records, or does Version 1 only need the *most recent* Progress Record to satisfy FR-PROG-02? This model assumes each Session retains its own Progress Record, but M02's exclusion of "detailed analytics" leaves the retention question open.
- Is "Skill" significant enough to future milestones (e.g., session content structure) that it should be promoted to a full entity in a later revision, rather than remaining a glossary-only concept?

Waiting for the next milestone.
