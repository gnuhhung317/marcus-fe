import { test, expect, type Page } from '@playwright/test';

async function seedMonitoringSession(page: Page) {
  const uniqueId = Date.now();
  await page.context().addCookies([
    { name: 'marcus_access_token', value: `e2e-token-${uniqueId}`, domain: '127.0.0.1', path: '/' },
    { name: 'marcus_role', value: 'TRADER', domain: '127.0.0.1', path: '/' },
    { name: 'marcus_username', value: `E2E Monitoring ${uniqueId}`, domain: '127.0.0.1', path: '/' },
  ]);
}

test('Monitoring Dashboard uses overview lastUpdated instead of chart tail timestamp', async ({ page }) => {
  await seedMonitoringSession(page);

  await page.route('**/dashboard/overview**', async (route) => {
    await route.fulfill({
      json: {
        totalEquity: 124500.11,
        openPnl: 320.14,
        winRate: 71,
        activeBots: 4,
        freshAccountsCount: 3,
        staleAccountsCount: 1,
        dataFreshness: 'PARTIAL',
        lastUpdated: null,
      },
    });
  });

  await page.route('**/dashboard/equity-series**', async (route) => {
    await route.fulfill({
      json: [
        { timestamp: '2026-06-24T00:00:00Z', value: 120000 },
        { timestamp: new Date().toISOString(), value: 124500.11 },
      ],
    });
  });

  await page.route('**/dashboard/exchange-allocation**', async (route) => {
    await route.fulfill({
      json: [
        { exchange: 'BINANCE', percentage: 55 },
        { exchange: 'BYBIT', percentage: 45 },
      ],
    });
  });

  await page.route('**/dashboard/trades**', async (route) => {
    await route.fulfill({
      json: {
        items: [
          {
            timestamp: '2026-06-30T11:38:00Z',
            assetPair: 'BTC/USDT',
            side: 'LONG',
            netPnl: 12.44,
            size: 0.1,
            entryPrice: 60000,
            exitPrice: 60124.4,
          },
        ],
      },
    });
  });

  await page.route('**/system/connectivity**', async (route) => {
    await route.fulfill({
      json: {
        overallStatus: 'UP',
        checkedAt: new Date().toISOString(),
      },
    });
  });

  await page.route('**/signals**', async (route) => {
    await route.fulfill({ json: [] });
  });

  await page.route('**/system/execution-logs**', async (route) => {
    await route.fulfill({ json: { items: [] } });
  });

  await page.goto('/en/terminal/monitoring');

  await expect(page.getByRole('heading', { name: 'Monitoring Dashboard' })).toBeVisible();
  await expect(page.locator('text=Updated: Never synced')).toBeVisible();

  const allocationCard = page.getByTestId('monitoring-exchange-allocation-card');
  await expect(allocationCard).toContainText('55.0%');
  await expect(allocationCard).toContainText('45.0%');
  await expect(allocationCard).not.toContainText('$12.44');
});

