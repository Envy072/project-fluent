# M19 — Frontend Architecture

**Status:** Draft
**Owner:** Product / Architecture
**Milestone:** M19
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M18 — Service Contracts](./M18-service-contracts.md)

---

# Overview

The Frontend Architecture defines the internal logical structure of the Presentation Layer described at a high level in M16. Where M16 treated Presentation as a single layer within the broader Technical Architecture, this document opens that layer up and defines its own internal shape — the logical divisions responsible for viewing, interacting, holding state, and navigating. It remains entirely conceptual: it describes what the frontend is responsible for and how those responsibilities are divided, not how any of it is built.

---

# Frontend Layers

## 1. View Layer
- **Purpose:** Present information to the Learner and capture their raw input.
- **Responsibilities:** Displaying the pages defined in M04 (Landing, Sign Up, Sign In, Dashboard, Learning Session Page) with whatever state is currently held by the State Layer; capturing the Learner's raw interactions (selections, submissions, requests to proceed).
- **Inputs:** Current state from the State Layer; the Learner's raw interactions.
- **Outputs:** Rendered presentation of that state; raw interaction events, passed to the Interaction Layer.
- **Constraints:** Must never decide whether an interaction is valid or what its outcome should be — it only displays and captures.

## 2. Interaction Layer
- **Purpose:** Translate the Learner's raw interactions into the defined User Actions from M13, and route them appropriately.
- **Responsibilities:** Recognizing which User Action a raw interaction corresponds to; performing basic format checks (e.g., that a Configuration selection is one of its defined values, per M09) before forwarding; forwarding valid User Actions to the Application Layer described in M16; receiving System Responses back and passing resulting state to the State Layer.
- **Inputs:** Raw interaction events from the View Layer.
- **Outputs:** User Actions forwarded to the Application Layer; updated state passed to the State Layer.
- **Constraints:** Must never make a business decision itself — it only recognizes intent and performs the same basic format validation already described in M09; authoritative correctness is always determined by the Domain Layer, per M16.

## 3. State Layer
- **Purpose:** Hold the frontend's local, conceptual reflection of the Learner's current Authentication, Configuration, Session, and Progress state.
- **Responsibilities:** Storing the most recently confirmed values for these four categories of state (see State Responsibilities below); making that state available to the View Layer for rendering; updating itself only in response to confirmed outcomes from the Interaction Layer.
- **Inputs:** Confirmed outcomes and current values received via the Interaction Layer.
- **Outputs:** Current state, made available to the View Layer and Navigation Layer.
- **Constraints:** Must never be treated as the authoritative source of truth — it is always a reflection of what the backend Domain Layer (per M16) has confirmed, never a substitute for it.

## 4. Navigation Layer
- **Purpose:** Determine the Learner's current logical position within the Site Map defined in M04, and govern transitions between pages.
- **Responsibilities:** Tracking which page the Learner is currently positioned at; permitting a transition to another page only when that transition is consistent with M04's Navigation Structure and M05's User Flows; reflecting Authentication State (from the State Layer) to prevent positioning the Learner at a page they are not permitted to access.
- **Inputs:** The Learner's current position; completed User Actions that warrant a transition (e.g., successful Sign In, successful Session Generation); current Authentication State from the State Layer.
- **Outputs:** The Learner's updated logical position, passed to the View Layer to render the corresponding page.
- **Constraints:** Must never permit a position not defined in M04's Site Map, and must never permit a transition not defined in M04's Navigation Structure or M05's User Flows.

---

# Presentation Responsibilities

**Belongs in the Presentation Layer:**
- Displaying information already confirmed by the backend, per M16.
- Capturing the Learner's raw interactions and translating them into defined User Actions.
- Performing basic format checks consistent with M09's Validation Rules (e.g., that a selected value is among the defined set) before forwarding a request.
- Holding a local, temporary reflection of confirmed state for rendering purposes.
- Determining the Learner's current logical position and permissible transitions, per M04 and M05.

**Must never belong in the Presentation Layer:**
- Enforcing Entity Rules, Business Rules, or Functional Area rules (per M07, M08, M13) — these belong exclusively to the Domain Layer, per M16.
- Determining whether a Session Generation request succeeds, or what a generated Session contains.
- Deciding a Progress Record's outcome.
- Retaining information across sessions on a long-term, authoritative basis — that belongs to the Persistence Layer, per M16.
- Introducing any decision point for the Learner beyond the three Configuration options defined in M09.

---

# State Responsibilities

The frontend manages exactly four conceptual categories of state, each already established in prior milestones:

- **Authentication State:** A local reflection of whether the Learner is currently Signed In or Signed Out, per M10 and M17. Used by the Navigation Layer to govern access to protected pages.
- **Configuration State:** A local reflection of the Learner's current English Level, Learning Goal, and Topic Toggle Preference, per M09. Used by the View Layer to display current values on the Dashboard and by the Interaction Layer when forwarding a Session Generation request.
- **Session State:** A local reflection of the currently In Progress Session, including which Session Composition parts have been engaged with, per M08. Used by the View Layer to render the Learning Session Experience and by the Navigation Layer to determine whether the Learner may leave the Learning Session Page.
- **Progress State:** A local reflection of the Learner's most recent Progress Record outcome, per M07. Used by the View Layer to reflect Progress on the Dashboard, per M05's Returning User Flow.

No other category of state is managed by the frontend in Version 1. No state management technology, library, or pattern is defined in this document.

---

# Navigation Responsibilities

