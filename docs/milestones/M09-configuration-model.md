# M09 — Product Configuration Model

**Status:** Draft
**Owner:** Product
**Milestone:** M09
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md), [M02 — Product Requirements](./M02-product-requirements.md), [M03 — User Personas and Stories](./M03-user-personas-and-stories.md), [M04 — Information Architecture](./M04-information-architecture.md), [M05 — User Flows](./M05-user-flows.md), [M06 — Feature Breakdown](./M06-feature-breakdown.md), [M07 — Domain Model](./M07-domain-model.md), [M08 — AI Learning Engine](./M08-ai-learning-engine.md)

---

# Overview

This document consolidates every configurable aspect of Project Fluent into a single, authoritative reference. M01 through M08 have each touched configuration from a different angle — the Vision established that configuration must stay minimal, the Requirements defined it as functional requirements, the Domain Model gave it entity form, and the AI Learning Engine described how it drives generation. The purpose of this document is to bring those threads together into one place that fully answers: what can a Learner configure, what happens when they do, and what rules govern that configuration — without introducing anything new.

---

# User Configuration

Version 1 has exactly three configurable options available to the Learner. No others exist.

### English Level
- **Purpose:** Declares the Learner's English proficiency, so generated Sessions are pitched at an appropriate difficulty.
- **Possible Values:** A1, A2, B1, B2, C1, C2.
- **Default Behavior:** No default value exists. A Learner must set their English Level before a Session can be generated, per M07's Entity Rules.
- **Business Rules:** Exactly one value is set at any time. The Learner may change it at any time. The value is self-declared, not assessed by the platform.

### Learning Goal
- **Purpose:** Declares the purpose the Learner is practicing for, so generated Sessions are framed with relevant context.
- **Possible Values:** General English, IELTS, Business, Travel, University, Job Interviews.
- **Default Behavior:** No default value exists. A Learner must set their Learning Goal before a Session can be generated, per M07's Entity Rules.
- **Business Rules:** Exactly one value is set at any time. The Learner may change it at any time. No value beyond these six may ever be introduced.

