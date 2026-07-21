# Project Fluent — Technology Selection and Architectural Decision Record

**Programme:** Engineering Program, Phase 3
**Status:** Draft
**Owner:** Engineering / Architecture
**Source of Truth:** M01–M56, `docs/engineering/engineering-execution-plan.md`, `docs/engineering/repository-and-workspace-architecture.md`. This document makes the concrete technology decisions M32 deliberately deferred. It evaluates every choice strictly against M32's already-established criteria — no new evaluation criterion is introduced here.

---

# Executive Overview

M32's Technology Selection Strategy established the principles any technology must satisfy, without naming one. This document performs that naming: it selects one technology per major engineering layer, justifies each selection against M32's Engineering Goals, Technology Evaluation Criteria, and Preferred Architectural Characteristics, and records each decision as a formal Architectural Decision Record (ADR). Where documented product scope (M01–M56) does not actually require a given category of technology, this document says so explicitly rather than inventing a feature to justify a purchase.

---

# Technology Selection Philosophy

Every technology decision in this document is evaluated exclusively against the criteria M32 already established:

- **Engineering Goals** (M32): Reliability, Scalability, Security, Maintainability, Performance, Developer Experience, Testability, Extensibility, Operational Simplicity.
- **Technology Evaluation Criteria** (M32): Architectural Alignment, NFR Alignment, Maturity and Stability, Ecosystem Health, Security Track Record, Total Cost of Adoption, Reversibility, Observability Support, Data Protection Compatibility.
- **Preferred Architectural Characteristics** (M32): Strong Typing, Modularity, Explicit Interfaces, Mature Ecosystem, Excellent Documentation, Long-Term Community Support, Predictable Release Cycle, High Observability, Automation-Friendly, Cloud-Native Compatibility.

No new criterion is introduced by this document. Every selection below cites which of these existing principles it satisfies.

---

# Decision Process

For every technology category, the following conceptual process was applied:

