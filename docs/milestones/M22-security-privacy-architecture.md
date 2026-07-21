# M22 — Security & Privacy Architecture

**Status:** Draft
**Owner:** Product / Architecture
**Milestone:** M22
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md) through [M21 — AI Integration Architecture](./M21-ai-integration-architecture.md)

---

# Overview

The Security & Privacy Architecture defines the conceptual responsibilities and boundaries that keep every Learner's information safe and private across Project Fluent's architecture. It consolidates and extends the Security and Privacy Principles first introduced in M15, mapping them onto the layered architecture defined in M16 and elaborated in M19–M21. It contains no protocol, mechanism, or technology — only the conceptual guarantees the system must uphold and which conceptual layer is responsible for upholding them.

---

# Security Principles

Consistent with M15, the following security principles apply across the entire system:

- Only a Learner whose Authentication State is Signed In may access their own information — never another Learner's.
- Authentication State, per M14 and M18, is the sole gate to every protected capability; no capability may be reached by circumventing it.
- No Learner's Configuration, Session, or Progress information is ever accessible to another Learner, under any circumstance.
- Security must never depend on a Learner's own behavior or good faith — every protected capability is structurally gated, per M20's Business Processing Responsibilities, not merely presented as restricted.

---

# Privacy Principles

Consistent with M15, the following privacy principles apply across the entire system:

- Only information necessary to support the capabilities already defined in M01–M21 is ever collected or used — nothing is gathered for undefined future use, per M01's principle that every input must earn its place.
- A Learner's Configuration, Session content, and Progress are personal to them and must be handled with the same care as any other personal record.
- Privacy is upheld by minimizing what any part of the system — including the AI Layer — is given access to, not solely by restricting who can view it after the fact.

---

# Identity Responsibilities

- The system must be able to uniquely establish and distinguish one Learner Identity from every other, per M07 and M17.
- Every piece of Configuration, Session, or Progress information must be associated with exactly one Learner Identity — never zero, never more than one, per M17's Data Integrity Rules.
- A Learner's identity must never be inferred, merged, or shared across what the Learner has explicitly established through Account Creation, per M18's CreateAccount operation.
- No protocol, credential format, or identity mechanism is defined here — identity is described only as the conceptual guarantee of uniqueness and ownership already established in M07.

---

# Access Responsibilities

- Every protected Service Operation defined in M18 (Configuration, Session Generation, Session Experience, Progress) must confirm the requesting Learner's Authentication State is Signed In before proceeding, per M20's Application Layer responsibilities.
- Access to a Learner's Configuration, Sessions, or Progress must always be scoped to that specific Learner — no operation may return or act on another Learner's information, per M07's ownership rules.
- The Dashboard (Learner Hub concept, per M14 and M18) must only ever compose and present information belonging to the currently Signed In Learner.
- Access responsibilities apply uniformly regardless of which Functional Area (per M13) is involved — there is no capability in Version 1 exempt from Authentication State gating other than Account Creation and Sign In themselves.

---

# Data Protection Responsibilities

- Every Logical Data Object defined in M17 must be protected such that only the Domain Layer, acting on behalf of the correctly identified and authenticated Learner, may retrieve or change it, per M20's layering.
- The Persistence Layer must never expose retained information except through the Domain Layer's instruction, per M16's and M20's Dependency Rules — there is no path by which retained information is reachable without passing through access-gated business logic.
- A Learner's information must never be exposed as a side effect of fulfilling another Learner's request — each request's results are scoped exclusively to its own, authenticated Learner.
- No encryption method, storage technology, or protection mechanism is defined in this document; data protection here refers only to the conceptual guarantee that information is never exposed outside its owning Learner's access.

---

# AI Privacy Responsibilities

- Consistent with M21's AI Input Concepts, the AI Layer must only ever receive the Learner's current English Level, Learning Goal, Topic Toggle Preference, and, where applicable, already-generated Topic(s) — never the Learner's identity, account details, Authentication State, Session history, or Progress outcomes.
- The AI Layer must never be able to associate the content it generates with a specific Learner Identity — its role, per M21, is limited to producing Topic and Session Composition content from the minimal Configuration inputs it is given.
- Privacy toward the AI Layer is upheld through data minimization: the AI Layer is structurally given no more information than is strictly required to fulfill its AI Responsibilities, per M21.
- No AI-specific privacy mechanism, provider behavior, or data-handling technology is defined in this document — only the conceptual boundary of what the AI Layer may and may never receive.

