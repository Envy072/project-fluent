# M12 — Design System Foundations

**Status:** Draft
**Owner:** Product
**Milestone:** M12
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M11 — UX Principles](./M11-ux-principles.md)

---

# Overview

This document defines the conceptual design language of Project Fluent — the foundational ideas that any future visual design must express. It sits directly beneath M11's UX Principles: where M11 defined how the product should *feel* to use, this document defines what visual and interaction *concepts* must be true for that feeling to be achievable. It contains no colors, fonts, measurements, components, or layouts — only the principles a design system must be built from.

---

# Design Philosophy

- **Minimal:** The product should visually contain only what a Learner needs at each step, mirroring M01's principle that every input must earn its place — nothing decorative competes with the Learner's task.
- **Focused:** At any point in the journey, the design should draw attention to the one primary action available (per M11's Interaction Principles), rather than presenting many equally weighted elements.
- **Calm:** The product should never feel urgent, cluttered, or demanding — consistent with M11's goal of Low Cognitive Load, the design should reduce pressure on the Learner rather than add to it.
- **Trustworthy:** The design should reinforce the Confidence goal from M11 — the Learner should sense that what they're looking at is deliberate, considered, and consistent, never arbitrary or generic.
- **Professional:** The product should present itself with the seriousness appropriate to something learners rely on for real progress, without feeling cold or impersonal.

Only these five qualities apply to Version 1. No additional philosophy (e.g., playful, bold, experimental) is introduced, as none is supported by M01–M11.

---

# Visual Language Principles

- **Hierarchy:** At every point, one element should be clearly the most important thing on the screen — corresponding to M11's "One Clear Primary Action" — with everything else visually subordinate to it.
- **Spacing:** Space should be used to group related information together and separate unrelated information, so the Learner can tell at a glance what belongs with what, without needing to read everything to understand structure.
- **Consistency:** Recurring concepts (e.g., a Configuration option, a Session Composition part, a Progress indication) should always look and behave the same way wherever they appear, reinforcing M11's Consistency goal.
- **Balance:** No single screen should feel visually heavier or busier on one side than the rest; the overall impression should always be even and composed, supporting the Calm philosophy above.
- **Readability:** All content must be presented in a way that is easy to read and understand at a glance, prioritizing comprehension over visual novelty.
- **Emphasis:** Emphasis should be reserved for what genuinely matters at that moment (the primary action, a result, an error) — emphasis used everywhere becomes emphasis used nowhere.

---

# Color Principles

Color exists in Version 1 to serve three conceptual roles, not to establish a visual identity for its own sake:

- **Distinguishing state:** Color should help a Learner tell apart different states of the same thing — for instance, a Session that is Completed versus one that is Incomplete or Abandoned (per M08).
- **Directing attention:** Color should help draw the Learner's eye toward the primary action or the most important piece of information at any given moment, supporting the Hierarchy principle above.
- **Reinforcing calm and trust:** Color should support the Design Philosophy's Calm and Trustworthy qualities rather than compete with them — color should never be the reason a screen feels busy or urgent.

No specific colors, palettes, or hex values are defined in this document; that is a downstream design decision outside the scope of this milestone.

---

# Typography Principles

Typography exists to serve legibility and hierarchy, not personality:

- **Legibility first:** Text must always be easy to read, in any context the product presents it (Configuration, Session content, Progress).
- **Hierarchy through contrast:** Differences in typographic weight or prominence should be used to reflect the Hierarchy principle above — more important content should read as more important, primarily through emphasis rather than decoration.
- **Restraint:** Typography should support a small number of clearly distinct levels of importance (e.g., primary content vs. supporting content), rather than many overlapping levels that create ambiguity.
- **Tone:** Typography should reinforce the Professional and Trustworthy qualities from the Design Philosophy — it should never feel casual to the point of undermining the Learner's confidence in the content.

No specific fonts, typefaces, or sizes are defined in this document.

---

# Iconography Principles

- Icons, where used, exist to reinforce meaning that is already communicated in words — never to replace clear language with ambiguous symbols, consistent with M11's Clarity goal.
- Icons should be used consistently: the same concept should always be represented the same way wherever it recurs, per the Consistency principle above.
- Icons should be reserved for genuinely recurring, well-understood concepts (e.g., indicating completion, indicating an action is available) rather than used decoratively.
- No icon library, icon set, or specific symbol is selected in this document; that is a downstream design decision.

---

# Motion Principles

- Motion, where used, should exist only to help the Learner understand a change of state — for example, that an action was received, or that a Session is being generated — never as decoration.
- Motion should reinforce Calm: it should feel smooth and unobtrusive, never abrupt or attention-grabbing for its own sake.
- Motion should never be the only signal that something has happened; per M11's Immediate Feedback principle, feedback must always be clear even without relying on motion alone.
- No animations, transitions, or timing values are defined in this document; that is a downstream design decision.

---

# Feedback Principles

- **Success:** A successful action (e.g., completing a Session, saving a Configuration change) should be clearly and immediately recognizable as successful, without requiring the Learner to interpret ambiguous signals.
- **Loading:** While the product is working on the Learner's behalf (e.g., generating a Session), the Learner should always be able to tell that something is happening rather than wondering if their action was received, consistent with M11's Immediate Feedback principle.
- **Progress:** Where relevant, the Learner should be able to sense how far they are through a Session's composition, supporting M11's Encourage Completion principle.
- **Errors:** An error should be communicated clearly and calmly, in line with M11's Error Experience Principles — never alarming beyond what is warranted, but never unclear either.
- **Warnings:** Where a warning is needed (e.g., leaving a Session before completion), it should inform the Learner of the consequence without being punitive in tone, consistent with the Calm and Trustworthy philosophy.
- **Information:** Informational content (e.g., reflecting a past Progress outcome) should be presented plainly and without demanding the Learner's immediate action, distinguishing it clearly from Success, Errors, and Warnings.

---

# Consistency Principles

- The same concept must always be represented the same way, everywhere it appears, across every page defined in M04.
- The same type of action (e.g., a primary action, per M11) must always behave the same way regardless of which page it appears on.
- Feedback for a given situation (success, error, warning, etc.) must always follow the same conceptual pattern, so the Learner learns to trust and predict how the product responds.
- Nothing about the design should vary based on a Learner's Configuration (English Level, Learning Goal, Topic Toggle Preference, per M09) — the design language is the same for every Learner; only the content generated within it varies.

---

# Design Constraints

The following must never be violated in Version 1:

1. No visual element may exist that does not serve Hierarchy, Clarity, or Feedback, per this document's principles.
2. No design decision may introduce a new decision point for the Learner beyond the three Configuration options already defined in M09.
3. No design decision may contradict the Calm, Minimal, or Focused qualities defined in the Design Philosophy.
4. Color, typography, iconography, and motion must always be used in service of meaning (state, hierarchy, feedback) — never purely decoratively.
5. Consistency must never be broken for the sake of visual novelty on any single page.
6. This document defines principles only; no specific colors, fonts, icons, measurements, or components may be treated as decided until a future, dedicated design milestone addresses them.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Defined Design Philosophy (Minimal, Focused, Calm, Trustworthy, Professional), scoped to what M01–M11 already support.
- Defined Visual Language Principles (Hierarchy, Spacing, Consistency, Balance, Readability, Emphasis), Color Principles, Typography Principles, Iconography Principles, and Motion Principles — all conceptual, with no colors, fonts, icons, or timing values specified.
- Defined Feedback Principles across Success, Loading, Progress, Errors, Warnings, and Information.
- Defined Consistency Principles and Design Constraints that must never be violated.

### Files Created
- `docs/milestones/M12-design-system-foundations.md`

### Files Modified
- None. M01–M11 were not revisited or altered.

### Pending
- No further action pending within M12. Awaiting next milestone instructions.

### Risks
- This document deliberately avoids naming any concrete visual value (color, font, spacing unit, icon, timing) per the milestone's rules. A future design milestone will need to translate these principles into concrete decisions; care should be taken that those decisions are evaluated against this document's principles rather than introduced independently.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
