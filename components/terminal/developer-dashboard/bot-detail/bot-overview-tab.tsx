import { LifecycleBadge } from '@/components/shared/lifecycle-badge';
import { DeveloperBotDetail, DeveloperBotStatus } from '@/lib/contracts/types';
import { RiskBar } from '@/components/shared/risk-bar';
import { Badge } from '@/components/ui/badge';
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
  const maxDrawdownValue = bot.performance?.maxDrawdown ? Math.abs(bot.performance.maxDrawdown) : 0;
  const riskScore = maxDrawdownValue > 0.25 ? 'HIGH' : maxDrawdownValue > 0.12 ? 'MEDIUM' : 'LOW';
  const riskNumeric = riskScore === 'HIGH' ? 8 : riskScore === 'MEDIUM' ? 5 : 2;

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Telemetry Summary</h2>
          <LifecycleBadge status={localStatus} />
        </div>

        <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/40 bg-surface/40 border-none font-mono">
          {[
            { label: 'Status', value: localStatus },
            { label: 'Subscribers', value: String(subscriberCount) },
            { label: 'Connected', value: String(connectedCount) },
            { label: 'Active', value: String(activeCount) },
          ].map((item) => (
            <div key={item.label} className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{item.label}</p>
              <p className="mt-2 text-xl font-bold tracking-tight text-main">{item.value}</p>
            </div>
          ))}
        </Card>
      </section>

      {bot.performance && (
        <section className="space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Performance Metrics</h2>
          <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/40 bg-surface/40 border-none font-mono">
            {[
              { label: 'Annual return', value: formatMetricPercent(bot.performance.annualReturn, true), tone: 'text-positive' },
              { label: 'Max drawdown', value: formatDrawdownPercent(bot.performance.maxDrawdown), tone: 'text-negative' },
              { label: 'Sharpe ratio', value: formatMetricNumber(bot.performance.sharpe), tone: 'text-main' },
              { label: 'Win rate', value: formatMetricPercent(bot.performance.winRate), tone: 'text-main' },
            ].map((item) => (
              <div key={item.label} className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{item.label}</p>
                <p className={`mt-2 text-xl font-bold ${item.tone} tracking-tight`}>{item.value}</p>
              </div>
            ))}
          </Card>
        </section>
      )}

      {/* Risk Profile Section */}
      <section className="space-y-3">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted font-mono">Risk Profile</h2>
        <Card className="p-6 bg-surface/40 border-none">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-medium text-muted/80">Risk exposure based on drawdown limits</span>
            <Badge
              variant={riskScore === 'HIGH' ? 'error' : riskScore === 'MEDIUM' ? 'warning' : 'success'}
              className="rounded-lg px-3 py-1 text-[10px] font-bold font-mono"
            >
              {riskScore} RISK ({riskNumeric}/10)
            </Badge>
          </div>
          <RiskBar value={riskNumeric} max={10} />
        </Card>
      </section>
    </div>
  );
}
