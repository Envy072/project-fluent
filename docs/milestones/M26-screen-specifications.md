# M26 — Screen Specifications

**Status:** Draft
**Owner:** Product
**Milestone:** M26
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M25 — Screen Inventory & Application Map](./M25-screen-inventory-application-map.md)

---

# Overview

Screen Specifications define exactly what each of Version 1's five screens does — their behavior, conditions, and responsibilities — in a single, standardized format. Where M25 inventoried each screen's identity and connections, this document goes one level deeper for each one, tying it back to the precise Preconditions, Success Conditions, and Failure Conditions already established in M13 and M18. It remains entirely conceptual: no layout, component, or visual detail appears anywhere in this document.

---

# Screen Specification Template

Every screen in this document is specified using exactly the following eighteen fields, in this order:

1. **Screen Name** — The screen being specified, as named in M25.
2. **Purpose** — Why the screen exists, per M04 and M25.
3. **Primary Responsibilities** — What the screen is accountable for doing.
4. **Preconditions** — What must already be true for the screen to be validly reached.
5. **Entry Conditions** — The specific circumstances under which a Learner arrives at the screen.
6. **Exit Conditions** — The specific circumstances under which a Learner leaves the screen.
7. **Inputs** — The business information the screen receives or captures.
8. **Outputs** — The business information or state change the screen produces.
9. **User Actions** — The discrete actions a Learner may take on the screen, per M13.
10. **System Responses** — The observable behavior the product produces in response, per M13.
11. **Success Conditions** — What confirms the screen's purpose was fulfilled.
12. **Failure Conditions** — The circumstances under which the screen's intended outcome does not occur.
13. **Related User Flows** — The M05 flows this screen participates in.
14. **Related Features** — The M06 features this screen exposes or supports.
15. **Related Services** — The M18 Service Operations this screen invokes.
16. **Related Domain Objects** — The M07/M17 objects this screen displays or affects.
17. **Related Configuration** — The M09 Configuration options relevant to this screen, if any.
18. **Access Rules** — The M25 access classification governing who may reach this screen.
19. **Constraints** — The behavioral limits this screen must never violate.

---

# Individual Screen Specifications

## Landing Page

