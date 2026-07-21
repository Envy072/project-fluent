# M29 — Design System Specification

**Status:** Draft
**Owner:** Product / Design
**Milestone:** M29
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M28 — Low-Fidelity Wireframe Specification](./M28-low-fidelity-wireframe-specification.md)

---

# Overview

The Design System Specification defines the visual language every future screen design must follow, extending the Design Philosophy and principles first established in M12 into a complete, conceptual system: color, typography, spacing, grid, iconography, motion, feedback, and components. It sits directly above the structural regions defined in M28 — where M28 defined *what* exists on each screen and in what order of importance, this document defines the shared visual system that will eventually give that structure a consistent look and feel. No color value, font, or component design is chosen here; this document defines the system's rules, not its final appearance.

---

# Design Philosophy

This document builds directly on the Design Philosophy established in M12, without altering it: the product must remain **Minimal**, **Focused**, **Calm**, **Trustworthy**, and **Professional**. Every rule in this Design System Specification exists to make those five qualities achievable consistently across every screen defined in M25, rather than left to be reinterpreted screen by screen.

---

# Visual Principles

Restating and applying M12's Visual Language Principles as the foundation for this system:

- **Hierarchy:** Every screen has exactly one most-important element, per M11 and M28's Information Hierarchy — the visual system must make that hierarchy immediately perceivable.
- **Spacing:** Space groups related content and separates unrelated content, per M12.
- **Consistency:** The same concept must look and behave the same way everywhere it recurs, per M12 and M28's Cross-Screen Structural Consistency.
- **Balance:** No screen should read as visually heavier on one side than another.
- **Readability:** Comprehension is always prioritized over visual novelty.
- **Emphasis:** Reserved for what genuinely matters at a given moment — the Primary Action, a Success or Error outcome, per M28's Feedback Areas.

---

# Color System

- **Semantic Colors:** Color in this system is organized around meaning, not decoration. Version 1 requires exactly five semantic color roles:
  - **Primary:** Identifies the screen's single Primary Action, per M11 and M28.
  - **Neutral:** Supports the majority of content — introductory text, Configuration groups, and general structure — reinforcing the Calm quality from M12.
  - **Success:** Indicates a successfully completed outcome (e.g., a Completed Session, a saved Configuration change), per M28's Feedback Areas.
  - **Warning:** Indicates a consequence the Learner should be aware of (e.g., leaving a Session before completion), without being punitive in tone, per M12.
  - **Error:** Indicates a Failure Condition, per M13 and M18, communicated clearly and calmly.
- **Functional Roles:** Color exists to (1) distinguish state, (2) direct attention toward the Primary Action or most important information, and (3) reinforce the Calm and Trustworthy qualities of the Design Philosophy — never to establish visual identity for its own sake, per M12.
- **Usage Principles:** A semantic color's meaning must never change from screen to screen — Error always means the same thing on the Dashboard as it does on the Sign Up Page. Color is never the sole signal of meaning; every semantic use of color must be paired with text or another perceivable signal, per M15's Accessibility expectations. No specific color value is defined in this document.

---

# Typography System

- **Hierarchy Levels:** Version 1 requires exactly four conceptual typography levels:
  - **Primary Heading:** Names a screen's Primary Region or Interaction Goal, per M28.
  - **Secondary Heading:** Names a Content Group within a region, per M28.
  - **Body Text:** Presents the substantive content of a region — Session Composition content, introductory text, credential prompts.
  - **Supporting Text:** Presents secondary or contextual information — feedback messages, alternate-path links, empty-state guidance.
- **Principles:** Legibility is always prioritized over stylistic distinction, per M12. A small, fixed number of levels is used consistently — no screen introduces a fifth level or reassigns what a given level means. Typography reinforces the Professional and Trustworthy qualities from the Design Philosophy. No specific font, typeface, or size is defined in this document.

---

# Spacing System

- Spacing exists to group related content and separate unrelated content, per M12 — it is a tool of comprehension, not decoration.
- A single, consistent conceptual scale of relative spacing is used throughout the product (e.g., tighter spacing within a Content Group, more generous spacing between distinct Regions), so that spatial relationships are predictable across every screen defined in M25.
- Spacing must always reinforce the Information Hierarchy already defined per screen in M28 — more important regions and their separation from less important ones must be spatially legible.
- No specific measurement, unit, or numeric spacing value is defined in this document.

---

# Layout Grid Principles

- A single, consistent structural grid concept underlies every screen, so that Regions (per M28) align predictably regardless of which screen the Learner is on.
- The grid exists to support the Region and Content Group structure already defined in M28 — it does not introduce any new structural element beyond what M28 established.
- Alignment must be consistent enough that a Learner's spatial expectations, once learned on one screen, transfer directly to every other screen, reinforcing M28's Cross-Screen Structural Consistency.
- No specific column count, measurement, or breakpoint is defined in this document.

---

# Iconography Principles

Restating M12's Iconography Principles as this system's standard:

- Icons reinforce meaning already communicated in words — they never replace clear language with ambiguous symbols.
- The same concept is always represented by the same icon wherever it recurs, per the Consistency principle.
- Icons are reserved for genuinely recurring, well-understood concepts (e.g., indicating Completion, indicating an available action), not used decoratively.
- No specific icon or icon set is selected in this document.

---

# Motion Principles

Restating M12's Motion Principles as this system's standard:

