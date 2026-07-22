import { defineConfig, devices } from '@playwright/test';

const DATABASE_URL =
  process.env.DATABASE_URL ??
  'postgresql://fluent:fluent_dev_password@localhost:5432/project_fluent';
const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET ?? 'e2e-test-secret-do-not-use-in-production';
const ANTHROPIC_API_KEY =
  process.env.ANTHROPIC_API_KEY ?? 'e2e-test-anthropic-key-do-not-use-in-production';
const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [['list']],
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: 'http://localhost:3100',
  },
  webServer: [
    {
      // Requires the `postgres` service (docker-compose) to already be
      // running — the same precondition apps/api's integration tests have.
      command: 'pnpm --filter @project-fluent/api build && pnpm --filter @project-fluent/api start',
      cwd: '../..',
      url: `${API_URL}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        DATABASE_URL,
        AUTH_JWT_SECRET,
        ANTHROPIC_API_KEY,
        PORT: '4000',
      },
    },
    {
      command: 'pnpm start',
      url: 'http://localhost:3100',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: {
        API_URL,
        NEXTAUTH_URL: 'http://localhost:3100',
        NEXTAUTH_SECRET:
          process.env.NEXTAUTH_SECRET ?? 'e2e-test-nextauth-secret-do-not-use-in-production',
      },
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
