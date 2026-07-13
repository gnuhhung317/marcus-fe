import { LoadingStateCard } from '@/components/shared/api-state';
import { getTranslations } from 'next-intl/server';

export default async function TerminalLoading() {
  const t = await getTranslations('Terminal.loading');

  return (
    <div className="space-y-4">
      <LoadingStateCard title={t('title')} message={t('message')} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="glass-strong h-28 animate-pulse rounded-2xl bg-border/14" />
        <div className="glass-strong h-28 animate-pulse rounded-2xl bg-border/14" />
        <div className="glass-strong h-28 animate-pulse rounded-2xl bg-border/14" />
        <div className="glass-strong h-28 animate-pulse rounded-2xl bg-border/14" />
      </div>
    </div>
  );
}
