# Production Deployment Guide

**Status**: Sprint 9 deliverable. Documents the cloud-account-independent
deployment foundation built in Sprint 9 (Phase 9, adjusted scope — see the
Sprint 9 design review and its approval). No real AWS or Vercel account
exists yet; every mechanism described here runs today against a local
Docker Compose **rehearsal target** standing in for that future cloud
target, exactly as M38 defines the Deployment Lifecycle. Terraform and any
real AWS resources (ECS, RDS, ElastiCache, S3, VPC) are explicitly
out of scope until a production cloud account exists — that is a future
sprint, per ADR-010.

## 1. What "deployment" means today vs. later

| | Today (Sprint 9) | Later (future Terraform sprint) |
|---|---|---|
| Deployment target | This repo's own images, run via `docker compose` on the GitHub Actions runner | AWS ECS Fargate (API) + Vercel (Web), per ADR-010 |
| Image registry | GHCR (`ghcr.io/<owner>/<repo>`), authenticated with the automatically-provided `GITHUB_TOKEN` — no extra credentials needed | Same GHCR images, deployed to the real target |
| What changes to go live for real | Nothing upstream of "Execution" — only the Execution job's final deploy step swaps from `docker compose up -d` to a real ECS/Vercel deploy call | — |

This split is intentional: every other stage of the Deployment Lifecycle
(build, environment validation, verification, operational validation,
rollback) is identical whether the target is a local rehearsal or a real
cloud account, so building and proving it now is not wasted work once a
cloud account exists.

## 2. The Deployment Lifecycle (M38), as implemented

`.github/workflows/deploy.yml` is a manually-triggered
(`workflow_dispatch`) workflow with six jobs mapping 1:1 to M38's six
Deployment Lifecycle stages:

1. **Preparation** — checks out the requested ref and re-runs Quality
   Gates 1-3 (M34): lint, typecheck, build, unit tests, e2e tests, format
   check. A deployment never proceeds on a ref that hasn't passed the same
   gates required for any other change.
2. **Environment Validation** — runs `scripts/deploy/validate-environment.sh`
   to confirm every variable the deployment target needs is actually
   present before anything is built or started.
