# M36 — Operational Readiness Specification

**Status:** Draft
**Owner:** Architecture / Engineering / Operations
**Milestone:** M36
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M35 — Security and Privacy Implementation Strategy](./M35-security-and-privacy-implementation-strategy.md)

---

# Overview

The Operational Readiness Specification defines how Project Fluent is expected to behave reliably once running in production — not how it is deployed or hosted, but the principles governing its ongoing monitoring, observability, reliability, incident handling, and governance. It extends M15's Quality Attributes, M23's and M34's Verification discipline, and M35's Security Philosophy into the operational domain, ensuring that everything documented in M01–M35 remains true not just at release, but continuously, in production, over time.

---

# Operational Philosophy

- **Reliability:** The system behaves correctly and consistently under normal operation, per M15, for as long as it runs.
- **Stability:** The system's documented behavior does not fluctuate unexpectedly — a Learner's experience under the same conditions remains the same today as it was yesterday.
- **Predictability:** Operational behavior always follows the Request Lifecycle defined in M16 and the Service Contracts defined in M18 — production never exhibits behavior that isn't already documented somewhere in M01–M35.
- **Recoverability:** The system can always return to a known-good state after a disruption, consistent with M17's Data Integrity Rules and M35's Recovery principle.
- **Continuous Improvement:** Every operational Finding, per M23, feeds back into strengthening Traceability and the Development Standards defined in M33 — never treated as a one-off fix disconnected from its root cause.
- **Operational Simplicity:** Consistent with M01 and M32, operations are never more complex than the product's actual, documented scope requires.

---

# Operational Responsibilities

- **The Product:** Responsible for behaving exactly as documented across M01–M35 under both normal and abnormal conditions — failing securely, per M35, and gracefully, per this document, whenever it cannot proceed as expected.
- **Automated Processes:** Responsible for continuous Regression Verification (per M34), continuous collection of Observability data (per M15), and continuous Security Verification (per M35), without requiring manual intervention for routine, expected operation.
- **Future Support Functions (Conceptually Only):** If a support function is introduced by a future milestone, its responsibility would be to respond to Operational Incidents, as defined below, within the exact same Security Constraints already established in M22 and M35. This document defines no role, permission, or access level for such a function — it only establishes that any future support function, whenever it comes to exist, would be bound by the same constraints as every other part of the system.

---

# Monitoring Principles

Production monitoring is conceptually organized around the following categories:

- **User Experience:** Whether Learners can complete the User Flows defined in M05 without friction, consistent with M15's Usability and Performance expectations.
- **Business Flows:** Whether the Functional Areas defined in M13 — Authentication, Learning Configuration, Session Generation, Learning Session Experience, Progress Recording — are completing successfully at the rate expected of normal operation.
- **Service Health:** Whether each of the five Services defined in M18 continues to fulfill its Operations' Postconditions consistently, in production.
- **AI Interaction Health:** Whether the two AI Interaction Points defined in M21 continue producing output that satisfies M08's Business Constraints and M21's AI Constraints.
- **Data Integrity:** Whether the Data Integrity Rules defined in M17 continue to hold across all retained information.
- **Quality Indicators:** Whether the Quality Attributes defined in M15 and the Quality Gates defined in M34 continue to be satisfied in production, not merely confirmed once at release.

---

# Observability Principles

Consistent with M15 and M34:

- Every business outcome listed in M15's Observability Expectations — Authentication success, Configuration changes, Session Generation success or failure, Session Completed or Abandoned, and Progress Recorded — must remain determinable continuously in production, not only verifiable during the testing described in M34.
- Observability data must respect the Data Minimization principles established in M22 and M35 — it reveals whether a business outcome occurred, never more Learner personal information than M15 already requires.
- Observability is the mechanism by which Monitoring Principles above are actually fulfilled — monitoring without underlying observability is not possible within this system.

---

# Reliability Principles

- **Fault Detection:** Relies on the Monitoring and Observability Principles above to make a fault — a Finding, per M23 — knowable as soon as documented behavior diverges from actual behavior.
- **Fault Isolation:** Consistent with M31's Dependency Principles, a fault within one Implementation Module must not cascade into modules that do not depend on it — a fault in the AI Integration Module, for example, must never affect the Identity & Access Module.
- **Graceful Degradation:** When a non-foundational capability is unavailable — for example, Session Generation, per M13's "Session Generation Unavailable" Error Recovery Flow — the rest of the product (Authentication, Configuration, Progress reflection) continues to function normally for the Learner.
- **Recovery Expectations:** After any disruption, the system returns to a state consistent with M17's Data Integrity Rules, with no Learner data lost, per M35's Recovery principle.
- **Operational Resilience:** The system's ability to continue serving Learners despite a fault in one module is a direct consequence of M31's Separation of Concerns and Dependency Principles being upheld in production — it is not a separately engineered capability, but an outcome of the architecture already documented.

---

# Operational Incident Principles

The lifecycle of an operational incident, mirroring M35's Incident Response Principles at the production level:

