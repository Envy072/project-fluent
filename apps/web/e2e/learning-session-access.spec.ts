import { test, expect } from '@playwright/test';
import { E2E_TEST_EMAIL, E2E_TEST_PASSWORD } from './global-setup';

/**
 * Learning Session Page access rules (Sprint 6, M25's Context-Dependent
 * access: authenticated AND a Session must exist). Covers the guard
 * behavior only — the Generate → Session flow itself requires a real
 * Anthropic API call and is verified via the mocked-AI backend integration
 * tests instead (see apps/api/test/learning-engine.integration.test.ts).
 */

test('redirects an unauthenticated visitor from /session to /login', async ({ page }) => {
  await page.goto('/session');
  await expect(page).toHaveURL(/\/login/);
});

test('redirects an authenticated Learner with no active Session back to the Dashboard', async ({
  page,
}) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(E2E_TEST_EMAIL);
  await page.getByLabel('Password').fill(E2E_TEST_PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto('/session');
  await expect(page).toHaveURL(/\/dashboard/);
});
