# M37 — Release Management Specification

**Status:** Draft
**Owner:** Architecture / Engineering / Release Management
**Milestone:** M37
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M36 — Operational Readiness Specification](./M36-operational-readiness-specification.md)

---

# Overview

The Release Management Specification defines the governance model by which any release of Project Fluent is planned, prepared, verified, approved, executed, and evaluated. It extends M24's Development Roadmap, M34's Quality Gates, M35's Security Verification, and M36's Operational Readiness into a single, repeatable release discipline. It introduces no deployment technology, CI/CD platform, branching strategy, infrastructure, or version numbering scheme — it defines the governance any such implementation must operate within.

---

# Release Philosophy

- **Predictability:** Every release follows the exact same documented lifecycle, defined below — never an ad hoc or one-off process.
- **Stability:** A release never introduces behavior beyond what is already documented in M01–M36; a release realizes approved scope, it does not expand it.
- **Repeatability:** The same Release Lifecycle applies to every future release of the product, not only its first.
- **Incremental Improvement:** Each release corresponds to a traceable increment of already-approved scope, per M23's Traceability chain, building on M24's Execution Phases.
- **Risk Reduction:** Every release is evaluated against the Release Risk Assessment defined below before it may proceed.
- **User-Centric Delivery:** A release is ultimately judged by whether it serves M01's Mission and M02's Requirements for the Learner — internal completion alone is never sufficient justification for release.

---

# Release Lifecycle

1. **Planning:** The scope of a release is defined strictly as a set of already-approved M02 requirements and M06 features, traceable through M23 — no undocumented scope is ever planned into a release.
2. **Preparation:** The Implementation Modules (M31) relevant to the release's scope are completed and pass Quality Gates 1 through 3, per M34.
3. **Verification:** The release candidate passes Quality Gate 4 (End-to-End and User Acceptance Verification), per M34, and Security & Privacy Verification, per M35.
4. **Approval:** The release is approved only once every Release Readiness Criterion, defined below, is fully satisfied — approval is never partial.
5. **Release Execution:** The approved release is made available to Learners; the Operational Readiness monitoring and observability defined in M36 begins or continues immediately.
6. **Post-Release Evaluation:** The release's real-world outcome is reviewed against its Planning scope and the Product Success Metrics defined in M02, per Post-Release Review below.

---

# Release Readiness Criteria

Consistent with M34, M35, and M36, a release is ready only when:

- Every Functional Area (M13) and Service Operation (M18) within the release's scope has passed Quality Gates 1 through 3, per M34.
- Every User Flow (M05) within the release's scope has passed Quality Gate 4, per M34.
- Every Quality Attribute (M15) relevant to the release's scope has passed its Non-Functional Verification, per M34.
- Security & Privacy Verification, per M35, confirms no unresolved Security Constraint violation exists within the release's scope.
- Operational Readiness, per M36, confirms Monitoring and Observability are in place for every business outcome the release affects.
- No unresolved defect exists that affects a foundational Implementation Module, per M31's Dependency Map and M34's Release Readiness Principles.

---

# Release Risk Assessment

- **Classification:** A release risk is classified by which Implementation Module or layer it would affect and how foundational that module is, per M31's Dependency Map — consistent with M34's and M35's existing prioritization logic.
- **Definition:** A release risk is any plausible way the release could fail to satisfy the Release Readiness Criteria above, or could regress previously verified behavior, per M34's Regression Strategy.
- **Severity:** Severity is determined by Learner impact — a risk affecting Identity & Access or Session Generation is treated as higher severity than a risk confined to a rarely exercised condition.
- **Mitigation Requirement:** A release with an unmitigated high-severity risk does not proceed to Approval; the risk must be resolved, or the affected scope removed from the release, before Approval can be granted.

---

# Rollback Principles

- A release must always be conceptually reversible — the prior, already-verified release state remains restorable at all times.
- Rollback restores the system to the last known Release-Ready state without violating any Data Integrity Rule defined in M17 or any Security Constraint defined in M22 and M35.
- Rollback is a valid, expected outcome of Post-Release Evaluation or of an Operational Incident, per M36 — it is never treated as a failure of the release process itself, but as the process working as intended.
- The confirmed ability to roll back safely is itself part of the Release Readiness Criteria — a release without a confirmed rollback path may not proceed to Approval.
- No specific rollback mechanism, tool, or infrastructure is defined in this document.

