import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { StatusDot } from '@/components/shared/status-dot';
import { BotMetricBlock, BotPerformance, BotPerformanceSource } from '@/lib/contracts/types';

interface MarketplaceBotRuntimeSnapshotProps {
  isActive: boolean;
  performance?: BotPerformance;
  performanceSource?: BotPerformanceSource | null;
  selectedMetricBlock?: BotMetricBlock | null;
  status: string;
}

function formatPercent(value: number | undefined | null, alwaysSign = false) {
  if (value === undefined || value === null) {
    return 'N/A';
  }

  const percentValue = value * 100;
  const prefix = alwaysSign && percentValue >= 0 ? '+' : '';
  return `${prefix}${percentValue.toFixed(2)}%`;
}

function formatDrawdown(value: number | undefined | null) {
  if (value === undefined || value === null) {
    return 'N/A';
  }

  return `-${(Math.abs(value) * 100).toFixed(2)}%`;
}

function formatRatio(value: number | undefined | null) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return 'N/A';
  }

  return value.toFixed(2);
}

function getTrendColor(valStr: string) {
  if (!valStr || valStr === 'N/A') return 'text-main';
  const normalized = valStr.replace(/^[+-]/, '');
  if (normalized === '0.00%') return 'text-main';
  return valStr.startsWith('-') ? 'text-negative' : 'text-positive';
}

function getSourceLabel(source: BotPerformanceSource | null | undefined, t: ReturnType<typeof useTranslations>) {
  switch (source) {
    case 'DRY_RUN':
      return t('sources.dryRun');
    case 'HISTORICAL':
      return t('sources.historical');
    case 'SIGNAL_BASED':
      return t('sources.signalBasedFallback');
    default:
      return t('sources.unavailable');
  }
}

export function MarketplaceBotRuntimeSnapshot({
  isActive,
  performance,
  performanceSource,
  selectedMetricBlock,
  status,
}: MarketplaceBotRuntimeSnapshotProps) {
  const t = useTranslations('Marketplace.snapshot');
  if (!selectedMetricBlock && !performance) {
    return null;
  }

  const annualReturn = selectedMetricBlock?.annualReturn ?? formatPercent(performance?.annualReturn, true);
  const maxDrawdown = selectedMetricBlock?.maxDrawdown ?? formatDrawdown(performance?.maxDrawdown);
  const sharpe = selectedMetricBlock?.sharpe ?? formatRatio(performance?.sharpe);
  const winRate = selectedMetricBlock?.winRate ?? formatPercent(performance?.winRate);
  const snapshotMetrics = [
    {
      label: t('annualReturn'),
      value: annualReturn,
      tone: getTrendColor(annualReturn),
    },
    {
      label: t('maxDrawdown'),
      value: maxDrawdown,
      tone: 'text-negative',
    },
    {
      label: t('sharpeRatio'),
      value: sharpe,
      tone: 'text-main',
    },
    {
      label: t('winRate'),
      value: winRate,
      tone: 'text-main',
    },
  ];

  const snapshotPills = selectedMetricBlock
    ? [
        { label: t('sampleDays'), value: String(selectedMetricBlock.sampleSizeDays ?? 0) },
        { label: t('closedTrades'), value: String(selectedMetricBlock.sampleSizeTrades ?? 0) },
      ]
    : [];

  return (
    <Card variant="glass-strong" className="p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('eyebrow')}</p>
          <h2 className="mt-2 text-2xl font-semibold text-main">{t('title')}</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted">{t('description')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isActive ? 'success' : 'warning'}>
            <StatusDot status={isActive ? 'active' : 'warning'} className="mr-1.5" size="sm" />
            {status}
          </Badge>
          <Badge variant="outline" className="border-primary/20 bg-primary-soft text-primary">
            {getSourceLabel(performanceSource, t)}
          </Badge>
          {selectedMetricBlock?.warning ? (
            <div className="max-w-[18rem] rounded-xl border border-warning/20 bg-warning/10 px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-warning">
              {selectedMetricBlock.warning}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 border-t border-border/40 pt-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {snapshotMetrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-border/40 bg-surface/30 p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{metric.label}</p>
              <p className={`mt-2 text-2xl font-bold font-mono ${metric.tone}`}>{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {snapshotPills.map((pill) => (
            <span
              key={pill.label}
              className="rounded-full border border-border/40 bg-surface/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted"
            >
              {pill.label} {pill.value}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
