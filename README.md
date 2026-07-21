# Project Fluent

> Working name. Subject to change as the product matures.

## Project Overview

Project Fluent is an AI-powered English learning platform built around a single idea: **learners should never have to decide what to study next.**

Instead of browsing lesson libraries, picking topics, or configuring study plans, a learner opens the app, selects their level and goal, and receives one complete, ready-to-go learning session built around a topic the AI has generated for them. No setup screens. No decision fatigue. No clutter.

## Mission

Build an AI-powered English learning platform where learners never have to decide what to study next.

## Current Stage

**Stage: Engineering Foundation — Platform Bootstrap**

The Version 1 documentation programme (M01–M56, `docs/milestones/`) is complete and closed. Engineering has since produced a full execution plan, repository architecture, technology selection record, and platform scaffold plan (`docs/engineering/`), and this repository now hosts the resulting engineering foundation — a working pnpm/Turborepo monorepo with a Next.js frontend and a NestJS backend. No product/business feature (authentication, database schema, AI, or learning functionality) has been implemented yet; this stage is the foundation those features will be built on top of.

## Folder Structure

```
project-fluent/
├── README.md                      # This file
├── docs/
│   ├── milestones/                # Numbered milestone documents (M01–M56)
│   ├── engineering/                # Execution plan, architecture, ADRs, scaffold plan
│   ├── future/                    # Ideas and directions deferred beyond MVP
│   └── decisions/                 # Architecture/product decision records
├── apps/
│   ├── web/                        # Next.js frontend (Presentation Module)
│   └── api/                        # NestJS backend (Domain/Application layers)
├── packages/
│   ├── config-typescript/          # Shared TypeScript configuration
│   ├── config-eslint/              # Shared ESLint configuration
│   └── config-prettier/            # Shared Prettier configuration
├── prompts/                       # AI prompt design and engineering artifacts
├── scripts/                       # Tooling and automation scripts (future)
├── docker-compose.yml              # Local development environment (Postgres, Redis, apps)
└── .claude/                       # Claude Code configuration
```

See `docs/engineering/engineering-execution-plan.md` for the full implementation roadmap.

## Development Philosophy

- **Documentation before implementation.** Every major product decision is written down and agreed upon before a single line of code is written.
- **Simplicity is a feature.** Every decision — product and process — is evaluated against whether it keeps the experience simple for the learner.
- **Foundations first.** We build production-quality structure, process, and documentation from day one, the way a senior engineering organization would, rather than accumulating shortcuts to unwind later.
- **Incremental, milestone-driven progress.** Work is organized into clearly numbered milestones so progress and reasoning are traceable over time.
- **No premature technical commitments.** Frameworks, databases, and APIs are deliberately not discussed until the product vision and requirements justify specific choices.
