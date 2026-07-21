# M18 — Service Contracts

**Status:** Draft
**Owner:** Product / Architecture
**Milestone:** M18
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M17 — Logical Data Model](./M17-logical-data-model.md)

---

# Overview

Service Contracts define the logical operations Project Fluent's Domain Layer (per M16) must expose to fulfill the product behavior already established in M01–M17. Each contract states, in business terms only, what an operation requires, what it guarantees, and how it can fail — the same discipline M13's Functional Specification applied to Functional Areas, now expressed as discrete, callable operations. This document defines no protocol, format, or technology; a "service" here is a logical grouping of related business operations, not a network-addressable API.

---

# Service Catalogue

## 1. Identity & Access Service
- **Purpose:** Establish and govern a Learner's Authentication State.
- **Responsibilities:** Registering new Learners; verifying returning Learners; ending authenticated access; recognizing persisted authenticated access.
- **Owned Concepts:** Learner Identity, Authentication State (per M14, M17).

## 2. Configuration Service
- **Purpose:** Capture, store, and expose the Learner's Learning Configuration.
- **Responsibilities:** Accepting and validating changes to English Level, Learning Goal, and Topic Toggle Preference; exposing their current values.
- **Owned Concepts:** English Level, Learning Goal, Topic Toggle Preference (per M09, M17).

## 3. Session Generation Service
- **Purpose:** Produce one complete Session from a Learner's current Learning Configuration.
- **Responsibilities:** Selecting Topic(s) according to the Topic Toggle Preference; assembling all seven Session Composition parts; fixing the Session's generating values at creation.
- **Owned Concepts:** Session, Topic, Session Composition (at the point of creation), per M08, M17.

## 4. Session Experience Service
- **Purpose:** Track a Learner's engagement with a Session through to a defined end.
- **Responsibilities:** Registering engagement with each Session Composition part; determining when a Session becomes Completed or Abandoned.
- **Owned Concepts:** Session state transitions, Session Composition engagement, per M08, M17.

## 5. Progress Service
- **Purpose:** Record and expose the outcome of a Learner's engagement with each Session.
- **Responsibilities:** Establishing a Progress Record when a Session begins; finalizing its outcome when the Session ends; exposing the most recent outcome.
- **Owned Concepts:** Progress Record, per M07, M17.

No sixth service exists for the Learner Hub concept described in M14 — the Learner Hub is a Presentation Layer concern (per M16) that composes information from the Configuration Service and Progress Service; it performs no business operation of its own and therefore owns no service contract.

---

# Service Operations

## Identity & Access Service

### CreateAccount
- **Purpose:** Register a new Learner and establish their Authentication State.
- **Required Inputs:** Details sufficient to establish a distinct Learner Identity.
- **Expected Outputs:** A new Learner Identity; an Authentication State of Signed In.
- **Preconditions:** No Learner Identity already exists for the given details.
- **Postconditions:** A Learner Identity exists; Authentication State is Signed In.
- **Failure Conditions:** The provided details are insufficient to establish a distinct Learner Identity, or a Learner Identity already exists for them.
- **Business Rules:** No information beyond what is required to establish the account may be requested, per M01.

### SignIn
- **Purpose:** Authenticate a returning Learner.
- **Required Inputs:** Credentials corresponding to an existing Learner Identity.
- **Expected Outputs:** An Authentication State of Signed In for the matched Learner.
- **Preconditions:** A Learner Identity already exists for the provided credentials.
- **Postconditions:** Authentication State is Signed In.
- **Failure Conditions:** The provided credentials do not match any existing Learner Identity.
- **Business Rules:** Successful authentication always results in the Learner being positioned at the Dashboard, per M04.

### SignOut
- **Purpose:** End a Learner's authenticated access.
- **Required Inputs:** None beyond the currently Signed In Learner.
- **Expected Outputs:** An Authentication State of Signed Out.
- **Preconditions:** The Learner's Authentication State is currently Signed In.
- **Postconditions:** Authentication State is Signed Out.
- **Failure Conditions:** None — this operation always succeeds if its precondition is met.
- **Business Rules:** Must be available regardless of which protected area the Learner is currently in, per M04.

### VerifySession
- **Purpose:** Recognize a previously authenticated Learner without requiring re-authentication.
- **Required Inputs:** None beyond a prior successful CreateAccount or SignIn for the Learner.
- **Expected Outputs:** The Learner's current Authentication State.
- **Preconditions:** A prior CreateAccount or SignIn occurred, and no SignOut has occurred since.
- **Postconditions:** The Learner is recognized as Signed In without re-entering credentials.
- **Failure Conditions:** No persisted Signed In state exists for the Learner (e.g., they previously signed out).
- **Business Rules:** Persisted access never survives an explicit SignOut, per M09.

---

## Configuration Service

### SetEnglishLevel
- **Purpose:** Set the Learner's current English Level.
- **Required Inputs:** A desired English Level value.
- **Expected Outputs:** The updated current English Level.
- **Preconditions:** The Learner's Authentication State is Signed In.
- **Postconditions:** The English Level's Configuration Status is Configured or Reconfigured with the new value.
- **Failure Conditions:** The provided value is not one of the six defined Levels.
- **Business Rules:** Exactly one current value exists at a time; the change does not affect any already-generated Session, per M09.

