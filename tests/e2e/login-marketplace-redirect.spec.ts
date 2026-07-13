import { test, expect, type Page } from '@playwright/test';

async function loginAsTrader(page: Page) {
  await page.goto('/en/login?next=/en/terminal/marketplace');
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

  await page.getByLabel('Username or email').fill('trader@example.com');
  await page.getByLabel('Password').fill('Password123!');

  await Promise.all([
    page.waitForURL('**/terminal/**'),
    page.getByRole('button', { name: 'Sign In' }).click(),
  ]);
}

test('Login with locale-prefixed marketplace next lands on marketplace', async ({ page }) => {
  await loginAsTrader(page);

  await expect(page).toHaveURL(/\/terminal\/marketplace($|\/|\?)/);
});

test('Login surfaces invalid credentials inline', async ({ page }) => {
  await page.goto('/en/login?next=/en/terminal/marketplace');
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

  await page.getByLabel('Username or email').fill('trader@example.com');
  await page.getByLabel('Password').fill('wrong-password');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByText('Invalid username/email or password.')).toBeVisible();
  await expect(page).toHaveURL(/\/en\/login\?next=.*terminal\/marketplace/);
});

test('Logout clears the session so protected routes redirect back to login', async ({ page }) => {
  await loginAsTrader(page);

  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/\/login\?logged_out=1$/);
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

  await page.goto('/en/terminal/monitoring');
  await expect(page).toHaveURL(/\/login\?next=.*terminal\/monitoring/);
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
});
