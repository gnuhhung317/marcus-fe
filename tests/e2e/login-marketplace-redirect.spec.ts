import { test, expect } from '@playwright/test';

test('Login with marketplace next lands on marketplace', async ({ page }) => {
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        accessToken: 'e2e-access-token',
        refreshToken: 'e2e-refresh-token',
        role: 'TRADER',
        username: 'E2E Trader',
        accessTokenExpiresInSeconds: 3600,
        refreshTokenExpiresInSeconds: 604800,
      }),
    });
  });

  await page.goto('/login?next=/terminal/marketplace');
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

  await page.getByLabel('Username or email').fill('trader@example.com');
  await page.getByLabel('Password').fill('Password123!');

  await Promise.all([
    page.waitForURL('**/terminal/marketplace**'),
    page.getByRole('button', { name: 'Sign In' }).click(),
  ]);

  await expect(page).toHaveURL(/\/terminal\/marketplace($|\/|\?)/);
});
