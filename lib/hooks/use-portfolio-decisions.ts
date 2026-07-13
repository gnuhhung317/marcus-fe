'use client';

import { useCallback, useTransition } from 'react';
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query';
import { BotDecisionCard, DecisionReason } from '@/lib/contracts/types';
import { getDashboardOverviewData, getDashboardPerformanceSeries, getPortfolioDecisions, getPortfolioOverview, unsubscribeFromBot } from '@/lib/contracts/client';

export type DecisionStatusFilter = 'ALL' | 'ACTIVE' | 'AT_RISK';

const atRiskReasons = new Set<DecisionReason>([DecisionReason.NEEDS_REVIEW, DecisionReason.HIGH_RISK]);

export const decisionKeys = {
  root: ['decision-dashboard'] as const,
  overview: () => [...decisionKeys.root, 'overview'] as const,
  performance: () => [...decisionKeys.root, 'performance'] as const,
  subscriptions: () => [...decisionKeys.root, 'subscriptions'] as const,
};

export function useDecisionOverviewQuery() {
  return useQuery({
    queryKey: decisionKeys.overview(),
    queryFn: getPortfolioOverview,
  });
}

export function useDecisionPerformanceQuery() {
  return useQuery({
    queryKey: decisionKeys.performance(),
    queryFn: async () => {
      const [dashboard, performanceSeries] = await Promise.all([
        getDashboardOverviewData(),
        getDashboardPerformanceSeries('7D'),
      ]);

      return {
        allocations: dashboard.allocations,
        performanceSeries,
      };
    },
  });
}

export function matchesDecisionStatusFilter(card: BotDecisionCard, statusFilter: DecisionStatusFilter) {
  switch (statusFilter) {
    case 'AT_RISK':
      return atRiskReasons.has(card.reason);
    case 'ACTIVE':
      return !atRiskReasons.has(card.reason);
    case 'ALL':
    default:
      return true;
  }
}

export function useDecisionSubscriptionsQuery() {
  return useQuery({
    queryKey: decisionKeys.subscriptions(),
    queryFn: () => getPortfolioDecisions('ALL'),
  });
}

export function useRefreshDecisionData() {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const isFetching = useIsFetching({ queryKey: decisionKeys.root }) > 0;

  const refresh = useCallback(() => {
    startTransition(() => {
      void queryClient.invalidateQueries({ queryKey: decisionKeys.root });
    });
  }, [queryClient, startTransition]);

  return {
    refresh,
    isRefreshing: isFetching || isPending,
  };
}

export function useUnsubscribeFromDecisionBot() {
  const queryClient = useQueryClient();

  return useCallback(
    async (botId: string) => {
      await unsubscribeFromBot(botId);
      await queryClient.invalidateQueries({ queryKey: decisionKeys.root });
    },
    [queryClient]
  );
}
