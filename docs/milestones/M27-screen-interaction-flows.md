# M27 — Screen Interaction Flows

**Status:** Draft
**Owner:** Product
**Milestone:** M27
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M26 — Screen Specifications](./M26-screen-specifications.md)

---

# Overview

Screen Interaction Flows describe the moment-by-moment sequence of interaction that occurs *within* each screen — what a Learner intends to do, what actions are available to them, how the product responds, and where each possible path leads. Where M26 specified each screen's static behavior and conditions, this document traces the dynamic sequence of interaction those conditions produce. It remains entirely conceptual, describing intent, action, response, and outcome — never layout, component, or visual detail.

---

# Interaction Principles

This document applies M11's Interaction Principles — One Clear Primary Action, Minimal Decisions, Predictable Behavior, Immediate Feedback, and Logical Progression — specifically to the sequence of events occurring within a single screen, rather than across the product as a whole. Every interaction described below exists to move the Learner from their Starting State to exactly one of a small, defined set of outcomes, with no ambiguity about what happened or what comes next.

---

# Screen Interaction Flows

## Landing Page

- **Screen Name:** Landing Page
- **Interaction Goal:** Move the visitor toward establishing or confirming their identity.
- **Starting State:** The visitor has no active Authentication State, per M25.
- **User Intent:** Understand what the product offers and decide whether to create an account or sign in.
- **User Actions:** Choose Sign Up; Choose Sign In.
- **System Responses:** Presentation of the chosen destination screen.
- **Decision Points:** "Do I already have an account?" per M05's Decision Points.
- **Possible Outcomes:** The visitor is presented with the Sign Up Page, or with the Sign In Page.
- **Success Path:** The visitor selects a destination and is presented with it.
- **Failure Path:** None defined, per M26.
- **Exit Paths:** Sign Up Page; Sign In Page.
- **Related Features:** None directly — the entry surface for F-01 and F-02, per M25.
- **Related Services:** None invoked.
- **Related User Flows:** The beginning of the First-Time User Flow; the Authentication Flow, per M05.
- **Constraints:** Must never require Level, Goal, or authenticated content, per M04.

---

## Sign Up Page

- **Screen Name:** Sign Up Page
- **Interaction Goal:** Establish a new Learner Identity and Authentication State.
- **Starting State:** The visitor arrived from the Landing Page and has no existing account.
- **User Intent:** Create an account to begin using the product.
- **User Actions:** Create Account; Move to Sign In.
- **System Responses:** On success, immediate transition to the Dashboard, per M13; on failure, the visitor remains at the Sign Up Page.
- **Decision Points:** "Do I already have an account?" per M05's Decision Points.
- **Possible Outcomes:** A new Learner Identity is established and the visitor moves to the Dashboard; the attempt fails and the visitor remains at the Sign Up Page; the visitor moves to the Sign In Page instead.
- **Success Path:** Account creation satisfies M18's CreateAccount Postconditions — a Learner Identity exists and Authentication State is Signed In — leading to the Dashboard.
- **Failure Path:** The provided details are insufficient to establish a distinct Learner Identity, or a Learner Identity already exists for them, per M18's CreateAccount Failure Conditions — the visitor remains at the Sign Up Page with no Authentication State established.
- **Exit Paths:** Dashboard (on success); Sign In Page (visitor already has an account).
- **Related Features:** F-01 Account Creation, per M06.
- **Related Services:** Identity & Access Service — CreateAccount, per M18.
- **Related User Flows:** The First-Time User Flow; the Sign Up Journey within the Authentication Flow, per M05.
- **Constraints:** Must never request information beyond what is required to establish the account, per M01 and M04.

---

## Sign In Page

- **Screen Name:** Sign In Page
- **Interaction Goal:** Confirm an existing Learner's identity and establish Authentication State.
- **Starting State:** The visitor arrived from the Landing Page and has an existing account.
- **User Intent:** Resume access to their account.
- **User Actions:** Sign In; Move to Sign Up.
- **System Responses:** On success, immediate transition to the Dashboard, per M13; on failure, the visitor remains at the Sign In Page.
- **Decision Points:** "Do I not yet have an account?" per M05's Decision Points.
- **Possible Outcomes:** The Learner is authenticated and moves to the Dashboard; the attempt fails and the visitor remains at the Sign In Page; the visitor moves to the Sign Up Page instead.
- **Success Path:** The provided credentials match an existing Learner Identity, satisfying M18's SignIn Postconditions, leading to the Dashboard.
- **Failure Path:** The provided credentials do not match any existing Learner Identity, per M18's SignIn Failure Conditions — the visitor remains at the Sign In Page.
- **Exit Paths:** Dashboard (on success); Sign Up Page (visitor does not have an account).
- **Related Features:** F-02 Sign In, per M06.
- **Related Services:** Identity & Access Service — SignIn, per M18.
- **Related User Flows:** The Returning User Flow; the Sign In Journey within the Authentication Flow, per M05.
- **Constraints:** Must never require setup before granting Dashboard access, per M04.

