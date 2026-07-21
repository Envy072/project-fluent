# M30 — High-Fidelity User Interface Specification

**Status:** Draft
**Owner:** Product / Design
**Milestone:** M30
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M29 — Design System Specification](./M29-design-system-specification.md)

---

# Overview

The High-Fidelity User Interface Specification describes the complete, final intended visual experience of every screen in Version 1, by combining the structural regions defined in M28 with the visual system defined in M29. It is the last conceptual step before any concrete design or implementation work begins — every screen described here is fully descriptive, using the semantic roles, typography levels, and feedback states already established, without ever choosing an actual color value, font, or pixel measurement. This document describes what the interface *is*, in prose, not what it is built with.

---

# Overall Experience

Consistent with M11's Product Experience Goals and M29's Design Philosophy, the complete interface must feel Minimal, Focused, Calm, Trustworthy, and Professional at every screen. A Learner moving through the product — from the Landing Page's simple introduction, through account creation or sign-in, to the Dashboard's single clear invitation to generate a Session, to the Learning Session Page's focused, one-part-at-a-time practice — should experience an application that never asks more of them than the three Configuration options already established in M09, and never presents more visual complexity than the region structure already established in M28. The overall experience is one continuous visual language, not five separately designed screens.

---

# Individual Screen Specifications

## Landing Page

- **Purpose:** Introduce the product and direct the visitor toward account creation, per M04.
- **Visual Hierarchy:** The Introductory Region is rendered at the Primary Heading level, drawing the eye first; the Action Region follows immediately beneath it.
- **Layout Structure:** A single-column arrangement following the Introductory Region → Action Region order established in M28, aligned to the shared Layout Grid.
- **Primary Content:** The product introduction, rendered at Body Text level.
- **Secondary Content:** None beyond the two entry actions.
- **Navigation Behavior:** Selecting Sign Up or Sign In moves the visitor to the corresponding screen, per M25.
- **Primary Actions:** Sign Up, rendered using the Primary semantic color with the highest visual weight on the screen.
- **Secondary Actions:** Sign In, rendered using the Neutral semantic color, clearly subordinate in weight to Sign Up.
- **Feedback Presentation:** None — consistent with M28, no Feedback Area exists on this screen.
- **Empty State Presentation:** Not applicable.
- **Error State Presentation:** Not applicable.
- **Loading State Presentation:** Not applicable.
- **Accessibility Considerations:** The Primary and Secondary actions are distinguishable by more than color alone; content order for assistive technology matches the Visual Hierarchy above.
- **Responsive Behavior:** The single-column structure adapts fluidly across viewport sizes while preserving the same Introductory Region → Action Region order at every size.
- **Related Design System Principles:** Design Philosophy (Calm, Trustworthy); Color System (Primary, Neutral); Typography System (Primary Heading, Body Text).
- **Related Features:** Entry surface for F-01 and F-02, per M25.
- **Constraints:** Must never present Level, Goal, or authenticated content, per M04.

---

## Sign Up Page

- **Purpose:** Allow account creation, per F-01.
- **Visual Hierarchy:** The Account Creation Region is rendered at the Primary Heading level with Body-level prompts; the Primary Action Region follows; the Alternate Path Region is rendered at Supporting Text level, least prominent.
- **Layout Structure:** A single-column arrangement following M28's order, aligned to the shared Layout Grid.
- **Primary Content:** Account creation prompts.
- **Secondary Content:** The alternate path to Sign In.
- **Navigation Behavior:** Successful account creation moves the Learner to the Dashboard; choosing the alternate path moves the visitor to the Sign In Page.
- **Primary Actions:** Create Account, rendered using the Primary semantic color; shown in a Disabled feedback state, per M29, until the required account details have been provided.
- **Secondary Actions:** Move to Sign In, rendered using the Neutral semantic color at Supporting Text level.
- **Feedback Presentation:** An Error feedback state, per M29, presented adjacent to the Account Creation Region if account creation fails, per M18's CreateAccount Failure Conditions; a Loading feedback state presented adjacent to the Primary Action Region while the request is pending.
- **Empty State Presentation:** Not applicable — this screen displays no pre-existing Learner data.
- **Error State Presentation:** Error semantic color with Supporting Text explaining the failure in actionable terms, placed directly adjacent to the Account Creation Region, per M11 and M28.
- **Loading State Presentation:** A Neutral, non-committal indication adjacent to the Primary Action Region while the Create Account request is pending.
- **Accessibility Considerations:** Account Creation fields and the Primary Action are independently reachable via assistive technology; error feedback is never conveyed by color alone.
- **Responsive Behavior:** The single-column structure is preserved at every viewport size; spacing adapts proportionally without reordering the Visual Hierarchy.
- **Related Design System Principles:** Color System (Primary, Error, Neutral); Typography (Primary Heading, Body Text, Supporting Text); Feedback States (Error, Loading, Disabled); Spacing System.
- **Related Features:** F-01 Account Creation.
- **Constraints:** Must never request information beyond what is required to establish the account, per M01 and M04.