### SetLearningGoal
- **Purpose:** Set the Learner's current Learning Goal.
- **Required Inputs:** A desired Learning Goal value.
- **Expected Outputs:** The updated current Learning Goal.
- **Preconditions:** The Learner's Authentication State is Signed In.
- **Postconditions:** The Learning Goal's Configuration Status is Configured or Reconfigured with the new value.
- **Failure Conditions:** The provided value is not one of the six defined Goals.
- **Business Rules:** Exactly one current value exists at a time; the change does not affect any already-generated Session, per M09.

### SetTopicTogglePreference
- **Purpose:** Set the Learner's current Topic Toggle Preference.
- **Required Inputs:** A desired Enabled or Disabled value.
- **Expected Outputs:** The updated current Topic Toggle Preference.
- **Preconditions:** The Learner's Authentication State is Signed In.
- **Postconditions:** The Topic Toggle Preference's status is Changed, holding the new value.
- **Failure Conditions:** The provided value is neither Enabled nor Disabled.
- **Business Rules:** The change does not affect any already-generated Session, per M08.

### GetCurrentConfiguration
- **Purpose:** Retrieve the Learner's current Learning Configuration.
- **Required Inputs:** None beyond the current Learner.
- **Expected Outputs:** The current English Level, Learning Goal, and Topic Toggle Preference values.
- **Preconditions:** The Learner's Authentication State is Signed In.
- **Postconditions:** None — this is a read-only operation.
- **Failure Conditions:** None defined.
- **Business Rules:** Values returned always reflect the most recently set value for each option.

---

## Session Generation Service

### GenerateSession
- **Purpose:** Produce one complete Session from the Learner's current Learning Configuration.
- **Required Inputs:** The Learner's current English Level, Learning Goal, and Topic Toggle Preference (obtained via the Configuration Service).
- **Expected Outputs:** A new, complete Session, containing its Topic(s) and all seven Session Composition parts.
- **Preconditions:** English Level and Learning Goal are both Configured; no other Session for the Learner currently has a Session State of In Progress.
- **Postconditions:** A new Session exists in the Generated, then In Progress, state; a corresponding Progress Record exists in the Pending state, per M13.
- **Failure Conditions:** English Level or Learning Goal is Unconfigured, or another Session is already In Progress for the Learner.
- **Business Rules:** Generation must always produce all seven Session Composition parts; no manual topic selection is available, per M08.

---

## Session Experience Service

### RecordCompositionPartEngagement
- **Purpose:** Register the Learner's engagement with a specific Session Composition part.
- **Required Inputs:** The Session, and the specific Part being engaged with.
- **Expected Outputs:** An updated Engagement Status for that Part.
- **Preconditions:** The Session's State is In Progress.
- **Postconditions:** The Part's Engagement Status reflects the Learner's progress (In Progress or Reached End).
- **Failure Conditions:** The Session is not In Progress (e.g., already Completed or Abandoned).
- **Business Rules:** Registering engagement with a single Part does not, by itself, complete the Session.

### CompleteSession
- **Purpose:** Finalize a Session as Completed.
- **Required Inputs:** The Session.
- **Expected Outputs:** A Session State of Completed.
- **Preconditions:** All seven Session Composition parts have an Engagement Status of Reached End.
- **Postconditions:** The Session's State is Completed; the Progress Service is notified of a Completed outcome.
- **Failure Conditions:** One or more Session Composition parts have not reached their end.
- **Business Rules:** Completion always requires all seven parts to be finished, per M08.

### AbandonSession
- **Purpose:** Finalize a Session as Abandoned.
- **Required Inputs:** The Session.
- **Expected Outputs:** A Session State of Abandoned.
- **Preconditions:** The Session's State is In Progress and not all seven parts have reached their end.
- **Postconditions:** The Session's State is Abandoned; the Progress Service is notified of an Incomplete outcome.
- **Failure Conditions:** None — this is a valid, defined terminal transition, not a failure, per M08 and M13.
- **Business Rules:** Represents the final form of a Session that was left Incomplete and not returned to, per M08.

---

## Progress Service

### CreateProgressRecord
- **Purpose:** Establish a Pending Progress Record when a Session begins.
- **Required Inputs:** The Session that has just entered the In Progress state.
- **Expected Outputs:** A new Progress Record with a Record Status of Pending.
- **Preconditions:** No Progress Record already exists for the Session.
- **Postconditions:** Exactly one Pending Progress Record exists for the Session.
- **Failure Conditions:** A Progress Record already exists for the Session.
- **Business Rules:** Exactly one Progress Record exists per Session, per M07.

