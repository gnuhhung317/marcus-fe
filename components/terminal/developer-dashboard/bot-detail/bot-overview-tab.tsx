import { LifecycleBadge } from '@/components/shared/lifecycle-badge';
import { DeveloperBotDetail, DeveloperBotStatus } from '@/lib/contracts/types';
import { Card } from '@/components/ui/card';

interface BotOverviewTabProps {
  bot: DeveloperBotDetail;
  localStatus: DeveloperBotStatus;
  subscriberCount: number;
  connectedCount: number;
  activeCount: number;
}

function formatMetricPercent(val: number | null | undefined, alwaysSign = false) {
  if (val === undefined || val === null) return 'N/A';
  const value = val * 100;
  const prefix = alwaysSign && value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

function formatDrawdownPercent(val: number | null | undefined) {
  if (val === undefined || val === null) return 'N/A';
  const value = Math.abs(val) * 100;
  return `-${value.toFixed(2)}%`;
}

function formatMetricNumber(val: number | null | undefined, decimals = 2) {
  if (val === undefined || val === null) return 'N/A';
  return val.toFixed(decimals);
}

export function BotOverviewTab({ bot, localStatus, subscriberCount, connectedCount, activeCount }: BotOverviewTabProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Summary</h2>
            <p className="mt-1 text-sm text-muted">Value-first snapshot of the current bot configuration.</p>     
          </div>
          <LifecycleBadge status={localStatus} />
        </div>

        <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Status', value: localStatus },
            { label: 'Subscribers', value: String(subscriberCount) },
            { label: 'Connected', value: String(connectedCount) },
            { label: 'Active', value: String(activeCount) },
          ].map((item) => (
            <Card key={item.label} variant="glass-strong" className="h-full p-4">
              <div className="flex h-full flex-col justify-between">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{item.label}</p>
                <p className="mt-3 text-lg font-semibold text-main">{item.value}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {bot.performance && (
        <section className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Annual return', value: formatMetricPercent(bot.performance.annualReturn, true), tone: 'text-positive' },
            { label: 'Max drawdown', value: formatDrawdownPercent(bot.performance.maxDrawdown), tone: 'text-negative' },
            { label: 'Sharpe', value: formatMetricNumber(bot.performance.sharpe), tone: 'text-main' },
            { label: 'Win rate', value: formatMetricPercent(bot.performance.winRate), tone: 'text-main' },
          ].map((item) => (
            <Card key={item.label} variant="glass-strong" className="h-full p-4">
              <div className="flex h-full flex-col justify-between">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{item.label}</p>
                <p className={`mt-3 text-lg font-semibold ${item.tone}`}>{item.value}</p>
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
