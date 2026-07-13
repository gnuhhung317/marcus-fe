'use client';

import { ErrorStateCard, LoadingStateCard } from '@/components/shared/api-state';
import { PortfolioMetrics } from '@/components/terminal/decision/portfolio-metrics';
import { useRefreshDecisionData, useDecisionOverviewQuery } from '@/lib/hooks/use-portfolio-decisions';
import { useTranslations } from 'next-intl';

export function DecisionOverviewSection() {
  const t = useTranslations('Decision.page');
  const { data: overview, error, isLoading } = useDecisionOverviewQuery();
  const { refresh } = useRefreshDecisionData();

  if (error) {
    return (
      <ErrorStateCard
        title={t('overviewErrorTitle')}
        message={error instanceof Error ? error.message : t('overviewErrorMessage')}
        onAction={refresh}
        actionLabel={t('retry')}
      />
    );
  }

  if (isLoading || !overview) {
    return <LoadingStateCard title={t('overviewLoadingTitle')} message={t('overviewLoadingMessage')} />;
  }

  return <PortfolioMetrics overview={overview} />;
}