- Motion exists only to help the Learner understand a change of state (e.g., a Session Generation request being received, a Session Composition part's engagement being acknowledged) — never as decoration.
- Motion reinforces the Calm quality from the Design Philosophy — it must feel smooth and unobtrusive.
- Motion is never the sole signal that something has happened, per M11's Immediate Feedback principle.
- No specific animation, transition, or timing value is defined in this document.

---

# Feedback States

Version 1 requires exactly five conceptual feedback states, each tied to the Color System's semantic roles and placed according to M28's Feedback Area rules:

- **Success:** Confirms a successfully completed outcome clearly and calmly, using the Success semantic color, placed adjacent to the region it concerns, per M28.
- **Warning:** Signals a consequence the Learner should be aware of, using the Warning semantic color, communicated without alarm, per M12.
- **Error:** Signals a Failure Condition (per M13 and M18) clearly and actionably, using the Error semantic color, placed adjacent to the region that failed, per M28.
- **Loading:** Signals that an operation is pending, using the Neutral semantic color, never implying success or failure while shown, placed per M28's Loading Indicator Placement.
- **Disabled:** Signals that an action is not currently available — for example, the Dashboard's Generate Session action before English Level and Learning Goal are Configured, per M18's GenerateSession Preconditions. A Disabled state is visually and semantically distinct from an Error state; it indicates unavailability, not failure.

---

# Component Principles

- A reusable component (e.g., a Primary Action, a Configuration selection control, a Feedback Area) must behave identically wherever it recurs across the five screens defined in M25, per M28's Cross-Screen Structural Consistency.
- A component's meaning and behavior are fixed by its role — Primary Action, Selection Control, Feedback Component, Navigation Element — never redefined by the specific screen hosting it.
- Components are defined here only by their behavioral and structural contract, consistent with the separation already established between structure (M28) and appearance (this document) — no individual component is visually designed in this milestone.
- Any future component design must express, not redefine, the roles and states already established in this document's Color System, Typography System, and Feedback States.

---

# Accessibility Principles

- No semantic color may be the sole signal of meaning; every color-coded state must also be communicated through text or another perceivable signal, per M15.
- Typography must remain legible and perceivable regardless of a Learner's visual acuity, consistent with M11's and M15's Accessibility expectations.
- The Information Hierarchy defined per screen in M28 must correspond to a consistent, logical order for Learners navigating via assistive technology.
- No visual design decision made under this system may reduce the accessibility guarantees already established in M11 and M15.

---

# Design Constraints

1. No specific color value, font, icon, spacing measurement, or grid measurement may be introduced under the authority of this document; those remain decisions for a future, more concrete design milestone.
2. Every visual rule in this document must trace to a principle already established in M11, M12, or M28 — no new visual philosophy is introduced here.
3. A semantic color, typography level, icon, or feedback state's meaning must never vary from screen to screen.
4. The Disabled feedback state must never be visually indistinguishable from the Error feedback state, since they represent different conditions (unavailability vs. failure).
5. No component's behavior may be redefined per screen; a component's role, once established, is fixed across the entire product.

---

# Design System Glossary

- **Semantic Color:** A color role defined by meaning (Primary, Neutral, Success, Warning, Error) rather than by a specific value.
- **Functional Role:** The purpose a design element serves (distinguishing state, directing attention, reinforcing tone) independent of its specific appearance.
- **Typography Hierarchy Level:** One of the four fixed levels of textual importance — Primary Heading, Secondary Heading, Body Text, Supporting Text.
- **Spacing Scale:** The consistent, relative system of spacing relationships used to group and separate content.
- **Layout Grid:** The consistent structural alignment system underlying every screen's Regions.
- **Component:** A reusable structural and behavioral unit (e.g., Primary Action, Selection Control) whose role is fixed across the product.
- **Feedback State:** One of the five conceptual states — Success, Warning, Error, Loading, Disabled — used to communicate an outcome or condition.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Restated and built directly on M12's Design Philosophy and Visual Language Principles, extending them into a Color System (five semantic roles), Typography System (four hierarchy levels), Spacing System, and Layout Grid Principles — all conceptual, with no hex values, fonts, or measurements specified.
- Restated M12's Iconography and Motion Principles as this system's standard, and defined five Feedback States (Success, Warning, Error, Loading, Disabled), the last of which is newly introduced at this milestone's explicit request.
- Documented Component Principles describing how reusable components must behave consistently by role, without designing any individual component.
- Documented Accessibility Principles and Design Constraints extending M11 and M15, and a Design System Glossary.

### Files Created
- `docs/milestones/M29-design-system-specification.md`

### Files Modified
- None. M01–M28 were not revisited or altered.

### Pending
- No further action pending within M29. Awaiting next milestone instructions.

### Risks
- This document substantially extends M12 rather than duplicating it — every section that overlaps with M12 (Design Philosophy, Visual Principles, Iconography, Motion) explicitly restates M12's content rather than reinterpreting it, to avoid any drift between the two documents. Where this document goes further (Color System's five named semantic roles, Typography's four named levels, Spacing System, Layout Grid, Component Principles, and the Disabled feedback state), that depth is new to this milestone but was requested explicitly by its structure.
- The "Disabled" feedback state is new relative to M12 (which listed Success, Loading, Progress, Errors, Warnings, and Information). It was introduced because this milestone's instructions explicitly listed Disabled as a required Feedback State, and it corresponds to an already-existing product condition (Session Generation being unavailable until Configuration is complete, per M18) — it is a new visual treatment of existing behavior, not a new feature.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
