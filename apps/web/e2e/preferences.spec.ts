import { test, expect } from '@playwright/test';

/**
 * Learning Configuration Foundation (Sprint 3, M09), now hosted directly on
 * the Dashboard (Sprint 6, M04/M25: "Settings are hosted on the Dashboard
 * itself" — there is no separate Settings page). Exercises the full
 * create → read → update → delete lifecycle through the real browser and
 * the real API, using a dedicated test account so this file can run
 * independently of auth.spec.ts's shared fixture without racing it.
 */
const PREFERENCES_TEST_EMAIL = 'e2e-preferences-user@example.com';
const PREFERENCES_TEST_PASSWORD = 'correct-horse-battery-staple';

test.describe.serial('learning configuration on the Dashboard', () => {
  test.beforeAll(async () => {
    const API_URL = process.env.API_URL ?? 'http://localhost:4000';
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: PREFERENCES_TEST_EMAIL,
        password: PREFERENCES_TEST_PASSWORD,
      }),
    });
    if (!response.ok && response.status !== 409) {
      throw new Error(`Failed to provision the preferences test account: ${response.status}`);
    }
  });

  async function login(page: import('@playwright/test').Page) {
    await page.goto('/login');
    await page.getByLabel('Email').fill(PREFERENCES_TEST_EMAIL);
    await page.getByLabel('Password').fill(PREFERENCES_TEST_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  }

  test('shows the Learning Configuration section on the Dashboard itself', async ({ page }) => {
    await login(page);
    await expect(page.getByRole('heading', { name: 'Learning Configuration' })).toBeVisible();
  });

  test('creates a configuration for the first time', async ({ page }) => {
    await login(page);

    await page.getByLabel('English Level').selectOption('B1');
    await page.getByLabel('Learning Goal').selectOption('IELTS');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Your learning preferences have been saved.')).toBeVisible();
  });

  test('persists the saved configuration across a reload', async ({ page }) => {
    await login(page);

    await expect(page.getByLabel('English Level')).toHaveValue('B1');
    await expect(page.getByLabel('Learning Goal')).toHaveValue('IELTS');
  });

  test('updates the configuration', async ({ page }) => {
    await login(page);

    await page.getByLabel('English Level').selectOption('C1');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Your learning preferences have been saved.')).toBeVisible();

    await page.reload();
    await expect(page.getByLabel('English Level')).toHaveValue('C1');
  });

  test('deletes the configuration and returns to the empty state', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: 'Delete Preferences' }).click();
    await page.getByRole('button', { name: 'Confirm Delete' }).click();
    await expect(page.getByText('Your learning preferences have been deleted.')).toBeVisible();

    await page.reload();
    await expect(page.getByRole('button', { name: 'Delete Preferences' })).toHaveCount(0);
  });
});
