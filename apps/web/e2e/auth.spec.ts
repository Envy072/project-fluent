import { test, expect } from '@playwright/test';
import { E2E_TEST_EMAIL, E2E_TEST_PASSWORD } from './global-setup';

test.describe('route protection', () => {
  test('redirects an unauthenticated visitor from /dashboard to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('authentication flow', () => {
  test('logs in with valid credentials and reaches the protected dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(E2E_TEST_EMAIL);
    await page.getByLabel('Password').fill(E2E_TEST_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText(E2E_TEST_EMAIL)).toBeVisible();
  });

  test('rejects invalid credentials and stays on the login page', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(E2E_TEST_EMAIL);
    await page.getByLabel('Password').fill('wrong-password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Invalid email or password.')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('signs out and returns to the Landing Page, per M04', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(E2E_TEST_EMAIL);
    await page.getByLabel('Password').fill(E2E_TEST_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page).toHaveURL('http://localhost:3100/');
    await expect(page.getByRole('heading', { name: 'Project Fluent' })).toBeVisible();

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