---

# Post-Release Review

- **Outcome Review:** Confirms whether the release's Planning scope was fully and correctly delivered, per M23's Traceability chain.
- **Incident Review:** Confirms whether any Operational Incident, per M36, occurred following the release, and whether it was properly Detected, Assessed, Prioritised, Responded to, Recovered from, and Reviewed.
- **User Impact:** Confirms whether the release measurably moved the Product Success Metrics defined in M02 (e.g., time to first session, session completion rate, return usage) in the intended direction.
- **Improvement Opportunities:** Findings from Outcome, Incident, and User Impact review feed into Continuous Release Improvement below, and, where a finding reveals a specification gap rather than an implementation gap, into a new milestone via M24's Change Management Principles.

---

# Continuous Release Improvement

- Every Post-Release Review feeds back into refining the Release Risk Assessment and Release Readiness Criteria over time, without ever loosening a constraint already documented in M01–M36.
- A pattern observed across multiple releases (e.g., a recurring category of Finding) prompts a review of the Development Standards (M33) or Testing and Quality Strategy (M34), not merely a one-off fix to the immediate symptom.
- The Release Lifecycle itself is subject to the same Change Management Principles as any other documented process, per M24 — improvements to it are documented explicitly, never applied silently.

---

# Release Governance

- Every release decision is evaluated against the entire body of M01–M36, not against a single milestone in isolation, mirroring M24's Change Management Principles.
- No release may introduce scope that is not already traceable to an approved M02 requirement through M23's chain.
- Release approval is described here only functionally — approval is granted once and only once every Release Readiness Criterion is satisfied. No specific approver role, title, or organizational structure is introduced by this document, consistent with M35's and M36's avoidance of defining operational roles.
- Release Governance is itself periodically reviewed against M01's Mission, ensuring the release process continues to serve the product's founding purpose rather than becoming procedural overhead disconnected from it.

---

# Release Constraints

1. No release proceeds without satisfying every Release Readiness Criterion defined above.
2. No release may introduce scope beyond what is already traceable to an approved M02 requirement.
3. No release may proceed with an unmitigated high-severity Release Risk.
4. Every release must have a confirmed, conceptual rollback path before Approval is granted.
5. No change to the release process itself may bypass the Change Management Principles defined in M24.

---

# Release Management Glossary

- **Release:** A discrete, approved increment of already-documented product scope, made available to Learners.
- **Release Lifecycle:** The six-stage conceptual process — Planning, Preparation, Verification, Approval, Release Execution, Post-Release Evaluation — every release follows.
- **Release Readiness:** The state in which every documented criterion for releasing safely has been satisfied.
- **Release Risk:** A plausible way a release could fail to satisfy its Readiness Criteria or regress previously verified behavior.
- **Rollback:** The conceptual restoration of the system to its last known Release-Ready state.
- **Post-Release Review:** The structured evaluation of a release's outcome, incidents, and user impact after execution.
- **Release Governance:** The discipline of keeping every release decision aligned with the entire body of approved documentation.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented a Release Philosophy (Predictability, Stability, Repeatability, Incremental Improvement, Risk Reduction, User-Centric Delivery) and a six-stage Release Lifecycle (Planning, Preparation, Verification, Approval, Release Execution, Post-Release Evaluation).
- Documented Release Readiness Criteria consistent with M34, M35, and M36; Release Risk Assessment (Classification, Definition, Severity, Mitigation Requirement); and Rollback Principles with no infrastructure named.
- Documented Post-Release Review (Outcome, Incident, User Impact, Improvement Opportunities), Continuous Release Improvement, Release Governance, Release Constraints, and a Release Management Glossary.

### Files Created
- `docs/milestones/M37-release-management-specification.md`

### Files Modified
- None. M01–M36 were not revisited or altered.

### Pending
- No further action pending within M37. Awaiting next milestone instructions.

### Risks
- Release Governance deliberately describes approval only functionally, with no approver role or title, consistent with M35's and M36's avoidance of defining organizational roles. If a future milestone needs to assign concrete accountability for release approval, that would require its own explicit milestone rather than being inferred from this document.
- This document assumes Version 1's first release is governed by the same Release Lifecycle as every subsequent release, per the Repeatability principle — no distinction is drawn between an initial launch and later releases, since M01–M36 do not establish one.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