---

## Sign In Page

- **Purpose:** Allow a returning Learner to authenticate, per F-02.
- **Visual Hierarchy:** The Credential Region is rendered at Primary Heading level with Body-level prompts; the Primary Action Region follows; the Alternate Path Region is rendered at Supporting Text level, least prominent.
- **Layout Structure:** A single-column arrangement following M28's order, aligned to the shared Layout Grid.
- **Primary Content:** Credential prompts.
- **Secondary Content:** The alternate path to Sign Up.
- **Navigation Behavior:** Successful authentication moves the Learner to the Dashboard; choosing the alternate path moves the visitor to the Sign Up Page.
- **Primary Actions:** Sign In, rendered using the Primary semantic color; shown in a Disabled feedback state until credentials have been provided.
- **Secondary Actions:** Move to Sign Up, rendered using the Neutral semantic color at Supporting Text level.
- **Feedback Presentation:** An Error feedback state presented adjacent to the Credential Region if authentication fails, per M18's SignIn Failure Conditions; a Loading feedback state adjacent to the Primary Action Region while pending.
- **Empty State Presentation:** Not applicable.
- **Error State Presentation:** Error semantic color with Supporting Text explaining the failure, placed directly adjacent to the Credential Region.
- **Loading State Presentation:** A Neutral indication adjacent to the Primary Action Region while the Sign In request is pending.
- **Accessibility Considerations:** Credential fields and the Primary Action are independently reachable via assistive technology; error feedback is never conveyed by color alone.
- **Responsive Behavior:** The single-column structure is preserved at every viewport size.
- **Related Design System Principles:** Color System (Primary, Error, Neutral); Typography (Primary Heading, Body Text, Supporting Text); Feedback States (Error, Loading, Disabled).
- **Related Features:** F-02 Sign In.
- **Constraints:** Must never require setup before granting Dashboard access, per M04.

---

## Dashboard

- **Purpose:** Serve as the central hub for a signed-in Learner, per M04.
- **Visual Hierarchy:** The Primary Action Region (Generate Session) is rendered with the highest visual weight, using the Primary semantic color; the Configuration Region follows, rendered at Secondary Heading level per Content Group (English Level, Learning Goal, Topic Toggle Preference); the Progress Region follows, rendered at Body/Supporting level; the Account Region is rendered at Supporting Text level, least prominent but always present.
- **Layout Structure:** Grid-aligned Regions per M28, with the Configuration Region subdivided into three consistently rendered Selection Control components — one per Content Group, per M29's Component Principles.
- **Primary Content:** Current Configuration values and the most recent Progress outcome.
- **Secondary Content:** The Account Region and its Sign Out path.
- **Navigation Behavior:** A successful Session Generation request moves the Learner to the Learning Session Page; Sign Out moves the Learner to the Landing Page.
- **Primary Actions:** Generate Session, rendered using the Primary semantic color; shown in a Disabled feedback state when English Level or Learning Goal is Unconfigured, per M18's GenerateSession Preconditions; shown in a Loading feedback state while a request is pending.
- **Secondary Actions:** Set English Level, Set Learning Goal, Change Topic Toggle Preference — each a Selection Control rendered with Neutral treatment; Sign Out — rendered at Supporting Text level within the Account Region.
- **Feedback Presentation:** A Success feedback state adjacent to the Configuration Region when a change is saved; an Error feedback state adjacent to the specific Configuration group or the Primary Action Region when a change or Session Generation request fails, per M09 and M18.
- **Empty State Presentation:** Within the Configuration Region, an Empty State — rendered with Supporting Text prompting selection — when English Level or Learning Goal is Unconfigured, per M03's "First-time user" edge case; within the Progress Region, an Informational (Neutral) presentation when no Session has ever been generated, per M18's GetMostRecentOutcome.
- **Error State Presentation:** Error semantic color with actionable Supporting Text, placed adjacent to the specific failing Configuration group or the Primary Action Region.
- **Loading State Presentation:** A Neutral indication adjacent to the Primary Action Region while a Session Generation request is pending.
- **Accessibility Considerations:** Each Configuration group is independently reachable and labeled; the Primary Action remains clearly distinguishable as the one primary action on the screen, per M11; Progress content is never conveyed by color alone.
- **Responsive Behavior:** Regions may reflow — for example, stacking vertically on narrower viewports — while preserving the exact Visual Hierarchy order defined above at every size.
- **Related Design System Principles:** Color System (Primary, Success, Error, Neutral); Typography (Secondary Heading, Body Text, Supporting Text); Feedback States (Success, Error, Loading, Disabled); Component Principles (Selection Control, Primary Action).
- **Related Features:** F-05 through F-09, F-11.
- **Constraints:** Must never present a setting beyond the three Configuration options, or any topic library, per M04.