---

# Security Boundaries

| Layer | Security & Privacy Responsibility |
|---|---|
| **Frontend (Presentation, per M19)** | Reflects the Learner's Authentication State for navigation purposes only; never treated as the authoritative access control mechanism. |
| **Application Layer (per M16, M20)** | Authoritatively confirms Authentication State before allowing any request to proceed to the Domain Layer — the true point of access gating. |
| **Domain Layer (per M16, M20)** | Enforces that every operation acts only on the correctly identified, authenticated Learner's own Configuration, Session, and Progress information, per M07's ownership rules. |
| **Persistence Layer (per M16, M20)** | Retains each Learner's information distinctly and never returns it except at the Domain Layer's instruction; never exposes one Learner's information while fulfilling another's request. |
| **AI Layer (per M21)** | Receives only the minimal Configuration and Topic concepts required to generate content; never receives Learner identity or any other personal information. |

This table remains fully consistent with the layer definitions and boundaries already established in M19, M20, and M21.

---

# Security Constraints

The following must always remain true, regardless of implementation:

1. No Learner's Configuration, Session, or Progress information is ever accessible to another Learner, under any request or condition.
2. Every protected Service Operation, per M18, authoritatively confirms Authentication State before proceeding — this confirmation is never optional and never solely a frontend concern.
3. The Persistence Layer is never reachable except through the Domain Layer's instruction, per M16 and M20.
4. The AI Layer never receives Learner identity or any information beyond the Configuration and Topic concepts defined in M21.
5. Every request's results are scoped exclusively to the authenticated Learner who made it — no operation returns or acts upon another Learner's data as a byproduct.
6. No security or privacy responsibility defined in this document may be satisfied by adding a new feature, setting, or exposed piece of information beyond what M01–M21 already establish.

---

# Security & Privacy Glossary

- **Learner Identity:** The unique, distinct representation of a registered individual, per M07 and M17, to which all their information is exclusively associated.
- **Authentication State:** The Signed In or Signed Out indicator that gates access to protected capability, per M10 and M14.
- **Access Gating:** The authoritative confirmation, performed by the Application Layer, that a request's Authentication State permits it to proceed.
- **Data Ownership:** The principle that every piece of Configuration, Session, and Progress information belongs to exactly one Learner and is never accessible to another.
- **Data Minimization:** The principle of providing any part of the system — particularly the AI Layer — with no more information than is strictly necessary to fulfill its defined responsibilities.
- **Protected Information:** Any Logical Data Object (per M17) whose access is restricted to its owning, authenticated Learner.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Restated and extended M15's Security and Privacy Principles at an architectural level, ensuring full consistency.
- Defined Identity Responsibilities, Access Responsibilities, Data Protection Responsibilities, and AI Privacy Responsibilities, each grounded in concepts already established in M07, M14, M17, M18, M20, and M21.
- Documented a Security Boundaries table mapping responsibility across the Frontend, Application, Domain, Persistence, and AI Layers, consistent with M19–M21.
- Documented Security Constraints that must always remain true and a Security & Privacy Glossary.

### Files Created
- `docs/milestones/M22-security-privacy-architecture.md`

### Files Modified
- None. M01–M21 were not revisited or altered.

### Pending
- No further action pending within M22. Awaiting next milestone instructions.

### Risks
- This document deliberately avoids naming any security mechanism (no authentication protocol, token format, or transport-security concept), per the milestone's explicit restrictions. As a result, "Authentication State" and "Access Gating" are described purely as conceptual guarantees; a future, more technical milestone will need to determine how these guarantees are actually enforced.
- The AI Privacy Responsibilities section relies entirely on M21's already-defined AI Input Concepts as the boundary of what the AI Layer may receive; no new restriction was introduced, only a restatement through a privacy lens.

### Open Questions
- None beyond those already raised in earlier milestones, which remain open and are not reintroduced here.

Waiting for the next milestone.
