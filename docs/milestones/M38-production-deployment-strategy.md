# M38 — Production Deployment Strategy

**Status:** Draft
**Owner:** Architecture / Engineering / Operations
**Milestone:** M38
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M37 — Release Management Specification](./M37-release-management-specification.md)

---

# Overview

The Production Deployment Strategy defines the conceptual strategy for moving an approved release, per M37, into a live production environment. It elaborates M37's "Release Execution" stage into its own detailed lifecycle, ensuring the act of deployment itself — not just the decision to release — is reliable, repeatable, safe, and recoverable. It names no cloud provider, infrastructure, deployment platform, CI/CD tool, container, or orchestration technology; it defines the principles any such implementation must satisfy.

---

# Deployment Philosophy

- **Reliability:** A deployment always results in the system reaching its intended, already-verified state — never an uncertain or partially applied one.
- **Repeatability:** The same deployment lifecycle, defined below, applies to every deployment, mirroring M37's Repeatability principle.
- **Safety:** A deployment never proceeds if doing so risks violating a Data Integrity Rule defined in M17 or a Security Constraint defined in M22 and M35.
- **Predictability:** Deployment behavior always follows the exact lifecycle documented below — production deployment never introduces surprises.
- **Recoverability:** Every deployment has a confirmed path back to the prior, known-good state, per M37's Rollback Principles.
- **Minimal User Disruption:** A deployment must never unexpectedly interrupt a Learner's in-progress Session or Authentication State, consistent with M08's rule that a Session's contents are fixed once generated, and M15's Availability expectations.

---

# Deployment Lifecycle

1. **Deployment Preparation:** The approved release, per M37's Approval stage, is confirmed to be scoped exactly to what was approved — nothing beyond that scope is included, per M23's Traceability chain.
2. **Environment Validation:** The target production environment is confirmed, conceptually, to satisfy every Architecture Constraint (M16, M20) and Operational Readiness expectation (M36) required for the release to behave exactly as documented.
3. **Deployment Execution:** The release is made active in production. This step realizes M37's "Release Execution" stage, elaborated here as its own internal sequence.
4. **Verification:** The deployed system is re-confirmed, immediately after execution, to satisfy the same Release Readiness Criteria already confirmed at Approval, per M37 — ensuring nothing changed unexpectedly between approval and live production.
5. **Operational Validation:** The Monitoring and Observability Principles defined in M36 confirm the deployed system is behaving as expected under real production conditions, not only under the synthetic conditions of prior Verification.
6. **Completion:** The deployment is formally considered complete only once both Verification and Operational Validation pass. Until then, the deployment remains in a state to which the Recovery Principles below may still apply.

---

# Deployment Readiness

Consistent with M34, M35, M36, and M37, a deployment may only begin when:

- The release has passed Approval, per M37's Release Lifecycle.
- Every Release Readiness Criterion defined in M37 remains satisfied at the moment of deployment, not only at the moment of Approval.
- A confirmed rollback path exists, per M37's Rollback Principles.
- Operational Readiness monitoring, per M36, is active and able to observe the deployment's effect immediately upon execution.
- No unresolved Security Constraint violation exists, per M35.

---

# Deployment Verification

- **Functional Verification:** Confirms that the Functional Areas (M13) and Service Operations (M18) affected by the deployment behave exactly according to their documented contracts in the live environment.
- **Operational Verification:** Confirms that the Monitoring and Observability Principles defined in M36 are correctly reporting business outcomes for the newly deployed scope.
- **Security Verification:** Confirms that the Security Constraints defined in M22 and M35 hold in the live environment — no Learner's information is reachable by another Learner, and Authentication State gating remains intact.
- **User Experience Verification:** Confirms that Learners can complete the User Flows defined in M05 affected by the deployment exactly as documented, consistent with M11's Product Experience Goals.

---

# Recovery Principles

Consistent with M37's Rollback Principles:

