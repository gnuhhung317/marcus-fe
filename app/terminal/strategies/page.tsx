import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getStrategyPageData } from '@/lib/contracts/client';
import { PerformanceChart } from '@/components/shared/performance-chart';

export default async function TerminalStrategiesPage() {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role !== 'OPERATOR' && role !== 'ADMIN') {
    redirect('/terminal');
  }

  const strategy = await getStrategyPageData();

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

      <section className="grid gap-5 xl:grid-cols-[minmax(280px,0.32fr)_minmax(0,0.68fr)]">
        <div className="space-y-5">
          {strategy.metricBlocks.map((block) => (
            <article key={block.title} className="glass-strong rounded-lg p-5 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-semibold text-white">{block.title}</h2>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-[rgba(132,162,191,0.22)] bg-white/[0.04] px-3 py-3">
                  <span className="text-sm text-white">Estimated annual return</span>
                  <span className="font-semibold text-positive">{block.annualReturn}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[rgba(132,162,191,0.22)] bg-white/[0.04] px-3 py-3">
                  <span className="text-sm text-white">Maximum drawdown</span>
                  <span className="font-semibold text-positive">{block.maxDrawdown}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[rgba(132,162,191,0.22)] bg-white/[0.04] px-3 py-3">
                  <span className="text-sm text-white">Sharpe ratio</span>
                  <span className="font-semibold text-white">{block.sharpe}</span>
                </div>
              </div>
              {block.warning ? (
                <p className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200" title={block.warning}>
                  {block.warning}
                </p>
              ) : null}
            </article>
          ))}
        </div>

        <div className="space-y-5">
          <section className="glass-strong rounded-lg p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-2xl font-semibold text-white">Performance chart</h2>
            <div className="mt-6">
              <PerformanceChart data={strategy.performanceSeries} splitTimestamp={strategy.splitTimestamp} />
            </div>
          </section>

          <section className="glass-strong rounded-lg p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-2xl font-semibold text-white">Performance metrics</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {strategy.metrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between border-b border-[rgba(132,162,191,0.16)] py-3">
                  <span className="text-sm font-medium text-white">{metric.label}</span>
                  <span className="text-lg font-semibold text-positive">{metric.value}</span>
                </div>
              ))}
            </div>
          </section>
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
