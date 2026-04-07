import { getLeaderboardPageData } from '../../../lib/contracts/client';

export default async function TerminalLeaderboardPage() {
  const { featured, rows } = await getLeaderboardPageData();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Verified Performance</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Leaderboard</h1>
          <p className="mt-2 text-sm text-muted">Third-party verified metrics with live strategy ranking.</p>
        </div>
        <button className="rounded-xl border border-[rgba(132,162,191,0.3)] px-4 py-2 text-sm text-white">Advanced Filters</button>
      </header>

      <section className="grid gap-5 xl:grid-cols-3">
        {featured.map((row) => (
          <article key={row.strategyId} className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Rank #{row.rank}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{row.strategyName}</h2>
            <p className="mt-3 text-sm text-muted">By {row.category} Lab</p>
            <p className="mt-6 text-4xl font-semibold text-positive">+{row.return24h.toFixed(2)}%</p>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-lg border border-[rgba(132,162,191,0.3)] px-3 py-2 text-sm text-white">Details</button>
              <button className="flex-1 rounded-lg cta-primary px-3 py-2 text-sm font-semibold">Connect</button>
            </div>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.22)]">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[rgba(148,163,184,0.08)] text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Strategy</th>
              <th className="px-4 py-3">Creator</th>
              <th className="px-4 py-3 text-right">Return 24h</th>
              <th className="px-4 py-3 text-right">Drawdown</th>
              <th className="px-4 py-3 text-right">Sharpe</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.strategyId} className="border-t border-[rgba(148,163,184,0.18)] transition-colors hover:bg-[rgba(148,163,184,0.08)]">
                <td className="px-4 py-3.5 text-white">#{row.rank}</td>
                <td className="px-4 py-3.5 font-medium text-white">{row.strategyName}</td>
                <td className="px-4 py-3.5 text-muted">{row.category}</td>
                <td className={`px-4 py-3.5 text-right font-semibold ${row.return24h >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {row.return24h >= 0 ? '+' : ''}
                  {row.return24h.toFixed(2)}%
                </td>
                <td className="px-4 py-3.5 text-right text-muted">{row.drawdown.toFixed(2)}%</td>
                <td className="px-4 py-3.5 text-right text-white">{row.sharpe.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
