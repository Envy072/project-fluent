import { test, expect } from '@playwright/test';

test('landing page shows the engineering foundation message', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Project Fluent' })).toBeVisible();
  await expect(page.getByText('Engineering Foundation Running')).toBeVisible();
});