test('Monitoring Dashboard switches equity ranges without stale chart state', async ({ page }) => {
  await seedMonitoringSession(page);

  const requestedRanges: string[] = [];
  const rangeSeries = {
    '1D': [
      { timestamp: '2026-06-30T09:00:00Z', value: 89.44 },
      { timestamp: '2026-06-30T11:39:36Z', value: 89.44 },
    ],
    '7D': [
      { timestamp: '2026-06-24T00:00:00Z', value: 84.5 },
      { timestamp: '2026-06-25T00:00:00Z', value: 86.92 },
      { timestamp: '2026-06-26T00:00:00Z', value: 85.71 },
      { timestamp: '2026-06-27T00:00:00Z', value: 87.48 },
      { timestamp: '2026-06-28T00:00:00Z', value: 91.56 },
      { timestamp: '2026-06-29T00:00:00Z', value: 88.97 },
      { timestamp: '2026-06-30T11:39:36Z', value: 89.44 },
    ],
    '30D': [
      { timestamp: '2026-06-01T00:00:00Z', value: 84.59 },
      { timestamp: '2026-06-08T00:00:00Z', value: 87.24 },
      { timestamp: '2026-06-15T00:00:00Z', value: 105.88 },
      { timestamp: '2026-06-22T00:00:00Z', value: 94.17 },
      { timestamp: '2026-06-30T11:39:36Z', value: 89.44 },
    ],
    ALL: [
      { timestamp: '2026-05-01T00:00:00Z', value: 81.1 },
      { timestamp: '2026-05-20T00:00:00Z', value: 85.77 },
      { timestamp: '2026-06-15T00:00:00Z', value: 105.88 },
      { timestamp: '2026-06-30T11:39:36Z', value: 89.44 },
    ],
  } as const;

  await page.route('**/dashboard/overview**', async (route) => {
    await route.fulfill({
      json: {
        totalEquity: 89.44,
        openPnl: 4.94,
        winRate: 71,
        activeBots: 4,
        freshAccountsCount: 3,
        staleAccountsCount: 1,
        dataFreshness: 'PARTIAL',
        lastUpdated: '2026-06-30T11:39:36Z',
      },
    });
  });

  await page.route('**/dashboard/equity-series**', async (route) => {
    const url = new URL(route.request().url());
    const range = (url.searchParams.get('range') ?? '7D') as keyof typeof rangeSeries;
    requestedRanges.push(range);

    await route.fulfill({
      json: rangeSeries[range],
    });
  });

  await page.route('**/dashboard/exchange-allocation**', async (route) => {
    await route.fulfill({
      json: [
        { exchange: 'BINANCE', percentage: 55 },
        { exchange: 'BYBIT', percentage: 45 },
      ],
    });
  });

  await page.route('**/dashboard/trades**', async (route) => {
    await route.fulfill({ json: { items: [] } });
  });

  await page.route('**/system/connectivity**', async (route) => {
    await route.fulfill({
      json: {
        overallStatus: 'UP',
        checkedAt: '2026-06-30T11:39:36Z',
      },
    });
  });

  await page.route('**/signals**', async (route) => {
    await route.fulfill({ json: [] });
  });

  await page.route('**/system/execution-logs**', async (route) => {
    await route.fulfill({ json: { items: [] } });
  });

  await page.goto('/en/terminal/monitoring');

  const chartCard = page.getByTestId('monitoring-equity-card');
  await expect(page.getByRole('heading', { name: 'Monitoring Dashboard' })).toBeVisible();
  await expect(chartCard).toContainText('$91.56');
  await expect(chartCard).toContainText('-$2.12');
  await expect(chartCard).toHaveScreenshot('monitoring-equity-1w.png', {
    animations: 'disabled',
    caret: 'hide',
  });

  await page.getByRole('button', { name: '1D' }).click();
  await expect(chartCard).toContainText('$89.44');
  await expect(chartCard).toContainText('+$0.00');
  await expect(chartCard).toHaveScreenshot('monitoring-equity-1d.png', {
    animations: 'disabled',
    caret: 'hide',
  });

  await page.getByRole('button', { name: '1W' }).click();
  await expect(chartCard).toContainText('$91.56');
  await expect(chartCard).toContainText('-$2.12');

  await page.getByRole('button', { name: '1M' }).click();
  await expect(chartCard).toContainText('$105.88');
  await expect(chartCard).toContainText('-$16.44');
  await expect(chartCard).toHaveScreenshot('monitoring-equity-1m.png', {
    animations: 'disabled',
    caret: 'hide',
  });

  expect(requestedRanges).toEqual(expect.arrayContaining(['7D', '1D', '30D']));
});

