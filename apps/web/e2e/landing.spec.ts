import { test, expect } from '@playwright/test';

test('landing page introduces the product and offers Sign Up and Sign In', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Project Fluent' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
});

test('landing page links lead to Sign Up and Sign In', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Sign Up' }).click();
  await expect(page).toHaveURL(/\/signup/);

  await page.goto('/');
  await page.getByRole('link', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/login/);
});
