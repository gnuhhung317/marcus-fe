import { test, expect } from '@playwright/test';

test('Marketplace → Bot Detail → Subscribe → Dashboard', async ({ page }) => {
  const uniqueId = Date.now();
  const email = `e2e+${uniqueId}@example.com`;
  const password = `E2eTestPass1!${uniqueId}`;
  const displayName = `E2E User ${uniqueId}`;

  await page.goto('/register');
  await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Display name').fill(displayName);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();

  await page.waitForFunction(() => window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/terminal'), {
    timeout: 30000,
  });

  const currentPath = await page.evaluate(() => window.location.pathname);
  if (currentPath.startsWith('/login')) {
    await expect(page.getByRole('heading', { name: 'Sign in to continue' })).toBeVisible();
    await page.getByLabel('Username or email').fill(email);
    await page.getByLabel('Password').fill(password);
    await Promise.all([
      page.waitForFunction(() => window.location.pathname.startsWith('/terminal'), { timeout: 30000 }),
      page.getByRole('button', { name: 'Sign In' }).click(),
    ]);
  } else {
    await expect(page).toHaveURL(/\/terminal($|\/|\?)/);
  }

  await page.goto('/terminal/marketplace');
  await expect(page.getByRole('heading', { name: 'Strategy Marketplace' })).toBeVisible();
  const marketplaceHits = page.locator('article:has-text("View Detail")');
  await expect(await marketplaceHits.count()).toBeGreaterThan(0);

  await page.getByLabel('Search').fill('');
  await page.getByRole('button', { name: 'Apply Filters' }).click();
  await page.waitForURL('**/terminal/marketplace**');

  const firstDetail = page.locator('text=View Detail').first();
  await expect(firstDetail).toBeVisible();
  await firstDetail.click();

  await expect(page.getByText('Bot Profile')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Subscribe Bot' })).toBeVisible();

  const subscribeButton = page.getByRole('button', { name: 'Subscribe Bot' });
  await expect(subscribeButton).toBeDisabled();

  await page.locator('input[type="checkbox"]').check();
  await expect(subscribeButton).toBeEnabled();

  await subscribeButton.click();
  await expect(page.locator('text=Subscription Status')).toBeVisible();
  await expect(page.locator('p:has-text("SUBSCRIBED")')).toBeVisible();

  const unsubscribeButton = page.getByRole('button', { name: 'Unsubscribe' });
  await expect(unsubscribeButton).toBeEnabled();
  await unsubscribeButton.click();
  await expect(page.locator('p:has-text("UNSUBSCRIBED")')).toBeVisible();

  await page.goto('/terminal');
  await expect(page.getByRole('heading', { name: 'Portfolio Control Center' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Refresh Data' })).toBeVisible();
  await expect(page.locator('text=Active Bot Performance')).toBeVisible();
});
