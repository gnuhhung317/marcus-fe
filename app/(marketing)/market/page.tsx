import { getLeaderboardPageData } from '@/lib/contracts/client';

export default async function MarketPage() {
  const { rows } = await getLeaderboardPageData();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Public Bot Benchmark</p>
          <h1 className="mt-3 font-display text-5xl text-white">Market Leaderboard</h1>
          <p className="mt-3 text-muted">Transparent real-time ranking for institutional trading bots.</p>
        </div>
        <div className="glass rounded-xl px-4 py-2 text-sm text-white">{rows.length} ranked bots</div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-[rgba(132,162,191,0.2)]">
        <table className="w-full border-collapse text-left">
          <thead className="bg-[rgba(16,24,40,0.82)] text-xs uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="px-4 py-4">Rank</th>
              <th className="px-4 py-4">Bot</th>
              <th className="px-4 py-4">Creator</th>
              <th className="px-4 py-4 text-right">Return 24H</th>
              <th className="px-4 py-4 text-right">Drawdown</th>
              <th className="px-4 py-4 text-right">Sharpe</th>
              <th className="px-4 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.botId} className="border-t border-[rgba(132,162,191,0.14)] bg-[rgba(6,10,18,0.58)] text-sm text-white">
                <td className="px-4 py-4 font-display text-lg text-white">{String(row.rank).padStart(2, '0')}</td>
                <td className="px-4 py-4 font-semibold">{row.botName}</td>
                <td className="px-4 py-4 text-muted">{row.creatorName}</td>
                <td className={`px-4 py-4 text-right font-semibold ${row.cagr >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {row.cagr >= 0 ? '+' : ''}
                  {row.cagr.toFixed(2)}%
                </td>
                <td className="px-4 py-4 text-right text-muted">{row.drawdown.toFixed(2)}%</td>
                <td className="px-4 py-4 text-right text-white">{row.sharpe.toFixed(2)}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-2 py-1 text-xs ${row.status === 'ACTIVE' ? 'bg-[rgba(34,197,94,0.15)] text-positive' : 'bg-[rgba(244,63,94,0.14)] text-negative'}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
