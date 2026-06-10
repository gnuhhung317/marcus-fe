import { test, expect } from '@playwright/test';

test('Decision Dashboard smoke: load, filter, search, refresh', async ({ page }) => {
  const uniqueId = Date.now();
  await page.context().addCookies([
    { name: 'marcus_access_token', value: `e2e-token-${uniqueId}`, url: 'http://127.0.0.1:3001' },
    { name: 'marcus_role', value: 'TRADER', url: 'http://127.0.0.1:3001' },
    { name: 'marcus_username', value: `E2E Decision ${uniqueId}`, url: 'http://127.0.0.1:3001' },
  ]);

  const overview = {
    activeBotsCount: 3,
    totalSubscribedCapital: 124000,
    aggregateWinRate24h: 0.68,
    atRiskSubscriptionCount: 2,
    totalEquity: 142509.42,
    aggregateOpenPnL: 2410.12,
    lastUpdated: new Date().toISOString(),
  };

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
        winRate: 0.42,
        signalCount24h: 12,
        successfulSignals24h: 5,
        reason: 'HIGH_RISK',
        reasonExplanation: 'Drawdown exceeded the risk threshold and the bot is underperforming.',
        riskScore: 0.91,
        subscribedSinceDay: 41,
        daysAtRisk: 3,
        lastSignal: new Date().toISOString(),
        exchange: 'BINANCE',
      },
      {
        subscriptionId: 'sub-btc-review',
        botId: 'bot-btc-review',
        botName: 'BTC Momentum',
        botIcon: '',
        status: 'ACTIVE',
        currentPnL: 84.91,
        pnlPercent: 0.027,
        drawdownPercent: -0.11,
        winRate: 0.56,
        signalCount24h: 18,
        successfulSignals24h: 12,
        reason: 'NEEDS_REVIEW',
        reasonExplanation: 'Signals remain active, but the win rate has softened over the last session.',
        riskScore: 0.62,
        subscribedSinceDay: 18,
        daysAtRisk: 1,
        lastSignal: new Date().toISOString(),
        exchange: 'BYBIT',
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
        winRate: 0.74,
        signalCount24h: 22,
        successfulSignals24h: 18,
        reason: 'SOLID_PERFORMER',
        reasonExplanation: 'Stable execution, strong win rate, and controlled drawdown.',
        riskScore: 0.12,
        subscribedSinceDay: 72,
        daysAtRisk: 0,
        lastSignal: new Date().toISOString(),
        exchange: 'OKX',
      },
    ],
    summary: {
      totalCount: 3,
      activeCount: 3,
      reviewNeededCount: 1,
      highRiskCount: 1,
    },
  };

  await page.route('**/dashboard/portfolio/overview**', async (route) => {
    await route.fulfill({ json: overview });
  });

  await page.route('**/dashboard/portfolio/decisions**', async (route) => {
    const url = new URL(route.request().url());
    const status = url.searchParams.get('status');

    const payload =
      status === 'AT_RISK'
        ? {
            ...decisions,
            decisions: decisions.decisions.filter((card) => card.reason !== 'SOLID_PERFORMER'),
            summary: {
              totalCount: 2,
              activeCount: 2,
              reviewNeededCount: 1,
              highRiskCount: 1,
            },
          }
        : decisions;

    await route.fulfill({ json: payload });
  });

  await page.goto('/terminal/decision');

  await expect(page.getByRole('heading', { name: 'Decision Dashboard' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Subscription Triage' })).toBeVisible();

  await expect(page.getByRole('button', { name: /All Bots/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Active/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /At-Risk/ })).toBeVisible();

  await expect(page.getByLabel('Search subscriptions by bot name')).toBeVisible();

  await page.getByRole('button', { name: /At-Risk/ }).click();
  await expect(page.getByRole('button', { name: /At-Risk/ })).toBeVisible();

  const searchInput = page.getByLabel('Search subscriptions by bot name');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('btc');

  const refreshButton = page.getByRole('button', { name: 'Refresh' });
  await expect(refreshButton).toBeVisible();
  await refreshButton.click();

  await expect(page.locator('text=Last updated:')).toBeVisible();

  await expect(page.getByRole('link', { name: /Review/ }).first()).toBeVisible();
});
