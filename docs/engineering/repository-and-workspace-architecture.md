# Project Fluent — Repository and Workspace Architecture

**Programme:** Engineering Program, Phase 2
**Status:** Draft
**Owner:** Engineering / Architecture
**Source of Truth:** M01–M56 (the closed Version 1 Documentation Programme) and `docs/engineering/engineering-execution-plan.md`. This document invents no module, chooses no technology, and creates no actual folder — it describes, conceptually, how the codebase that will eventually host the nine Implementation Modules defined in M31 should be organized.

---

# Executive Overview

The Repository and Workspace Architecture defines the conceptual organization of the codebase that will host Project Fluent's implementation. It exists to ensure that the moment engineering work begins, it has a clear, pre-agreed workspace shape to build into — one that mirrors the nine Implementation Modules defined in M31 exactly, rather than an organization invented ad hoc once code is already being written. It names no programming language, framework, or literal folder path; it defines logical areas of the codebase and the rules governing how they relate to one another.

---

# Workspace Philosophy

- **Separation of Concerns:** Each workspace holds exactly the responsibility of the Implementation Module(s) it hosts, per M31 — never a mix of unrelated concerns.
- **Modularity:** A workspace boundary is a hard boundary — code in one workspace does not reach into another's internals, mirroring M16's layer boundaries and M20's Dependency Rules.
- **Scalability:** The workspace structure must accommodate a growing number of Learners and Sessions, per M15, without requiring reorganization — growth in data or usage never requires a different workspace shape, only more of the same.
- **Maintainability:** The mapping between a workspace and the milestone(s) it realizes remains obvious at all times, per M31's Maintainability Principles, so a new engineer can locate the code governing any documented behavior without guesswork.
- **Independent Evolution:** A workspace can change internally without requiring a change to another workspace, provided the Dependency Principles below are respected — this is M31's Extension Principles applied to physical code organization.
- **Testability:** Every workspace is structured so that the Quality Gates defined in M34 can be applied to it independently, before being applied to the system as a whole.
- **Documentation Traceability:** Every workspace's existence and boundary trace directly back to a specific milestone, per M23 — no workspace exists without a documented reason to.

---

# Repository Structure

The repository is conceptually organized into eight logical areas. These are areas of responsibility, not literal folder names or paths.

- **Applications:** Hosts the Presentation Module and the Application Orchestration Module, per M31 — the two Implementation Modules directly responsible for serving a Learner's request and presenting a response.
- **Shared Libraries:** Hosts the Logical Data Objects defined in M17 and the Entity and Business Rules defined in M07–M09 that every Domain-owning module depends on in common — the single place these shared concepts are defined once and referenced everywhere, never redefined per module.
- **AI Components:** Hosts the AI Integration Module exclusively, per M21 and M45 — isolated from every other workspace except for its single, controlled relationship with Session Generation.
- **Infrastructure:** Hosts the Persistence Module, per M31, and any conceptual deployment-related code supporting M38's Deployment Lifecycle.
- **Configuration:** Hosts technical and environment-level configuration only — explicitly distinct from the Learner-facing Configuration Module (English Level, Learning Goal, Topic Toggle Preference, per M09 and M18), which lives in the domain area described below, not here.
- **Documentation:** Refers to the existing `docs/` structure already established — M01 through M56, and the engineering documents building on it. This area is referenced by every workspace but is never generated from code, per M53's Documentation Authority.
- **Testing:** Hosts the artifacts and structures supporting the four Quality Gates defined in M34 — organized to mirror the Implementation Modules being verified, never as an undifferentiated catch-all.
- **Tooling:** Hosts conceptual support for enforcing M33's Development Standards and maintaining M23's Traceability — never product logic itself.

The five Domain-owning Services defined in M18 — Identity & Access, Configuration, Session Generation, Session Experience, and Progress — are conceptually grouped together as a **Domain** area, sitting alongside Applications, AI Components, and Infrastructure, and drawing on Shared Libraries. This grouping is implied by, and consistent with, the eight areas above; it is named explicitly here because M31's five Services are the most consequential and most frequently referenced grouping in this document.

---

# Workspace Boundaries

| Workspace | Responsible For | Must Never |
|---|---|---|
| Applications | Presentation and Application Orchestration, per M19, M20. | Contain Business Rules or Entity Rules, per M16. |
| Domain (five Services) | Identity & Access, Configuration, Session Generation, Session Experience, Progress, per M18. | Contain presentation logic or direct persistence mechanics. |
| Shared Libraries | The Logical Data Objects and cross-cutting rules every Domain Service depends on, per M17, M07–M09. | Contain logic specific to only one Domain Service. |
| AI Components | Topic Generation and Composition Content Generation, per M21. | Be reachable by any workspace other than the Session Generation Service within Domain. |
| Infrastructure | Retaining and returning information exactly as instructed, per M17, M16. | Determine any business outcome. |
| Configuration (technical) | Environment and build-level settings. | Alter, override, or bypass a Business Rule or Entity Rule, per M33. |
| Testing | Verifying every workspace against its Quality Gates, per M34. | Be depended upon by any other workspace at runtime. |
| Tooling | Enforcing Development Standards and Traceability, per M33, M23. | Contain product logic. |

---

# Shared Component Strategy

