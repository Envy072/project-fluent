# M04 — Information Architecture (IA)

**Status:** Draft
**Owner:** Product
**Milestone:** M04
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md), [M02 — Product Requirements](./M02-product-requirements.md), [M03 — User Personas and Stories](./M03-user-personas-and-stories.md)

---

# Information Architecture Overview

The Information Architecture defines how Version 1 of Project Fluent is organized: what pages exist, what each page is responsible for, how learners move between them, and which pages require authentication. It exists to ensure the product's structure stays as simple and decision-free as the product itself — consistent with the principles in M01 (no onboarding questionnaire, no study-time setup, no complicated settings) and the Core User Journey defined in M02.

This document defines structure only. It does not define layout, visual design, components, or any technical implementation.

---

# Site Map

### 1. Landing Page
- **Purpose:** Introduces the product to a visitor who has not yet created an account, and directs them toward signing up.
- **Accessible From:** Direct entry (e.g. opening the app for the first time).
- **Accessible To:** Everyone (unauthenticated visitors and, if desired, signed-out learners).

### 2. Sign Up Page
- **Purpose:** Allows a new visitor to create an account, per FR-AUTH-01.
- **Accessible From:** Landing Page.
- **Accessible To:** Unauthenticated visitors only.

### 3. Sign In Page
- **Purpose:** Allows a returning learner to authenticate, per FR-AUTH-02.
- **Accessible From:** Landing Page.
- **Accessible To:** Unauthenticated visitors only.

### 4. Dashboard
- **Purpose:** Serves as the single central starting point for a signed-in learner. Presents current Level, Goal, and topic-toggle state, and provides the entry point to generate a session, per FR-DASH-01 through FR-DASH-06.
- **Accessible From:** Sign Up Page (immediately after account creation) and Sign In Page (immediately after authentication).
- **Accessible To:** Authenticated learners only.

### 5. Learning Session Page
- **Purpose:** Presents the generated session to the learner and allows them to work through it to completion, per FR-SESS-06 through FR-SESS-08.
- **Accessible From:** Dashboard, only after a session has been generated.
- **Accessible To:** Authenticated learners only.

No other pages exist in Version 1. There is no separate Settings page (Level, Goal, and the topic toggle are controlled from the Dashboard, per FR-SET-01–04), no topic or lesson library, and no separate "session complete" page — session completion is a state reached within the Learning Session Page, not a distinct page.

---

# Navigation Structure

- A visitor begins at the Landing Page and moves forward to either the Sign Up Page or the Sign In Page.
- Successful account creation moves the learner forward from the Sign Up Page directly to the Dashboard.
- Successful authentication moves the learner forward from the Sign In Page directly to the Dashboard.
- From the Dashboard, the learner moves forward to the Learning Session Page only by generating a session; there is no other route to the Learning Session Page.
- From the Learning Session Page, the learner returns to the Dashboard upon completing the session, or by choosing to leave the session before completion.
- There is no navigation path from the Learning Session Page or the Dashboard back to the Landing Page, Sign Up Page, or Sign In Page while the learner remains authenticated — those pages are only reachable by an unauthenticated visitor.
- Signing out returns the learner from any authenticated page to the Landing Page.

---

# Screen Responsibilities

### Landing Page
- **Primary Responsibility:** Communicate what the product is and direct the visitor toward account creation.
- **Secondary Responsibility:** Offer a path to Sign In for visitors who already have an account.
- **Must Never:** Require any Level, Goal, or setting input; present any content that requires authentication.

### Sign Up Page
- **Primary Responsibility:** Allow a visitor to create an account.
- **Secondary Responsibility:** Offer a path to the Sign In Page for visitors who already have an account.
- **Must Never:** Ask for Level, Goal, or the topic toggle, or any onboarding information beyond what is required to create an account, consistent with M01's "no onboarding questionnaire" principle.

### Sign In Page
- **Primary Responsibility:** Allow a returning learner to authenticate.
- **Secondary Responsibility:** Offer a path to the Sign Up Page for visitors who do not yet have an account.
- **Must Never:** Require any product setup before granting access to the Dashboard.

### Dashboard
- **Primary Responsibility:** Present the learner's current Level, Goal, and topic-toggle state, and provide the single entry point to generate a session.
- **Secondary Responsibility:** Reflect whether a prior session was completed or left incomplete, per FR-PROG-02 and FR-PROG-03.
- **Must Never:** Present any setting beyond Level, Goal, and the topic toggle; present a topic library or any manual topic selection; require the learner to complete additional steps before generation is available.

### Learning Session Page
- **Primary Responsibility:** Present the generated session and allow the learner to work through it to a clear completion state.
- **Secondary Responsibility:** Preserve the learner's ability to leave before completion without corrupting their account state.
- **Must Never:** Allow the learner to alter Level, Goal, or the topic toggle mid-session in a way that changes the session already generated; present more than one session at a time; require manual topic selection.

