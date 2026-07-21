# M13 — Functional Specification

**Status:** Draft
**Owner:** Product
**Milestone:** M13
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M12 — Design System Foundations](./M12-design-system-foundations.md)

---

# Overview

The Functional Specification defines the precise, observable behavior of every major function in Project Fluent Version 1 — what must happen, under what conditions, and what counts as success or failure. Where M02 established *that* these capabilities are required and M06 broke them into features, this document defines their exact behavioral contract: given a starting condition and an action, what the product must produce. It remains entirely behavioral; it does not describe how any of this is technically achieved.

---

# Functional Areas

## 1. Authentication

- **Purpose:** Establish and manage a Learner's Authentication State (per M10), governing access to all protected functionality.
- **Inputs:** Account creation details; sign-in credentials; an explicit sign-out request.
- **Outputs:** An Authentication State of Signed In or Signed Out for the Learner.
- **Preconditions:** For Account Creation — none. For Sign In — a previously created account must exist. For Sign Out — the Learner must currently be Signed In.
- **Postconditions:** After successful Account Creation or Sign In, the Learner's Authentication State is Signed In and they are positioned at the Dashboard. After Sign Out, the Learner's Authentication State is Signed Out and they are positioned at the Landing Page.
- **Business Rules:** A Learner has exactly one Authentication State at any time (per M07). No protected functional area is reachable while Signed Out.
- **Failure Conditions:** Account Creation fails if the required account details are not successfully established. Sign In fails if the provided credentials do not match an existing account. In both failure cases, the Learner's Authentication State remains Signed Out.
- **Success Conditions:** The Learner reaches a Signed In Authentication State and is positioned at the Dashboard.

## 2. Dashboard

- **Purpose:** Serve as the single central hub for a Signed In Learner, per M04.
- **Inputs:** The Learner's current Learning Configuration and most recent Progress outcome.
- **Outputs:** A presentation of current English Level, Learning Goal, Topic Toggle Preference, last Progress outcome, and the entry point to Session Generation.
- **Preconditions:** The Learner must be Signed In.
- **Postconditions:** The Learner can view or change any Configuration option, or initiate Session Generation.
- **Business Rules:** No functionality beyond Learning Configuration access, Progress reflection, and Session Generation entry may be presented here (per FR-DASH-06, FR-SET-04).
- **Failure Conditions:** None defined — the Dashboard is always reachable for a Signed In Learner and always presents a valid state.
- **Success Conditions:** The Learner reaches the Dashboard and it accurately reflects their current Configuration and last Progress outcome.

## 3. Learning Configuration

