# M10 — Product Content Architecture

**Status:** Draft
**Owner:** Product
**Milestone:** M10
**Source of Truth:** [M01 — Product Vision](./M01-product-vision.md), [M02 — Product Requirements](./M02-product-requirements.md), [M03 — User Personas and Stories](./M03-user-personas-and-stories.md), [M04 — Information Architecture](./M04-information-architecture.md), [M05 — User Flows](./M05-user-flows.md), [M06 — Feature Breakdown](./M06-feature-breakdown.md), [M07 — Domain Model](./M07-domain-model.md), [M08 — AI Learning Engine](./M08-ai-learning-engine.md), [M09 — Configuration Model](./M09-configuration-model.md)

---

# Overview

Where M04 defined the *pages* of Project Fluent and M07 defined its *business entities*, this document defines its **content** — the logical information that exists within the product, grouped into domains, independent of any page, screen, or interface. Content Architecture answers a single question for every piece of information in Version 1: what is it, what does it contain, and who is responsible for it — without any statement of how it looks or where it appears on a page.

---

# Information Domains

Version 1 contains exactly five information domains, each already established in prior milestones:

1. **Authentication Information** — information governing a Learner's access to the product (M02's Authentication requirements, M05's Authentication Flow).
2. **Learner Information** — information identifying the Learner as an individual (M07's Learner entity).
3. **Learning Configuration** — information the Learner sets to shape session generation (M09's Configuration Model).
4. **Learning Session** — information describing a generated unit of practice (M07's Session/Topic entities, M08's Session Composition).
5. **Progress** — information describing the outcome of a Learner's engagement with a Session (M07's Progress Record entity).

No domain exists outside of these five; every information object in this document belongs to exactly one of them.

---

# Information Objects

## Domain: Authentication Information

### Authentication State
- **Purpose:** Represents whether a Learner is currently recognized as signed in, governing access to protected domains.
- **Contains:** The fact of being Signed In or Signed Out for a given Learner.
- **Owned By:** The Learner.
- **Lifecycle:** Signed Out → Signed In (via Account Creation or Sign In) → Signed Out (via Sign Out), per M05's Authentication Flow.
- **Business Rules:** A Learner has exactly one Authentication State at any time. Learner Information, Learning Configuration, Learning Session, and Progress domains are only accessible while Authentication State is Signed In.

---

## Domain: Learner Information

### Learner Identity
- **Purpose:** Represents the Learner as a distinct, registered individual using the product.
- **Contains:** The fact of being a uniquely registered Learner, distinct from every other Learner.
- **Owned By:** Itself — no other information object governs a Learner's existence.
- **Lifecycle:** Registered (at Account Creation) → Active, per M07.
- **Business Rules:** Exactly one Learner Identity exists per account. All other information domains exist only in relation to a Learner Identity.

---

## Domain: Learning Configuration

### English Level
- **Purpose:** Represents the Learner's declared proficiency, used to shape session difficulty.
- **Contains:** One value among A1, A2, B1, B2, C1, C2.
- **Owned By:** The Learner.
- **Lifecycle:** Unconfigured → Configured → Reconfigured, per M09.
- **Business Rules:** Exactly one current value at a time; required before a Session can be generated.

### Learning Goal
- **Purpose:** Represents the Learner's declared purpose, used to shape session context.
- **Contains:** One value among General English, IELTS, Business, Travel, University, Job Interviews.
- **Owned By:** The Learner.
- **Lifecycle:** Unconfigured → Configured → Reconfigured, per M09.
- **Business Rules:** Exactly one current value at a time; required before a Session can be generated.

### Topic Toggle Preference
- **Purpose:** Represents whether the Learner wants one shared Topic across a Session or multiple Topics.
- **Contains:** One value: Enabled or Disabled.
- **Owned By:** The Learner.
- **Lifecycle:** Defaulted → Changed, per M09.
- **Business Rules:** Exactly one current value at a time; always holds a value, so it never blocks Session generation.

---

## Domain: Learning Session

### Session
- **Purpose:** Represents one complete, generated unit of English practice.
- **Contains:** The Learning Configuration values (English Level, Learning Goal, Topic Toggle Preference) that produced it, the Topic(s) it is built around, and its seven Session Composition parts (Reading, Listening, Speaking, Writing, Vocabulary, Grammar, Quiz), per M08.
- **Owned By:** The Learner it was generated for.
- **Lifecycle:** Generated → In Progress → Completed or Abandoned, per M07 and M08.
- **Business Rules:** A Session's contained Learning Configuration values are fixed at generation and never change afterward, even if the Learner's current configuration changes.

### Topic
- **Purpose:** Represents the AI-generated subject matter a Session, or a part of a Session, is built around.
- **Contains:** The subject matter connecting one or more Session Composition parts.
- **Owned By:** The Session it was generated for.
- **Lifecycle:** Generated → Assigned to a Session, per M07.
- **Business Rules:** A Topic belongs to exactly one Session and is never reused across Sessions.

### Session Composition
- **Purpose:** Represents the seven required parts that together make up a complete Session.
- **Contains:** Reading, Listening, Speaking, Writing, Vocabulary, Grammar, and Quiz, per M08's Session Composition.
- **Owned By:** The Session.
- **Lifecycle:** Created together with the Session at Session Creation; each part is worked through during Learning and reaches its own end as the Learner progresses.
- **Business Rules:** All seven parts must be present in every Session; none may be omitted or substituted, per M08's Business Constraints.

---

## Domain: Progress

### Progress Record
- **Purpose:** Represents the recorded outcome of a Learner's engagement with a specific Session.
- **Contains:** The Session it corresponds to, and its outcome — Completed or Incomplete.
- **Owned By:** The Learner, through the Session it corresponds to.
- **Lifecycle:** Pending (Session In Progress) → Recorded (Completed or Incomplete), per M07 and M08.
- **Business Rules:** Exactly one Progress Record exists per Session; its recorded outcome, once set, is immutable.

---

# Information Relationships

- **Authentication State** governs access to all other domains — Learner Information, Learning Configuration, Learning Session, and Progress are only reachable while Authentication State is Signed In.
- **Learner Identity** is the anchor for every other information object — English Level, Learning Goal, Topic Toggle Preference, every Session, and every Progress Record exist only in relation to exactly one Learner Identity.
- **Learning Configuration** (English Level, Learning Goal, Topic Toggle Preference) is read at the moment a **Session** is created and copied into that Session's contained values — the Session does not maintain a live link back to the Learner's current configuration after generation.
- A **Session** contains one or more **Topics**, determined by the Topic Toggle Preference value the Session was created with.
- A **Session** contains exactly one **Session Composition**, made up of its seven fixed parts.
- A **Session** relates to exactly one **Progress Record**, which reflects that Session's outcome.

---

# Information Lifecycle

- **Creation:** Authentication State is created at Account Creation. Learner Identity is created at the same moment. English Level, Learning Goal, and Topic Toggle Preference are created (as Unconfigured/Defaulted) at first Dashboard visit. A Session, its Topic(s), and its Session Composition are created together at Session Creation. A Progress Record is created the moment a Session becomes In Progress.
- **Update:** Authentication State updates on Sign In/Sign Out. English Level, Learning Goal, and Topic Toggle Preference update whenever the Learner changes them. A Progress Record updates once, from Pending to Recorded, when its Session reaches Completed or Abandoned.
- **Use:** English Level, Learning Goal, and Topic Toggle Preference are used every time a Session is created. A Session and its Topic(s)/Session Composition are used throughout the Learning step defined in M08. A Progress Record is used whenever the Dashboard reflects the Learner's last session outcome, per M05.
- **Retirement:** No information object in Version 1 is deliberately deleted or archived by product behavior. A Session, once Completed or Abandoned, is not reopened or reused, but it and its Progress Record remain part of the Learner's information indefinitely, consistent with M07's exclusion of any archival state.

---

# Information Ownership

| Information Object | Owned By |
|---|---|
| Authentication State | Learner |
| Learner Identity | Itself |
| English Level | Learner |
| Learning Goal | Learner |
| Topic Toggle Preference | Learner |
| Session | Learner |
| Topic | Session |
| Session Composition | Session |
| Progress Record | Learner (via Session) |

Ownership here describes which product entity is logically responsible for an information object's existence — not which page displays it or how it is technically stored.

---

# Information Constraints

1. Every information object in Version 1 belongs to exactly one of the five defined Information Domains — no information exists outside Authentication Information, Learner Information, Learning Configuration, Learning Session, or Progress.
2. No Learning Configuration, Learning Session, or Progress information can exist without an associated, Signed In Learner Identity.
3. A Session's contained Learning Configuration values, once set at creation, are immutable for the life of that Session.
4. Every Session has exactly one Session Composition, containing exactly seven parts — never more, never fewer.
5. Every Session has exactly one Progress Record; every Progress Record corresponds to exactly one Session.
6. A Topic exists only as part of exactly one Session and is never independently accessible.

---

# Information Glossary

- **Information Domain:** A logical grouping of related information within the product — Authentication Information, Learner Information, Learning Configuration, Learning Session, or Progress.
- **Information Object:** A distinct unit of information within a domain (e.g., English Level, Session, Progress Record).
- **Authentication State:** Whether a Learner is currently Signed In or Signed Out.
- **Learner Identity:** The distinct, registered individual using the product.
- **English Level, Learning Goal, Topic Toggle Preference:** The three Learning Configuration values, as defined in M09.
- **Session:** The complete, generated unit of practice, containing the configuration that produced it, its Topic(s), and its Session Composition.
- **Topic:** The AI-generated subject matter underlying a Session or part of a Session.
- **Session Composition:** The seven required parts of every Session — Reading, Listening, Speaking, Writing, Vocabulary, Grammar, Quiz.
- **Progress Record:** The recorded outcome (Completed or Incomplete) of a Learner's engagement with a Session.
- **Ownership:** The product entity logically responsible for an information object's existence, independent of storage or display.

---

## Milestone Report

### Milestone Status
Complete.

### Completed
- Identified five Information Domains: Authentication Information, Learner Information, Learning Configuration, Learning Session, and Progress — all already established in M01–M09.
- Defined Information Objects within each domain (Purpose, Contains, Owned By, Lifecycle, Business Rules).
- Documented Information Relationships, Information Lifecycle, Information Ownership, Information Constraints, and an Information Glossary.

### Files Created
- `docs/milestones/M10-content-architecture.md`

### Files Modified
- None. M01–M09 were not revisited or altered.

### Pending
- No further action pending within M10. Awaiting next milestone instructions.

### Risks
- This document reorganizes information already defined in M07 (Domain Model), M08 (AI Learning Engine), and M09 (Configuration Model) under an information-domain lens rather than a business-entity or logic lens. No new information was introduced, but the reframing means some content necessarily overlaps with those milestones by design; where any apparent difference exists, the earlier, immutable milestone governs.
- "Session Composition" is treated here as its own Information Object (distinct from Session) to satisfy this milestone's request for defined Information Objects per domain. M07 did not model it as a separate entity. This is a content-architecture-level grouping, not a new business entity, and should be read as such.

### Open Questions
- None beyond those already raised in M07, M08, and M09 (session history retention, composition-part ordering, minimum engagement per part), which remain open and are not reintroduced here.

Waiting for the next milestone.
