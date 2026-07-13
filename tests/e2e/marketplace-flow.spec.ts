import { test, expect, type Page } from '@playwright/test';

async function registerAndLogin(page: Page, email: string, password: string, displayName: string) {
  await page.goto('/register');
  await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[autocomplete="name"]').fill(displayName);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();

  await page.waitForFunction(() => window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/terminal'), {
    timeout: 30000,
  });

  const currentPath = await page.evaluate(() => window.location.pathname);
  if (currentPath.startsWith('/login')) {
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await page.getByLabel('Username or email').fill(email);
    await page.getByLabel('Password').fill(password);
    await Promise.all([
      page.waitForFunction(() => window.location.pathname.startsWith('/terminal'), { timeout: 30000 }),
      page.getByRole('button', { name: 'Sign In' }).click(),
    ]);
    return;
  }

  await expect(page).toHaveURL(/\/terminal($|\/|\?)/);
}

test('Marketplace → Bot Detail → Subscribe → Dashboard', async ({ page }) => {
  const uniqueId = Date.now();
  const email = `e2e+${uniqueId}@example.com`;
  const password = `E2eTestPass1!${uniqueId}`;
  const displayName = `E2E User ${uniqueId}`;

  await registerAndLogin(page, email, password, displayName);

  await page.goto('/terminal/marketplace');
  await expect(page.getByRole('heading', { name: 'Bot marketplace' })).toBeVisible();
  await expect(page.getByText(/active bots/i)).toBeVisible();

  await page.getByLabel('Search').fill('');
  await page.getByRole('button', { name: 'Apply filters' }).click();
  await page.waitForURL('**/terminal/marketplace**');

  const firstDetail = page.getByRole('link', { name: 'Open bot' }).first();
  await expect(firstDetail).toBeVisible();
  await firstDetail.click();

  await expect(page.getByText('Bot Profile')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Subscribe bot' })).toBeVisible();

  const subscribeButton = page.getByRole('button', { name: 'Subscribe bot' });
  const unsubscribeButton = page.getByRole('button', { name: 'Unsubscribe' });
  await expect(subscribeButton).toBeVisible();
  await expect(unsubscribeButton).toHaveCount(0);

  await page.locator('input[type="checkbox"]').check();
  await expect(subscribeButton).toBeEnabled();

  await subscribeButton.click();
  await expect(page.getByText('Runtime token')).toBeVisible();

  await expect(unsubscribeButton).toBeEnabled();
  await page.once('dialog', (dialog) => dialog.accept());
  await unsubscribeButton.click();
  await expect(page.getByRole('button', { name: 'Subscribe bot' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Unsubscribe' })).toHaveCount(0);

  await page.goto('/terminal');
  await expect(page.getByRole('heading', { name: 'Portfolio Control Center' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Refresh Data' })).toBeVisible();
  await expect(page.locator('text=Active Bot Performance')).toBeVisible();
});

test('Marketplace bot detail shows unsubscribe when viewer subscription already exists', async ({ page }) => {
  const uniqueId = Date.now();
  const email = `viewer-subscribed+${uniqueId}@example.com`;
  const password = `E2eTestPass1!${uniqueId}`;
  const displayName = `Subscribed Viewer ${uniqueId}`;

  await registerAndLogin(page, email, password, displayName);

  await page.goto('/terminal/marketplace/kinetic-alpha-v4');
  await expect(page.getByRole('heading', { name: 'Subscribe bot' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Unsubscribe' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Subscribe bot' })).toHaveCount(0);
});