- Restating M33's Reusability Principles, a component is placed in Shared Libraries only when it is genuinely needed by more than one Domain Service and doing so does not violate any Service's Boundaries.
- The Logical Data Objects defined in M17, and the Entity Rules defined in M07, are the primary legitimate candidates for shared status, since every Domain Service references at least one of them.
- Applications never shares internal state or logic directly with Domain — any information Applications needs from Domain passes through Application Orchestration, per M16's and M19's Dependency Rules, never through a shared library bypassing that boundary.
- Premature sharing is avoided: a component used by only one Domain Service stays with that Service until a second, genuine need arises, consistent with M01's and M33's minimalism.

---

# Dependency Principles

- **Applications** depends only on **Domain**, through Application Orchestration — never directly on Infrastructure or AI Components, per M16's and M20's Dependency Rules.
- **Domain** depends on **Infrastructure** (for retention and retrieval) and, specifically for the Session Generation Service, on **AI Components** — no other Domain Service may depend on AI Components.
- **AI Components** depends on nothing else, and is depended upon only by the Session Generation Service within Domain — never by Applications, Infrastructure, or any other Domain Service, per M21's and M45's boundaries.
- **Infrastructure** depends on nothing.
- **Configuration (technical)** may be referenced by any workspace but must never be a path by which a Business Rule or Entity Rule is altered, per M33.
- **Testing** and **Tooling** may observe and verify every other workspace, but no other workspace may depend on either of them at runtime — this asymmetry keeps verification code from ever becoming load-bearing product behavior.
- **Documentation** has no dependency relationship with any workspace — it is referenced by all of them, but it is never generated from code and never depends on any implementation decision, per M53.

---

# Configuration Strategy

- Two entirely distinct categories of configuration exist, and must never be organized together:
  - **Product Configuration:** English Level, Learning Goal, and Topic Toggle Preference, per M09 — Learner-facing, owned by the Configuration Service within the Domain area.
  - **Technical Configuration:** Environment and build-level settings supporting how the system runs — owned by the Configuration workspace described in Repository Structure above.
- Technical Configuration must never be used to alter, disable, or bypass a Business Rule or Entity Rule defined in M07, M08, or M09, restating M33's Configuration Standards.
- Any technical configuration mechanism that would affect documented product behavior is evaluated through M24's and M42's Change Management Principles before being introduced, exactly as any other product-affecting change would be.
- No specific configuration tool, format, or mechanism is named in this document.

---

# Documentation Traceability

| Workspace | Traces To |
|---|---|
| Applications | M19 (Frontend Architecture), M04, M25–M30 (Screens and Design) |
| Domain | M18 (Service Contracts), M07–M09 (Domain, Logic, Configuration Models) |
| Shared Libraries | M17 (Logical Data Model) |
| AI Components | M21 (AI Integration Architecture), M45 (AI Governance) |
| Infrastructure | M16, M20 (Technical and Backend Architecture), M38 (Deployment Strategy) |
| Configuration (technical) | M33 (Development Standards — Configuration Standards) |
| Testing | M34 (Testing and Quality Strategy) |
| Tooling | M33 (Development Standards), M23 (Verification & Traceability Strategy) |

No workspace exists in this architecture without a corresponding entry in this table; conversely, no milestone describing implementation structure (M16–M22, M31–M34, M38) lacks a corresponding workspace here.

---

# Repository Constraints

- This document chooses no programming language.
- This document chooses no framework.
- This document creates no actual folder or file path — every "workspace" and "area" named above is a logical grouping of responsibility, not a literal directory.
- This document writes no code.
- This document invents no module beyond the nine Implementation Modules already defined in M31; the eight workspaces described here are groupings of those nine modules (plus Testing, Tooling, and Documentation as supporting, non-product areas), never additional product scope.

---

## End Report

### Phase Status
Complete.

### Completed
- Documented a Workspace Philosophy (Separation of Concerns, Modularity, Scalability, Maintainability, Independent Evolution, Testability, Documentation Traceability), each tied to a specific milestone.
- Documented a conceptual Repository Structure across eight logical areas (Applications, Shared Libraries, AI Components, Infrastructure, Configuration, Documentation, Testing, Tooling), explicitly grouping M31's nine Implementation Modules without adding any new one, and a named Domain grouping for the five Services.
- Documented Workspace Boundaries, a Shared Component Strategy, Dependency Principles, a Configuration Strategy explicitly distinguishing Product Configuration from Technical Configuration (per M33), a Documentation Traceability table, and Repository Constraints.

### Files Created
- `docs/engineering/repository-and-workspace-architecture.md`

### Files Modified
- None. M01–M56 and the Engineering Execution Plan were not revisited or altered.

### Pending
- No actual repository, folder, or file structure has been created — this document remains conceptual, per its own rules. The next concrete step, per the Engineering Execution Plan's Infrastructure phase, is selecting an actual technology stack (M32) before any of these logical workspaces can be given a literal form.

### Risks
- This document explicitly names a "Domain" grouping for M31's five Services, which is not a literal ninth or tenth Implementation Module — it is a naming convenience for this repository-organization document only. This should be read as organizational grouping, not as a change to M31's module count.
- The Testing and Tooling workspaces are described as having no product logic and never being depended upon at runtime; this asymmetric dependency rule is new to this document (not stated this way in M31 or M34) but follows directly from those milestones' existing Separation of Concerns and Quality Gate structure, rather than introducing a new principle.

### Open Questions
- None new. No open question from any prior milestone or from the Engineering Execution Plan is resolved, introduced, or altered by this document.
