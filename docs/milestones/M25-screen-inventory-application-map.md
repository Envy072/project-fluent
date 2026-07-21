# M25 — Screen Inventory & Application Map

**Status:** Draft
**Owner:** Product
**Milestone:** M25
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M24 — Development Roadmap](./M24-development-roadmap.md)

---

# Overview

The Screen Inventory & Application Map provides a single, complete reference to every screen a Learner can reach in Version 1, viewed strictly from the user's perspective. It builds directly on M04's Information Architecture — the Site Map, Navigation Structure, and Authentication Flow already defined there — and enriches each screen with its purpose, audience, entry and exit points, and connections to the Features (M06) and User Flows (M05) already approved. It introduces no new screen, no visual design, and no implementation detail; it exists to make the application's complete structure verifiable at a glance.

---

# Screen Classification

Version 1's five screens, all already established in M04, fall into exactly three justified categories:

- **Public:** Reachable without authentication. Contains the Landing Page.
- **Authentication:** Screens whose purpose is establishing or verifying a Learner's identity. Contains the Sign Up Page and Sign In Page.
- **Learning (Core Application):** Reachable only by an authenticated Learner, where the product's actual value is delivered. Contains the Dashboard and the Learning Session Page.

No further category (e.g., Profile, Settings, Support) is introduced, since no such screen exists in M04's Site Map — Settings are hosted on the Dashboard itself (per M04's Screen Responsibilities and FR-SET-04), and no Profile or Support screen has been defined anywhere in M01–M24.

---

# Complete Screen Inventory

### Landing Page
- **Primary Purpose:** Introduce the product to a visitor and direct them toward account creation, per M04.
- **Primary User:** An unauthenticated visitor, including any persona from M03 before they have created an account.
- **Entry Points:** Opening the application for the first time, per M05's Entry Points.
- **Exit Points:** Proceeding to the Sign Up Page or the Sign In Page.
- **Related Features:** None directly — it is the entry surface leading to F-01 (Account Creation) and F-02 (Sign In), per M06.
- **Related User Flows:** The beginning of the First-Time User Flow and the Sign Up/Sign In Journeys within the Authentication Flow, per M05.
- **Dependencies:** None, per M04's Page Dependency Matrix.

### Sign Up Page
- **Primary Purpose:** Allow a visitor to create an account, per M04.
- **Primary User:** A first-time visitor without an existing account.
- **Entry Points:** The Landing Page.
- **Exit Points:** The Dashboard, upon successful account creation; the Sign In Page, if the visitor already has an account.
- **Related Features:** F-01 Account Creation, per M06.
- **Related User Flows:** The First-Time User Flow and the Sign Up Journey within the Authentication Flow, per M05.
- **Dependencies:** The Landing Page, as the typical path, per M04.

### Sign In Page
- **Primary Purpose:** Allow a returning, registered Learner to authenticate, per M04.
- **Primary User:** A returning Learner with an existing account.
- **Entry Points:** The Landing Page.
- **Exit Points:** The Dashboard, upon successful authentication; the Sign Up Page, if the visitor does not yet have an account.
- **Related Features:** F-02 Sign In, per M06.
- **Related User Flows:** The Returning User Flow and the Sign In Journey within the Authentication Flow, per M05.
- **Dependencies:** The Landing Page, as the typical path, per M04.

### Dashboard
- **Primary Purpose:** Serve as the single central hub for a signed-in Learner — presenting current Learning Configuration and Progress, and providing the entry point to generate a Session, per M04.
- **Primary User:** Any authenticated Learner, corresponding to every primary and secondary persona in M03.
- **Entry Points:** The Sign Up Page (after account creation); the Sign In Page (after authentication); a persisted Authentication State on return, per F-04; the Learning Session Page, upon completing or leaving a Session.
- **Exit Points:** The Learning Session Page, via Session Generation; the Landing Page, via Sign Out.
- **Related Features:** F-05 Dashboard, F-06 English Level Selection, F-07 Learning Goal Selection, F-08 Topic Toggle Control, F-09 Session Generation (entry point), F-11 Progress Recording (reflection), per M06.
- **Related User Flows:** The Returning User Flow, the Settings Change Flow, and the "Before Generation" state of the Learning Session Flow, per M05.
- **Dependencies:** The Sign Up Page or the Sign In Page, per M04's Page Dependency Matrix.

### Learning Session Page
- **Primary Purpose:** Present a generated Session and allow the Learner to work through it to a defined end, per M04.
- **Primary User:** An authenticated Learner who has just generated a Session.
- **Entry Points:** The Dashboard, only as a direct result of Session Generation.
- **Exit Points:** The Dashboard, upon completing the Session or leaving it before completion.
- **Related Features:** F-09 Session Generation (produces the content shown), F-10 Learning Session Experience, F-11 Progress Recording (triggered on exit), per M06.
- **Related User Flows:** The Generation, In Progress, Completed, and Abandoned states of the Learning Session Flow, per M05.
- **Dependencies:** The Dashboard, per M04's Page Dependency Matrix.

No sixth screen exists in Version 1; this inventory is exhaustive and reflects only what M04 has already established.

---

# Navigation Relationships

- The Landing Page connects to the Sign Up Page and the Sign In Page; these two connect to each other directly, without returning to the Landing Page first, per M04's Screen Responsibilities.
- The Sign Up Page and the Sign In Page each connect forward, on success, to the Dashboard — there is no other way to reach the Dashboard.
- The Dashboard connects forward to the Learning Session Page, but only as the result of a Session Generation request — there is no other way to reach the Learning Session Page.
- The Learning Session Page connects back to the Dashboard, whether the Session is completed or left before completion.
- Every authenticated screen (Dashboard, Learning Session Page) connects back to the Landing Page via Sign Out.
- No screen connects to a screen outside this set; the application's navigable structure is a closed graph of exactly these five screens.

