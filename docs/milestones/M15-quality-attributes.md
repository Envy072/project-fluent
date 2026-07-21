# M15 — Quality Attributes and Non-Functional Requirements

**Status:** Draft
**Owner:** Product
**Milestone:** M15
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M14 — Conceptual System Architecture](./M14-conceptual-system-architecture.md)

---

# Overview

Quality Attributes define the characteristics Project Fluent must exhibit as a working system, independent of any specific feature. Where M02 first introduced Non Functional Requirements at a high level, and M11–M14 have since defined the product's experience, design, functional, and architectural foundations, this document consolidates and extends those quality expectations into a single, complete reference. It describes what "good" means for the system as a whole — never how that quality is technically achieved.

---

# Usability

- The product must remain usable by a first-time Learner without external instructions, per M11's Product Experience Goals.
- Every core journey defined in M05 must be completable using only the three Configuration options defined in M09 — no journey may require the Learner to understand anything not already presented to them.
- Usability must be measured by how little the Learner has to think, not by how much the product can do — consistent with M01's founding principle that learners never have to decide what to study next.

---

# Performance

- The product must feel responsive at every step of the journeys defined in M05 — the Learner should never be left uncertain whether an action was received, consistent with M11's Immediate Feedback principle.
- Session Generation, as the single most consequential action a Learner takes (per M08 and M13), must complete within a time that does not cause the Learner to disengage or abandon the request.
- No numeric performance targets are defined in this document, as none have been established in M01–M14; any such target is a future, more technical decision.

---

# Reliability

- The product must reliably produce a complete Session — all seven Session Composition parts, per M08 — for every valid Learning Configuration, with no partial or malformed outcomes.
- The product must reliably preserve a Learner's Configuration, in-progress Session state, and recorded Progress across normal use, consistent with M11's Error Experience Principles.
- The product's behavior must remain consistent under repeated use — the same action, taken under the same conditions, must always produce the same category of outcome, per M13's Functional Constraints.
- Continuity must be preserved across a Learner's journey: a Learner who leaves and returns must find their Configuration and Progress exactly as they left them, per M05's Returning User Flow.

---

# Availability

- The product should be accessible to a Learner whenever they choose to use it, consistent with M01's removal of study-time setup — there is no scheduled or expected time window for use.
- Authentication must not become a recurring obstacle to availability: a previously Signed In Learner should be able to return without friction, per FR-AUTH-04's Session Persistence expectation.
- Temporary unavailability of Session Generation must not result in loss of the Learner's Configuration or prior Progress, per M13's Error Recovery treatment of generation unavailability.

---

# Maintainability

- Every future addition or change to the product must remain traceable to an approved milestone, so the product's evolution never drifts from its documented foundation, per this project's overall documentation-first approach.
- The product's structure — its System Modules (M14), Information Domains (M10), and Functional Areas (M13) — must remain the stable reference against which future change is evaluated, so that evolution happens by extending or revising a defined structure rather than working around an undefined one.
- Maintainability is a product discipline as much as a technical one: every new capability must be justified against M01's principle that every input and every piece of complexity must earn its place.

---

# Scalability

- The product must be able to serve a growing number of Learners without any change to the experience an individual Learner has, consistent with M02's Non Functional Requirements.
- Growth in the number of Learners, Sessions, or Progress Records must never alter the fixed, one-Session-at-a-time experience defined in M07 and M08 for any individual Learner.
- Scalability is defined here purely as "the product continues to behave identically to each Learner as usage grows" — no specific capacity, load, or infrastructure expectation is defined, as none has been established in M01–M14.

---

# Security Principles

- Only a Signed In Learner may access their own Learning Configuration, Sessions, and Progress — no Learner's information is ever accessible to another Learner, consistent with M07's ownership rules and M14's Identity & Access Module.
- Authentication must be the sole gate to every protected capability, per M14's Architecture Constraints — no functional area may be reachable by circumventing it.
- The product must treat every Learner's account and progress as belonging exclusively to them, with no shared or ambient access by default.
- No specific authentication protocol, credential-handling method, or encryption approach is defined in this document, as these are technical decisions outside the scope of a product-level milestone.