### Topic Toggle Preference ("Use One Topic for All Skills")
- **Purpose:** Declares whether the Learner wants a single shared Topic across an entire Session, or is willing to have Topics vary by Session Composition part.
- **Possible Values:** Enabled, Disabled.
- **Default Behavior:** A value exists from the Learner's first visit to the Dashboard (Defaulted state, per M07); Version 1 does not require the Learner to set it explicitly before generating a first Session, unlike English Level and Learning Goal.
- **Business Rules:** Exactly one value is set at any time. The Learner may change it at any time, and the change takes effect on the next generated Session only (per M08's Topic Consistency Rules).

No other user-facing configuration exists in Version 1, consistent with M01's principle that every input must earn its place and M02's requirement that no additional settings be exposed (FR-SET-04).

---

# Session Configuration

Every generated Session is shaped entirely by the Learner's current configuration at the moment of generation, per M08's Session Generation Logic:

- **English Level** determines the difficulty of every Session Composition part (Reading, Listening, Speaking, Writing, Vocabulary, Grammar, Quiz), applied uniformly across the whole Session.
- **Learning Goal** determines the context and framing of every Session Composition part, applied uniformly across the whole Session.
- **Topic Toggle Preference** determines whether one Topic underlies the entire Session or multiple Topics are used across its composition parts, per M08's Topic Consistency Rules.

These three configuration values act together, not independently — a Session is always the joint product of all three at once. No configuration value can shape a Session on its own, and no part of a Session is exempt from any of the three.

---

# Configuration Dependencies

- **Topic Toggle Preference** has no dependency on English Level or Learning Goal — it can be set, viewed, or changed regardless of their state.
- **Session Generation** depends on both English Level and Learning Goal being Configured; it does not depend on any particular Topic Toggle Preference state, since that configuration is always Defaulted or Changed by the time the Dashboard is first reached.
- **English Level** and **Learning Goal** are independent of one another — setting or changing one never requires or affects the other.
- No configuration option depends on the outcome of a prior Session; configuration is entirely independent of Session history, consistent with M07's Domain Constraints.

---

# Configuration Constraints

The following must always remain true:

1. Exactly three configurable options exist for the Learner: English Level, Learning Goal, and Topic Toggle Preference. No more, no fewer.
2. A Learner always has exactly one current value for each configuration option once it has been set — never zero, never more than one.
3. English Level and Learning Goal must both be Configured before a Session can be generated; Topic Toggle Preference does not block generation, since it always holds a value.
4. Changing any configuration option never alters a Session that has already been generated.
5. No configuration option may be set on behalf of the Learner through inference, recommendation, or automatic adjustment — every value is the Learner's explicit choice.

---

# Configuration Lifecycle

- The first time a Learner reaches the Dashboard, English Level and Learning Goal are Unconfigured, and Topic Toggle Preference is Defaulted (per M07).
- Once the Learner sets English Level and Learning Goal for the first time, both move to Configured, and Session Generation becomes available (per M08's Business Constraints).
- Any subsequent change to English Level or Learning Goal moves that option to Reconfigured; the new value becomes current immediately and applies to the next Session generated — it has no effect on any Session already generated or completed.
- Any change to Topic Toggle Preference moves it to Changed; the new value becomes current immediately and applies to the next Session generated — it has no effect on any Session already generated or in progress.
- Configuration values persist for the Learner indefinitely across visits, until the Learner changes them again — they are never reset automatically.

---

# Validation Rules

- English Level must be exactly one of the six defined values (A1–C2); no other value is valid.
- Learning Goal must be exactly one of the six defined values (General English, IELTS, Business, Travel, University, Job Interviews); no other value is valid.
- Topic Toggle Preference must be exactly one of two values (Enabled or Disabled); no other value is valid.
- A Session Generation request is only valid if English Level and Learning Goal are both Configured at the time of the request; a request made without both is not a valid generation event, per M08's Business Constraints.
- A configuration change is only valid if it sets the option to one of its defined Possible Values — partial, blank, or out-of-range values are never valid states for any configuration option.

---

# Configuration Glossary

- **Configuration Option:** One of the three Learner-facing values that shape Session generation: English Level, Learning Goal, or Topic Toggle Preference.
- **English Level:** The Learner's self-declared proficiency value, one of A1–C2.
- **Learning Goal:** The Learner's self-declared purpose value, one of the six Goals defined in M01.
- **Topic Toggle Preference:** The Learner's choice of whether a Session uses one shared Topic or multiple Topics across its composition parts.
- **Configured:** The state of a configuration option once the Learner has set an explicit value for it.
- **Unconfigured:** The state of English Level or Learning Goal before the Learner has ever set a value.
- **Defaulted:** The initial state of the Topic Toggle Preference before the Learner has ever changed it, distinct from Unconfigured since a usable value already exists.
- **Reconfigured / Changed:** The state of a configuration option after the Learner has altered a previously set value.
- **Current Value:** The value of a configuration option as it stands at any given moment, used the next time a Session is generated.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented the three Version 1 configuration options (English Level, Learning Goal, Topic Toggle Preference) with Purpose, Possible Values, Default Behavior, and Business Rules for each.
- Explained how these three options jointly shape Session Configuration, consistent with M08's Session Generation Logic.
- Documented Configuration Dependencies, Configuration Constraints, Configuration Lifecycle, Validation Rules, and a Configuration Glossary.

### Files Created
- `docs/milestones/M09-configuration-model.md`

### Files Modified
- None. M01–M08 were not revisited or altered.

### Pending
- No further action pending within M09. Awaiting next milestone instructions.

### Risks
- No new configuration options were introduced, per instruction; this document is purely a consolidation of configuration behavior already established across M01, M02, M07, and M08. If any inconsistency is later found between this consolidation and an earlier milestone, the earlier milestone governs, since all prior milestones are immutable source of truth.

### Open Questions
- None beyond those already raised in M07 and M08 regarding Session history retention and composition-part ordering, which remain open and are not reintroduced here.

Waiting for the next milestone.
