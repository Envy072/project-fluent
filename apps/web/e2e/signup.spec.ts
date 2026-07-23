import { test, expect } from '@playwright/test';

/**
 * Sign Up Page (Sprint 6, M04/M26): creates a new Learner Identity and
 * moves directly to the Dashboard, with no intermediate step, per M13's
 * System Responses. Uses a randomized email per run so repeated test runs
 * never collide with a previously created account.
 */
function uniqueSignUpEmail(): string {
  return `e2e-signup-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`;
}

const PASSWORD = 'correct-horse-battery-staple';

test('creates an account and moves directly to the Dashboard', async ({ page }) => {
  const email = uniqueSignUpEmail();

  await page.goto('/signup');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText(email)).toBeVisible();
});

test('rejects creating a second account with the same email', async ({ page }) => {
  const email = uniqueSignUpEmail();

  await page.goto('/signup');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.getByRole('button', { name: 'Sign Out' }).click();
  await expect(page).toHaveURL('http://localhost:3100/');

  await page.goto('/signup');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page).toHaveURL(/\/signup/);
  await expect(page.getByRole('alert')).toBeVisible();
});

test('cross-navigates between Sign Up and Sign In without returning to the Landing Page', async ({
  page,
}) => {
  await page.goto('/signup');
  await page.getByRole('link', { name: 'Already have an account? Sign In' }).click();
  await expect(page).toHaveURL(/\/login/);

  await page.getByRole('link', { name: "Don't have an account? Sign Up" }).click();
  await expect(page).toHaveURL(/\/signup/);
});
