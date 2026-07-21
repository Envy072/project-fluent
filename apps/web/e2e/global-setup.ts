/**
 * Ensures a fixed end-to-end test account exists before the Playwright
 * suite runs, calling the real Identity & Access API directly (there is no
 * registration UI in this sprint's scope — only the Login page).
 * Requires the `postgres` service (docker-compose) and the API itself to be
 * reachable; the API is started by Playwright's own webServer config.
 */
const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export const E2E_TEST_EMAIL = 'e2e-test-user@example.com';
export const E2E_TEST_PASSWORD = 'correct-horse-battery-staple';

export default async function globalSetup(): Promise<void> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: E2E_TEST_EMAIL, password: E2E_TEST_PASSWORD }),
  });

  if (!response.ok && response.status !== 409) {
    throw new Error(
      `Failed to provision the e2e test account: ${response.status} ${await response.text()}`,
    );
  }
}