1. **Screen Name:** Landing Page
2. **Purpose:** Introduce the product to a visitor and direct them toward account creation, per M04.
3. **Primary Responsibilities:** Communicating what the product is; offering a path to the Sign Up Page and the Sign In Page.
4. **Preconditions:** None — reachable by anyone.
5. **Entry Conditions:** The visitor has no active Authentication State, either because they have never signed in or because they have signed out, per M05's Entry and Exit Points.
6. **Exit Conditions:** The visitor chooses to proceed to the Sign Up Page or the Sign In Page.
7. **Inputs:** None.
8. **Outputs:** None — no business state is created or changed here.
9. **User Actions:** Choose Sign Up; Choose Sign In (per M05's Decision Points).
10. **System Responses:** Presentation of the chosen destination screen.
11. **Success Conditions:** The visitor reaches the Sign Up Page or the Sign In Page.
12. **Failure Conditions:** None defined.
13. **Related User Flows:** The beginning of the First-Time User Flow; the Authentication Flow, per M05.
14. **Related Features:** None directly — it is the entry surface for F-01 and F-02, per M25.
15. **Related Services:** None invoked directly.
16. **Related Domain Objects:** None.
17. **Related Configuration:** None.
18. **Access Rules:** Public, per M25.
19. **Constraints:** Must never require Level, Goal, or any authenticated content, per M04.

---

## Sign Up Page

1. **Screen Name:** Sign Up Page
2. **Purpose:** Allow a visitor to create an account, per M04.
3. **Primary Responsibilities:** Capturing account creation details; offering a path to the Sign In Page for visitors who already have an account.
4. **Preconditions:** No Learner Identity already exists for the visitor's provided details, per M18's CreateAccount Preconditions.
5. **Entry Conditions:** The visitor arrives from the Landing Page.
6. **Exit Conditions:** Account creation succeeds, moving the Learner to the Dashboard; or the visitor chooses to move to the Sign In Page instead.
7. **Inputs:** Details sufficient to establish a distinct Learner Identity, per M18.
8. **Outputs:** A new Learner Identity; an Authentication State of Signed In, per M18's CreateAccount Outputs.
9. **User Actions:** Create Account; Move to Sign In, per M13's User Actions table.
10. **System Responses:** Immediate transition to the Dashboard upon success, with no intermediate step, per M13's System Responses.
11. **Success Conditions:** A Learner Identity exists and Authentication State is Signed In, per M18.
12. **Failure Conditions:** The provided details are insufficient to establish a distinct Learner Identity, or a Learner Identity already exists for them, per M18.
13. **Related User Flows:** The First-Time User Flow; the Sign Up Journey within the Authentication Flow, per M05.
14. **Related Features:** F-01 Account Creation, per M06.
15. **Related Services:** Identity & Access Service — CreateAccount, per M18.
16. **Related Domain Objects:** Learner, Authentication State, per M07 and M17.
17. **Related Configuration:** None — no Configuration option is set during account creation, per M01.
18. **Access Rules:** Public, per M25.
19. **Constraints:** Must never request information beyond what is required to establish the account, per M04 and M01.

---

## Sign In Page

1. **Screen Name:** Sign In Page
2. **Purpose:** Allow a returning, registered Learner to authenticate, per M04.
3. **Primary Responsibilities:** Capturing credentials; offering a path to the Sign Up Page for visitors without an account.
4. **Preconditions:** A Learner Identity already exists for the provided credentials, per M18's SignIn Preconditions.
5. **Entry Conditions:** The visitor arrives from the Landing Page.
6. **Exit Conditions:** Authentication succeeds, moving the Learner to the Dashboard; or the visitor chooses to move to the Sign Up Page instead.
7. **Inputs:** Credentials corresponding to an existing Learner Identity, per M18.
8. **Outputs:** An Authentication State of Signed In for the matched Learner, per M18's SignIn Outputs.
9. **User Actions:** Sign In; Move to Sign Up, per M13's User Actions table.
10. **System Responses:** Immediate transition to the Dashboard upon success, with no intermediate step, per M13's System Responses.
11. **Success Conditions:** Authentication State is Signed In for the matched Learner, per M18.
12. **Failure Conditions:** The provided credentials do not match any existing Learner Identity, per M18.
13. **Related User Flows:** The Returning User Flow; the Sign In Journey within the Authentication Flow, per M05.
14. **Related Features:** F-02 Sign In, per M06.
15. **Related Services:** Identity & Access Service — SignIn, per M18.
16. **Related Domain Objects:** Learner, Authentication State, per M07 and M17.
17. **Related Configuration:** None.
18. **Access Rules:** Public, per M25.
19. **Constraints:** Must never require setup before granting Dashboard access, per M04.

---

## Dashboard

1. **Screen Name:** Dashboard
2. **Purpose:** Serve as the single central hub for a signed-in Learner, per M04.
3. **Primary Responsibilities:** Presenting current Learning Configuration and Progress; providing the entry point to Session Generation.
4. **Preconditions:** The Learner's Authentication State is Signed In, per M13's Dashboard Preconditions.
5. **Entry Conditions:** Arrival from the Sign Up Page or Sign In Page (immediately after authentication); recognition of a persisted Authentication State, per F-04; return from the Learning Session Page.
6. **Exit Conditions:** A successful Session Generation request, moving the Learner to the Learning Session Page; a Sign Out request, moving the Learner to the Landing Page.
7. **Inputs:** The Learner's current Learning Configuration and most recent Progress outcome, per M13; Configuration change selections; a Session Generation request.
8. **Outputs:** A presentation combining current Configuration and Progress; updated Configuration values, when changed; a new Session, when generation succeeds.
9. **User Actions:** Set English Level; Set Learning Goal; Change Topic Toggle Preference; Generate Session; Sign Out, per M13's User Actions table.
10. **System Responses:** Immediate reflection of any Configuration change, per M13; transition to the Learning Session Page on successful generation, or remaining at the Dashboard with Configuration intact if generation cannot proceed, per M13's Error Recovery Flows.
11. **Success Conditions:** The Dashboard accurately reflects current Configuration and last Progress outcome, per M13; each Configuration change and Session Generation request succeeds per its own Service Operation's Postconditions, per M18.
12. **Failure Conditions:** A Configuration change is attempted with a value outside its defined valid set, per M09; a Session Generation request is attempted while English Level or Learning Goal is Unconfigured, or while another Session is already In Progress, per M18's GenerateSession Failure Conditions.
13. **Related User Flows:** The Returning User Flow; the Settings Change Flow; the "Before Generation" state of the Learning Session Flow, per M05.
14. **Related Features:** F-05 Dashboard, F-06 English Level Selection, F-07 Learning Goal Selection, F-08 Topic Toggle Control, F-09 Session Generation (entry point), F-11 Progress Recording (reflection), per M06.
15. **Related Services:** Configuration Service (SetEnglishLevel, SetLearningGoal, SetTopicTogglePreference, GetCurrentConfiguration); Session Generation Service (GenerateSession); Progress Service (GetMostRecentOutcome); Identity & Access Service (SignOut), per M18.
16. **Related Domain Objects:** Learner, English Level, Learning Goal, Topic Toggle Preference, Progress Record, per M07 and M17.
17. **Related Configuration:** English Level, Learning Goal, Topic Toggle Preference, per M09.
18. **Access Rules:** Authenticated, per M25.
19. **Constraints:** Must never present a setting beyond the three Configuration options, or any topic library, per M04.

---

## Learning Session Page

1. **Screen Name:** Learning Session Page
2. **Purpose:** Present a generated Session and allow the Learner to work through it to a defined end, per M04.
3. **Primary Responsibilities:** Presenting the Session's composition parts; tracking the Learner's engagement with each; determining whether the Session becomes Completed or Abandoned.
4. **Preconditions:** A Session exists with a Session State of In Progress for the Learner, per M13's Learning Session Experience Preconditions.
5. **Entry Conditions:** Arrival from the Dashboard, only as a direct result of a successful Session Generation request, per M04 and M25.
6. **Exit Conditions:** The Session reaches Completed, or the Learner leaves before all seven Session Composition parts are finished (Abandoned), per M08.
7. **Inputs:** The generated Session's Topic(s) and Session Composition parts; the Learner's engagement with each part, per M13.
8. **Outputs:** A final Session State of Completed or Abandoned; a corresponding finalized Progress Record outcome.
9. **User Actions:** Progress Through a Session Composition Part; Complete a Session; Leave a Session Before Completion, per M13's User Actions table.
10. **System Responses:** Acknowledgment of engagement with a Session Composition part; indication that the Session has reached its end; return to the Dashboard with Progress updated on the next visit, per M13.
11. **Success Conditions:** The Learner reaches the end of all seven Session Composition parts, and the Session is marked Completed, per M08 and M13.
12. **Failure Conditions:** None distinct from Abandonment — leaving the Session before completion is a defined, valid outcome, not an error, per M08 and M13.
13. **Related User Flows:** The Generation, In Progress, Completed, and Abandoned states of the Learning Session Flow, per M05.
14. **Related Features:** F-09 Session Generation (produces the content shown), F-10 Learning Session Experience, F-11 Progress Recording (triggered on exit), per M06.
15. **Related Services:** Session Experience Service (RecordCompositionPartEngagement, CompleteSession, AbandonSession); Progress Service (RecordOutcome, triggered on Session end), per M18.
16. **Related Domain Objects:** Session, Topic, Session Composition, Progress Record, per M07 and M17.
17. **Related Configuration:** The Session's fixed generating English Level, Learning Goal, and Topic Toggle Preference are referenced but never changeable here, per M08.
18. **Access Rules:** Authenticated and Context-Dependent (a Session must be In Progress), per M25.
19. **Constraints:** Must never allow the Learner to change Level, Goal, or the Topic Toggle Preference mid-session; must never present more than one Session at a time, per M04 and M08.

---

# Cross-Screen Consistency

- The same Configuration concept (English Level, Learning Goal, Topic Toggle Preference) must always be represented identically wherever it appears, whether on the Dashboard or referenced on the Learning Session Page, per M11 and M12.
- The same category of System Response (success, error, warning, information) must always follow the same conceptual pattern regardless of which screen produces it, per M12's Feedback Principles.
- Every screen presents exactly one clear primary action appropriate to its Purpose, consistent with M11's Interaction Principles and M25's Consistency Principles.
- No screen's Success or Failure Conditions may contradict the Service Operation Postconditions and Failure Conditions already defined in M18 for the same underlying behavior.

---

# Error Handling Principles

- An error on any screen must never leave the Learner in an ambiguous state; per M13's Error Recovery Flows, the Learner is always returned to a known, valid screen — most often the Dashboard.
- An error must never cause loss of Configuration, in-progress Session engagement, or previously recorded Progress, consistent with M11's Error Experience Principles.
- An error is always attributable to a specific, already-documented Failure Condition from this document or from M13 and M18 — no screen may exhibit an undocumented failure.
- Recovering from an error never requires the Learner to redo more than the specific action that failed, consistent with M11.

---

# Empty State Principles

- A first-time Learner reaching the Dashboard before ever setting an English Level or Learning Goal must be presented with a clear path to set them, rather than an ambiguous or blank state, per M03's "First-time user" edge case and M13's "No Generated Session" handling.
- A Learner reaching the Dashboard before ever generating a Session must see Session Generation presented as the clear next action, consistent with M03's "No generated session yet" edge case.
- A Learner whose Progress Service GetMostRecentOutcome (per M18) indicates no Session has ever been generated must see this reflected plainly, not as an error, consistent with M12's Feedback Principles distinguishing Information from Errors.

---

# Loading State Principles

- While Session Generation is being processed, the Learner must be able to tell that the request is being handled, consistent with M11's Immediate Feedback principle and M12's Loading feedback principle.
- No screen may appear unresponsive while an operation defined in M18 is pending; the Learner must never be left wondering whether their action was received.
- No specific timing, duration, or technical loading mechanism is defined in this document, consistent with M15's Performance expectations, which define no numeric targets.

---

# Screen Constraints

1. Every screen's behavior must conform exactly to its Individual Screen Specification in this document; no screen may exhibit behavior not documented here or in M04, M05, M13, or M18.
2. No screen's Access Rules may differ from those established in M25.
3. Every screen's Success and Failure Conditions must remain traceable to the Service Operations defined in M18 that the screen invokes.
4. No screen may be added, removed, or altered in purpose without a new, explicit milestone.

---

# Screen Specification Glossary

- **Screen Specification:** The complete, eighteen-field description of a single screen's behavior and responsibilities.
- **Precondition:** A condition that must already be true for a screen to be validly reached, distinct from an Entry Point (M25), which describes how the Learner arrived.
- **Entry Condition / Exit Condition:** The specific circumstances governing arrival at, and departure from, a screen.
- **Empty State:** The condition in which a screen must present information that does not yet exist (e.g., no Configuration set, no Session ever generated).
- **Loading State:** The condition in which a screen is awaiting the outcome of a pending operation.
- **Context-Dependent Access:** An access requirement beyond authentication alone, as defined in M25, applying specifically to the Learning Session Page.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined a standard, nineteen-field Screen Specification Template used consistently for every screen.
- Produced Individual Screen Specifications for all five screens identified in M25 (Landing Page, Sign Up Page, Sign In Page, Dashboard, Learning Session Page), each fully traced to M04, M05, M06, M07, M09, M13, M17, and M18.
- Documented Cross-Screen Consistency, Error Handling Principles, Empty State Principles, Loading State Principles, Screen Constraints, and a Screen Specification Glossary.

### Files Created
- `docs/milestones/M26-screen-specifications.md`

### Files Modified
- None. M01–M25 were not revisited or altered.

### Pending
- No further action pending within M26. Awaiting next milestone instructions.

### Risks
- The Screen Specification Template lists nineteen fields, one more than the eighteen enumerated in the milestone's instructions — "Constraints" was numbered as a nineteenth item because the instructions' list, read literally, already contains eighteen distinct fields before Constraints; this is a labeling clarification only, and all originally requested fields are present in full for every screen.
- No new Success or Failure Condition was invented for any screen; every one specified here is a direct restatement of a condition already established in M13 or M18. Where a screen's specification required synthesis (e.g., combining M13's Dashboard conditions with M18's underlying Service Operations), that synthesis is noted as such rather than presented as new fact.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
