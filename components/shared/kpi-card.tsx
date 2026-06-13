import { Sparkline } from './sparkline';

interface KpiCardProps {
  label: string;
  value: string;
  delta: string;
  context: string;
  trend: 'up' | 'down' | 'neutral';
  data?: number[];
}

const trendPresentation: Record<KpiCardProps['trend'], { symbol: string; className: string }> = {
  up: { symbol: '↑', className: 'text-positive bg-primary-soft' },
  down: { symbol: '↓', className: 'text-negative bg-negative-soft' },
  neutral: { symbol: '→', className: 'text-muted bg-[var(--border-base)]' },
};

export function KpiCard({ label, value, delta, context, trend, data }: KpiCardProps) {
  const trendStyle = trendPresentation[trend];

  return (
    <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:translate-y-[-2px] hover:border-[var(--primary-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">{label}</p>
          <p className="mt-3 text-4xl font-semibold leading-none text-white tracking-tight">{value}</p>
        </div>
        {data && (
          <div className="pt-1">
            <Sparkline data={data} color={trend === 'up' ? 'var(--semantic-positive)' : trend === 'down' ? 'var(--semantic-negative)' : 'var(--text-muted)'} />
          </div>
        )}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <span className={`inline-flex items-center rounded-lg px-2 py-1 text-[11px] font-bold ${trendStyle.className}`}>
          {trendStyle.symbol} {delta}
        </span>
        <span className="text-[11px] font-medium text-muted/60 uppercase tracking-wider">{context}</span>
      </div>
    </article>
  );
}
