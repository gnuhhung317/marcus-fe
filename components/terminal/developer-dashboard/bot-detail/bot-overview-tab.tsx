import { LifecycleBadge } from '@/components/shared/lifecycle-badge';
import { DeveloperBotDetail, DeveloperBotStatus } from '@/lib/contracts/types';
import { RiskBar } from '@/components/shared/risk-bar';

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
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="font-sans">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Summary</h2>
            <p className="mt-1 text-xs text-slate-400">Current active session telemetry and configuration stats.</p>     
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
            <div key={item.label} className="rounded-xl border border-border bg-surface p-4 flex flex-col justify-between h-full font-mono">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
              <p className="mt-3 text-lg font-bold text-white tracking-tight">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {bot.performance && (
        <section className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Annual return', value: formatMetricPercent(bot.performance.annualReturn, true), tone: 'text-positive' },
            { label: 'Max drawdown', value: formatDrawdownPercent(bot.performance.maxDrawdown), tone: 'text-negative' },
            { label: 'Sharpe ratio', value: formatMetricNumber(bot.performance.sharpe), tone: 'text-white' },
            { label: 'Win rate', value: formatMetricPercent(bot.performance.winRate), tone: 'text-white' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-surface p-4 flex flex-col justify-between h-full font-mono">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
              <p className={`mt-3 text-lg font-bold ${item.tone} tracking-tight`}>{item.value}</p>
            </div>
          ))}
        </section>
      )}

      {/* Risk Profile Section */}
      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Risk Profile</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
              Dynamic risk classification based on portfolio drawdown limits.
            </p>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
            riskScore === 'HIGH' ? 'text-negative' : riskScore === 'MEDIUM' ? 'text-warning' : 'text-positive'
          }`}>
            {riskScore} RISK ({riskNumeric}/10)
          </span>
        </div>
        <div className="mt-4">
          <RiskBar value={riskNumeric} max={10} />
        </div>
      </section>
    </div>
  );
}