- **Purpose:** Capture and store the Learner's English Level, Learning Goal, and Topic Toggle Preference, per M09.
- **Inputs:** The Learner's selection of a Level, a Goal, or a Toggle state.
- **Outputs:** An updated current value for the selected Configuration option.
- **Preconditions:** The Learner must be Signed In and positioned at the Dashboard.
- **Postconditions:** The selected Configuration option holds the new value; the change is available for the next Session Generation.
- **Business Rules:** Each option must always hold exactly one valid value from its defined set (per M09's Validation Rules). A change to one option never affects the others. A change never alters a Session already generated.
- **Failure Conditions:** A selection outside the defined valid values for an option (per M09) does not result in a change — the option retains its prior value.
- **Success Conditions:** The chosen value is reflected as the current value of that Configuration option.

## 4. Session Generation

- **Purpose:** Produce one complete Session from the Learner's current Learning Configuration, per M08.
- **Inputs:** The Learner's current English Level, Learning Goal, and Topic Toggle Preference at the moment of the request.
- **Outputs:** One complete Session containing Topic(s) and all seven Session Composition parts.
- **Preconditions:** The Learner must be Signed In, with both English Level and Learning Goal Configured, and must have no other Session currently In Progress (per M07's Domain Constraints).
- **Postconditions:** A new Session exists in the Generated, then In Progress, state; a corresponding Progress Record exists in the Pending state; the Learner is positioned at the Learning Session Experience.
- **Business Rules:** Generation must always produce all seven Session Composition parts (per M08's Business Constraints). Topic selection must follow the current Topic Toggle Preference. No manual topic selection is available (per FR-SESS-07).
- **Failure Conditions:** Generation cannot occur if English Level or Learning Goal is Unconfigured, or if another Session is already In Progress for the Learner. In either case, the Learner remains at the Dashboard with their Configuration unchanged.
- **Success Conditions:** Exactly one complete Session is produced and the Learner is positioned to begin it.

## 5. Learning Session Experience

- **Purpose:** Let the Learner work through a generated Session to a defined end, per M08.
- **Inputs:** The generated Session's Topic(s) and Session Composition parts; the Learner's engagement with each part.
- **Outputs:** A final Session state of Completed or Abandoned.
- **Preconditions:** A Session must exist in the In Progress state for the Learner.
- **Postconditions:** Upon reaching the end of all seven Session Composition parts, the Session becomes Completed. Upon the Learner leaving before that point without returning, the Session becomes Abandoned.
- **Business Rules:** The Session's Configuration values and Topic(s) remain fixed for its duration (per M08). Only one Session may be In Progress for a Learner at a time.
- **Failure Conditions:** None distinct from Abandonment — leaving a Session before completion is a defined, valid outcome (Abandoned), not an error.
- **Success Conditions:** The Learner reaches the end of all seven Session Composition parts, and the Session is marked Completed.

## 6. Progress Recording

- **Purpose:** Record and reflect the outcome of a Learner's engagement with a Session, per M07.
- **Inputs:** The final state of a Session — Completed or Abandoned.
- **Outputs:** A Recorded Progress Record with an outcome of Completed or Incomplete.
- **Preconditions:** A Progress Record must exist in the Pending state, tied to a Session that has just reached Completed or Abandoned.
- **Postconditions:** The Progress Record moves from Pending to Recorded, permanently holding its outcome; the Dashboard reflects this outcome on the Learner's next visit.
- **Business Rules:** Exactly one Progress Record exists per Session (per M07). Once Recorded, an outcome is immutable.
- **Failure Conditions:** None defined — every Session that reaches Completed or Abandoned always results in a successfully Recorded Progress Record.
- **Success Conditions:** The Progress Record accurately reflects the Session's final outcome and is visible to the Learner on their next Dashboard visit.

---

# Functional Interactions

- **Authentication** gates every other functional area — Dashboard, Learning Configuration, Session Generation, Learning Session Experience, and Progress Recording are only reachable while Authentication State is Signed In.
- **Dashboard** is the shared surface for **Learning Configuration** and the entry point to **Session Generation** — it does not perform either function itself, but hosts access to both.
- **Learning Configuration** supplies the inputs that **Session Generation** consumes; Session Generation cannot succeed without valid, Configured Level and Goal values.
- **Session Generation** produces the Session that **Learning Session Experience** operates on; the Learning Session Experience has no independent starting point.
- **Learning Session Experience** produces the outcome that **Progress Recording** captures; Progress Recording has no independent trigger.
- **Progress Recording** feeds back into **Dashboard**, closing the loop described in M05's Returning User Flow — the Dashboard's Progress reflection always originates from the most recent Progress Recording outcome.

---

# User Actions

| Action | Trigger | Expected Behavior | Result | Constraints |
|---|---|---|---|---|
| Create Account | Visitor submits account creation details | Authentication establishes a new, Signed In Learner | Learner reaches Dashboard | Requires no prior account; no onboarding information beyond account creation is requested (per M01). |
| Sign In | Visitor submits credentials for an existing account | Authentication verifies credentials and grants access | Learner reaches Dashboard | Requires a previously created account. |
| Sign Out | Signed In Learner requests to sign out | Authentication State becomes Signed Out | Learner reaches Landing Page | Available from any authenticated page. |
| Set English Level | Learner selects a Level value | Learning Configuration stores the selected Level | Current English Level is updated | Value must be one of A1–C2. |
| Set Learning Goal | Learner selects a Goal value | Learning Configuration stores the selected Goal | Current Learning Goal is updated | Value must be one of the six defined Goals. |
| Change Topic Toggle Preference | Learner enables or disables the toggle | Learning Configuration stores the new toggle state | Current Topic Toggle Preference is updated | Value must be Enabled or Disabled. |
| Generate Session | Learner initiates generation from the Dashboard | Session Generation produces one complete Session | Learner is positioned at the Learning Session Experience | Requires Configured English Level and Learning Goal; no other Session may be In Progress. |
| Progress Through a Session Composition Part | Learner engages with Reading, Listening, Speaking, Writing, Vocabulary, Grammar, or Quiz | Learner's engagement with that part is registered | Learner advances toward Session completion | Applies only within an In Progress Session. |
| Complete a Session | Learner reaches the end of all seven Session Composition parts | Session transitions to Completed | Progress Record is Recorded as Completed | Requires all seven parts to have been reached. |
| Leave a Session Before Completion | Learner exits the Learning Session Experience before finishing | Session transitions to Abandoned | Progress Record is Recorded as Incomplete | Applies only to a Session that is currently In Progress. |
| Regenerate a Session | Learner initiates generation again after a prior Session's outcome | Session Generation produces a new, independent Session | Learner is positioned at the new Learning Session Experience | Same constraints as Generate Session; prior Session's outcome is unaffected. |

---

# System Responses

- **Account Creation / Sign In:** The product must observably transition the Learner from an unauthenticated state to the Dashboard, with no intermediate step.
- **Sign Out:** The product must observably transition the Learner from any authenticated page to the Landing Page, and no protected content must remain accessible afterward.
- **Configuration Change (Level, Goal, Toggle):** The product must observably reflect the new current value immediately after the change, without requiring any further action from the Learner.
- **Session Generation:** The product must observably move the Learner from the Dashboard to a Session ready to be worked through; if generation cannot occur (per Failure Conditions above), the product must observably keep the Learner at the Dashboard with their Configuration intact.
- **Progress Through a Session Composition Part:** The product must observably acknowledge that the Learner's engagement with that part has registered, consistent with M11's Immediate Feedback principle.
- **Session Completion:** The product must observably indicate that the Session has reached its end, and must observably update the Dashboard's reflected Progress on the Learner's next visit.
- **Session Abandonment:** The product must observably return the Learner to a known, valid state (the Dashboard) and must observably reflect the Session as Incomplete on a later visit.

---

# Functional Constraints

1. No functional area is reachable without a Signed In Authentication State, except Authentication itself.
2. Session Generation never succeeds without both a Configured English Level and a Configured Learning Goal.
3. A Learner never has more than one Session In Progress at a time.
4. A generated Session's Configuration values and Topic(s) never change after generation, regardless of later Configuration changes.
5. Every Session always results in exactly one Progress Record, with an outcome of Completed or Incomplete — never neither, never both.
6. No functional area introduces a Learner-facing decision beyond the three Configuration options defined in M09.
7. No functional area produces partial output — Account Creation produces a complete account or none; Session Generation produces a complete Session (all seven composition parts) or none.

---

# Functional Glossary

- **Functional Area:** A major, self-contained unit of product behavior — Authentication, Dashboard, Learning Configuration, Session Generation, Learning Session Experience, or Progress Recording.
- **Precondition:** A condition that must be true before a functional area's behavior can occur.
- **Postcondition:** A condition guaranteed to be true after a functional area's behavior completes successfully.
- **Failure Condition:** A circumstance under which a functional area's intended behavior cannot occur, and what state the product remains in as a result.
- **Success Condition:** The observable outcome that confirms a functional area's behavior completed as intended.
- **User Action:** A discrete, Learner-initiated trigger that invokes one or more functional areas.
- **System Response:** The observable product behavior that results from a User Action.
- **Trigger:** The specific event that initiates a User Action.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined six Functional Areas (Authentication, Dashboard, Learning Configuration, Session Generation, Learning Session Experience, Progress Recording), each with Purpose, Inputs, Outputs, Preconditions, Postconditions, Business Rules, Failure Conditions, and Success Conditions.
- Documented Functional Interactions describing how these six areas connect end-to-end.
- Listed every User Action supported by Version 1 with Trigger, Expected Behavior, Result, and Constraints, and defined the corresponding System Responses.
- Documented Functional Constraints that must always remain true, and a Functional Glossary.

### Files Created
- `docs/milestones/M13-functional-specification.md`

### Files Modified
- None. M01–M12 were not revisited or altered.

### Pending
- No further action pending within M13. Awaiting next milestone instructions.

### Risks
- This document treats "leaving a Session before completion" as a defined, non-error outcome (Abandoned) rather than a Failure Condition, consistent with M05's and M08's treatment of Abandonment as a valid final state rather than a fault. This framing should be confirmed as correct before any future milestone treats early exit as an error case.
- Session Generation's Failure Conditions are limited to missing Configuration and a Session already In Progress, since M01–M12 do not define any other product-level reason generation could fail (e.g., no failure modes tied to external systems are in scope for a product-only document).

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
