import { test, expect } from '@playwright/test';

test('Admin routes redirect non-admin users', async ({ page }) => {
  await page.context().addCookies([
    { name: 'marcus_access_token', value: 'e2e-token-non-admin', url: 'http://127.0.0.1:3001' },
    { name: 'marcus_role', value: 'TRADER', url: 'http://127.0.0.1:3001' },
    { name: 'marcus_username', value: 'E2E Trader', url: 'http://127.0.0.1:3001' },
  ]);

  await page.goto('/terminal/admin');

  await expect(page).toHaveURL(/\/terminal($|\/|\?)/);
});
