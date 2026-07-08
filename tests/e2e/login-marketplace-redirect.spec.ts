import { test, expect } from '@playwright/test';

test('Login with locale-prefixed marketplace next lands on marketplace', async ({ page }) => {
  await page.goto('/en/login?next=/en/terminal/marketplace');
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

  await page.getByLabel('Username or email').fill('trader@example.com');
  await page.getByLabel('Password').fill('Password123!');

  await Promise.all([
    page.waitForURL('**/terminal/marketplace**'),
    page.getByRole('button', { name: 'Sign In' }).click(),
  ]);

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
