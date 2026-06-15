import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { StatusDot } from '@/components/shared/status-dot';
import { BotMetricBlock } from '@/lib/contracts/types';

interface MarketplaceBotRuntimeSnapshotProps {
  isActive: boolean;
  primaryBlock: BotMetricBlock | null;
  status: string;
}

function formatMetric(value: string | undefined | null) {
  return value && value.length ? value : 'N/A';
}

function getTrendColor(valStr: string | null | undefined) {
  if (!valStr || valStr === 'N/A' || valStr === '0.00%') return 'text-main';
  return valStr.startsWith('-') ? 'text-negative' : 'text-positive';
}

export function MarketplaceBotRuntimeSnapshot({
  isActive,
  primaryBlock,
  status,
}: MarketplaceBotRuntimeSnapshotProps) {
  if (!primaryBlock) {
    return null;
  }

  const snapshotMetrics = [
    {
      label: 'Annual return',
      value: formatMetric(primaryBlock.annualReturn),
      tone: getTrendColor(primaryBlock.annualReturn),
    },
    {
      label: 'Max drawdown',
      value: formatMetric(primaryBlock.maxDrawdown),
      tone: 'text-negative',
    },
    {
      label: 'Sharpe ratio',
      value: formatMetric(primaryBlock.sharpe),
      tone: 'text-main',
    },
    {
      label: 'Win rate',
      value: formatMetric(primaryBlock.winRate),
      tone: 'text-main',
    },
  ];

  const snapshotPills = [
    { label: 'Sample days', value: String(primaryBlock.sampleSizeDays ?? 0) },
    { label: 'Closed trades', value: String(primaryBlock.sampleSizeTrades ?? 0) },
  ];

  return (
    <Card variant="glass-strong" className="p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Overview</p>
          <h2 className="mt-2 text-2xl font-semibold text-main">Runtime Snapshot</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Live and dry-run metrics for the current marketplace subscription state.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isActive ? 'success' : 'warning'}>
            <StatusDot status={isActive ? 'active' : 'warning'} className="mr-1.5" size="sm" />
            {status}
          </Badge>
          <Badge variant="outline" className="border-primary/20 bg-primary-soft text-primary">
            {primaryBlock.title === 'Out-of-sample' ? 'Live / Dry Run' : primaryBlock.title}
          </Badge>
          {primaryBlock.warning ? (
            <div className="max-w-[18rem] rounded-xl border border-warning/20 bg-warning/10 px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-warning">
              {primaryBlock.warning}
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
