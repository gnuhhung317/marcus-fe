import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getStrategyPageData } from '../../../lib/contracts/client';
import { TimeSeriesValue } from '../../../lib/contracts/types';

function buildSeriesPath(series: TimeSeriesValue[]) {
  if (series.length <= 1) {
    return 'M0,30 L100,10';
  }

  const values = series.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  return series
    .map((point, index) => {
      const x = (index / (series.length - 1)) * 100;
      const normalized = (point.value - minValue) / range;
      const y = 36 - normalized * 30;
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

export default async function TerminalStrategiesPage() {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role !== 'OPERATOR' && role !== 'ADMIN') {
    redirect('/terminal');
  }

  const strategy = await getStrategyPageData();
  const chartPath = buildSeriesPath(strategy.performanceSeries);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Live Analytics</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">{strategy.strategyName}</h1>
          <p className="mt-2 text-sm text-muted">
            Owned by {strategy.ownerName} · Market {strategy.market} · Status {strategy.status}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-xl border border-[rgba(132,162,191,0.3)] px-4 py-2 text-sm text-white">Export JSON</button>
          <button className="rounded-xl cta-primary px-4 py-2 text-sm font-semibold">Deploy to Paper</button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {strategy.metrics.map((metric) => (
          <article key={metric.label} className="glass-strong rounded-2xl p-4 shadow-[var(--shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
        <h2 className="text-2xl font-semibold text-white">Performance Vector</h2>
        <div className="mt-6 h-72 rounded-xl border border-[rgba(132,162,191,0.2)] bg-[linear-gradient(180deg,rgba(62,183,255,0.07),rgba(19,227,163,0.06))] p-4">
          <svg viewBox="0 0 100 40" className="h-full w-full text-[var(--primary)]" preserveAspectRatio="none" aria-label="Strategy performance curve">
            <path d={chartPath} fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
      </section>

      <section className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
        <h2 className="text-2xl font-semibold text-white">Trade Logs</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.15em] text-muted">
              <tr>
                <th className="py-3">Timestamp</th>
                <th className="py-3">Pair</th>
                <th className="py-3">Side</th>
                <th className="py-3 text-right">Net PnL</th>
              </tr>
            </thead>
            <tbody>
              {strategy.trades.map((trade) => (
                <tr key={`${trade.timestamp}-${trade.pair}`} className="border-t border-[rgba(132,162,191,0.15)]">
                  <td className="py-3 text-muted">
                    {Number.isNaN(Date.parse(trade.timestamp))
                      ? trade.timestamp
                      : new Date(trade.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 text-white">{trade.pair}</td>
                  <td className="py-3 text-white">{trade.side}</td>
                  <td className={`py-3 text-right font-semibold ${trade.pnl >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {trade.pnl >= 0 ? '+' : ''}
                    {trade.pnl.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
