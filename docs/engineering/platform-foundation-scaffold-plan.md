# Project Fluent — Platform Foundation Scaffold Plan

**Programme:** Engineering Program, Phase 4
**Status:** Draft
**Owner:** Engineering / Architecture
**Source of Truth:** M01–M56, `engineering-execution-plan.md`, `repository-and-workspace-architecture.md`, `technology-selection-and-adr.md`. This document defines the minimal scaffold that must exist before any business feature is implemented. It writes no code and scaffolds no literal folder; it specifies what must exist, conceptually, realizing the Execution Plan's Platform Foundation phase with the Repository Architecture's workspaces and the ADR's selected technologies.

---

# Executive Overview

Before any documented Functional Area (M13) can be implemented — before Identity & Access, before Configuration, before Session Generation — a minimal, running platform must exist to build them into. This document defines exactly what that platform consists of: the smallest set of scaffolding that makes the repository buildable, deployable, testable, and observable, with zero business logic. It is the concrete realization of the Execution Plan's Phase 1 (Platform Foundation), built using the eight workspaces defined in the Repository and Workspace Architecture and the technologies selected in the Technology Selection and ADR document.

---

# Foundation Philosophy

- **Minimal Runnable Platform:** The foundation is the smallest possible set of pieces that let the system run end-to-end — a walking skeleton, per the Execution Plan's Build Strategy — before any business behavior exists.
- **Incremental Development:** The foundation supports adding one Domain Service at a time, per M31's Extension Principles, without requiring rework of what came before it.
- **Documentation Traceability:** Every scaffold component traces to a specific milestone or ADR, per M23 and M53 — nothing is added because it "seems standard."
- **Security by Default:** The Authentication scaffold, backed by the Identity & Access Module (M18, M22), is wired from the very first commit — nothing is ever built "temporarily insecure" and secured later.
- **Testability:** The Testing Pyramid tooling selected in ADR-009 (Vitest, Playwright) is wired before any business logic exists, so every subsequent feature is testable from its first commit onward.
- **Independent Deployability:** The foundation is deployable, per M38's Deployment Lifecycle, even though it does nothing yet — restating the Execution Plan's "deployable at every increment" principle at its most literal.

---

# Repository Bootstrap

The initial repository must contain, conceptually:

- A pnpm and Turborepo monorepo (per ADR-008) with all eight workspace areas defined in the Repository and Workspace Architecture represented as distinct, buildable packages: Applications, Domain, Shared Libraries, AI Components, Infrastructure, Configuration (technical), Testing, and Tooling.
- A Next.js application within the Applications workspace, capable of rendering a placeholder for each of the five documented screens (M04, M25) with no real behavior.
- A NestJS application within the Domain and Application Orchestration workspaces, exposing a single, minimal health-check endpoint and nothing else.
- A Shared Libraries package containing type definitions only for the nine Logical Data Objects defined in M17 — no business logic, no validation, no persistence behavior yet.
- A version-control and CI pipeline skeleton (GitHub Actions, per ADR-010) that runs on every change from the first commit onward, even before any real test exists for it to execute.

---

# Core Platform Components

Only components already implied by prior documentation and ADRs are included:

- **Persistence Connectivity:** A working, connected PostgreSQL instance (ADR-004), reachable by the NestJS application, capable of a trivial read and write — before any Logical Data Object's real schema is populated.
- **Authentication Scaffold:** Auth.js (ADR-005) wired into a placeholder Identity & Access Module — structurally present before any CreateAccount, SignIn, SignOut, or VerifySession business logic is implemented, per Security by Default.
- **Technical Configuration Layer:** Environment-level configuration handling, per M33's Configuration Standards, kept structurally separate from the not-yet-built Product Configuration Service.
- **Caching and Job Queue Connectivity:** A working, connected Redis instance (ADR-006), reachable but unused until the Session Generation Module exists.
- **Observability Wiring:** Datadog (ADR-011) wired for basic health and uptime signals across both applications, satisfying the minimum Service Health and Operational Health coverage from M44 before any real Business Flow exists to observe.
- **CI/CD Pipeline Skeleton:** GitHub Actions (ADR-010) running build, lint, and a placeholder test step on every change, providing the Quality Gate infrastructure M34 requires before Gate 1 has anything substantive to check.
- **Testing Harness:** Vitest and Playwright (ADR-009), both configured and runnable against trivial placeholder tests, so Quality Gate 1 tooling exists from the first commit.
- **API Contract Scaffold:** The shared TypeScript contract layer (ADR-007) initialized, even though it currently defines no real Service Operation.

---

# Environment Strategy