1. **Detection:** An incident is detected through the Monitoring and Observability Principles above.
2. **Assessment:** The affected Functional Area or Implementation Module is identified, and the incident is confirmed as a Finding, per M23.
3. **Prioritisation:** The incident is prioritized according to M31's Dependency Map and M34's Defect Prioritization — an incident affecting a foundational module (Identity & Access, Persistence) is prioritized above one confined to a peripheral concern.
4. **Response:** The incident is contained without violating any Security Constraint defined in M22 or M35, and without exposing additional Learner data in the process of diagnosis.
5. **Recovery:** The system is restored to a state consistent with M17's Data Integrity Rules.
6. **Review:** The incident is treated as a Finding and resolved through the Traceability and Change Management discipline defined in M23 and M24, ensuring the underlying cause is genuinely closed and feeding the Continuous Improvement principle above.

---

# Operational Metrics

The following categories of operational metric are conceptually tracked, with no numerical target defined in this document:

- **Availability Metrics:** Whether protected capability remains reachable to authenticated Learners over time, per M15.
- **Completion Metrics:** The rate at which Session Generation and Session Completion succeed, connecting directly to the Product Success Metrics defined in M02.
- **Responsiveness Metrics:** Whether Learner-facing actions, particularly Session Generation, continue to feel responsive, per M15's Performance expectations.
- **Failure Rate Metrics:** The frequency with which any Failure Condition defined in M13 or M18 is met during normal operation.
- **AI Output Validity Metrics:** The frequency with which AI Layer output passes the Output Validation defined in M21 and M35 on the first attempt.
- **Data Integrity Metrics:** The frequency, expected to be zero, with which any Data Integrity Rule defined in M17 is found to be violated.

---

# Operational Governance

- Every operational practice defined in this document must trace back to a Quality Attribute (M15), an Architecture or Security Constraint (M16, M20, M22, M35), or a Verification Level (M23, M34) — no operational practice exists independently of the documented specification.
- Any change to operational practice must proceed through the same Change Management Principles defined in M24 — never as an ad hoc, undocumented adjustment.
- Operational Metrics are periodically reviewed against the Product Success Metrics defined in M02, confirming that the product continues to fulfill M01's Mission in production, not only at the moment of release.
- Operational Governance is itself subject to Continuous Quality, per M34 — the practices defined here are expected to be reinforced continuously, not verified once and assumed permanent.

---

# Operational Constraints

1. No operational practice may violate an Architecture Constraint (M16, M20), a Security Constraint (M22, M35), or a Data Integrity Rule (M17).
2. No monitoring or observability activity may collect more information than M15's Observability Expectations and M22's/M35's Data Minimization principles allow.
3. No operational incident response action may expose additional Learner data beyond what is already necessary and authorized.
4. No operational change may bypass the Change Management Principles defined in M24.
5. No operational role, permission, team, or administrative capability is defined, implied, or introduced by this document.

---

# Operational Glossary

- **Operational Readiness:** The state in which the product is confirmed to behave reliably, observably, and recoverably in production, consistent with M01–M35.
- **Graceful Degradation:** The property that a non-foundational capability's unavailability does not affect the rest of the product's normal function.
- **Fault Isolation:** The property that a fault in one Implementation Module does not cascade into modules that do not depend on it.
- **Operational Resilience:** The system's capacity to continue serving Learners despite an isolated fault, as a direct outcome of the architecture already documented.
- **Operational Incident:** A production event in which a Finding, per M23, is detected and must be assessed, prioritized, responded to, recovered from, and reviewed.
- **Operational Metric:** A tracked category of production behavior used to confirm ongoing Quality Attribute and Business Flow health, with no numerical target defined at this milestone.
- **Operational Governance:** The discipline of keeping operational practice traceable to, and evolving in step with, the documented specification.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented an Operational Philosophy (Reliability, Stability, Predictability, Recoverability, Continuous Improvement, Operational Simplicity) and Operational Responsibilities for the Product, Automated Processes, and Future Support Functions — the latter deliberately introducing no role or permission, per this milestone's rules.
- Documented Monitoring Principles across six categories (User Experience, Business Flows, Service Health, AI Interaction Health, Data Integrity, Quality Indicators) and Observability Principles consistent with M15 and M34.
- Documented Reliability Principles (Fault Detection, Fault Isolation, Graceful Degradation, Recovery Expectations, Operational Resilience), a six-step Operational Incident lifecycle, Operational Metrics categories with no numerical targets, Operational Governance, Operational Constraints, and an Operational Glossary.

### Files Created
- `docs/milestones/M36-operational-readiness-specification.md`

### Files Modified
- None. M01–M35 were not revisited or altered.

### Pending
- No further action pending within M36. Awaiting next milestone instructions.

### Risks
- The "Future Support Functions" responsibility is described only in the abstract, per this milestone's explicit prohibition on introducing operational roles or permissions. This mirrors the same gap already flagged as an Open Question in M35 — this document does not resolve it, only restates that any future support capability must operate within the existing Security Constraints, consistent with M35.
- "Graceful Degradation" and "Fault Isolation" are new terms introduced at this milestone, but both describe behavior already implied by existing documentation (M13's Error Recovery Flows and M31's Dependency Principles, respectively) rather than new product behavior.

### Open Questions
- Should a future milestone formally define a support or incident-response function, resolving the gap already noted in M35 and restated here?
- None else beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
