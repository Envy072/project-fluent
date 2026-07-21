# M28 — Low-Fidelity Wireframe Specification

**Status:** Draft
**Owner:** Product / Design
**Milestone:** M28
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M27 — Screen Interaction Flows](./M27-screen-interaction-flows.md)

---

# Overview

The Low-Fidelity Wireframe Specification defines the structural layout of every screen — what regions of information exist, how they are prioritized relative to one another, and where feedback, errors, empty states, and loading indication belong. It translates the behavior already defined in M26 and M27 into structural placement, without ever specifying color, typography, or visual style. A wireframe here is a map of information and hierarchy, not a picture.

---

# Wireframe Principles

- **Structure follows behavior:** Every region defined in this document exists because a Content Group, Action, or Feedback need was already established in M26 or M27 — no region is introduced for its own sake.
- **One primary action per screen:** Consistent with M11's "One Clear Primary Action" principle, every screen's structure places exactly one action at the highest level of prominence.
- **Hierarchy reflects importance, not decoration:** The order in which regions are described reflects their actual importance to the Learner's current Interaction Goal (per M27), not visual arrangement.
- **Feedback stays local:** Error, empty-state, and loading indication are always placed adjacent to the specific region they concern, never as an unassociated, floating element.
- **No structure without purpose:** A region exists only if it corresponds to a Content Group, Related Feature, or Related Service already established in M06, M18, M26, or M27.

---

# Screen Wireframe Specifications

## Landing Page

- **Primary Regions:** Introductory Region (communicates what the product is); Action Region (entry points to Sign Up and Sign In).
- **Information Hierarchy:** 1) Product introduction; 2) primary path to Sign Up; 3) secondary path to Sign In.
- **Content Groups:** Product Introduction group; Entry Actions group.
- **Navigation Areas:** The Action Region itself, containing the paths to the Sign Up Page and Sign In Page.
- **Primary Actions:** Choose Sign Up.
- **Secondary Actions:** Choose Sign In.
- **Feedback Areas:** None — no Success or Failure Condition is defined for this screen, per M26.
- **Empty State Placement:** Not applicable — this screen displays no Learner-specific data.
- **Error Message Placement:** Not applicable, per M26's Landing Page Failure Conditions.
- **Loading Indicator Placement:** Not applicable — no pending operation occurs on this screen.
- **Accessibility Considerations:** The primary action must be clearly distinguishable from the secondary action, per M11; introductory content must be perceivable without depending on a single sense, per M15.
- **Related Screen Specifications:** M26 Landing Page Specification; M27 Landing Page Interaction Flow.
- **Constraints:** Must never contain a region requiring Level, Goal, or any authenticated content, per M04.

---

## Sign Up Page

- **Primary Regions:** Account Creation Region (captures account details); Primary Action Region (Create Account); Alternate Path Region (link to Sign In).
- **Information Hierarchy:** 1) Account Creation Region; 2) Primary Action; 3) Alternate Path.
- **Content Groups:** Account Details group; Primary Action group; Alternate Path group.
- **Navigation Areas:** Alternate Path Region, leading to the Sign In Page.
- **Primary Actions:** Create Account.
- **Secondary Actions:** Move to Sign In.
- **Feedback Areas:** A Feedback Area associated with the Account Creation Region, reflecting M18's CreateAccount Failure Conditions.
- **Empty State Placement:** Not applicable — this screen displays no pre-existing Learner data.
- **Error Message Placement:** Directly adjacent to the Account Creation Region, associated with the specific detail that caused the failure, consistent with M11's Error Experience Principles.
- **Loading Indicator Placement:** Adjacent to the Primary Action Region, shown while the Create Account request is pending, per M11's Immediate Feedback principle.
- **Accessibility Considerations:** Account Creation Region and Primary Action must be independently reachable via assistive technology; error feedback must be perceivable without depending on a single sense, per M15.
- **Related Screen Specifications:** M26 Sign Up Page Specification; M27 Sign Up Page Interaction Flow.
- **Constraints:** Must never contain a region requesting information beyond what is required to establish the account, per M01 and M04.

---

## Sign In Page

