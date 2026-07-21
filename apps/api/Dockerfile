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
WORKDIR /repo
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY --from=build /repo/apps/api/generated ./apps/api/generated
COPY --from=build /repo/apps/api/prisma ./apps/api/prisma
COPY --from=build /repo/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
COPY --from=build /repo/apps/api/package.json ./apps/api/package.json
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/api/node_modules ./apps/api/node_modules
WORKDIR /repo/apps/api
EXPOSE 4000
# Applies any pending migrations before the API starts serving traffic —
# safe to run on every container start, since `migrate deploy` only applies
# migrations that have not already been applied.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
