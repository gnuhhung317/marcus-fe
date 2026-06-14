import { EmptyStateCard, ErrorStateCard } from '@/components/shared/api-state';
import { getLeaderboardPageData } from '@/lib/contracts/client';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default async function MarketPage() {
  try {
    const { rows } = await getLeaderboardPageData({ dataSource: 'ALL' });

    if (rows.length === 0) {
      return (
        <EmptyStateCard
          title="No market leaderboard rows yet"
          message="The public benchmark feed has not returned any rows yet."
          actionLabel="Refresh"
          actionHref="/market"
        />
      );
    }

    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl text-main uppercase">Market Leaderboard</h1>
          </div>
          <Card variant="glass" className="px-4 py-2 text-sm text-main">
            {rows.length} ranked bots
          </Card>
        </header>

        <Card variant="glass-strong" className="overflow-hidden p-0">
          <table className="w-full border-collapse text-left">
            <thead className="bg-surface-strong text-xs uppercase tracking-[0.16em] text-muted">
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
                <tr key={row.botId} className="border-t border-border/60 bg-surface/70 text-sm text-main">
                  <td className="px-4 py-4 font-display text-lg text-main">{String(row.rank).padStart(2, '0')}</td>
                  <td className="px-4 py-4 font-semibold">{row.botName}</td>
                  <td className="px-4 py-4 text-muted">{row.creatorName}</td>
                  <td className={`px-4 py-4 text-right font-semibold ${row.cagr >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {row.cagr >= 0 ? '+' : ''}
                    {row.cagr.toFixed(2)}%
                  </td>
                  <td className="px-4 py-4 text-right text-muted">{row.drawdown.toFixed(2)}%</td>
                  <td className="px-4 py-4 text-right text-main">{row.sharpe.toFixed(2)}</td>
                  <td className="px-4 py-4">
                    <Badge variant={row.status === 'ACTIVE' ? 'success' : 'error'} className="text-[10px]">
                      {row.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  } catch (error) {
    return (
      <ErrorStateCard
        title="Market leaderboard unavailable"
        message={error instanceof Error ? error.message : 'Unable to load the public leaderboard right now.'}
        actionLabel="Retry"
        actionHref="/market"
      />
    );
  }
}