---

# Privacy Principles

- A Learner's account information, Learning Configuration, and Progress must never be exposed to another Learner or to any unauthorized party, per M02's Non Functional Requirements.
- The product must collect only what is necessary to support the capabilities already defined in M01–M14 — consistent with M01's principle that every input must earn its place, no information should be gathered "just in case" for undefined future use.
- A Learner's Progress and Session history must be treated as personal to them, reflecting their real learning activity, and must be handled with the same care as any other personal record.

---

# Accessibility Expectations

- Accessibility expectations remain exactly as defined in M11's Accessibility Principles: the product must be usable by Learners with varying levels of digital literacy, every core journey must be completable using assistive technology, and no experience may depend on a single sense to be understood.
- Clarity and Simplicity, as established in M11's Product Experience Goals, are treated as accessibility qualities in their own right — a product that is easy to understand is inherently more accessible to a wider range of Learners.

---

# Observability Expectations

From a business perspective, the product should make the following outcomes observable — that is, it should always be possible to determine whether they occurred:

- Whether a Learner successfully created an account or signed in (per M14's Identity & Access Module).
- The current value of a Learner's English Level, Learning Goal, and Topic Toggle Preference at any point (per the Configuration Module).
- Whether a Session Generation request succeeded or could not proceed, and why, at the level defined in M13's Failure Conditions (missing Configuration, or a Session already In Progress).
- Whether a Session was Completed or Abandoned (per M07 and M08).
- Whether a Progress Record was successfully Recorded following a Session's outcome (per the Progress Module).

These are business-level outcomes that must be knowable, not technical logs, metrics, or monitoring systems — how they are made observable is outside the scope of this document.

---

# Quality Constraints

The following must always remain true regardless of implementation:

1. No Learner's Configuration, Session, or Progress information is ever visible to another Learner.
2. Every Session Generation either succeeds completely (a full Session, per M08) or does not occur at all — there is no partial or degraded outcome.
3. A Learner's Configuration and Progress remain intact and unaffected by product growth, temporary unavailability, or repeated use.
4. Every business outcome listed in Observability Expectations must be determinable at all times.
5. No quality attribute in this document may be satisfied by adding a feature, setting, or piece of information not already defined in M01–M14.

---

# Quality Glossary

- **Quality Attribute:** A required characteristic of the product as a system (e.g., Reliability, Usability), rather than a specific feature or capability.
- **Non-Functional Requirement:** A requirement describing how well the product must perform its functions, rather than what functions it performs.
- **Observability (Business Sense):** The property of a business outcome being knowable and determinable, independent of how that determination is technically achieved.
- **Continuity:** The preservation of a Learner's Configuration and Progress across time, visits, and product growth.
- **Availability:** The product's readiness to be used by a Learner whenever they choose to, without a scheduled or expected time window.
- **Scalability (Product Sense):** The property that an individual Learner's experience remains identical as the total number of Learners grows.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented Usability, Performance, Reliability, Availability, Maintainability, and Scalability expectations, consolidating and extending M02's Non Functional Requirements.
- Documented Security Principles, Privacy Principles, and Accessibility Expectations, the latter explicitly kept consistent with M11.
- Documented Observability Expectations at a business-outcome level only, and Quality Constraints that must always remain true.
- Compiled a Quality Glossary defining every quality-related term used in this document.

### Files Created
- `docs/milestones/M15-quality-attributes.md`

### Files Modified
- None. M01–M14 were not revisited or altered.

### Pending
- No further action pending within M15. Awaiting next milestone instructions.

### Risks
- No numeric or measurable targets (e.g., specific response times, uptime percentages) are defined anywhere in this document, since none were established in M01–M14. Future milestones that require measurable targets will need to introduce them explicitly rather than assume any implied by this document.
- Security and Privacy Principles are intentionally limited to product-level expectations (who can see what) and explicitly avoid any protocol or method — this is a deliberate scope limit per the milestone's rules, not an omission.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
