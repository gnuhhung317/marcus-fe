# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: marketplace-flow.spec.ts >> Marketplace → Bot Detail → Subscribe → Dashboard
- Location: tests\e2e\marketplace-flow.spec.ts:3:5

# Error details

```
Test timeout of 60000ms exceeded.
```

```
TimeoutError: page.waitForFunction: Timeout 15000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - generic [ref=e4]:
      - link "Marcus Trading home" [ref=e5] [cursor=pointer]:
        - /url: /
        - img "Marcus Trading logo" [ref=e6]
        - generic [ref=e7]: Marcus Trading
      - navigation "Primary navigation" [ref=e8]:
        - link "Home" [ref=e9] [cursor=pointer]:
          - /url: /
        - link "Training" [ref=e10] [cursor=pointer]:
          - /url: /training
        - link "Market" [ref=e11] [cursor=pointer]:
          - /url: /market
        - link "Blog" [ref=e12] [cursor=pointer]:
          - /url: /blog
        - link "Research" [ref=e13] [cursor=pointer]:
          - /url: /research
      - generic [ref=e14]:
        - link "Open registration" [ref=e15] [cursor=pointer]:
          - /url: /register
          - text: Sign Up
        - link "Sign in" [ref=e16] [cursor=pointer]:
          - /url: /login?next=/terminal
          - text: Sign In
  - main [ref=e17]:
    - generic [ref=e18]:
      - heading "Create an account" [level=1] [ref=e19]
      - paragraph [ref=e20]: Create your Marcus Trading account to start exploring bots and run paper trading.
      - generic [ref=e22]:
        - generic [ref=e23]:
          - generic [ref=e24]: Email
          - textbox "Email" [ref=e25]
          - paragraph [ref=e26]: Use a reachable email for account recovery.
        - generic [ref=e27]:
          - generic [ref=e28]: Account type
          - combobox "Account type" [ref=e29]:
            - option "Trader" [selected]
            - option "Developer"
          - paragraph [ref=e30]: Select developer if you plan to publish bots or integrations.
        - generic [ref=e31]:
          - generic [ref=e32]: Display name
          - textbox "Display name" [ref=e33]
        - generic [ref=e34]:
          - generic [ref=e35]: Password
          - textbox "Password" [ref=e36]
          - paragraph [ref=e37]: At least 8 chars, with upper/lowercase and a number.
        - button "Create account" [ref=e39] [cursor=pointer]
        - paragraph [ref=e40]: By creating an account, you agree to system access and audit policies.
  - contentinfo [ref=e41]:
    - generic [ref=e42]:
      - paragraph [ref=e43]: 2026 Marcus Trading Systems. Operational Intelligence Layer.
      - generic [ref=e44]:
        - link "Research" [ref=e45] [cursor=pointer]:
          - /url: /research
        - link "Blog" [ref=e46] [cursor=pointer]:
          - /url: /blog
        - link "API Docs" [ref=e47] [cursor=pointer]:
          - /url: "#"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Marketplace → Bot Detail → Subscribe → Dashboard', async ({ page }) => {
  4  |   const uniqueId = Date.now();
  5  |   const email = `e2e+${uniqueId}@example.com`;
  6  |   const password = `E2eTestPass1!${uniqueId}`;
  7  |   const displayName = `E2E User ${uniqueId}`;
  8  | 
  9  |   await page.goto('/register');
  10 |   await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
  11 | 
  12 |   await page.getByLabel('Email').fill(email);
  13 |   await page.getByLabel('Display name').fill(displayName);
  14 |   await page.getByLabel('Password').fill(password);
  15 |   await page.getByRole('button', { name: 'Create account' }).click();
  16 | 
> 17 |   await page.waitForFunction(() => window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/terminal'), {
     |              ^ TimeoutError: page.waitForFunction: Timeout 15000ms exceeded.
  18 |     timeout: 30000,
  19 |   });
  20 | 
  21 |   const currentPath = await page.evaluate(() => window.location.pathname);
  22 |   if (currentPath.startsWith('/login')) {
  23 |     await expect(page.getByRole('heading', { name: 'Sign in to continue' })).toBeVisible();
  24 |     await page.getByLabel('Username or email').fill(email);
  25 |     await page.getByLabel('Password').fill(password);
  26 |     await Promise.all([
  27 |       page.waitForFunction(() => window.location.pathname.startsWith('/terminal'), { timeout: 30000 }),
  28 |       page.getByRole('button', { name: 'Sign In' }).click(),
  29 |     ]);
  30 |   } else {
  31 |     await expect(page).toHaveURL(/\/terminal($|\/|\?)/);
  32 |   }
  33 | 
  34 |   await page.goto('/terminal/marketplace');
  35 |   await expect(page.getByRole('heading', { name: 'Strategy Marketplace' })).toBeVisible();
  36 |   const marketplaceHits = page.locator('article:has-text("View Detail")');
  37 |   await expect(await marketplaceHits.count()).toBeGreaterThan(0);
  38 | 
  39 |   await page.getByLabel('Search').fill('');
  40 |   await page.getByRole('button', { name: 'Apply Filters' }).click();
  41 |   await page.waitForURL('**/terminal/marketplace**');
  42 | 
  43 |   const firstDetail = page.locator('text=View Detail').first();
  44 |   await expect(firstDetail).toBeVisible();
  45 |   await firstDetail.click();
  46 | 
  47 |   await expect(page.getByText('Bot Profile')).toBeVisible();
  48 |   await expect(page.getByRole('heading', { name: 'Subscribe Bot' })).toBeVisible();
  49 | 
  50 |   const subscribeButton = page.getByRole('button', { name: 'Subscribe Bot' });
  51 |   await expect(subscribeButton).toBeDisabled();
  52 | 
  53 |   await page.locator('input[type="checkbox"]').check();
  54 |   await expect(subscribeButton).toBeEnabled();
  55 | 
  56 |   await subscribeButton.click();
  57 |   await expect(page.locator('text=Subscription Status')).toBeVisible();
  58 |   await expect(page.locator('p:has-text("SUBSCRIBED")')).toBeVisible();
  59 | 
  60 |   const unsubscribeButton = page.getByRole('button', { name: 'Unsubscribe' });
  61 |   await expect(unsubscribeButton).toBeEnabled();
  62 |   await unsubscribeButton.click();
  63 |   await expect(page.locator('p:has-text("UNSUBSCRIBED")')).toBeVisible();
  64 | 
  65 |   await page.goto('/terminal');
  66 |   await expect(page.getByRole('heading', { name: 'Portfolio Control Center' })).toBeVisible();
  67 |   await expect(page.getByRole('button', { name: 'Refresh Data' })).toBeVisible();
  68 |   await expect(page.locator('text=Active Bot Performance')).toBeVisible();
  69 | });
  70 | 
```