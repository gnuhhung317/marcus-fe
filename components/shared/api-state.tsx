'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ApiStateCardProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function LoadingStateCard({ title, message }: Pick<ApiStateCardProps, 'title' | 'message'>) {
  const t = useTranslations('Common.apiState');

  return (
    <Card variant="glass-strong" className="p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('loading')}</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <div className="mt-4 h-2 w-2/3 animate-pulse rounded-full bg-border" />
    </Card>
  );
}

export function ErrorStateCard({ title, message, actionLabel, onAction, actionHref }: ApiStateCardProps) {
  const t = useTranslations('Common.apiState');

  return (
    <Card variant="glass-strong" className="p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-negative">{t('error')}</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-negative">{message}</p>
      <div className="mt-4">
        {actionHref ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={actionHref}>{actionLabel ?? t('retry')}</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel ?? t('retry')}
          </Button>
        )}
      </div>
    </Card>
  );
}

export function EmptyStateCard({ title, message, actionLabel, actionHref }: Omit<ApiStateCardProps, 'onAction'>) {
  const t = useTranslations('Common.apiState');

  return (
    <Card variant="glass-strong" className="p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('empty')}</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {actionLabel && actionHref && (
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </div>
      )}
    </Card>
  );
}

interface DashboardSkeletonCardProps {
  title?: string;
  lines?: number;
}

export function DashboardSkeletonCard({ title, lines = 4 }: DashboardSkeletonCardProps) {
  const t = useTranslations('Common.apiState');

  return (
    <Card variant="glass-strong" className="p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('loading')}</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title ?? t('dashboardBlock')}</h3>
      <div className="mt-4 space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={`${title ?? 'dashboard-block'}-${index}`}
            className={`h-3 animate-pulse rounded-full bg-border ${index === lines - 1 ? 'w-2/3' : 'w-full'}`}
          />
        ))}
      </div>
    </Card>
  );
}
