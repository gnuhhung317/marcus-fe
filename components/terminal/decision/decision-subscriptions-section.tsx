'use client';

import { useMemo, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { ErrorStateCard, LoadingStateCard } from '@/components/shared/api-state';
import { SubscriptionList } from '@/components/terminal/decision/subscription-list';
import {
  matchesDecisionStatusFilter,
  useDecisionSubscriptionsQuery,
  useRefreshDecisionData,
  type DecisionStatusFilter,
} from '@/lib/hooks/use-portfolio-decisions';

export function DecisionSubscriptionsSection() {
  const t = useTranslations('Decision.page');
  const [statusFilter, setStatusFilter] = useState<DecisionStatusFilter>('ALL');
  const [isPending, startTransition] = useTransition();
  const { data, error, isLoading } = useDecisionSubscriptionsQuery();
  const { refresh } = useRefreshDecisionData();

  const filteredCards = useMemo(
    () => data?.decisions.filter((card) => matchesDecisionStatusFilter(card, statusFilter)) ?? [],
    [data?.decisions, statusFilter]
  );

  if (error) {
    return (
      <ErrorStateCard
        title={t('error.title')}
        message={error instanceof Error ? error.message : t('error.message')}
        onAction={refresh}
        actionLabel={t('retry')}
      />
    );
  }

  if (isLoading || !data) {
    return <LoadingStateCard title={t('triage')} message={t('subscriptionsLoadingMessage')} />;
  }

  return (
    <SubscriptionList
      cards={filteredCards}
      statusFilter={statusFilter}
      onStatusFilterChange={(nextStatus) => startTransition(() => setStatusFilter(nextStatus))}
      onRefreshRequested={refresh}
      summary={data.summary}
      isFiltering={isPending}
    />
  );
}
