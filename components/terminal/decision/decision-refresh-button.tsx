'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useRefreshDecisionData } from '@/lib/hooks/use-portfolio-decisions';

export function DecisionRefreshButton() {
  const t = useTranslations('Decision.page');
  const { refresh, isRefreshing } = useRefreshDecisionData();

  return (
    <Button variant="outline" size="sm" onClick={refresh} isLoading={isRefreshing} className="min-w-32">
      {t('sync')}
    </Button>
  );
}
