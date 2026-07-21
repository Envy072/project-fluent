# Project Fluent — Web (Next.js) development/production image
# Built from the repository root context so the pnpm workspace resolves correctly.

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages ./packages
COPY apps/web ./apps/web
RUN pnpm install --frozen-lockfile --filter @project-fluent/web...

FROM deps AS build
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @project-fluent/web... build

# Next's standalone output (per next.config.mjs's output: 'standalone') is
# self-contained as long as its internal relative directory structure is
# preserved when copied — its node_modules symlinks are relative paths
# (e.g. apps/web/node_modules/next -> ../../../node_modules/.pnpm/...) that
# only resolve correctly if the whole tree is copied as one unit, rather than
# reassembled from fragments.
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /repo/standalone
COPY --from=build /repo/apps/web/.next/standalone/. ./
COPY --from=build /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /repo/apps/web/public ./apps/web/public
EXPOSE 3100
ENV PORT=3100
ENV HOSTNAME=0.0.0.0
CMD ["node", "apps/web/server.js"]