---

# Global Navigation Rules

- No page beyond the Landing Page, Sign Up Page, and Sign In Page is reachable without authentication.
- No page beyond the Dashboard and Learning Session Page is reachable once authenticated other than through the flow defined above.
- Every authenticated page must provide a way to sign out, returning the learner to the Landing Page.
- The Dashboard is always the landing destination immediately after authentication — there is no alternate authenticated home.
- The Learning Session Page is only reachable as a direct result of generating a session from the Dashboard; it cannot be reached directly (e.g., without a Level, Goal, and toggle state already set).
- No page in Version 1 links to a page not defined in the Site Map.

---

# Authentication Flow

**Public pages (no authentication required):**
- Landing Page
- Sign Up Page
- Sign In Page

**Authenticated pages (authentication required):**
- Dashboard
- Learning Session Page

A visitor without an account can only reach the three public pages. Access to the Dashboard and Learning Session Page is only granted after successful account creation (Sign Up Page) or successful authentication (Sign In Page), consistent with FR-AUTH-01 and FR-AUTH-02.

---

# Entry Points

- Opening the application for the first time as a new visitor (Landing Page).
- Opening the application as a visitor who chooses to sign in directly (Sign In Page).
- Returning to the application already authenticated from a prior session, per FR-AUTH-04 (Dashboard).
- Completing account creation (moves directly into the Dashboard as a product entry point).
- Completing authentication (moves directly into the Dashboard as a product entry point).

---

# Exit Points

**Ways to leave a Learning Session:**
- Completing the session, which returns the learner to the Dashboard with progress saved (per FR-PROG-01).
- Leaving the session before completion, which returns the learner to the Dashboard with the session marked incomplete (per FR-PROG-03).

**Ways to leave the application:**
- Signing out from any authenticated page, returning the learner to the Landing Page.
- Closing the application at any point, whether on a public or authenticated page.

---

# Protected Areas

The following pages are accessible only to authenticated learners:

- Dashboard
- Learning Session Page

All other pages (Landing Page, Sign Up Page, Sign In Page) are public.

---

# Page Dependency Matrix

| Page | Depends On | Nature of Dependency |
|---|---|---|
| Landing Page | None | Entry point; no prerequisites. |
| Sign Up Page | Landing Page (typical path) | Reachable from Landing Page; does not require prior authentication. |
| Sign In Page | Landing Page (typical path) | Reachable from Landing Page; does not require prior authentication. |
| Dashboard | Sign Up Page or Sign In Page | Requires a successfully authenticated learner; cannot be reached without one of these two pages first succeeding. |
| Learning Session Page | Dashboard | Requires a Level, Goal, and topic-toggle state to already be set on the Dashboard, and requires the learner to have initiated session generation from the Dashboard. Cannot exist independently of a Dashboard-originated generation request. |

These dependencies are product relationships only — they describe what must be true in the learner's journey for a page to be reachable, not how that is technically implemented.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined the full Version 1 Site Map (Landing Page, Sign Up Page, Sign In Page, Dashboard, Learning Session Page) consistent with M01–M03.
- Defined Navigation Structure, Screen Responsibilities, Global Navigation Rules, Authentication Flow, Entry Points, Exit Points, Protected Areas, and the Page Dependency Matrix.
- Confirmed no separate Settings page or session-complete page is needed, keeping the IA consistent with M02's "no additional settings" requirement (FR-SET-04) and M03's treatment of completion as a session state rather than a distinct page.

### Files Created
- `docs/milestones/M04-information-architecture.md`

### Files Modified
- None. M01, M02, and M03 were not revisited or altered.

### Pending
- No further action pending within M04. Awaiting next milestone instructions.

### Risks
- A Sign In Page was included as a distinct page even though M02's Core User Journey names only "Sign Up" explicitly. This was necessary to satisfy FR-AUTH-02 (Sign In) from M02, but should be confirmed as correctly scoped rather than an invented addition.
- Treating session completion as a state within the Learning Session Page (rather than a separate page) is an IA-level interpretation of M02/M03; if a future milestone requires a distinct summary or results page, this document would need revisiting.

### Open Questions
- Should the Sign In Page and Sign Up Page be treated as two distinct pages, or a single combined authentication page with two modes? This document assumed two distinct pages for clarity of the Site Map, but M01–M03 do not specify this and it may be a downstream design decision rather than an IA one.
- If a learner is authenticated but has no Level/Goal set yet (e.g., a brand-new account), is the Dashboard still the correct landing destination, or does this require a distinct first-time state? M03's "First-time user" edge case implies Level/Goal must be set before generation, but this document did not introduce a separate page for that, treating it as a state of the Dashboard.

Waiting for the next milestone.
