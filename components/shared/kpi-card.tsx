interface KpiCardProps {
  label: string;
  value: string;
  delta: string;
  context: string;
  trend: 'up' | 'down' | 'neutral';
}

const trendPresentation: Record<KpiCardProps['trend'], { symbol: string; className: string }> = {
  up: { symbol: 'UP', className: 'text-positive bg-[rgba(34,197,94,0.12)]' },
  down: { symbol: 'DOWN', className: 'text-negative bg-[rgba(244,63,94,0.14)]' },
  neutral: { symbol: 'FLAT', className: 'text-muted bg-[rgba(148,163,184,0.12)]' },
};

export function KpiCard({ label, value, delta, context, trend }: KpiCardProps) {
  const trendStyle = trendPresentation[trend];

  return (
    <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)] transition-colors duration-200 hover:border-[rgba(148,163,184,0.4)]">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-3 text-4xl font-semibold leading-none text-white">{value}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold tracking-[0.08em] ${trendStyle.className}`}>
          {trendStyle.symbol} {delta}
        </span>
        <span className="text-xs text-muted">{context}</span>
      </div>
    </article>
  );
}
