import { defineConfig } from 'prisma/config';

// Used by the Prisma CLI (migrate/generate) only — application code connects
// via the PrismaPg driver adapter in src/prisma/prisma.service.ts instead.
//
// `prisma generate` validates this file even though it never touches the
// database, so a placeholder is used when DATABASE_URL is not set (e.g.
// during a fresh `pnpm install`). Real commands (`migrate dev`/`deploy`)
// require the actual DATABASE_URL to be set in the environment.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url:
      process.env.DATABASE_URL ?? 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
  },
});