### RecordOutcome
- **Purpose:** Finalize a Progress Record's outcome when a Session ends.
- **Required Inputs:** The Session's final state (Completed or Abandoned).
- **Expected Outputs:** A Progress Record with an Outcome of Completed or Incomplete, and a Record Status of Recorded.
- **Preconditions:** A Pending Progress Record exists for the Session.
- **Postconditions:** The Progress Record's Record Status is Recorded, and its Outcome becomes immutable.
- **Failure Conditions:** No Pending Progress Record exists for the Session.
- **Business Rules:** A Recorded outcome never changes afterward, per M07.

### GetMostRecentOutcome
- **Purpose:** Retrieve the Learner's most recent Progress Record for Dashboard reflection.
- **Required Inputs:** None beyond the current Learner.
- **Expected Outputs:** The most recent Progress Record's Outcome, or an indication that no Session has ever been generated.
- **Preconditions:** The Learner's Authentication State is Signed In.
- **Postconditions:** None — this is a read-only operation.
- **Failure Conditions:** None defined.
- **Business Rules:** Always reflects the outcome of the most recently generated Session, per M05's Returning User Flow.

---

# Service Relationships

- The **Identity & Access Service** gates every other service — no operation on the Configuration, Session Generation, Session Experience, or Progress Services may occur for a Learner whose Authentication State is not Signed In.
- The **Configuration Service** supplies the current values the **Session Generation Service** requires; GenerateSession cannot succeed without values obtained from GetCurrentConfiguration.
- The **Session Generation Service**, upon successfully producing a Session, causes the **Progress Service**'s CreateProgressRecord operation to occur for that Session, per M13's combined postcondition.
- The **Session Experience Service**'s CompleteSession and AbandonSession operations each cause the **Progress Service**'s RecordOutcome operation to occur, supplying the Session's final state.
- The Presentation Layer's Learner Hub concept (per M14, M16) composes its view by calling the **Configuration Service**'s GetCurrentConfiguration and the **Progress Service**'s GetMostRecentOutcome — it does not itself constitute a service, only a consumer of these two.

---

# Contract Constraints

1. Every operation defined in this document must state its Preconditions, Postconditions, and Failure Conditions — no operation may be added to any service without all three.
2. No operation may bypass the Identity & Access Service's gating; every other service's operations assume a Signed In Authentication State as an implicit precondition.
3. An operation either completes fully according to its Postconditions, or fails entirely according to its Failure Conditions — no operation may produce a partial outcome.
4. A service may only expose operations related to its Owned Concepts, per the Service Catalogue; no service may perform an operation that changes another service's Owned Concepts directly.
5. Every state change described by a Postcondition in this document must correspond to a rule already established in M07–M17 — no new business behavior may be introduced through a service contract.

---

# Error Contract Principles

- A failed operation must never leave its Owned Concepts in an inconsistent or partially changed state — if an operation's Preconditions are not met, none of its Postconditions occur.
- A failed operation must always be attributable to one of its explicitly listed Failure Conditions — there is no undefined or unexplained failure in a well-formed service contract.
- The Learner-facing consequence of a failed operation is defined by M13's Error Recovery Flows (e.g., remaining at the Dashboard with Configuration intact) — this document defines only that an operation fails cleanly, not how that failure is communicated across layers.
- No failure representation in this document implies a status code, exception type, or protocol-specific error mechanism; failure is described purely as "the Failure Condition was met, and the Postconditions did not occur."

---

# Service Glossary

- **Service:** A logical grouping of related business operations, owning a specific set of concepts from the Domain Layer.
- **Operation:** A single, discrete unit of business behavior a service exposes, with defined inputs, outputs, and conditions.
- **Precondition:** A condition that must be true before an operation may occur.
- **Postcondition:** A condition guaranteed to be true after an operation completes successfully.
- **Failure Condition:** A circumstance under which an operation's Postconditions do not occur.
- **Contract:** The complete definition of an operation's Purpose, Inputs, Outputs, Preconditions, Postconditions, Failure Conditions, and Business Rules.
- **Owned Concept:** A business concept (per M07, M17) a given service is responsible for changing or exposing.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined a Service Catalogue of five logical services (Identity & Access, Configuration, Session Generation, Session Experience, Progress), each with Purpose, Responsibilities, and Owned Concepts.
- Defined Service Operations for every service, each with Required Inputs, Expected Outputs, Preconditions, Postconditions, Failure Conditions, and Business Rules, entirely in business terms.
- Documented Service Relationships describing how the five services collaborate, Contract Constraints, Error Contract Principles, and a Service Glossary.

### Files Created
- `docs/milestones/M18-service-contracts.md`

### Files Modified
- None. M01–M17 were not revisited or altered.

### Pending
- No further action pending within M18. Awaiting next milestone instructions.

### Risks
- This document deliberately does not define a sixth service for the Learner Hub concept (M14), treating it instead as a Presentation Layer composition of the Configuration and Progress Services' read operations, consistent with M16's layering. This is a first-time explicit decision and should be confirmed as the intended reading.
- Operation names (e.g., CreateAccount, GenerateSession, RecordOutcome) are introduced here for the first time to give each contract a concrete identity. These are logical operation names only, not method signatures or endpoint names, and carry no implementation implication.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
