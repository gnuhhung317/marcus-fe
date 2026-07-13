'use client';

import { ErrorStateCard, LoadingStateCard } from '@/components/shared/api-state';
import { EquityOverview } from '@/components/terminal/decision/equity-overview';
import { useDecisionPerformanceQuery, useRefreshDecisionData } from '@/lib/hooks/use-portfolio-decisions';
import { useTranslations } from 'next-intl';

export function DecisionPerformanceSection() {
  const t = useTranslations('Decision.page');
  const { data, error, isLoading } = useDecisionPerformanceQuery();
  const { refresh } = useRefreshDecisionData();

  if (error) {
    return (
      <ErrorStateCard
        title={t('performanceErrorTitle')}
        message={error instanceof Error ? error.message : t('performanceErrorMessage')}
        onAction={refresh}
        actionLabel={t('retry')}
      />
    );
  }

  if (isLoading || !data) {
    return <LoadingStateCard title={t('performanceLoadingTitle')} message={t('performanceLoadingMessage')} />;
  }

  return <EquityOverview performanceSeries={data.performanceSeries} allocations={data.allocations} />;
}