3. **Execution** — builds and pushes versioned API/Web images to GHCR
   (tagged with the deploying commit's SHA, plus a rolling `:latest`),
   then starts the rehearsal target running those exact images via
   `docker-compose.deploy-rehearsal.yml`.
4. **Verification** — runs `scripts/deploy/smoke-test.sh` against the
   running target, confirming both services respond successfully.
5. **Operational Validation** — confirms Docker's own `HEALTHCHECK` reports
   `healthy` for both services, and confirms Sprint 7's structured
   observability events (`"event":"http.request.completed"`) are actually
   present in the API's logs — proof the deployed system is not just
   "up" but behaving as the rest of the platform expects.
6. **Completion** — tears down the rehearsal target and writes a summary
   (image tags, target, rollback instructions) to the workflow run.

Trigger it from the Actions tab (or `gh workflow run deploy.yml`), with an
optional `ref` input (defaults to `main`).

## 3. Rollback

`.github/workflows/rollback.yml` is a separate, manually-triggered
workflow (required `image_tag` input — the git SHA a previous deployment
was built from). Rollback is always a deliberate action, never automatic,
per M37's Rollback Principles.

It calls `scripts/deploy/rollback.sh`, which:

1. Computes `API_IMAGE`/`WEB_IMAGE` from `IMAGE_REGISTRY` and the
   requested tag.
2. Pulls those exact images and starts them via the same
   `docker-compose.deploy-rehearsal.yml` used by `deploy.yml`.
3. Re-runs `scripts/deploy/smoke-test.sh` to prove the rolled-back
   version is genuinely healthy before declaring the rollback complete.

Locally verified (Sprint 9): the compose file's variable substitution and
the script's image-reference computation are correct, and the "pull a
known tag → bring the target up → smoke test" path is exactly the path
already proven by the `deploy.yml` rehearsal run — a live pull against a
real pushed GHCR tag can only be exercised once real deployments exist
to roll back to.

## 4. `DEPLOYMENT_ENVIRONMENT` vs `NODE_ENV`

Two separate variables gate two separate concerns — do not conflate them:

- **`NODE_ENV`** is Node/Next.js's own runtime-optimization switch
  (`production` enables production builds, disables dev-only warnings,
  etc.). It is baked into `apps/api/Dockerfile` and `apps/web/Dockerfile`
  regardless of where the resulting image actually runs — including a
  purely local rehearsal of the production build.
- **`DEPLOYMENT_ENVIRONMENT`** (`local` | `ci` | `staging` | `production`)
  is the real signal for "is this an actual production deployment."
  Only when it equals `production` does the application refuse to start
  with a secret that still matches a known development/CI placeholder
  pattern (`dev-only`, `ci-only`, `local-dev`, `placeholder`,
  `do-not-use-in-production`) — see
  `apps/api/src/config/environment-variables.ts` and
  `apps/web/lib/environment-variables.ts`.

This split exists because `NODE_ENV=production` is required to even run
the production Docker build locally (as `docker-compose.yml` and the
deploy rehearsal both do, with placeholder secrets) — keying the
placeholder-secret rejection off `NODE_ENV` would make local rehearsal of
the production build impossible.

**Rule of thumb**: `DEPLOYMENT_ENVIRONMENT=production` must only ever be
set for a real, deliberate production deployment. Every other context —
local development, CI, and the deploy/rollback rehearsal target — uses
`local` or `ci`.

## 5. Required production environment variables

See `.env.production.example` for the full, authoritative list with
placeholders. Summary:

| Variable | Where used | Notes |
|---|---|---|
| `DEPLOYMENT_ENVIRONMENT=production` | API + Web | Must be set for a real deployment; gates placeholder-secret rejection |
| `DATABASE_URL` | API | Real production Postgres connection string; provisioning deferred to the future Terraform sprint |
| `REDIS_URL` | API | Documented for the future; no application code consumes it yet (see Sprint 9 design review, Finding 5) |
| `AUTH_JWT_SECRET`, `AUTH_JWT_EXPIRES_IN` | API | Real secret, generated with `openssl rand -base64 32`, never reused from a lower environment |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | API | Real key (ADR-003); Session Generation will not function without it |
| `WEB_APP_URL` | API | Real production frontend origin, used for CORS |
| `NEXT_PUBLIC_API_URL` | Web | Browser-facing API origin — inlined at **build** time, cannot change at container runtime |
| `API_URL` | Web | Server-side API origin the Next.js server itself calls |
| `NEXTAUTH_URL`, `NEXTAUTH_SECRET` | Web | Real frontend origin and a real, unique secret (must differ from `AUTH_JWT_SECRET`, per ADR-005) |

None of these have real values committed anywhere. Today they live as
GitHub Actions encrypted secrets for the rehearsal target's own CI-only
placeholders; a real production deployment will source them from AWS
Secrets Manager, SSM Parameter Store, or Vercel's environment variables
dashboard once that account exists.

## 6. Environment validation

Two independent layers validate configuration before anything starts
serving traffic:

- **Application-level** (`apps/api/src/config/environment-variables.ts`,
  `apps/web/instrumentation.ts` + `apps/web/lib/environment-variables.ts`):
  runs inside the process itself at boot. Missing or malformed variables
  throw immediately; a `production`-tagged deployment with a placeholder
  secret is explicitly refused. The web app additionally calls
  `process.exit(1)` on failure — Next.js's standalone server does not
  exit on its own when `instrumentation.ts`'s `register()` throws, so
  this is required to get real fail-fast behavior a container
  orchestrator can detect.
- **Pipeline-level** (`scripts/deploy/validate-environment.sh`): runs as
  the Deployment Lifecycle's dedicated Environment Validation stage,
  before any image is built or started, so a missing variable is caught
  before spending time on a build that would fail to boot anyway.

## 7. Docker production hardening

Both `apps/api/Dockerfile` and `apps/web/Dockerfile`'s runner stages
include:

- `tini` as PID 1 (`ENTRYPOINT ["/sbin/tini", "--"]`) for correct SIGTERM
  forwarding and zombie reaping during graceful shutdown.
- The non-root `node` user (all `COPY` instructions use
  `--chown=node:node`, and the runner stage sets `USER node`).
- A Docker `HEALTHCHECK` instruction (using Node's own `http` module, so
  no extra `curl`/`wget` package is needed in the alpine image), which is
  what `deploy.yml`'s Operational Validation stage inspects.

## 8. What's explicitly deferred

Per the approved Sprint 9 scope adjustment, none of the following exist
yet and are out of scope until a real production cloud account is
finalized:

- Terraform / any Infrastructure-as-Code for AWS resources (ECS, RDS,
  ElastiCache, S3, VPC, networking)
- A real AWS account, real Vercel project, or any real production secret
- Datadog wiring (ADR-011) — structured JSON logs already ship to stdout,
  ready for an Agent to tail once a Datadog account exists
- Any application code that consumes `REDIS_URL` (Redis is provisioned
  locally but currently unused by the app — Sprint 9 design review,
  Finding 5)

When that future sprint arrives, only the Execution stage's final deploy
step in `deploy.yml` needs to change; everything documented here carries
over unchanged.
