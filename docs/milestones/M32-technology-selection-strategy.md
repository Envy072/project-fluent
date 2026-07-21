# M32 — Technology Selection Strategy

**Status:** Draft
**Owner:** Architecture / Engineering
**Milestone:** M32
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M31 — Implementation Architecture Specification](./M31-implementation-architecture-specification.md)

---

# Overview

The Technology Selection Strategy establishes the principles, standards, and decision criteria that any future technology choice — language, framework, database, cloud provider, or third-party dependency — must satisfy before adoption. It names no specific technology. Its purpose is to ensure that whenever a concrete technology decision is eventually made, it is made against a consistent, pre-agreed standard rather than by convenience or trend, and that the resulting choice upholds everything already established in M01–M31, particularly the Quality Attributes (M15) and the Implementation Architecture (M31).

---

# Engineering Goals

Every technology decision must demonstrably support the following goals:

- **Reliability:** The chosen technology must support the Reliability expectations already defined in M15 — consistent, correct behavior under normal operation, with no silent data loss.
- **Scalability:** The chosen technology must allow the product to serve a growing number of Learners without altering any individual Learner's experience, per M15's Scalability expectations.
- **Security:** The chosen technology must support the access, identity, and data protection guarantees defined in M22 without requiring those guarantees to be compromised for convenience.
- **Maintainability:** The chosen technology must keep the mapping between documentation (M01–M31) and implementation clear and traceable, per M31's Maintainability Principles.
- **Performance:** The chosen technology must support the responsiveness expectations defined in M15, particularly for Session Generation, without requiring the product's behavior to change to accommodate it.
- **Developer Experience:** The chosen technology must allow engineers to implement the Implementation Modules defined in M31 clearly and without unnecessary friction, reducing the likelihood of an implementation drifting from its specification.
- **Testability:** The chosen technology must support the Verification Levels defined in M23 — Product, Architecture, Business Rule, Interaction, and Security & Privacy Verification — without structural obstruction.
- **Extensibility:** The chosen technology must support the Extension Principles defined in M31, allowing new modules to be added without altering existing ones.
- **Operational Simplicity:** The chosen technology must not introduce operational complexity disproportionate to the product's actual scope, consistent with M01's founding principle that every addition must earn its place.

---

# Technology Evaluation Criteria

Every future technology must be evaluated against the following criteria before adoption:

- **Architectural Alignment:** Does the technology respect the layer and module boundaries defined in M16, M19, M20, M21, and M31, without requiring those boundaries to be violated or worked around?
- **NFR Alignment:** Does the technology demonstrably support the Quality Attributes defined in M15?
- **Maturity and Stability:** Does the technology have a demonstrated history of stable, predictable behavior over time, rather than being early-stage or unproven?
- **Ecosystem Health:** Does the technology have an active, sustained community and ecosystem, reducing the risk of abandonment?
- **Security Track Record:** Does the technology have a demonstrated history of responsible vulnerability disclosure and timely resolution?
- **Total Cost of Adoption:** Does the technology's learning curve, integration effort, and ongoing maintenance burden remain proportionate to the value it provides?
- **Reversibility:** Can the technology be replaced later, per M31's Extension Principles, without requiring a disproportionate rewrite of unrelated modules?
- **Observability Support:** Does the technology support the business-level Observability Expectations defined in M15?
- **Data Protection Compatibility:** Does the technology support the Data Protection Responsibilities defined in M22 without requiring compromise?

No technology may be adopted that fails a majority of these criteria, and no technology may be adopted that fails Architectural Alignment or Security Track Record under any circumstance.

---

# Preferred Architectural Characteristics

The following characteristics are conceptually preferred in any technology considered for Version 1, evaluated during the criteria above:

- **Strong Typing:** Reduces the likelihood of a class of errors reaching a Learner, supporting Reliability.
- **Modularity:** Naturally supports the nine Implementation Modules defined in M31, and their explicit Dependency Principles.
- **Explicit Interfaces:** Makes the boundaries between modules — and between the layers defined in M16 — visible and enforceable, rather than implicit.
- **Mature Ecosystem:** Reduces the risk of needing to build foundational capability that already exists elsewhere.
- **Excellent Documentation:** Reduces the risk of implementation drifting from the documented specification, per M31.
- **Long-Term Community Support:** Reduces the risk of a technology becoming unmaintained during the product's lifetime.
- **Predictable Release Cycle:** Supports the Upgrade Strategy defined below, avoiding disruptive, unannounced breaking changes.
- **High Observability:** Naturally supports the Observability Expectations defined in M15.
- **Automation-Friendly:** Supports repeatable, consistent Verification, per M23, without manual intervention becoming a bottleneck.
- **Cloud-Native Compatibility:** Supports the Scalability and Availability expectations defined in M15 without requiring architectural compromise later.

No specific technology, product, or vendor satisfying these characteristics is named in this document.

---

# Non-Functional Requirements Mapping

Every technology decision must be evaluated against how it supports each Quality Attribute already defined in M15:

| M15 Quality Attribute | Technology Selection Expectation |
|---|---|
| Usability | The technology must not constrain the product's ability to remain simple and immediate for the Learner, per M11. |
| Performance | The technology must support responsive behavior for Session Generation and every other Learner-facing action. |
| Reliability | The technology must support consistent, correct behavior and safe handling of Learner data across normal use. |
| Availability | The technology must support the product being reachable whenever a Learner chooses to use it. |
| Maintainability | The technology must keep implementation traceable to documentation, per M31. |
| Scalability | The technology must support a growing number of Learners without altering any individual Learner's experience. |
| Security | The technology must support the access and identity guarantees defined in M22. |
| Privacy | The technology must support data minimization and Learner-information protection, per M22. |
| Accessibility | The technology must not obstruct the accessibility guarantees defined in M11 and M15. |
| Observability | The technology must support determining the business outcomes listed in M15's Observability Expectations. |