---

## Learning Session Page

- **Purpose:** Present a generated Session and allow the Learner to work through it to a defined end, per F-10.
- **Visual Hierarchy:** The Session Composition Region (the currently active part's content) is rendered with the highest visual weight, at Primary Heading/Body level; the Progression Region follows, at Supporting Text level; the Primary Action Region follows, using the Primary semantic color; the Exit Region is rendered at Supporting Text level, least prominent but always available.
- **Layout Structure:** A single active-part focus, consistent with M08's rule that only one Session is ever presented at a time; the Session's Topic Context is reflected at Secondary Heading level; all Regions aligned to the shared Layout Grid.
- **Primary Content:** The active Session Composition part's content.
- **Secondary Content:** The Progression indicator and Topic Context.
- **Navigation Behavior:** Reaching Completion or choosing to leave before completion (Abandonment) is the only way to leave this screen, returning the Learner to the Dashboard in either case, per M25.
- **Primary Actions:** Advancing through or completing the current Session Composition part, rendered using the Primary semantic color.
- **Secondary Actions:** Leaving the Session before completion, rendered at Supporting Text level within the Exit Region, using a Warning-adjacent treatment when engaged — informative rather than punitive, per M12's and M29's Warning principle.
- **Feedback Presentation:** A Neutral acknowledgment feedback state when engagement with a Session Composition part registers, per M11's Immediate Feedback principle; a Success feedback state when the Session reaches Completion.
- **Empty State Presentation:** Not applicable — a Session is only ever presented once fully generated with all seven Session Composition parts, per M08.
- **Error State Presentation:** Not applicable — no Failure Condition distinct from Abandonment exists for this screen, per M13 and M28.
- **Loading State Presentation:** Not applicable within this screen — Session content is already fully generated upon arrival; loading indication for generation itself belongs to the Dashboard.
- **Accessibility Considerations:** Session Composition content never depends on a single sense, given the mix of text-based (Reading, Writing) and audio-based (Listening, Speaking) parts; the Progression Region and Exit Region remain independently reachable via assistive technology.
- **Responsive Behavior:** Session Composition content reflows appropriately across viewport sizes while preserving focus on the single active part and the Visual Hierarchy order defined above.
- **Related Design System Principles:** Color System (Primary, Success, Warning, Neutral); Typography (Primary Heading, Secondary Heading, Body Text, Supporting Text); Feedback States (Success); Component Principles.
- **Related Features:** F-09, F-10, F-11.
- **Constraints:** Must never allow mid-session changes to Level, Goal, or the Topic Toggle Preference, or present more than one Session at a time, per M04 and M08.

---

# Cross-Screen Visual Consistency

- Every screen applies the same Color System, Typography System, Component Principles, and Feedback States defined in M29 — no screen introduces a visual treatment unique to itself.
- The Primary semantic color always identifies the single Primary Action on a screen, and never anything else, across all five screens.
- Typography Hierarchy Levels (Primary Heading, Secondary Heading, Body Text, Supporting Text) carry the same relative meaning on every screen, regardless of content.
- Feedback States (Success, Warning, Error, Loading, Disabled) are always presented adjacent to the Region they concern, and always mean the same thing, wherever they appear.
- The overall Calm, Minimal, Focused, Trustworthy, and Professional experience described in Overall Experience is achieved by this consistent, repeated application of the same system — not by five independently designed screens.

---

# Responsive Design Principles

- The Visual Hierarchy order established for each screen above must be preserved at every viewport size — desktop, tablet, or mobile — regions may reflow or stack, but their relative order of importance never changes.
- Regions may adapt their arrangement (e.g., a single column on a narrower viewport, multiple aligned regions on a wider one) without ever hiding the Primary Action or collapsing a Region's content into an inaccessible state.
- The Spacing System and Layout Grid defined in M29 scale proportionally across viewport sizes, maintaining the same relative relationships between Regions and Content Groups at every size.
- No screen's interaction model is assumed to depend on a specific input method; every Primary and Secondary Action remains equally reachable regardless of viewport or input method, consistent with M15's Accessibility expectations.
- No specific breakpoint, device, or viewport measurement is defined in this document.

---

# Visual Accessibility

- No semantic color is ever the sole signal of meaning anywhere in the interface; every color-coded state is paired with text or another perceivable signal, per M15 and M29.
- Typography remains legible and perceivable across every screen regardless of a Learner's visual acuity, per M11.
- The order in which content is reachable via assistive technology matches the Visual Hierarchy defined for each screen, ensuring a consistent, predictable experience regardless of how a Learner navigates.
- The Learning Session Page's Session Composition content never depends on a single sense, given its mix of text-based and audio-based parts, per M11 and M15.
- No screen's Responsive Behavior may reduce or reorder accessibility guarantees already established for its default presentation.

---

# High-Fidelity UI Constraints

1. Every screen's High-Fidelity specification must trace directly to its structural definition in M28 and its visual system application from M29 — no new structure or visual rule may be introduced here.
2. No screen may introduce a Color, Typography, Feedback, or Component treatment not already defined in M29.
3. The Visual Hierarchy order defined for each screen in this document must exactly match the Information Hierarchy already defined for that screen in M28.
4. No concrete color value, font, icon, or pixel measurement may be introduced anywhere in this document.
5. Responsive reflow must never alter a screen's Visual Hierarchy order, per Responsive Design Principles.

---

# High-Fidelity UI Glossary

- **Visual Hierarchy:** The rendered order of prominence among a screen's Regions, expressed through the Color and Typography Systems, matching M28's Information Hierarchy.
- **Layout Structure:** The description of how a screen's Regions are arranged and aligned to the shared Layout Grid.
- **Primary Content / Secondary Content:** The most and less important information presented on a screen, respectively.
- **Feedback Presentation:** The description of how a Feedback State (per M29) is visually expressed on a given screen.
- **Empty / Error / Loading State Presentation:** The description of how a screen visually expresses the absence of expected data, a Failure Condition, or a pending operation, respectively.
- **Responsive Behavior:** The description of how a screen's Regions adapt across viewport sizes while preserving Visual Hierarchy.
- **Reflow:** The rearrangement of Regions across viewport sizes without altering their relative order of importance.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented the Overall Experience of the product, consistent with M11 and M29.
- Produced Individual Screen Specifications for all five screens defined in M25, each combining M28's structural regions with M29's Color System, Typography System, Component Principles, and Feedback States, described entirely in prose with no concrete color, font, or measurement values.
- Documented Cross-Screen Visual Consistency, Responsive Design Principles, Visual Accessibility, High-Fidelity UI Constraints, and a High-Fidelity UI Glossary.

### Files Created
- `docs/milestones/M30-high-fidelity-ui-specification.md`

### Files Modified
- None. M01–M29 were not revisited or altered.

### Pending
- No further action pending within M30. Awaiting next milestone instructions.

### Risks
- This document is described as "high-fidelity" per the milestone's title, but consistent with every prior design milestone's restriction, it still contains no concrete color values, fonts, or measurements — fidelity here refers to completeness of descriptive detail (Visual Hierarchy, Feedback Presentation, Responsive Behavior for every screen), not to literal visual precision. This should be confirmed as the correct reading of "high-fidelity" within a documentation-only phase.
- The Learning Session Page's "Leave a Session Before Completion" action was described using a "Warning-adjacent treatment," combining M29's Warning semantic role with the Exit Region's Supporting Text weight from M28. This is a synthesis of two already-established systems rather than a new visual rule, but it is the first time these two have been explicitly combined and should be validated.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
