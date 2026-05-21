import { test, expect } from '@playwright/test';

test('Decision Dashboard smoke: load, filter, search, refresh', async ({ page }) => {
  const uniqueId = Date.now();
  const email = `e2e+decision-${uniqueId}@example.com`;
  const password = `E2eTestPass1!${uniqueId}`;
  const displayName = `E2E Decision ${uniqueId}`;

  await page.goto('/register');
  await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Display name').fill(displayName);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();

  await page.waitForFunction(
    () => window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/terminal'),
    { timeout: 30000 }
  );

  const currentPath = await page.evaluate(() => window.location.pathname);
  if (currentPath.startsWith('/login')) {
    await expect(page.getByRole('heading', { name: 'Sign in to continue' })).toBeVisible();
    await page.getByLabel('Username or email').fill(email);
    await page.getByLabel('Password').fill(password);
    await Promise.all([
      page.waitForFunction(() => window.location.pathname.startsWith('/terminal'), { timeout: 30000 }),
      page.getByRole('button', { name: 'Sign In' }).click(),
    ]);
  }

  await page.goto('/terminal/decision');

  await expect(page.getByRole('heading', { name: 'Decision Dashboard' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your Subscriptions' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'All Bots' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Active' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'At-Risk' })).toBeVisible();

  await page.getByRole('button', { name: 'At-Risk' }).click();
  await expect(page.getByRole('button', { name: 'At-Risk' })).toBeVisible();

  const searchInput = page.getByPlaceholder('Search bot name...');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('btc');

  const refreshButton = page.getByRole('button', { name: 'Refresh' });
  await expect(refreshButton).toBeVisible();
  await refreshButton.click();

  await expect(page.locator('text=Last updated:')).toBeVisible();
});