- **Primary Regions:** Credential Region (captures sign-in credentials); Primary Action Region (Sign In); Alternate Path Region (link to Sign Up).
- **Information Hierarchy:** 1) Credential Region; 2) Primary Action; 3) Alternate Path.
- **Content Groups:** Credentials group; Primary Action group; Alternate Path group.
- **Navigation Areas:** Alternate Path Region, leading to the Sign Up Page.
- **Primary Actions:** Sign In.
- **Secondary Actions:** Move to Sign Up.
- **Feedback Areas:** A Feedback Area associated with the Credential Region, reflecting M18's SignIn Failure Conditions.
- **Empty State Placement:** Not applicable — this screen displays no pre-existing Learner data.
- **Error Message Placement:** Directly adjacent to the Credential Region, consistent with M11's Error Experience Principles.
- **Loading Indicator Placement:** Adjacent to the Primary Action Region, shown while the Sign In request is pending.
- **Accessibility Considerations:** Credential Region and Primary Action must be independently reachable via assistive technology; error feedback must be perceivable without depending on a single sense, per M15.
- **Related Screen Specifications:** M26 Sign In Page Specification; M27 Sign In Page Interaction Flow.
- **Constraints:** Must never contain a region requiring setup before granting Dashboard access, per M04.

---

## Dashboard

- **Primary Regions:** Configuration Region (English Level, Learning Goal, Topic Toggle Preference); Progress Region (most recent outcome); Primary Action Region (Generate Session); Account Region (Sign Out).
- **Information Hierarchy:** 1) Primary Action Region — Generate Session is the single most prominent element, per M11; 2) Configuration Region, since it directly informs the primary action; 3) Progress Region; 4) Account Region, always available but least prominent.
- **Content Groups:** English Level group; Learning Goal group; Topic Toggle Preference group (together forming the Configuration Region); Progress Reflection group; Session Generation group; Account group.
- **Navigation Areas:** Account Region, containing the path to Sign Out and, by extension, the Landing Page.
- **Primary Actions:** Generate Session.
- **Secondary Actions:** Set English Level; Set Learning Goal; Change Topic Toggle Preference; Sign Out.
- **Feedback Areas:** A Feedback Area associated with the Configuration Region, reflecting successful or rejected Configuration changes per M09; a Feedback Area associated with the Primary Action Region, reflecting Session Generation Failure Conditions per M18.
- **Empty State Placement:** Within the Configuration Region, when English Level or Learning Goal is Unconfigured — presenting a clear path to set them before generation is available, per M03's "First-time user" and "No generated session yet" edge cases; within the Progress Region, when no Session has ever been generated, per M18's GetMostRecentOutcome.
- **Error Message Placement:** Adjacent to the specific Configuration group that failed validation; adjacent to the Primary Action Region if a Session Generation request fails.
- **Loading Indicator Placement:** Adjacent to the Primary Action Region, shown while a Session Generation request is pending.
- **Accessibility Considerations:** Each Configuration group must be independently reachable via assistive technology; the Primary Action must remain clearly distinguishable as the one primary action, per M11; Progress Region content must be perceivable without depending on a single sense, per M15.
- **Related Screen Specifications:** M26 Dashboard Specification; M27 Dashboard Interaction Flow.
- **Constraints:** Must never contain a region for any setting beyond the three Configuration options, or a topic library region, per M04.

---

## Learning Session Page

- **Primary Regions:** Session Composition Region (the currently active part — Reading, Listening, Speaking, Writing, Vocabulary, Grammar, or Quiz); Progression Region (indicating how far through the seven parts the Learner is); Primary Action Region (advance or complete the current part); Exit Region (leave before completion).
- **Information Hierarchy:** 1) Session Composition Region, since it is the content the Learner is actively engaging with; 2) Progression Region; 3) Primary Action Region; 4) Exit Region, always available but least prominent.
- **Content Groups:** Topic Context group (reflecting the Session's Topic(s)); Composition Part Content group (the active part's content); Progression Indicator group; Primary Action group; Exit group.
- **Navigation Areas:** Exit Region, providing the path back to the Dashboard before completion.
- **Primary Actions:** Progress through or complete the current Session Composition part.
- **Secondary Actions:** Leave the Session before completion.
- **Feedback Areas:** A Feedback Area associated with the Session Composition Region, confirming engagement with a part has registered, per M11's Immediate Feedback principle; a Feedback Area indicating the Session has reached its end, per M08.
- **Empty State Placement:** Not applicable — a Session is only ever presented once fully generated with all seven Session Composition parts, per M08's Business Constraints; no partial Session state exists to place.
- **Error Message Placement:** Not applicable — no Failure Condition distinct from Abandonment is defined for this screen, per M13 and M26.
- **Loading Indicator Placement:** Not applicable within this screen — Session content is already fully generated upon arrival, per M08; loading indication for generation itself belongs to the Dashboard's Primary Action Region.
- **Accessibility Considerations:** Session Composition content must never depend on a single sense, given the mix of text-based (Reading, Writing) and audio-based (Listening, Speaking) parts, per M11 and M15; the Progression Region and Exit Region must remain independently reachable via assistive technology.
- **Related Screen Specifications:** M26 Learning Session Page Specification; M27 Learning Session Page Interaction Flow.
- **Constraints:** Must never contain a region allowing mid-session changes to Level, Goal, or the Topic Toggle Preference, or a region presenting more than one Session's content at a time, per M04 and M08.