- If Deployment Verification or Operational Validation fails, the deployment is rolled back to the last known Release-Ready state, exactly as described in M37.
- Recovery from a failed deployment must never violate a Data Integrity Rule defined in M17 or a Security Constraint defined in M22 and M35.
- A failed deployment is treated as a Finding, per M23, feeding directly into the Post-Release Review and Continuous Release Improvement principles already defined in M37, as well as the Continuous Deployment Improvement principle below.
- Restoring the last known good state is always preferred over attempting to correct a failed deployment while it remains live — recovery takes priority over live remediation.

---

# Deployment Governance

- Every deployment is evaluated against the entire body of M01–M37, not against a single milestone in isolation, mirroring M24's and M37's governance principles.
- Deployment is a stage within the Release Lifecycle already defined in M37 — no deployment may occur outside of, or as a bypass of, that lifecycle.
- Deployment Governance is periodically reviewed against M01's Mission, consistent with M37's Release Governance, ensuring the deployment process continues to serve the product's founding purpose.

---

# Continuous Deployment Improvement

- Every deployment's outcome, per Deployment Verification above, feeds back into refining Deployment Readiness and Environment Validation expectations over time.
- A recurring deployment-related Finding prompts a review of Operational Readiness (M36) or the Development Standards defined in M33, not merely an isolated, one-time fix.
- Changes to deployment practice are documented explicitly through M24's Change Management Principles — never applied silently.

---

# Deployment Constraints

1. No deployment may begin without satisfying Deployment Readiness in full.
2. No deployment may proceed if any Release Readiness Criterion, per M37, is no longer satisfied at the moment of deployment.
3. No deployment may be considered Complete without passing both Deployment Verification and Operational Validation.
4. No deployment may unexpectedly disrupt a Learner's in-progress Session or Authentication State.
5. No recovery action taken in response to a failed deployment may violate a Data Integrity Rule or Security Constraint.

---

# Production Deployment Glossary

- **Deployment:** The act of making an approved release active in the production environment.
- **Deployment Lifecycle:** The six-stage conceptual process — Preparation, Environment Validation, Execution, Verification, Operational Validation, Completion — every deployment follows.
- **Deployment Readiness:** The state in which every documented condition for beginning a deployment has been satisfied.
- **Deployment Verification:** The confirmation, across Functional, Operational, Security, and User Experience dimensions, that a deployment behaves exactly as documented.
- **Operational Validation:** The confirmation, under real production conditions, that a deployed system behaves as expected.
- **Recovery:** The restoration of the system to its last known Release-Ready state following a failed deployment.
- **Environment Validation:** The conceptual confirmation that the production environment satisfies the Architecture Constraints and Operational Readiness expectations a release depends on.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Documented a Deployment Philosophy (Reliability, Repeatability, Safety, Predictability, Recoverability, Minimal User Disruption) and a six-stage Deployment Lifecycle (Preparation, Environment Validation, Execution, Verification, Operational Validation, Completion), elaborating M37's "Release Execution" stage.
- Documented Deployment Readiness consistent with M34–M37, Deployment Verification across four dimensions (Functional, Operational, Security, User Experience), and Recovery Principles consistent with M37's Rollback Principles.
- Documented Deployment Governance, Continuous Deployment Improvement, Deployment Constraints, and a Production Deployment Glossary.

### Files Created
- `docs/milestones/M38-production-deployment-strategy.md`

### Files Modified
- None. M01–M37 were not revisited or altered.

### Pending
- No further action pending within M38. Awaiting next milestone instructions.

### Risks
- This document treats "Deployment Execution" as a direct elaboration of M37's "Release Execution" stage rather than a separate, competing process. This relationship is stated explicitly to avoid any ambiguity between the two documents, and should be confirmed as the intended reading — deployment is a sub-lifecycle within release, not a parallel one.
- Recovery Principles here intentionally restate, rather than reinterpret, M37's Rollback Principles, to keep the two documents in lockstep given how closely related they are.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
