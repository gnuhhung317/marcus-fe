'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyStateCard } from '@/components/shared/api-state';
import { cn } from '@/lib/utils';
import { LeaderboardPageData, LeaderboardRow } from '@/lib/contracts/types';

interface LeaderboardClientProps {
  initialData: LeaderboardPageData;
}

type TabKey = 'main' | 'proving-grounds';
type SortKey = 'CAGR' | 'SHARPE';
type PodiumVariant = 'gold' | 'silver' | 'bronze';

function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function getDataSourceBadge(dataSource?: string) {
  if (dataSource === 'DRY_RUN') {
    return <Badge variant="success">OOS</Badge>;
  }

  if (dataSource === 'HISTORICAL') {
    return <Badge variant="warning">Backtest</Badge>;
  }

  return null;
}

function getPodiumPresentation(variant: PodiumVariant) {
  switch (variant) {
    case 'gold':
      return {
        border: 'border-[hsl(var(--semantic-warning)/0.55)]',
        label: 'text-warning',
        badge: 'warning' as const,
        accent: 'bg-warning/10',
      };
    case 'silver':
      return {
        border: 'border-border-line',
        label: 'text-muted',
        badge: 'outline' as const,
        accent: 'bg-surface-strong',
      };
    case 'bronze':
    default:
      return {
        border: 'border-[hsl(var(--semantic-warning)/0.28)]',
        label: 'text-warning',
        badge: 'warning' as const,
        accent: 'bg-warning/5',
      };
  }
}