---

# Cross-Screen Structural Consistency

- The same conceptual region types — Primary Content Region, Action Region, Feedback Area, Navigation Area — recur across every screen with the same meaning, so a Learner's understanding of structure transfers from one screen to the next.
- The Primary Action always occupies the highest level of Information Hierarchy on every screen, per M11's "One Clear Primary Action" principle.
- Feedback Areas are always placed adjacent to the specific region they concern, never as a generic, unassociated element, across all five screens.
- Empty State, Error Message, and Loading Indicator placement follow the same pattern everywhere they apply: directly adjacent to the region whose data or action is affected, never detached from context.
- No screen introduces a region type not already used by at least one other screen, except where a screen's unique purpose genuinely requires it (e.g., the Session Composition Region, unique to the Learning Session Page).

---

# Wireframe Constraints

1. Every region defined in this document must correspond to a Content Group, Related Feature, or Related Service already established in M06, M18, M26, or M27 — no undocumented region may exist.
2. Every screen's Information Hierarchy must place exactly one Primary Action at its highest level, consistent with M11.
3. Every Feedback Area, Empty State, Error Message, and Loading Indicator placement must be adjacent to the region it concerns.
4. No screen's structure may introduce a region that violates that screen's Constraints as defined in M04, M08, M25, or M26.
5. No color, typography, branding, or visual styling may be introduced anywhere in this document or attributed to any region.

---

# Wireframe Glossary

- **Region:** A named, conceptual area of a screen responsible for one coherent purpose.
- **Content Group:** A cluster of related information or controls within a region, corresponding to a Feature or Configuration option already established in prior milestones.
- **Information Hierarchy:** The ranked order of importance among a screen's regions.
- **Primary Action:** The single most prominent action available on a screen, per M11.
- **Secondary Action:** Any other available action on a screen, subordinate to the Primary Action.
- **Feedback Area:** A region responsible for communicating the outcome of an action, placed adjacent to the region it concerns.
- **Empty State Placement:** The structural location where a screen indicates that expected data does not yet exist.
- **Error Message Placement:** The structural location where a screen indicates that an action has failed.
- **Loading Indicator Placement:** The structural location where a screen indicates that an action is pending.
- **Navigation Area:** The region of a screen responsible for moving the Learner to another screen.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented Wireframe Principles establishing that structure follows behavior, one primary action per screen, hierarchy reflects importance, feedback stays local, and no structure exists without a documented purpose.
- Produced Screen Wireframe Specifications for all five screens defined in M25, each with Primary Regions, Information Hierarchy, Content Groups, Navigation Areas, Primary/Secondary Actions, Feedback Areas, and Empty State, Error Message, and Loading Indicator placement, with Accessibility Considerations and full traceability to M04, M06, M08, M09, M11, M15, M18, M25, M26, and M27.
- Documented Cross-Screen Structural Consistency, Wireframe Constraints, and a Wireframe Glossary.

### Files Created
- `docs/milestones/M28-low-fidelity-wireframe-specification.md`

### Files Modified
- None. M01–M27 were not revisited or altered.

### Pending
- No further action pending within M28. Awaiting next milestone instructions.

### Risks
- This document introduces named structural regions (e.g., "Configuration Region," "Session Composition Region") for the first time. These are structural groupings only, directly derived from Content Groups and Related Features already established in M06, M18, M26, and M27 — no new feature or behavior was introduced, but the specific region names are new labels and should be confirmed as sensible before any future visual design milestone builds on them.
- The Information Hierarchy ranking on the Dashboard places the Configuration Region above the Progress Region, reasoning that Configuration directly informs the Primary Action while Progress is purely reflective. This is a structural judgment call consistent with M11's principles but not explicitly dictated by any single prior milestone, and should be validated.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