1. Confirm the category corresponds to a genuine, documented need (an Implementation Module per M31, a Quality Gate per M34, or an Operational discipline per M36–M40) — not an assumed industry-standard checklist item.
2. Where no genuine documented need exists, record the category as **Not Required for Version 1 Documented Scope**, rather than selecting a technology to fill it.
3. Where a genuine need exists, shortlist mature, production-proven options and evaluate each against M32's full criteria set.
4. Select the option that best satisfies Architectural Alignment and Security Track Record first (M32's non-negotiable criteria), then the remaining criteria.
5. Record the selection, its justification, its trade-offs, the alternatives considered, and the documentation it traces back to.

---

# Selected Technology Stack

| Layer | Selected Technology | Why It Satisfies M32 | Major Trade-offs | Alternatives Considered | Documentation References |
|---|---|---|---|---|---|
| Frontend Framework | **Next.js (React, TypeScript)** | Mature Ecosystem, Long-Term Community Support, Strong Typing (via TypeScript), Cloud-Native Compatibility. Directly realizes the View, Interaction, State, and Navigation Layers (M19) as a cohesive framework. | Framework opinionation requires following its conventions; larger bundle surface than a minimal library. | SvelteKit, Vue/Nuxt, plain React with a separate router. | M19, M04, M25–M30 |
| Backend Framework | **Node.js with NestJS (TypeScript)** | Modularity — NestJS's first-class module system maps directly onto M31's nine Implementation Modules and M20's layering; Strong Typing; Explicit Interfaces. | Steeper learning curve and more boilerplate than a minimal framework (e.g., Express alone). | Express.js (minimal, less structure), a JVM framework (Spring Boot), a Go service. | M16, M20, M31, M18 |
| AI Integration Layer | **Anthropic Claude API** | Strong instruction-following and structured-output reliability, directly supporting M21's Output Validation and Structural Determinism Constraints; mature, well-documented API; predictable release cycle. | Dependent on an external provider's availability and pricing; requires the strict input/output boundary discipline M21 and M45 already mandate to be enforced in code. | OpenAI API, self-hosted open-source models (e.g., via a hosted inference platform). | M08, M21, M45 |
| Database | **PostgreSQL** | Mature, ACID-compliant, strong relational integrity guarantees directly supporting M17's Data Integrity Rules and M07's immutability requirements (e.g., Recorded Progress outcomes); excellent documentation; huge ecosystem. | Relational schema changes require migration discipline; less naturally flexible than a document store for rapidly changing shapes (not a concern here, since M17's data shapes are fixed and well-defined). | MySQL, a managed NoSQL document store (e.g., MongoDB). | M17, M07, M41 |
| Authentication | **Auth.js (credentials-based) backed directly by the Identity & Access Module** | Keeps Authentication State fully owned within the Domain Layer, per M22's Access Responsibilities, while using a mature, widely audited library for password hashing and session-token mechanics rather than building cryptographic primitives from scratch. | Requires more integration work than fully outsourcing identity to a third-party provider. | Fully outsourced identity providers (e.g., Auth0, Clerk) — rejected because M22 requires Authentication State to remain owned by the Domain Layer, and outsourcing would move that ownership outside the documented architecture. | M18 (Identity & Access Service), M22, M35 |
| Object Storage | **S3-compatible object storage** | Mature, cloud-native, minimal operational overhead; available if any future AI-generated audio asset (for Listening Session Composition parts) needs caching. | Currently minimal documented need — Version 1 defines no Learner-uploaded content, per M35's Data Protection Strategy. | A database-stored binary column (rejected: poor fit for larger media, per M32's Operational Simplicity). | M08, M35 |
| Background Jobs | **Redis-backed job queue** | Supports asynchronous AI Interaction Point processing (M21) without blocking the Learner-facing request, supporting M15's Performance expectations; reuses the same Redis instance selected for Caching, minimizing operational surface, per M32's Operational Simplicity. | Introduces eventual-consistency handling for Session Generation status. | A dedicated message broker (e.g., a separate queue product) — rejected as unnecessary additional operational surface for this product's scale. | M08, M13, M15 |
| Caching | **Redis** | Mature, ubiquitous, dual-purpose (caching and background jobs), reducing total infrastructure surface, per M32's Operational Simplicity. | Adds a stateful component requiring its own availability management. | An in-process cache only (rejected: insufficient for multi-instance deployment). | M15, M36 |
| Search | **Not Required for Version 1 Documented Scope** | M02 explicitly excludes manual topic browsing and any topic/lesson library (FR-SESS-07); no Learner-facing search capability exists anywhere in M01–M56. | Introducing a search technology now would add operational surface for a capability that is out of scope, violating M32's Operational Simplicity and M01's minimalism. | N/A — evaluated and declined. | M02, M08 |
| API Style | **Typed HTTP API following REST-style resource/action conventions, with a shared TypeScript contract** | Explicit Interfaces and Strong Typing (M32); directly mirrors M18's Service Operations, each already defined with clear inputs, outputs, and conditions. | Less flexible for ad hoc client-side querying than GraphQL. | GraphQL — rejected as unnecessary flexibility given M18's fixed, well-defined Operations do not require flexible querying. | M18, M13, M16 |
| Realtime Communication | **Not Required for Version 1 Documented Scope** | No Learner Flow in M05 requires live, bidirectional communication; every documented interaction (per M13's User Actions) is a discrete request and response. | Introducing realtime infrastructure now would add operational surface for a capability not documented anywhere in M01–M56. | N/A — evaluated and declined. If Speaking practice ever requires live audio interaction, that is a functional clarification for M42's Change Lifecycle, not a preemptive technology choice here. | M05, M08, M13 |
| Package Manager | **pnpm** | Efficient dependency resolution and strong native monorepo support; mature and widely adopted, supporting M31's nine-module structure across the workspace. | Less universally familiar than npm to newer contributors. | npm, Yarn. | M31, Repository and Workspace Architecture |
| Monorepo Tool | **Turborepo** | Mature, well-documented, pairs naturally with pnpm and Next.js; directly supports the eight workspace areas defined in the Repository and Workspace Architecture, enforcing their Dependency Principles at build time. | Requires disciplined workspace boundary definitions to get full value. | Nx, a set of independent repositories (rejected: independent repositories would weaken the single-source-of-truth Traceability the Repository Architecture depends on). | Repository and Workspace Architecture |
| Testing Framework | **Vitest (unit and module level) and Playwright (end-to-end)** | Directly supports M34's Testing Pyramid — Vitest for Unit and Module Verification, Playwright for End-to-End Verification; both mature, well-documented, and Automation-Friendly, per M32. | Two distinct tools to maintain rather than one unified framework. | Jest (rejected: Vitest's tighter integration with the chosen frontend/backend TypeScript toolchain), Cypress (rejected in favor of Playwright's broader browser support). | M34 |
| CI/CD Platform | **GitHub Actions** | Mature, ubiquitous, tightly integrated with source control; directly supports M37's Release Lifecycle and M38's Deployment Lifecycle as automatable, repeatable gates. | Vendor-coupled to GitHub as the source control host. | GitLab CI, a self-hosted CI runner. | M37, M38 |
| Cloud Infrastructure | **AWS (RDS for PostgreSQL, ElastiCache for Redis, S3 for object storage, ECS Fargate for backend compute)** | Mature, industry-standard, broad managed-service coverage reducing operational burden for Infrastructure and Persistence, per M32's Operational Simplicity and Cloud-Native Compatibility. | Requires disciplined cost and configuration management across several managed services. | Google Cloud Platform, Microsoft Azure. | M16, M20, M38 |
| Deployment Platform | **Vercel (frontend) + AWS Fargate (backend)** | Vercel provides edge-optimized delivery for the Presentation Module, directly supporting M15's Performance expectations; Fargate provides controlled, stateful compute for the Domain and Application layers where more operational control is warranted. | Two deployment platforms to coordinate rather than one; requires clear release coordination, per M37 and M38. | A single, unified platform for both frontend and backend (rejected: would sacrifice Vercel's edge-delivery strength for the Presentation Layer specifically). | M38 |
| Observability Platform | **Datadog** | Unified logs, metrics, and traces in one platform, directly supporting M44's seven Observability Domains and M32's High Observability characteristic. | Cost scales with usage; introduces a third-party dependency for operational visibility. | A self-hosted Prometheus/Grafana/Loki stack (rejected for this stage: higher operational burden than justified by M32's Operational Simplicity, though noted below as a viable future alternative). | M15, M36, M44 |

---

# Architectural Decision Records

### ADR-001: Frontend Framework — Next.js
- **Context:** The Presentation Module (M19) requires a View, Interaction, State, and Navigation implementation across five documented screens (M04, M25–M30).
- **Decision:** Adopt Next.js with React and TypeScript.
- **Consequences:** Presentation code follows Next.js's file-based routing and rendering model; the four Frontend Layers are implemented as clearly separated concerns within that model.
- **Trade-offs:** Framework opinionation traded for maturity, ecosystem breadth, and strong TypeScript support.
- **Related Documentation:** M19, M04, M25–M30.

### ADR-002: Backend Framework — NestJS
- **Context:** The Application Orchestration Module and five Domain Services (M18, M31) require a structured, modular backend implementation.
- **Decision:** Adopt Node.js with NestJS, in TypeScript.
- **Consequences:** Each Domain Service and the Application Orchestration Module is implemented as a distinct NestJS module, directly mirroring M31's module boundaries and M20's layering.
- **Trade-offs:** More initial structure and boilerplate than a minimal framework, traded for enforced modularity and long-term maintainability.
- **Related Documentation:** M16, M20, M31, M18.

### ADR-003: AI Integration Layer — Anthropic Claude API
- **Context:** The AI Integration Module (M21, M45) must perform Topic Generation and Composition Content Generation within strict input and output boundaries.
- **Decision:** Adopt the Anthropic Claude API as the AI Integration Layer.
- **Consequences:** All AI Interaction Points are implemented as calls to this API, strictly scoped to the AI Input Concepts defined in M21; Output Validation against M08's Business Constraints is implemented in the Session Generation Module, never delegated to the API itself.
- **Trade-offs:** External provider dependency traded for maturity, strong instruction-following, and predictable behavior supporting M21's Consistency and Structural Determinism Constraints.
- **Related Documentation:** M08, M21, M45.

### ADR-004: Database — PostgreSQL
- **Context:** M17 defines nine Logical Data Objects with strict relational integrity requirements and immutability guarantees (e.g., Recorded Progress outcomes).
- **Decision:** Adopt PostgreSQL as the sole system of record.
- **Consequences:** All Logical Data Objects are modeled relationally; Data Integrity Rules (M17) are enforced at the database and Domain Layer levels together.
- **Trade-offs:** Requires migration discipline for schema evolution, traded for strong consistency guarantees.
- **Related Documentation:** M17, M07, M41.

### ADR-005: Authentication — Auth.js Backed by the Identity & Access Module
- **Context:** M22 requires Authentication State to be owned entirely within the Domain Layer, never delegated externally.
- **Decision:** Implement authentication mechanics using Auth.js, integrated directly with the Identity & Access Module's Operations (CreateAccount, SignIn, SignOut, VerifySession, per M18), rather than outsourcing identity to a third-party provider.
- **Consequences:** Password handling and session-token mechanics use a mature, audited library, while ownership of Authentication State remains entirely within the documented architecture.
- **Trade-offs:** More integration work than a fully outsourced identity provider, traded for architectural and privacy alignment with M22 and M35.
- **Related Documentation:** M18, M22, M35.

### ADR-006: Caching and Background Jobs — Redis
- **Context:** Session Generation's AI Interaction Points (M21) may require asynchronous processing to preserve Learner-facing responsiveness, per M15.
- **Decision:** Adopt Redis as both the caching layer and the backing store for a background job queue.
- **Consequences:** A single stateful component serves two related operational needs, reducing infrastructure surface.
- **Trade-offs:** Introduces eventual-consistency handling for in-flight Session Generation requests, traded for reduced operational complexity.
- **Related Documentation:** M08, M13, M15, M36.

### ADR-007: API Style — Typed REST-Style Contract
- **Context:** M18 defines five Services with fixed, well-specified Operations, each with explicit inputs, outputs, and conditions.
- **Decision:** Implement the API as a typed HTTP interface following REST-style resource/action conventions, sharing TypeScript contract types between frontend and backend.
- **Consequences:** Each Service Operation maps to a specific, typed endpoint; client and server share a single source of truth for request and response shapes.
- **Trade-offs:** Less ad hoc query flexibility than GraphQL, traded for simplicity and direct alignment with M18's already-fixed contracts.
- **Related Documentation:** M18, M13, M16.

### ADR-008: Package Manager and Monorepo Tool — pnpm and Turborepo
- **Context:** The Repository and Workspace Architecture defines eight logical workspace areas that must remain independently buildable and testable while sharing common libraries.
- **Decision:** Adopt pnpm as the package manager and Turborepo as the monorepo build orchestrator.
- **Consequences:** Workspace boundaries defined in the Repository and Workspace Architecture become enforceable build-time boundaries.
- **Trade-offs:** Requires disciplined workspace configuration, traded for consistent, cached, parallelizable builds across the whole repository.
- **Related Documentation:** Repository and Workspace Architecture, M31.

### ADR-009: Testing Framework — Vitest and Playwright
- **Context:** M34 defines a six-level Testing Pyramid requiring distinct tooling for Unit/Module Verification versus End-to-End Verification.
- **Decision:** Adopt Vitest for Unit and Module Verification, and Playwright for End-to-End and User Acceptance Verification.
- **Consequences:** Each Quality Gate defined in M34 has a corresponding, appropriate tool.
- **Trade-offs:** Two distinct testing tools to maintain, traded for each tool's fitness to its specific Verification Level.
- **Related Documentation:** M34.

### ADR-010: CI/CD, Cloud Infrastructure, and Deployment Platform
- **Context:** M37's Release Lifecycle and M38's Deployment Lifecycle require an automatable, repeatable execution and deployment mechanism.
- **Decision:** Adopt GitHub Actions for CI/CD, AWS for core cloud infrastructure (RDS, ElastiCache, S3, ECS Fargate), and a split deployment model — Vercel for the frontend, AWS Fargate for the backend.
- **Consequences:** Presentation Module deployment benefits from edge-optimized delivery; Domain, Application, and Persistence Modules run on infrastructure offering finer operational control.
- **Trade-offs:** Two deployment platforms to coordinate rather than one, traded for each platform's strength being applied where it matters most, per M15's Performance expectations for the Presentation Layer specifically.
- **Related Documentation:** M37, M38, M16, M20.

### ADR-011: Observability Platform — Datadog
- **Context:** M44 defines seven Observability Domains that must remain measurable across the entire system.
- **Decision:** Adopt Datadog as the unified observability platform for logs, metrics, and traces.
- **Consequences:** All seven Observability Domains are instrumented through a single platform, simplifying correlation across Product Behaviour, Service Health, AI Behaviour, and Operational Health.
- **Trade-offs:** Ongoing cost scaling with usage, traded for reduced integration complexity versus assembling multiple open-source tools; a self-hosted Prometheus/Grafana/Loki stack remains a documented, viable future alternative if cost considerations change.
- **Related Documentation:** M15, M36, M44.

---

# Stack Compatibility Review

- **Frontend and Backend:** Next.js and NestJS both use TypeScript natively, allowing shared type contracts across the API Style decision (ADR-007), satisfying M32's Strong Typing characteristic end-to-end.
- **Backend and Database:** NestJS has mature, well-documented integration patterns with PostgreSQL, supporting the Domain Layer's direct enforcement of M17's Data Integrity Rules.
- **Backend and Caching/Jobs:** NestJS integrates natively with Redis-backed queue libraries, supporting ADR-006's dual-purpose Redis usage without introducing a separate messaging technology.
- **AI Integration and Backend:** The Anthropic Claude API is called exclusively from within the Session Generation Service (per M31's Dependency Principles), never from the Presentation or Persistence layers directly, preserving M21's and M45's strict AI boundary in the chosen stack.
- **Monorepo and All Layers:** Turborepo and pnpm workspaces accommodate the Next.js frontend, NestJS backend, and any Shared Libraries package (per the Repository and Workspace Architecture) within a single, coherently buildable repository.
- **Deployment and Cloud Infrastructure:** Vercel's frontend hosting and AWS's backend services are both natively compatible with the chosen frameworks and require no unusual bridging technology.
- **Observability Across the Stack:** Datadog provides supported integrations for Next.js, NestJS, PostgreSQL, and Redis alike, meaning no Observability Domain (M44) is left uninstrumented due to a tooling gap.

No incompatibility was found between any two selected technologies. Every dependency direction required by the stack matches the Dependency Principles already established in M31 and the Repository and Workspace Architecture.

---

# Future Replacement Principles

- Consistent with M43's Compatibility Principles, any future replacement of a selected technology must preserve Backward Consistency — a Learner's existing Configuration, Sessions, and Progress must remain valid and correctly interpretable regardless of the underlying technology.
- A technology replacement is evaluated using the exact Replacement Strategy principle already defined in M32's Dependency Selection Principles — every technology in this document was selected with an understanding of how it could be replaced without violating M31's Dependency Principles.
- Replacing the AI Integration Layer (ADR-003) would be classified, per M43's Version Classification, as at most Adaptive — the AI Layer's Purpose, Input Concepts, and Output Concepts (M21) remain unchanged regardless of which underlying API fulfills them, provided the same AI Constraints (M21, M45) are satisfied.
- Replacing the Database (ADR-004) would require the highest scrutiny among infrastructure choices, given its direct bearing on M17's Data Integrity Rules — any such change requires explicit migration planning consistent with M41's Data Continuity Principles, never a silent swap.
- No technology decision in this document is treated as permanent; each is documented, per M42's Change Lifecycle, so that a future, explicit milestone can revisit it without disrupting the architecture it was chosen to serve.

---

# Constraints

- This document invents no product feature; where a technology category corresponded to no documented product need (Search, Realtime Communication), it was declined rather than filled.
- Every technology decision in this document traces back to M32's Engineering Goals, Technology Evaluation Criteria, or Preferred Architectural Characteristics.
- Every selection favors a mature, production-proven technology over an emerging or unproven one, consistent with M32's Maturity and Stability criterion.
- Every selection minimizes unnecessary complexity, consistent with M32's Operational Simplicity Engineering Goal — reflected specifically in the dual-purpose use of Redis and the decision to decline Search and Realtime Communication entirely.

---

## End Report

### Phase Status
Complete.

### Completed
- Selected one technology for every requested engineering layer, evaluated explicitly against M32's existing criteria, with two categories (Search, Realtime Communication) explicitly declined as not required by any documented Version 1 scope rather than filled by default.
- Documented eleven Architectural Decision Records covering Frontend, Backend, AI Integration, Database, Authentication, Caching/Background Jobs, API Style, Package Manager/Monorepo, Testing, CI/CD/Cloud/Deployment, and Observability.
- Documented a Stack Compatibility Review confirming no incompatibility exists among the selected technologies and that every dependency direction matches M31's and the Repository Architecture's existing rules, and Future Replacement Principles aligned with M43.

### Files Created
- `docs/engineering/technology-selection-and-adr.md`

### Files Modified
- None. M01–M56 and the prior engineering documents were not revisited or altered.

### Pending
- No technology has actually been installed, configured, or provisioned — this document is the decision record only. Provisioning and initial project scaffolding are the next concrete engineering steps, following the Implementation Roadmap's Platform Foundation phase.

### Risks
- Authentication (ADR-005) deliberately avoids a fully outsourced identity provider to preserve M22's requirement that Authentication State remain owned by the Domain Layer. This is a stricter, more implementation-heavy choice than a typical "just use a hosted auth provider" default, and should be confirmed as the intended trade-off before implementation begins.
- The split deployment model (Vercel for frontend, AWS for backend, per ADR-010) introduces two platforms to coordinate rather than one. This was justified by each platform's fitness for its specific layer, but it is a real operational trade-off that increases release coordination complexity, per M37 and M38, and should be weighed against a simpler, single-platform alternative if the team prefers to minimize coordination overhead over per-layer optimization.
- The AI Integration Layer selection (ADR-003) names a specific commercial provider (Anthropic). M21 and M45 deliberately avoided naming any provider at the architecture level, and this document is the first to do so, consistent with this phase's explicit instruction to make concrete technology selections. This choice should be confirmed as intentional, since M43's Future Replacement Principles note that changing it later remains a comparatively low-scrutiny (Adaptive-level) change if ever needed.

### Open Questions
- None new beyond those already raised in earlier milestones and engineering documents.
