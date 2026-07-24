# Project Fluent — API (NestJS) development/production image
# Built from the repository root context so the pnpm workspace resolves correctly.

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages ./packages
COPY apps/api ./apps/api
RUN pnpm install --frozen-lockfile --filter @project-fluent/api...

FROM deps AS build
RUN pnpm --filter @project-fluent/api... build

FROM base AS runner
ENV NODE_ENV=production
# tini becomes PID 1 so SIGTERM (sent by Docker/ECS during a graceful stop
# or rolling deploy) is forwarded correctly to the Node process — Node
# itself does not handle being PID 1 properly, per M38's "Minimal User
# Disruption" and Recovery Principles.
RUN apk add --no-cache tini
WORKDIR /repo
COPY --from=build --chown=node:node /repo/apps/api/dist ./apps/api/dist
COPY --from=build --chown=node:node /repo/apps/api/generated ./apps/api/generated
COPY --from=build --chown=node:node /repo/apps/api/prisma ./apps/api/prisma
COPY --from=build --chown=node:node /repo/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
COPY --from=build --chown=node:node /repo/apps/api/package.json ./apps/api/package.json
COPY --from=build --chown=node:node /repo/node_modules ./node_modules
COPY --from=build --chown=node:node /repo/apps/api/node_modules ./apps/api/node_modules
WORKDIR /repo/apps/api
USER node
EXPOSE 4000
# Confirms the container itself — not just an external monitor — can
# report its own health, per M36's Rapid Detection principle.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health',(r)=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
ENTRYPOINT ["/sbin/tini", "--"]
# Applies any pending migrations before the API starts serving traffic —
# safe to run on every container start, since `migrate deploy` only applies
# migrations that have not already been applied.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