- **Local Development:** Engineers run the Next.js and NestJS applications locally against a local or containerized PostgreSQL and Redis instance, mirroring production topology at the smallest scale.
- **Testing:** An isolated environment used exclusively by the CI pipeline, running the Vitest and Playwright suites against a fresh, disposable PostgreSQL and Redis instance per run — never sharing state with any other environment, consistent with M34's requirement that verification never depends on unverified prior state.
- **Staging:** A persistent environment mirroring Production's topology (AWS and Vercel, per ADR-010), used to run Deployment Verification, per M38, before any Release reaches Learners — the first environment where the full Deployment Lifecycle is genuinely exercised.
- **Production:** The live environment serving Learners, reached only after every Release Readiness Criterion (M37) and Deployment Readiness condition (M38) is satisfied.
- In every environment, only Technical Configuration varies; no environment's configuration is ever permitted to alter a Business Rule, per M33's Configuration Standards.

---

# Initial Build Order

1. Establish the monorepo and its eight workspace areas (Repository Bootstrap).
2. Wire the CI pipeline skeleton so it runs on every change from the first commit.
3. Establish the Local Development environment, confirming PostgreSQL and Redis are reachable locally.
4. Confirm Persistence connectivity — a trivial read and write against PostgreSQL.
5. Add the Shared Libraries type definitions for the nine Logical Data Objects, as types only.
6. Stand up the NestJS application skeleton with its health-check endpoint, and deploy it to Staging to confirm the Deployment Lifecycle (M38) works end-to-end with zero business logic.
7. Stand up the Next.js application skeleton with placeholder screens (M04), deployed to Staging alongside the backend.
8. Wire the Authentication scaffold (Auth.js integration, no real CreateAccount/SignIn logic yet) and Observability (Datadog), confirming the security gate and monitoring exist before any real Domain Service is built.
9. Confirm the Testing harness (Vitest, Playwright) runs successfully in CI against the skeleton.
10. Complete a first Production deployment of this empty-but-functioning skeleton, confirming Independent Deployability end-to-end before Authentication (Execution Plan Phase 2) begins in earnest.

---

# Acceptance Criteria

Business-feature implementation may begin only once all of the following are true:

- The monorepo exists with all eight workspace areas represented as buildable packages, per the Repository and Workspace Architecture.
- The Next.js and NestJS applications both build, run locally, and deploy successfully to Staging and Production, with no business logic implemented.
- Persistence connectivity to PostgreSQL and Redis is confirmed in every environment (Local, Testing, Staging, Production).
- The CI pipeline runs on every change and successfully executes the (currently trivial) Vitest and Playwright suites.
- Observability reports basic Service Health and Operational Health signals from both applications in Staging and Production.
- The Authentication scaffold is wired — Auth.js integrated with a placeholder Identity & Access Module — even though no real CreateAccount or SignIn logic exists yet.
- The shared TypeScript contract layer and the nine Logical Data Object type definitions exist and are referenced by both applications, without yet containing business logic.
- A first, empty deployment has completed the full Deployment Lifecycle — Preparation through Completion, per M38 — proving the platform is deployable before a single Functional Area is implemented.

Only once every criterion above is satisfied does Authentication (Execution Plan Phase 2) begin — implementing the actual CreateAccount, SignIn, SignOut, and VerifySession business logic.

---

# Constraints

- This document writes no code.
- This document does not create any literal folder — every component described is conceptual scaffolding to be realized when engineering work actually begins.
- This document invents no feature; every component listed exists because a prior milestone or ADR already implies it, not because it is common practice in general.
- Every foundation component above is traceable to a specific milestone or ADR, cited inline throughout this document.

---

## End Report

### Phase Status
Complete.

### Completed
- Documented a Foundation Philosophy (Minimal Runnable Platform, Incremental Development, Documentation Traceability, Security by Default, Testability, Independent Deployability), each tied to a specific milestone or prior engineering document.
- Documented Repository Bootstrap and Core Platform Components, restricted strictly to components already implied by M01–M56 and the three prior engineering documents — no new component was introduced without a citation.
- Documented an Environment Strategy across Local Development, Testing, Staging, and Production, a ten-step Initial Build Order, Acceptance Criteria gating the start of business-feature implementation, and Constraints.

### Files Created
- `docs/engineering/platform-foundation-scaffold-plan.md`

### Files Modified
- None. M01–M56 and the three prior engineering documents were not revisited or altered.

### Pending
- No scaffolding has actually been created — this document defines what must exist, not the act of creating it. The next concrete step is executing the Initial Build Order, item by item, in an actual repository.

### Risks
- The Authentication scaffold (wiring Auth.js to a placeholder Identity & Access Module before any real CreateAccount/SignIn logic exists) is presented as part of the Foundation rather than deferred to the Execution Plan's Authentication phase. This is a deliberate reading of "Security by Default" — the gate exists structurally before any feature is built behind it — but it does mean the Foundation phase includes slightly more than a purely inert skeleton. This should be confirmed as the intended scope before build begins.
- The Initial Build Order recommends a first Production deployment of an empty skeleton (step 10) before any business feature exists. This is intended to prove Independent Deployability early and cheaply, consistent with the Execution Plan's Build Strategy, but represents an early production deployment decision some teams may prefer to defer until slightly more functionality exists — this should be confirmed as acceptable.

### Open Questions
- None new beyond those already raised in earlier milestones and engineering documents.