function PodiumCard({
  row,
  rank,
  variant,
}: {
  row: LeaderboardRow;
  rank: number;
  variant: PodiumVariant;
}) {
  const isCenter = rank === 1;
  const style = getPodiumPresentation(variant);

  return (
    <Card
      variant="glass-strong"
      className={cn(
        'flex h-full flex-col gap-5 p-6 shadow-soft',
        style.border,
        isCenter && 'min-h-[24rem] lg:translate-y-[-0.75rem]'
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Badge variant={style.badge}>Rank #{rank}</Badge>
        {getDataSourceBadge(row.dataSource)}
      </div>

      <div className={cn('rounded-2xl border border-border p-4', style.accent)}>
        <h2 className="line-clamp-1 text-2xl font-semibold text-main">{row.botName}</h2>
        <p className="mt-1 text-sm text-muted">By {row.creatorName}</p>
      </div>

      <div className="mt-auto grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-surface p-3">
          <p className="text-[10px] uppercase tracking-[0.12em] text-muted">CAGR</p>
          <p className={cn('mt-1 text-2xl font-semibold', row.cagr >= 0 ? 'text-positive' : 'text-negative')}>
            {formatPercent(row.cagr)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3">
          <p className="text-[10px] uppercase tracking-[0.12em] text-muted">Drawdown</p>
          <p className="mt-1 text-2xl font-semibold text-main">{Math.abs(row.drawdown).toFixed(2)}%</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3">
          <p className="text-[10px] uppercase tracking-[0.12em] text-muted">Sharpe</p>
          <p className="mt-1 text-2xl font-semibold text-main">{row.sharpe.toFixed(2)}</p>
        </div>
      </div>

      <Button asChild className="w-full">
        <Link href={`/terminal/bots/${row.botId}`}>View Details</Link>
      </Button>
    </Card>
  );
}

function PodiumSection({ top3 }: { top3: LeaderboardRow[] }) {
  const [first, second, third] = top3;

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_1.3fr_1fr] lg:items-end">
      {second ? (
        <div className="order-2 lg:order-1">
          <PodiumCard row={second} rank={2} variant="silver" />
        </div>
      ) : (
        <div className="order-2 lg:order-1" />
      )}

      {first ? (
        <div className="order-1 lg:order-2">
          <PodiumCard row={first} rank={1} variant="gold" />
        </div>
      ) : null}

      {third ? (
        <div className="order-3 lg:order-3">
          <PodiumCard row={third} rank={3} variant="bronze" />
        </div>
      ) : null}
    </section>
  );
}

function DetailTable({ rows, startRank }: { rows: LeaderboardRow[]; startRank: number }) {
  if (rows.length === 0) return null;

  return (
    <Card variant="glass-strong" className="overflow-hidden">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-surface-strong text-xs uppercase tracking-[0.12em] text-muted">
          <tr>
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Bot</th>
            <th className="px-4 py-3">Creator</th>
            <th className="px-4 py-3 text-right">CAGR</th>
            <th className="px-4 py-3 text-right">Max DD</th>
            <th className="px-4 py-3 text-right">Sharpe</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.botId} className="border-t border-border transition-colors hover:bg-surface">
              <td className="px-4 py-3.5 font-medium text-main">#{startRank + idx}</td>
              <td className="px-4 py-3.5 font-medium text-main">
                <div className="flex items-center gap-2">
                  <span>{row.botName}</span>
                  {getDataSourceBadge(row.dataSource)}
                </div>
              </td>
              <td className="px-4 py-3.5 text-muted">{row.creatorName}</td>
              <td className={cn('px-4 py-3.5 text-right font-semibold', row.cagr >= 0 ? 'text-positive' : 'text-negative')}>
                {formatPercent(row.cagr)}
              </td>
              <td className="px-4 py-3.5 text-right text-muted">{Math.abs(row.drawdown).toFixed(2)}%</td>
              <td className="px-4 py-3.5 text-right text-main">{row.sharpe.toFixed(2)}</td>
              <td className="px-4 py-3.5 text-right">
                <Button asChild variant="link" size="sm" className="px-0">
                  <Link href={`/terminal/bots/${row.botId}`}>Details</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export default function LeaderboardClient({ initialData }: LeaderboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('main');
  const [sortBy, setSortBy] = useState<SortKey>('CAGR');

  const filteredRows = useMemo(() => {
    if (activeTab === 'main') {
      return initialData.rows.filter((row) => row.dataSource === 'DRY_RUN' || !row.dataSource);
    }

    return initialData.rows.filter((row) => row.dataSource === 'HISTORICAL');
  }, [activeTab, initialData.rows]);

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows];

    if (sortBy === 'CAGR') {
      rows.sort((left, right) => right.cagr - left.cagr);
    } else {
      rows.sort((left, right) => right.sharpe - left.sharpe);
    }

    return rows.map((row, index) => ({ ...row, rank: index + 1 }));
  }, [filteredRows, sortBy]);

  const top3 = sortedRows.slice(0, 3);
  const restRows = sortedRows.slice(3);
  const hasRows = filteredRows.length > 0;

  return (
    <div className="space-y-8">
      <header className="space-y-5 border-b border-border pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-3">
            <h1 className="font-display text-4xl font-semibold text-main uppercase">
              {activeTab === 'main' ? 'Main Leaderboard' : 'Proving Grounds'}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={activeTab === 'main' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('main')}
          >
            Main Leaderboard
          </Button>
          <Button
            type="button"
            variant={activeTab === 'proving-grounds' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('proving-grounds')}
          >
            Proving Grounds
          </Button>
        </div>

        {activeTab === 'proving-grounds' ? (
          <Card variant="glass-strong" className="border-warning/20 bg-warning/5 p-4">
            <div className="flex items-start gap-3">
              <Badge variant="warning">Risk</Badge>
              <div>
                <h3 className="font-semibold text-warning">Risk Warning</h3>
                <p className="mt-1 text-sm text-muted">
                  Historical backtest data does not guarantee future results. These bots have not been verified in live
                  markets. Capital at risk.
                </p>
              </div>
            </div>
          </Card>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={sortBy === 'CAGR' ? 'primary' : 'outline'}
            onClick={() => setSortBy('CAGR')}
          >
            Sort by CAGR
          </Button>
          <Button
            type="button"
            variant={sortBy === 'SHARPE' ? 'primary' : 'outline'}
            onClick={() => setSortBy('SHARPE')}
          >
            Sort by Sharpe
          </Button>
        </div>
      </header>

      {!hasRows ? (
        <EmptyStateCard
          title={activeTab === 'main' ? 'No main leaderboard rows yet' : 'No proving grounds rows yet'}
          message={
            activeTab === 'main'
              ? 'The live leaderboard has not returned any DRY_RUN rows yet.'
              : 'The historical leaderboard has not returned any backtest rows yet.'
          }
        />
      ) : (
        <>
          {top3.length > 0 ? <PodiumSection top3={top3} /> : null}

          {restRows.length > 0 ? <DetailTable rows={restRows} startRank={4} /> : null}

          <Card variant="glass-strong" className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <span className="text-muted">
              Showing {sortedRows.length} bots · {activeTab === 'main' ? 'DRY_RUN (OOS)' : 'HISTORICAL'} · Sorted by {sortBy}
            </span>
          </Card>
        </>
      )}
    </div>
  );
}