---

# Screen Responsibilities

Consistent with M04's Screen Responsibilities, each screen's boundary remains unchanged here and is restated for completeness:

| Screen | Primary Responsibility | Must Never |
|---|---|---|
| Landing Page | Communicate the product and direct visitors to Sign Up. | Require Level, Goal, or any authenticated content. |
| Sign Up Page | Allow account creation. | Ask for onboarding information beyond account creation. |
| Sign In Page | Allow authentication. | Require setup before granting Dashboard access. |
| Dashboard | Present Configuration and Progress, and the Session Generation entry point. | Present a setting beyond Level, Goal, and the toggle, or any topic library. |
| Learning Session Page | Present and progress a single generated Session. | Allow mid-session changes to Level, Goal, or the toggle, or present more than one Session at a time. |

---

# Screen Access Rules

- **Public:** Landing Page, Sign Up Page, Sign In Page — reachable without authentication, per M04's Authentication Flow.
- **Authenticated:** Dashboard, Learning Session Page — reachable only by a Learner whose Authentication State is Signed In, per M04 and M22.
- **Context-Dependent:** The Learning Session Page additionally requires a specific context beyond authentication — a Session that is currently In Progress for that Learner, per M18's GenerateSession Postconditions. A Learner cannot be positioned at the Learning Session Page by authentication alone; a Session must also exist.

No screen in Version 1 has any access rule beyond these three categories.

---

# Screen Lifecycle

Describing the Learner's movement across screens over the course of using the product:

1. A visitor arrives at the **Landing Page** with no prior relationship to the product.
2. They move to the **Sign Up Page** (first-time) or **Sign In Page** (returning), establishing or confirming their Authentication State.
3. They arrive at the **Dashboard**, which becomes their recurring home screen for every future visit, per M05's Returning User Flow.
4. From the Dashboard, they may adjust their Learning Configuration, then move to the **Learning Session Page** by generating a Session.
5. They return from the Learning Session Page to the **Dashboard**, whether by completing or leaving the Session, with their Progress reflected.
6. This cycle (Dashboard → Learning Session Page → Dashboard) repeats indefinitely for as long as the Learner uses the product; no screen outside this cycle is ever introduced.
7. At any point, the Learner may leave the authenticated screens entirely via Sign Out, returning to the **Landing Page**.

---

# Consistency Principles

- Every screen belongs to exactly one of the three classifications defined in Screen Classification — no screen is ambiguous in category.
- Every screen presents one clear primary action, consistent with M11's Interaction Principles, regardless of which classification it belongs to.
- No screen introduces content outside its stated Primary Purpose; Configuration, Session content, and Progress are never blended across screens in a way that contradicts M10's Content Presentation boundaries.
- Navigation between screens only ever follows a path already defined in Navigation Relationships above — no screen may introduce an undocumented connection.

---

# Screen Constraints

1. Exactly five screens exist in Version 1: Landing Page, Sign Up Page, Sign In Page, Dashboard, Learning Session Page. No additional screen may be introduced without a new, explicit milestone.
2. No screen's Entry Points, Exit Points, or Dependencies may contradict M04's Site Map or Page Dependency Matrix; where any apparent difference exists, M04 governs.
3. No screen may be reachable by a Learner whose Authentication State or Session context does not satisfy its Screen Access Rule.
4. Every screen must remain traceable to at least one Feature (M06) and at least one User Flow (M05); no screen exists without a documented purpose.

---

# Screen Glossary

- **Screen:** A distinct, navigable destination within the application, equivalent to a "page" as used in M04.
- **Screen Classification:** The category (Public, Authentication, Learning) a screen belongs to, based on its access requirements and purpose.
- **Entry Point:** A documented way a Learner arrives at a given screen.
- **Exit Point:** A documented way a Learner leaves a given screen.
- **Context-Dependent Access:** An access requirement beyond simple authentication — specifically, the existence of an In Progress Session for the Learning Session Page.
- **Primary User:** The type of Learner (per M03's personas or general authentication state) a screen is designed to serve.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Classified Version 1's five existing screens (per M04) into three justified categories: Public, Authentication, and Learning (Core Application).
- Documented a Complete Screen Inventory for all five screens, each with Primary Purpose, Primary User, Entry Points, Exit Points, Related Features (M06), Related User Flows (M05), and Dependencies (M04).
- Documented Navigation Relationships, a Screen Responsibilities table restating M04 without contradiction, Screen Access Rules (including a Context-Dependent category for the Learning Session Page), Screen Lifecycle, Consistency Principles, Screen Constraints, and a Screen Glossary.

### Files Created
- `docs/milestones/M25-screen-inventory-application-map.md`

### Files Modified
- None. M01–M24 were not revisited or altered.

### Pending
- No further action pending within M25. Awaiting next milestone instructions.

### Risks
- No new screen was introduced. This document is a Feature- and Flow-enriched restatement of M04's Site Map, viewed through the specific inventory structure this milestone requested; where any wording here might appear to add detail beyond M04, M04 remains the governing, immutable source.
- "Context-Dependent" was introduced as a third Screen Access Rule category, alongside Public and Authenticated, to accurately describe the Learning Session Page's requirement of an In Progress Session beyond mere authentication. This is a descriptive addition, not a new access rule or feature, and reflects a Precondition already established in M18's GenerateSession contract.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
