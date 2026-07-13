'use client';

import { ErrorStateCard } from '@/components/shared/api-state';
import { useTranslations } from 'next-intl';

export default function TerminalError({ reset }: { reset: () => void }) {
  const t = useTranslations('Terminal.error');

  return (
    <ErrorStateCard
      title={t('title')}
      message={t('message')}
      actionLabel={t('action')}
      onAction={reset}
    />
  );
}
