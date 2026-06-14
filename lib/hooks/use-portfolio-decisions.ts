'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getDashboardPageData, getDecisionDashboardData } from '@/lib/contracts/client';
import { AllocationSlice, BotDecisionCard, PortfolioOverview, TimeSeriesValue } from '@/lib/contracts/types';

export type DecisionStatusFilter = 'ALL' | 'ACTIVE' | 'AT_RISK';

type DecisionDashboardData = Awaited<ReturnType<typeof getDecisionDashboardData>>;
type DashboardPageData = Awaited<ReturnType<typeof getDashboardPageData>>;

interface UsePortfolioDecisionsOptions {
  enabled?: boolean;
  initialStatusFilter?: DecisionStatusFilter;
}

export interface UsePortfolioDecisionsResult {
  overview: PortfolioOverview | null;
  summary: DecisionDashboardData['decisions']['summary'] | null;
  decisions: BotDecisionCard[];
  performanceSeries: TimeSeriesValue[];
  allocations: AllocationSlice[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  statusFilter: DecisionStatusFilter;
  setStatusFilter: (status: DecisionStatusFilter) => void;
  refresh: () => Promise<void>;
}

export function usePortfolioDecisions({
  enabled = true,
  initialStatusFilter = 'ALL',
}: UsePortfolioDecisionsOptions = {}): UsePortfolioDecisionsResult {
  const [statusFilter, setStatusFilter] = useState<DecisionStatusFilter>(initialStatusFilter);
  const [data, setData] = useState<{ decisionData: DecisionDashboardData; dashboardData: DashboardPageData } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const hasLoadedRef = useRef(false);

  const loadData = useCallback(
    async (filter: DecisionStatusFilter, mode: 'initial' | 'refresh') => {
      const requestId = ++requestIdRef.current;
      const loadingState = mode === 'initial';

      if (loadingState) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setError(null);

      try {
        const [decisionData, dashboardData] = await Promise.all([
          getDecisionDashboardData(filter),
          getDashboardPageData(),
        ]);

        if (requestId !== requestIdRef.current) {
          return;
        }

        setData({ decisionData, dashboardData });
        hasLoadedRef.current = true;
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setError(err instanceof Error ? err.message : 'Failed to load decision dashboard data');
      } finally {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    void loadData(statusFilter, hasLoadedRef.current ? 'refresh' : 'initial');
  }, [enabled, loadData, statusFilter]);

  const refresh = useCallback(async () => {
    if (!enabled) {
      return;
    }

    await loadData(statusFilter, hasLoadedRef.current ? 'refresh' : 'initial');
  }, [enabled, loadData, statusFilter]);

  return {
    overview: data?.decisionData.overview ?? null,
    summary: data?.decisionData.decisions.summary ?? null,
    decisions: data?.decisionData.decisions.decisions ?? [],
    performanceSeries: data?.dashboardData.performanceSeries ?? [],
    allocations: data?.dashboardData.allocations ?? [],
    isLoading,
    isRefreshing,
    error,
    statusFilter,
    setStatusFilter,
    refresh,
  };
}