---

## Dashboard

- **Screen Name:** Dashboard
- **Interaction Goal:** Let the Learner review or adjust their Learning Configuration and initiate a new Session.
- **Starting State:** The Learner is Signed In, having arrived from the Sign Up Page, the Sign In Page, a persisted Authentication State, or the Learning Session Page; their Configuration may be Unconfigured (first-time) or already Configured (returning), per M05.
- **User Intent:** Confirm or change their Level, Goal, and Topic Toggle Preference, then begin a new Session — or simply check their last Progress outcome.
- **User Actions:** Set English Level; Set Learning Goal; Change Topic Toggle Preference; Generate Session; Sign Out.
- **System Responses:** Immediate reflection of any Configuration change; transition to the Learning Session Page on successful generation; remaining at the Dashboard with Configuration intact if generation cannot proceed, per M13's Error Recovery Flows.
- **Decision Points:** "Keep existing settings or change them?"; "Generate now?"; "Continue at the Dashboard or Sign Out?" per M05's Decision Points.
- **Possible Outcomes:** A Configuration option is updated and the Learner remains at the Dashboard; a Session is successfully generated and the Learner moves to the Learning Session Page; a Session Generation request fails and the Learner remains at the Dashboard; the Learner signs out and moves to the Landing Page.
- **Success Path:** English Level and Learning Goal are Configured, and a Session Generation request satisfies M18's GenerateSession Postconditions, leading to the Learning Session Page.
- **Failure Path:** A Configuration change references a value outside its defined valid set, per M09, and is rejected, leaving the prior value unchanged; or a Session Generation request occurs while English Level or Learning Goal is Unconfigured, or while another Session is already In Progress, per M18's GenerateSession Failure Conditions — the Learner remains at the Dashboard.
- **Exit Paths:** Learning Session Page (via successful generation); Landing Page (via Sign Out).
- **Related Features:** F-05, F-06, F-07, F-08, F-09, F-11, per M06.
- **Related Services:** Configuration Service (SetEnglishLevel, SetLearningGoal, SetTopicTogglePreference, GetCurrentConfiguration); Session Generation Service (GenerateSession); Progress Service (GetMostRecentOutcome); Identity & Access Service (SignOut), per M18.
- **Related User Flows:** The Returning User Flow; the Settings Change Flow; the "Before Generation" state of the Learning Session Flow, per M05.
- **Constraints:** Must never present a setting beyond the three Configuration options or any topic library, per M04; must never allow a Session Generation request to succeed without a Configured English Level and Learning Goal, per M18.

---

## Learning Session Page

- **Screen Name:** Learning Session Page
- **Interaction Goal:** Let the Learner work through the generated Session's seven parts to a defined end.
- **Starting State:** A Session exists with a Session State of In Progress, having arrived directly from a successful Dashboard generation request.
- **User Intent:** Complete the practice Session, or step away before finishing.
- **User Actions:** Progress Through a Session Composition Part; Complete a Session; Leave a Session Before Completion.
- **System Responses:** Acknowledgment of engagement with each Session Composition part; indication that the Session has reached its end; return to the Dashboard with Progress updated on the next visit, per M13.
- **Decision Points:** "Continue through the Session, or leave before completion?" per M05's Decision Points.
- **Possible Outcomes:** All seven Session Composition parts are reached and the Session becomes Completed; the Learner leaves before all parts are reached and the Session becomes Abandoned.
- **Success Path:** The Learner engages with and reaches the end of all seven Session Composition parts, per M08's Business Constraints, resulting in a Completed Session, a Progress Record Recorded as Completed, and a return to the Dashboard.
- **Failure Path:** None distinct from Abandonment — leaving before completion is a defined, valid outcome rather than an error, per M08 and M13. When it occurs, the Session becomes Abandoned, its Progress Record is Recorded as Incomplete, and the Learner returns to the Dashboard.
- **Exit Paths:** Dashboard — the only exit path, reached via either Completion or Abandonment.
- **Related Features:** F-09 (produces the content shown), F-10, F-11 (triggered on exit), per M06.
- **Related Services:** Session Experience Service (RecordCompositionPartEngagement, CompleteSession, AbandonSession); Progress Service (RecordOutcome, triggered by either terminal state), per M18.
- **Related User Flows:** The Generation, In Progress, Completed, and Abandoned states of the Learning Session Flow, per M05.
- **Constraints:** Must never allow mid-session changes to Level, Goal, or the Topic Toggle Preference, per M08; must never present more than one Session at a time, per M04.

