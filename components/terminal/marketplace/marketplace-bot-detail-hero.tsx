import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusDot } from '@/components/shared/status-dot';

interface MarketplaceBotDetailHeroProps {
  botId: string;
  description: string;
  exchange?: string | null;
  isActive: boolean;
  name: string;
  status: string;
  tradingPair?: string | null;
}

export function MarketplaceBotDetailHero({
  botId,
  description,
  exchange,
  isActive,
  name,
  status,
  tradingPair,
}: MarketplaceBotDetailHeroProps) {
  const t = useTranslations('Marketplace.detailHero');

  return (
    <header className="flex flex-wrap items-start justify-between gap-6">
      <div className="max-w-3xl space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('eyebrow')}</p>
          <h1 className="mt-2 text-4xl font-semibold text-main">{name}</h1>
          <p className="mt-3 text-sm text-muted">{description}</p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border/40 bg-surface/30 px-4 py-3">
            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted">{t('status')}</dt>
            <dd className="mt-1 flex items-center gap-2 text-sm font-semibold text-main">
              <StatusDot status={isActive ? 'active' : 'warning'} className="shrink-0" size="sm" />
              {status}
            </dd>
          </div>
          <div className="rounded-xl border border-border/40 bg-surface/30 px-4 py-3">
            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted">{t('exchange')}</dt>
            <dd className="mt-1 truncate text-sm font-semibold text-main">{exchange || t('na')}</dd>
          </div>
          <div className="rounded-xl border border-border/40 bg-surface/30 px-4 py-3">
            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted">{t('pair')}</dt>
            <dd className="mt-1 truncate text-sm font-semibold text-main">{tradingPair || t('na')}</dd>
          </div>
          <div className="rounded-xl border border-border/40 bg-surface/30 px-4 py-3">
            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted">{t('botId')}</dt>
            <dd className="mt-1 truncate font-mono text-xs text-main" title={botId}>
              {botId}
            </dd>
          </div>
        </dl>
      </div>

      <Button asChild variant="outline">
        <Link href="/terminal/marketplace">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Link>
      </Button>
    </header>
  );
}