A technology that cannot be shown to support a given Quality Attribute may still be adopted only if that attribute is demonstrably unaffected by the choice — never if the choice would degrade it.

---

# Dependency Selection Principles

- **Adoption:** A third-party dependency may only be adopted when a genuine, already-documented need exists, traceable through M23's chain back to an M02 requirement — never speculatively, per M31's Extension Principles.
- **Version Stability:** Preference is given to dependencies with a demonstrated pattern of stable, backward-compatible releases over dependencies with frequent breaking changes.
- **Security Review:** Every dependency must be reviewed against its known vulnerability history and disclosure practices before adoption, and periodically thereafter.
- **Maintenance Quality:** Preference is given to dependencies that are actively maintained, with a demonstrated pattern of timely issue resolution.
- **Community Maturity:** Preference is given to dependencies with an established, sustained user base over newly introduced alternatives without a track record.
- **License Compatibility:** A dependency's license must be compatible with the product's commercial goals and must not impose unacceptable obligations on the rest of the implementation.
- **Replacement Strategy:** Every dependency must be adopted with a documented understanding of how it could be replaced later without violating the Dependency Principles defined in M31 — no dependency may be adopted in a way that makes the module depending on it irreplaceable.

---

# Upgrade Strategy

- Technologies are expected to evolve incrementally over time; every upgrade must be evaluated against the Engineering Goals and Technology Evaluation Criteria defined above before being adopted, exactly as a new technology would be.
- No upgrade may violate the layer or module boundaries defined in M16, M19, M20, M21, or M31 — an upgrade that would require such a violation is not a valid upgrade path.
- No upgrade may proceed without passing the Verification Levels defined in M23, confirming that documented behavior still holds after the upgrade.
- Breaking changes introduced by an upstream technology must be evaluated and adopted through the same Change Management Principles defined in M24 — never absorbed silently.
- Where a technology's predictable release cycle (per Preferred Architectural Characteristics) allows it, upgrades should be adopted incrementally and proactively, reducing the risk of accumulating a disruptive backlog of changes.

---

# Risk Management Principles

- A technology risk is any circumstance in which a chosen technology could fail to support the Engineering Goals defined above — including single points of failure, vendor or ecosystem lock-in, unmaintained dependencies, or unresolved security vulnerabilities.
- Every identified technology risk must be evaluated against the Technology Evaluation Criteria defined above to determine whether the technology remains appropriate, or whether its Replacement Strategy should be exercised.
- A technology risk must never be resolved by silently compromising an Engineering Goal (e.g., disabling a security guarantee for convenience) — any such compromise is itself a Finding, per M23, and must be surfaced rather than absorbed.
- The earlier a technology risk is identified — ideally during initial Technology Evaluation rather than after adoption — the lower its cost to resolve, consistent with M24's Risk Management Principles applied to execution generally.

---

# Technology Constraints

1. No technology may be adopted without being evaluated against every criterion defined in Technology Evaluation Criteria.
2. No technology may be adopted that violates the layer or module boundaries defined in M16, M19, M20, M21, or M31.
3. No technology may be adopted that degrades any Quality Attribute defined in M15, per the Non-Functional Requirements Mapping above.
4. No dependency may be adopted without a documented Replacement Strategy.
5. This document names no specific technology, vendor, or provider; any future document that does so must demonstrate, at the point of that decision, how the chosen technology satisfies every principle established here.

---

# Technology Strategy Glossary

- **Engineering Goal:** A high-level outcome (e.g., Reliability, Scalability) every technology decision must support.
- **Evaluation Criterion:** An objective standard used to assess whether a specific technology should be adopted.
- **Preferred Architectural Characteristic:** A conceptual quality (e.g., strong typing, modularity) that makes a technology more likely to satisfy the Engineering Goals.
- **Dependency:** Any third-party technology or library the implementation relies upon.
- **Replacement Strategy:** The documented understanding of how a given technology or dependency could be replaced without violating established architectural boundaries.
- **Vendor Neutrality:** The principle that this document, and the strategy it defines, never favors or names a specific commercial provider.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented Engineering Goals (Reliability, Scalability, Security, Maintainability, Performance, Developer Experience, Testability, Extensibility, Operational Simplicity), each tied to specific prior milestones.
- Documented Technology Evaluation Criteria, Preferred Architectural Characteristics, and a Non-Functional Requirements Mapping table connecting every M15 Quality Attribute to a technology selection expectation.
- Documented Dependency Selection Principles (Adoption, Version Stability, Security Review, Maintenance Quality, Community Maturity, License Compatibility, Replacement Strategy), an Upgrade Strategy, Risk Management Principles, Technology Constraints, and a Technology Strategy Glossary.

### Files Created
- `docs/milestones/M32-technology-selection-strategy.md`

### Files Modified
- None. M01–M31 were not revisited or altered.

### Pending
- No further action pending within M32. Awaiting next milestone instructions. This document establishes criteria only — no actual technology selection has occurred, and would require a distinct future milestone or explicit decision to undertake.

### Risks
- This document is deliberately abstract, per its rules — it names no language, framework, database, cloud provider, or AI provider. As a result, it cannot itself be "wrong" about a specific technology, but a future technology-selection milestone will need to demonstrate explicit compliance with every criterion here, and should be checked against this document rather than treated as a fresh, independent decision.
- The Non-Functional Requirements Mapping table restates M15's Quality Attributes rather than introducing new ones, ensuring no drift; this was a deliberate choice to keep the two documents in lockstep.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