- The Navigation Layer is responsible for knowing, at any moment, which page from M04's Site Map the Learner is logically positioned at.
- The Navigation Layer is responsible for permitting a transition only when it is consistent with a path already defined in M04's Navigation Structure or M05's User Flows — no undefined transition may occur.
- The Navigation Layer is responsible for reflecting Authentication State such that a Learner who is Signed Out can never be positioned at a protected page (Dashboard, Learning Session Page), consistent with M04's Authentication Flow.
- The Navigation Layer is responsible for positioning the Learner at the Dashboard immediately following successful Account Creation or Sign In, and at the Learning Session Page immediately following successful Session Generation, per M05.
- No routes, URLs, or framework-level navigation concepts are defined in this document — navigation is described purely as logical positioning and permitted transition.

---

# Interaction Flow

1. The Learner performs a raw interaction, captured by the **View Layer**.
2. The **Interaction Layer** recognizes which User Action (per M13) the interaction corresponds to, performs basic format checks, and forwards the User Action to the Application Layer (per M16).
3. The Application Layer coordinates the request as described in M16's Request Lifecycle, returning a System Response.
4. The **Interaction Layer** receives the System Response and passes the resulting confirmed state to the **State Layer**.
5. The **State Layer** updates the relevant category of state (Authentication, Configuration, Session, or Progress).
6. The **Navigation Layer** evaluates whether the updated state warrants a change in the Learner's logical position (e.g., a successful Sign In warrants moving to the Dashboard).
7. The **View Layer** re-renders to reflect the current state and current position.

This sequence occurs identically for every User Action defined in M13; no interaction skips a layer or occurs out of this order.

---

# Frontend Boundaries

| Concern | Frontend Responsibility | Backend Service Responsibility (per M16, M18) |
|---|---|---|
| Displaying current state | Yes — the View Layer renders confirmed state. | No — services do not present information. |
| Capturing Learner intent | Yes — the View and Interaction Layers capture and translate it. | No. |
| Basic format validation (e.g., value is among a defined set) | Yes — performed before forwarding, per M09. | Yes, again, authoritatively — the Domain Layer re-validates every request regardless of frontend checks, per M16. |
| Determining business correctness (e.g., can a Session be generated) | No — the frontend never decides this. | Yes — exclusively the Domain Layer, per M16 and M18. |
| Producing a Session | No. | Yes — the Session Generation Service, per M18. |
| Recording a Progress outcome | No. | Yes — the Progress Service, per M18. |
| Retaining information long-term | No — frontend state is temporary and local. | Yes — the Persistence Layer, per M16. |
| Governing logical page position | Yes — the Navigation Layer. | No — this is a Presentation-only concern. |

---

# Frontend Constraints

The following must always remain true:

1. The frontend never determines the correctness of a business outcome; it only reflects outcomes already confirmed by the backend, per M16.
2. Frontend state is always a temporary reflection of backend-confirmed state, never an authoritative source in its own right.
3. The Navigation Layer never positions a Learner at a page inconsistent with their current Authentication State, per M04.
4. The Interaction Layer never bypasses the Application Layer boundary defined in M16 — no frontend layer communicates directly with the Domain or Persistence Layers.
5. No frontend layer introduces a decision point for the Learner beyond the three Configuration options defined in M09.
6. Every Interaction Flow sequence (View → Interaction → Application → State → Navigation → View) occurs in full for every User Action; no step is skipped.

---

# Frontend Glossary

- **View Layer:** The frontend layer responsible for presenting state and capturing raw Learner interaction.
- **Interaction Layer:** The frontend layer responsible for translating raw interaction into defined User Actions and routing them to the Application Layer.
- **State Layer:** The frontend layer responsible for holding a local, temporary reflection of confirmed Authentication, Configuration, Session, and Progress state.
- **Navigation Layer:** The frontend layer responsible for tracking the Learner's logical position within the Site Map and governing permitted transitions.
- **Local State:** State held temporarily by the frontend for rendering purposes, always subordinate to backend-confirmed state.
- **Authoritative State:** The confirmed, correct state as determined by the Domain Layer (per M16) — the frontend never overrides it.
- **Logical Position:** The page, from M04's Site Map, the Learner is currently considered to be at.
- **Transition:** A permitted change in logical position, consistent with M04's Navigation Structure and M05's User Flows.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined four Frontend Layers (View, Interaction, State, Navigation), each with Purpose, Responsibilities, Inputs, Outputs, and Constraints, entirely technology-agnostic.
- Documented Presentation Responsibilities (what belongs and what must never belong in the frontend), State Responsibilities across the four established state categories (Authentication, Configuration, Session, Progress), and Navigation Responsibilities without routes, URLs, or framework concepts.
- Documented the Interaction Flow sequence, a Frontend Boundaries table distinguishing frontend from backend service responsibility, Frontend Constraints, and a Frontend Glossary.

### Files Created
- `docs/milestones/M19-frontend-architecture.md`

### Files Modified
- None. M01–M18 were not revisited or altered.

### Pending
- No further action pending within M19. Awaiting next milestone instructions.

### Risks
- This document opens up the single Presentation Layer from M16 into four internal layers (View, Interaction, State, Navigation). This is a natural elaboration consistent with M16's Separation of Concerns, but it is the first milestone to subdivide Presentation this way, and should be confirmed as the intended internal shape before any future frontend-specific milestone builds on it.
- Basic format validation is described as occurring in both the Interaction Layer (frontend) and the Domain Layer (backend, per M16, M18), with the backend's check always authoritative. This dual-check pattern was necessary to reconcile M09's Validation Rules with M16's rule that only the Domain Layer determines correctness, and should be confirmed as intended rather than redundant.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
