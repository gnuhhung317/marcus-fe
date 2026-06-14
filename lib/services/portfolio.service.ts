import {
  PortfolioOverview,
  PortfolioDecisionsResponse,
  DecisionReason,
  DecisionDashboardData,
} from '@/lib/contracts/types';
import {
  requestContractJson,
} from '@/lib/services/base.service';

interface PortfolioOverviewResponse {
  activeBotsCount?: number;
  totalSubscribedCapital?: number;
  aggregateWinRate24h?: number;
  atRiskSubscriptionCount?: number;
  totalEquity?: number;
  aggregateOpenPnL?: number;
  lastUpdated?: string;
  freshAccountsCount?: number;
  staleAccountsCount?: number;
  dataFreshness?: string;
}

interface BotDecisionCardResponse {
  subscriptionId?: string;
  botId?: string;
  botName?: string;
  botIcon?: string;
  status?: string;
  currentPnL?: number;
  pnlPercent?: number;
  drawdownPercent?: number;
  winRate?: number;
  signalCount24h?: number;
  successfulSignals24h?: number;
  reason?: string;
  reasonExplanation?: string;
  riskScore?: number;
  subscribedSinceDay?: number;
  daysAtRisk?: number;
  lastSignal?: string | null;
  exchange?: string;
}

interface PortfolioDecisionsResponseData {
  decisions?: BotDecisionCardResponse[];
  summary?: {
    totalCount?: number;
    activeCount?: number;
    reviewNeededCount?: number;
    highRiskCount?: number;
  };
}

/**
 * Fetch portfolio overview for Decision Dashboard header.
 * Returns aggregated portfolio metrics (active bots, equity, win rate, at-risk count).
 */
export async function getPortfolioOverview(): Promise<PortfolioOverview> {
  try {
    const res = await requestContractJson<PortfolioOverviewResponse>('portfolio-overview', {
      init: { method: 'GET' },
    });
    return {
      activeBotsCount: res.activeBotsCount ?? 0,
      totalSubscribedCapital: res.totalSubscribedCapital ?? 0,
      aggregateWinRate24h: res.aggregateWinRate24h ?? 0,
      atRiskSubscriptionCount: res.atRiskSubscriptionCount ?? 0,
      totalEquity: res.totalEquity ?? 0,
      aggregateOpenPnL: res.aggregateOpenPnL ?? 0,
      lastUpdated: res.lastUpdated ?? new Date().toISOString(),
      freshAccountsCount: res.freshAccountsCount ?? 0,
      staleAccountsCount: res.staleAccountsCount ?? 0,
      dataFreshness: res.dataFreshness ?? 'STALE',
    };
  } catch (error) {
    throw new Error(`Portfolio overview failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Fetch decision-enriched subscription list with reason tags.
 * Returns subscriptions sorted by decision priority (HIGH_RISK first).
 */
export async function getPortfolioDecisions(
  statusFilter: 'ALL' | 'ACTIVE' | 'AT_RISK' = 'ALL',
): Promise<PortfolioDecisionsResponse> {
  try {
    const res = await requestContractJson<PortfolioDecisionsResponseData>('portfolio-decisions', {
      queryParams: {
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      },
      init: { method: 'GET' },
    });

    return {
      decisions: (res.decisions ?? []).map((d) => ({
        subscriptionId: d.subscriptionId ?? '',
        botId: d.botId ?? '',
        botName: d.botName ?? '',
        botIcon: d.botIcon ?? '',
        status: (d.status ?? 'ACTIVE') as 'ACTIVE' | 'INACTIVE' | 'PAUSED',
        currentPnL: d.currentPnL ?? 0,
        pnlPercent: d.pnlPercent ?? 0,
        drawdownPercent: d.drawdownPercent ?? 0,
        winRate: d.winRate ?? 0,
        signalCount24h: d.signalCount24h ?? 0,
        successfulSignals24h: d.successfulSignals24h ?? 0,
        reason: (d.reason as DecisionReason) ?? DecisionReason.NEEDS_REVIEW,
        reasonExplanation: d.reasonExplanation ?? '',
        riskScore: d.riskScore ?? 0,
        subscribedSinceDay: d.subscribedSinceDay ?? 0,
        daysAtRisk: d.daysAtRisk ?? 0,
        lastSignal: d.lastSignal ?? null,
        exchange: d.exchange ?? '',
      })),
      summary: {
        totalCount: res.summary?.totalCount ?? 0,
        activeCount: res.summary?.activeCount ?? 0,
        reviewNeededCount: res.summary?.reviewNeededCount ?? 0,
        highRiskCount: res.summary?.highRiskCount ?? 0,
      },
    };
  } catch (error) {
    throw new Error(`Portfolio decisions failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Fetch complete Decision Dashboard data (overview + decisions).
 * Orchestrates both portfolio and subscription queries in parallel.
 */
export async function getDecisionDashboardData(
  statusFilter: 'ALL' | 'ACTIVE' | 'AT_RISK' = 'ALL',
): Promise<DecisionDashboardData> {
  try {
    const allDecisionsPromise = getPortfolioDecisions('ALL');
    const [overview, summaryResponse, decisionsResponse] = await Promise.all([
      getPortfolioOverview(),
      allDecisionsPromise,
      statusFilter === 'ALL' ? allDecisionsPromise : getPortfolioDecisions(statusFilter),
    ]);

    return {
      overview,
      decisions: {
        decisions: decisionsResponse.decisions,
        summary: summaryResponse.summary,
      },
    };
  } catch (error) {
    throw new Error(`Decision dashboard data failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