test('Monitoring Dashboard presents execution logs as a history viewer without Bot ID controls', async ({ page }) => {
  await seedMonitoringSession(page);

  const executionLogLimits: number[] = [];

  await page.route('**/dashboard/overview**', async (route) => {
    await route.fulfill({
      json: {
        totalEquity: 124500.11,
        openPnl: 320.14,
        winRate: 71,
        activeBots: 4,
        freshAccountsCount: 3,
        staleAccountsCount: 1,
        dataFreshness: 'PARTIAL',
        lastUpdated: '2026-06-30T11:39:36Z',
      },
    });
  });

  await page.route('**/dashboard/equity-series**', async (route) => {
    await route.fulfill({
      json: [
        { timestamp: '2026-06-24T00:00:00Z', value: 120000 },
        { timestamp: '2026-06-30T11:39:36Z', value: 124500.11 },
      ],
    });
  });

  await page.route('**/dashboard/exchange-allocation**', async (route) => {
    await route.fulfill({
      json: [
        { exchange: 'BINANCE', percentage: 55 },
        { exchange: 'BYBIT', percentage: 45 },
      ],
    });
  });

  await page.route('**/dashboard/trades**', async (route) => {
    await route.fulfill({ json: { items: [] } });
  });

  await page.route('**/system/connectivity**', async (route) => {
    await route.fulfill({
      json: {
        overallStatus: 'UP',
        checkedAt: '2026-06-30T11:39:36Z',
      },
    });
  });

  await page.route('**/signals**', async (route) => {
    await route.fulfill({
      json: [
        {
          signalId: 'sig-001',
          botId: 'bot-alpha',
          symbol: 'BTC/USDT',
          action: 'BUY',
          status: 'EXECUTED',
          generatedTimestamp: '2026-06-30T11:38:00Z',
        },
        {
          signalId: 'sig-002',
          botId: 'bot-beta',
          symbol: 'ETH/USDT',
          action: 'SELL',
          status: 'PENDING',
          generatedTimestamp: '2026-06-30T11:39:00Z',
        },
      ],
    });
  });

  await page.route('**/system/execution-logs**', async (route) => {
    const url = new URL(route.request().url());
    executionLogLimits.push(Number(url.searchParams.get('limit') ?? '0'));

    await route.fulfill({
      json: {
        cursor: null,
        items: [
          {
            timestamp: '2026-06-30T11:40:00Z',
            level: 'INFO',
            source: 'executor',
            message: 'Synced latest signal',
          },
          {
            timestamp: '2026-06-30T11:41:00Z',
            level: 'WARN',
            source: 'risk-engine',
            message: 'Retrying order placement',
          },
        ],
      },
    });
  });

  await page.goto('/en/terminal/monitoring');

  await expect(page.getByRole('heading', { name: 'Execution history' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Recent signals' })).toBeVisible();
  await expect(page.getByText('Bot ID')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Pause Stream' })).toHaveCount(0);
  await expect(page.getByLabel('Auto-Scroll')).toHaveCount(0);

  const executionCard = page.getByTestId('monitoring-execution-log-card');
  const signalCard = page.getByTestId('monitoring-recent-signals-card');
  const logSearch = executionCard.getByPlaceholder('Search logs by source or message...');
  const signalSearch = signalCard.getByPlaceholder('Filter by symbol, action, or status...');

  await logSearch.fill('risk');
  await expect(page.getByText('Retrying order placement')).toBeVisible();
  await expect(page.getByText('Synced latest signal')).toHaveCount(0);

  await logSearch.fill('placement');
  await expect(page.getByText('Retrying order placement')).toBeVisible();
  await expect(page.getByText('Synced latest signal')).toHaveCount(0);

  await logSearch.fill('');
  await page.getByRole('button', { name: 'Warn' }).click();
  await expect(page.getByText('Retrying order placement')).toBeVisible();
  await expect(page.getByText('Synced latest signal')).toHaveCount(0);

  await page.getByRole('button', { name: 'Info' }).click();
  await expect(page.getByText('Synced latest signal')).toBeVisible();
  await expect(page.getByText('Retrying order placement')).toHaveCount(0);

  await signalSearch.fill('btc');
  await expect(page.getByText('BTC/USDT')).toBeVisible();
  await expect(page.getByText('ETH/USDT')).toHaveCount(0);

  await signalSearch.fill('sell');
  await expect(page.getByText('ETH/USDT')).toBeVisible();
  await expect(page.getByText('BTC/USDT')).toHaveCount(0);

  await signalSearch.fill('pending');
  await expect(page.getByText('ETH/USDT')).toBeVisible();
  await expect(page.getByText('BTC/USDT')).toHaveCount(0);

  expect(executionLogLimits.length).toBeGreaterThan(0);
  expect(executionLogLimits.every((limit) => limit === 100)).toBe(true);
});
