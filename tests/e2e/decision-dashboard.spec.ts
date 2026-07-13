import { test, expect } from '@playwright/test';

test('Decision Dashboard smoke: load, filter, search, refresh', async ({ page }) => {
  const uniqueId = Date.now();
  const cookieDomains = ['127.0.0.1', 'localhost'];
  await page.context().addCookies(
    cookieDomains.flatMap((domain) => [
      { name: 'marcus_access_token', value: `e2e-token-${uniqueId}`, domain, path: '/' },
      { name: 'marcus_role', value: 'TRADER', domain, path: '/' },
      { name: 'marcus_username', value: `E2E Decision ${uniqueId}`, domain, path: '/' },
    ])
  );

  const overview = {
    activeBotsCount: 3,
    totalSubscribedCapital: 124000,
    aggregateWinRate24h: 0.68,
    atRiskSubscriptionCount: 2,
    totalEquity: 142509.42,
    aggregateOpenPnL: 2410.12,
    lastUpdated: new Date().toISOString(),
  };

  const dashboardOverview = {
    totalEquity: 142509.42,
    openPnl: 2410.12,
    winRate: 68,
    activeBots: 3,
    freshAccountsCount: 2,
    staleAccountsCount: 1,
    dataFreshness: 'PARTIAL',
    lastUpdated: new Date().toISOString(),
  };

  const equitySeries = [
    {
      timestamp: '2026-06-24T00:00:00Z',
      value: 140000,
    },
    {
      timestamp: new Date().toISOString(),
      value: 142509.42,
    },
  ];

  const allocations = [
    { exchange: 'BINANCE', percentage: 62 },
    { exchange: 'BYBIT', percentage: 38 },
  ];

  const decisions = {
    decisions: [
      {
        subscriptionId: 'sub-btc-risk',
        botId: 'bot-btc-risk',
        botName: 'BTC Sentinel',
        botIcon: '',
        status: 'ACTIVE',
        currentPnL: -123.45,
        pnlPercent: -0.031,
        drawdownPercent: -0.22,
        reason: 'HIGH_RISK',
        reasonExplanation: 'Critical 22.0% subscription drawdown.',
        riskScore: 0.91,
        subscribedSinceDay: 41,
        lastSyncAt: new Date().toISOString(),
        syncFreshness: 'FRESH',
        lastSignal: new Date().toISOString(),
        exchange: 'BINANCE',
      },
      {
        subscriptionId: 'sub-btc-review',
        botId: 'bot-btc-review',
        botName: 'BTC Momentum',
        botIcon: '',
        status: 'ACTIVE',
        currentPnL: null,
        pnlPercent: null,
        drawdownPercent: null,
        reason: 'NEEDS_REVIEW',
        reasonExplanation: 'No subscription telemetry has been synced yet.',
        riskScore: 0.62,
        subscribedSinceDay: 18,
        lastSyncAt: null,
        syncFreshness: 'NEVER_SYNCED',
        lastSignal: null,
        exchange: 'BYBIT',
      },
      {
        subscriptionId: 'sub-ada-slip',
        botId: 'bot-ada-slip',
        botName: 'ADA Drift',
        botIcon: '',
        status: 'ACTIVE',
        currentPnL: 42.18,
        pnlPercent: 0.011,
        drawdownPercent: -0.03,
        reason: 'SLIPPING',
        reasonExplanation: 'Telemetry is fresh, but no bot signals were seen in the last 24 hours.',
        riskScore: 0.21,
        subscribedSinceDay: 9,
        lastSyncAt: new Date().toISOString(),
        syncFreshness: 'FRESH',
        lastSignal: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        exchange: 'BINANCE',
      },
      {
        subscriptionId: 'sub-sol-healthy',
        botId: 'bot-sol-healthy',
        botName: 'SOL Trend',
        botIcon: '',
        status: 'ACTIVE',
        currentPnL: 522.73,
        pnlPercent: 0.061,
        drawdownPercent: -0.04,
        reason: 'SOLID_PERFORMER',
        reasonExplanation: 'Subscription telemetry is fresh and within configured risk limits.',
        riskScore: 0.12,
        subscribedSinceDay: 72,
        lastSyncAt: new Date().toISOString(),
        syncFreshness: 'FRESH',
        lastSignal: new Date().toISOString(),
        exchange: 'OKX',
      },
    ],
    summary: {
      totalCount: 4,
      activeCount: 2,
      reviewNeededCount: 1,
      highRiskCount: 1,
    },
  };

  const activeBotIds = new Set(['bot-ada-slip', 'bot-sol-healthy']);
  const atRiskBotIds = new Set(['bot-btc-risk', 'bot-btc-review']);
  let decisionRows = [...decisions.decisions];
  let decisionRequestCount = 0;

  await page.route('**/dashboard/portfolio/overview**', async (route) => {
    await route.fulfill({ json: overview });
  });

  await page.route('**/dashboard/overview**', async (route) => {
    await route.fulfill({ json: dashboardOverview });
  });

  await page.route('**/dashboard/equity-series**', async (route) => {
    await route.fulfill({ json: equitySeries });
  });

  await page.route('**/dashboard/exchange-allocation**', async (route) => {
    await route.fulfill({ json: allocations });
  });

  await page.route('**/dashboard/trades**', async (route) => {
    await route.fulfill({ json: { items: [] } });
  });

  await page.route('**/dashboard/portfolio/decisions**', async (route) => {
    decisionRequestCount += 1;
    const url = new URL(route.request().url());
    const status = url.searchParams.get('status');
    const filteredRows =
      status === 'AT_RISK'
        ? decisionRows.filter((card) => atRiskBotIds.has(card.botId))
        : status === 'ACTIVE'
          ? decisionRows.filter((card) => activeBotIds.has(card.botId))
          : decisionRows;
    const summary = {
      totalCount: decisionRows.length,
      activeCount: decisionRows.filter((card) => activeBotIds.has(card.botId)).length,
      reviewNeededCount: decisionRows.filter((card) => card.reason === 'NEEDS_REVIEW').length,
      highRiskCount: decisionRows.filter((card) => card.reason === 'HIGH_RISK').length,
    };
    const payload = {
      decisions: filteredRows,
      summary,
    };

    await route.fulfill({ json: payload });
  });

  await page.route('**/subscriptions/*', async (route) => {
    if (route.request().method() !== 'DELETE') {
      await route.fallback();
      return;
    }

    const botId = route.request().url().split('/').pop() ?? '';
    if (botId === 'bot-btc-risk') {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'No active subscription found for bot: bot-btc-risk' }),
      });
      return;
    }

    decisionRows = decisionRows.filter((card) => card.botId !== botId);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ botId, wsToken: '', status: 'UNSUBSCRIBED' }),
    });
  });

  await page.goto('/en/terminal/decision');

  await expect(page.getByRole('heading', { name: 'Decision Dashboard' })).toBeVisible();
  await expect(page.getByText('Subscription Triage', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Capital Allocation by Exchange' })).toBeVisible();
  await expect(page.getByText('Sync coverage')).toBeVisible();
  await expect(page.getByText('100%')).toBeVisible();
  await expect(page.getByText('0/0')).toHaveCount(0);

  await expect(page.getByRole('tab', { name: 'All Bots (4)' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Active (2)' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'At-Risk (2)' })).toBeVisible();

  await expect(page.getByLabel('Search subscriptions by bot name')).toBeVisible();
  const initialDecisionRequestCount = decisionRequestCount;

  await page.getByRole('tab', { name: 'At-Risk (2)' }).click();
  await expect(page.getByText('BTC Sentinel')).toBeVisible();
  await expect(page.getByText('BTC Momentum')).toBeVisible();
  await expect(page.getByText('Unsynced')).toBeVisible();
  await expect(page.getByText('No recent signal')).toBeVisible();
  await expect(page.getByText('SOL Trend')).toHaveCount(0);
  await expect.poll(() => decisionRequestCount).toBe(initialDecisionRequestCount);

  await page.getByRole('tab', { name: 'Active (2)' }).click();
  await expect(page.getByText('ADA Drift')).toBeVisible();
  await expect(page.getByText('SOL Trend')).toBeVisible();
  await expect(page.getByText('BTC Sentinel')).toHaveCount(0);
  await expect.poll(() => decisionRequestCount).toBe(initialDecisionRequestCount);

  const searchInput = page.getByLabel('Search subscriptions by bot name');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('ada');
  await expect(page.getByText('ADA Drift')).toBeVisible();
  await expect(page.getByText('SOL Trend')).toHaveCount(0);
  await expect.poll(() => decisionRequestCount).toBe(initialDecisionRequestCount);

  await searchInput.fill('');
  await page.getByRole('tab', { name: 'At-Risk (2)' }).click();
  await expect(page.getByText('BTC Sentinel')).toBeVisible();
  await expect(page.getByText('BTC Momentum')).toBeVisible();

  await page.getByRole('button', { name: 'Unsubscribe' }).first().click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByText('No active subscription found for bot: bot-btc-risk')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('BTC Sentinel', { exact: true })).toBeVisible();

  await page.getByRole('tab', { name: 'Active (2)' }).click();
  await expect(page.getByText('ADA Drift')).toBeVisible();
  await expect(page.getByText('SOL Trend')).toBeVisible();

  await page.getByRole('button', { name: 'Unsubscribe' }).nth(1).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByText('SOL Trend unsubscribed.')).toBeVisible();
  await expect(page.getByText('SOL Trend', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Unsubscribe' })).toHaveCount(1);
  await expect(page.getByRole('tab', { name: 'Active (1)' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'All Bots (3)' })).toBeVisible();

  const refreshButton = page.getByRole('button', { name: 'Sync Telemetry' });
  await expect(refreshButton).toBeVisible();
  await refreshButton.click();

  await expect(page.locator('text=Last sync:')).toBeVisible();

  await expect(page.getByRole('link', { name: /Review/ }).first()).toBeVisible();
});
