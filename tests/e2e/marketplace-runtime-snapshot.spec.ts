import { test, expect, type Page } from '@playwright/test';

const runtimeSnapshotTestBotId = 'runtime-snapshot-test-bot';

async function seedSession(page: Page, accessToken: string) {
  const cookieDomains = ['127.0.0.1', 'localhost'];
  await page.context().addCookies(
    cookieDomains.flatMap((domain) => [
      { name: 'marcus_access_token', value: accessToken, domain, path: '/' },
      { name: 'marcus_role', value: 'TRADER', domain, path: '/' },
      { name: 'marcus_username', value: 'Runtime Snapshot Tester', domain, path: '/' },
    ]),
  );
}

function snapshotCard(page: Page) {
  return page.getByRole('heading', { name: 'Runtime Snapshot', exact: true }).locator('xpath=ancestor::*[contains(@class, "p-6")][1]');
}

test('marketplace runtime snapshot uses out-of-sample analytics block for dry-run source', async ({ page }) => {
  await seedSession(page, 'runtime-snapshot-dry-run');

  await page.goto(`/en/terminal/marketplace/${runtimeSnapshotTestBotId}?source=DRY_RUN`);

  const snapshot = snapshotCard(page);
  await expect(page.getByRole('heading', { name: 'Runtime Snapshot', exact: true })).toBeVisible();
  await expect(snapshot.getByText('+424.92%', { exact: true })).toBeVisible();
  await expect(snapshot.getByText('-198.42%', { exact: true })).toBeVisible();
  await expect(snapshot.getByText('0.71', { exact: true })).toBeVisible();
  await expect(snapshot.getByText('86.67%', { exact: true })).toBeVisible();
  await expect(snapshot.getByText(/Sample days\s+70/i)).toBeVisible();
  await expect(snapshot.getByText(/Closed trades\s+30/i)).toBeVisible();
  await expect(snapshot.getByText('+2137.42%', { exact: true })).toHaveCount(0);
  await expect(snapshot.getByText('-100.00%', { exact: true })).toHaveCount(0);
  await expect(snapshot.getByText('51.55', { exact: true })).toHaveCount(0);

  await expect(page.getByText('+424.92%', { exact: true })).toHaveCount(2);
  await expect(page.getByText('70 days | 30 trades', { exact: true })).toBeVisible();
});

test('marketplace runtime snapshot uses historical analytics block for historical source', async ({ page }) => {
  await seedSession(page, 'runtime-snapshot-historical');

  await page.goto(`/en/terminal/marketplace/${runtimeSnapshotTestBotId}?source=HISTORICAL`);

  const snapshot = snapshotCard(page);
  await expect(page.getByRole('heading', { name: 'Runtime Snapshot', exact: true })).toBeVisible();
  await expect(snapshot.getByText('+111.11%', { exact: true })).toBeVisible();
  await expect(snapshot.getByText('-12.34%', { exact: true })).toBeVisible();
  await expect(snapshot.getByText('1.11', { exact: true })).toBeVisible();
  await expect(snapshot.getByText('55.00%', { exact: true })).toBeVisible();
  await expect(snapshot.getByText(/Sample days\s+40/i)).toBeVisible();
  await expect(snapshot.getByText(/Closed trades\s+12/i)).toBeVisible();
  await expect(snapshot.getByText('+2137.42%', { exact: true })).toHaveCount(0);
  await expect(snapshot.getByText('-100.00%', { exact: true })).toHaveCount(0);
  await expect(snapshot.getByText('51.55', { exact: true })).toHaveCount(0);

  await expect(page.getByText('+111.11%', { exact: true })).toHaveCount(2);
  await expect(page.getByText('40 days | 12 trades', { exact: true })).toBeVisible();
});

test('marketplace runtime snapshot falls back to bot detail performance when source block is unavailable', async ({ page }) => {
  await seedSession(page, 'runtime-snapshot-fallback');

  await page.goto(`/en/terminal/marketplace/${runtimeSnapshotTestBotId}`);

  const snapshot = snapshotCard(page);
  await expect(page.getByRole('heading', { name: 'Runtime Snapshot', exact: true })).toBeVisible();
  await expect(snapshot.getByText('+2137.42%', { exact: true })).toBeVisible();
  await expect(snapshot.getByText('-100.00%', { exact: true })).toBeVisible();
  await expect(snapshot.getByText('51.55', { exact: true })).toBeVisible();
  await expect(snapshot.getByText('11.11%', { exact: true })).toBeVisible();
  await expect(snapshot.getByText(/Sample days/i)).toHaveCount(0);
  await expect(snapshot.getByText(/Closed trades/i)).toHaveCount(0);
  await expect(snapshot.getByText('Signal-based fallback', { exact: true })).toBeVisible();
});