---

# Cross-Screen Interaction Principles

- Every screen's interaction sequence follows the same shape: a Starting State, a small set of available User Actions, an immediate System Response, and a small, defined set of Possible Outcomes — no screen introduces an interaction pattern unique to itself.
- Decision Points across every screen are phrased and resolved the same way a Learner would naturally think about them, consistent with M05's Decision Points — no screen introduces a decision beyond what M05 or M09 already define.
- The vocabulary of outcomes (Success Path, Failure Path, Exit Paths) is used consistently across every screen, so that a Learner's mental model of "what happens when I act" never needs to be re-learned per screen.
- Every Failure Path across every screen results in the Learner remaining at, or returning to, a known and valid screen — never an undefined or inconsistent state, consistent with M11's and M26's Error Handling Principles.

---

# Interaction Constraints

1. Every User Action listed in this document must correspond exactly to a User Action already defined in M13 — no screen may introduce an interaction not already catalogued there.
2. Every Success Path and Failure Path must resolve to a Postcondition or Failure Condition already defined in M18 for the corresponding Service Operation — no new outcome may be introduced.
3. Every Exit Path must correspond to a connection already defined in M25's Navigation Relationships — no screen may exit to a destination not already established.
4. No screen's interaction sequence may require the Learner to hold more than the Decision Points explicitly listed for that screen in mind at once.
5. No Failure Path may result in a state that is not already recoverable via a documented Success Path on a subsequent attempt.

---

# Interaction Glossary

- **Interaction Goal:** The single purpose a screen's interaction sequence exists to achieve.
- **Starting State:** The condition of the Learner and the product immediately before interaction begins on a given screen.
- **User Intent:** What the Learner is trying to accomplish by interacting with the screen.
- **Decision Point:** A moment within a screen's interaction sequence at which the Learner must choose between defined options, consistent with M05.
- **Possible Outcome:** One of the defined results an interaction sequence may produce.
- **Success Path:** The sequence of actions and responses that leads to a screen's intended outcome being achieved.
- **Failure Path:** The sequence of actions and responses that occurs when a screen's intended outcome is not achieved, per its documented Failure Conditions.
- **Exit Path:** The destination a Learner reaches upon leaving a screen, whether via a Success Path or a Failure Path.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented Interaction Principles applying M11's principles to within-screen interaction sequences.
- Produced Screen Interaction Flows for all five screens defined in M25 (Landing Page, Sign Up Page, Sign In Page, Dashboard, Learning Session Page), each with Interaction Goal, Starting State, User Intent, User Actions, System Responses, Decision Points, Possible Outcomes, Success Path, Failure Path, Exit Paths, Related Features, Related Services, Related User Flows, and Constraints.
- Documented Cross-Screen Interaction Principles, Interaction Constraints, and an Interaction Glossary.

### Files Created
- `docs/milestones/M27-screen-interaction-flows.md`

### Files Modified
- None. M01–M26 were not revisited or altered.

### Pending
- No further action pending within M27. Awaiting next milestone instructions.

### Risks
- Each screen's Failure Path was reconstructed by combining the Failure Conditions already defined in M18 with the "remains at the same screen" behavior implied by M13's Error Recovery Flows. No new failure behavior was introduced, but this reconstruction is the first time each screen's specific failure destination has been made explicit, and should be confirmed as accurate.
- The Landing Page and Learning Session Page's Failure Paths are stated as "None defined" and "None distinct from Abandonment" respectively, consistent with M26 and M13 — these are intentional restatements, not omissions.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
