'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { EmptyStateCard } from '@/components/shared/api-state';
import { LeaderboardPageData, LeaderboardRow } from '@/lib/contracts/types';

interface LeaderboardClientProps {
  initialData: LeaderboardPageData;
}

type TabKey = 'main' | 'proving-grounds';
type SortKey = 'CAGR' | 'SHARPE';

function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function getDataSourceBadge(dataSource?: string) {
  if (!dataSource) return null;

  if (dataSource === 'DRY_RUN') {
    return (
      <span className="inline-flex items-center rounded-md bg-[rgba(16,185,129,0.15)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-positive">
        OOS
      </span>
    );
  }

  if (dataSource === 'HISTORICAL') {
    return (
      <span className="inline-flex items-center rounded-md bg-warning/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-warning/100">
        Backtest
      </span>
    );
  }

  return null;
}

function PodiumCard({ row, rank, variant }: { row: LeaderboardRow; rank: number; variant: 'gold' | 'silver' | 'bronze' }) {
  const isCenter = rank === 1;
  const borderColor =
    variant === 'gold'
      ? 'border-[rgba(251,191,36,0.5)]'
      : variant === 'silver'
        ? 'border-border/40'
        : 'border-[rgba(204,128,72,0.4)]';
  const rankColor =
    variant === 'gold'
      ? 'text-[rgba(251,191,36,1)]'
      : variant === 'silver'
        ? 'text-border/100'
        : 'text-[rgba(204,128,72,1)]';
  const heightClass = isCenter ? 'h-full' : '';

  return (
    <article className={`glass-strong flex flex-col rounded-2xl border ${borderColor} p-6 shadow-[var(--shadow-soft)] ${heightClass}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-[0.16em] ${rankColor}`}>Rank #{rank}</span>
        {getDataSourceBadge(row.dataSource)}
      </div>
      <h2 className="mt-3 line-clamp-1 text-2xl font-semibold text-white">{row.botName}</h2>
      <p className="mt-1 text-sm text-muted">By {row.creatorName}</p>

      <div className="mt-auto">
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted">CAGR</p>
            <p className={`mt-1 text-2xl font-semibold ${row.cagr >= 0 ? 'text-positive' : 'text-negative'}`}>
              {formatPercent(row.cagr)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted">Drawdown</p>
            <p className="mt-1 text-2xl font-semibold text-muted">{Math.abs(row.drawdown).toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted">Sharpe</p>
            <p className="mt-1 text-2xl font-semibold text-white">{row.sharpe.toFixed(2)}</p>
          </div>
        </div>

        <Link
          href={`/terminal/bots/${row.botId}`}
          className="mt-6 block rounded-xl cta-primary px-4 py-2.5 text-center text-sm font-semibold"
        >
          View Details
        </Link>
      </div>
    </article>
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
    <section className="overflow-hidden rounded-2xl border border-border/22">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-border/8 text-xs uppercase tracking-[0.12em] text-muted">
          <tr>
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Bot</th>
            <th className="px-4 py-3">Creator</th>
            <th className="px-4 py-3 text-right">CAGR</th>
            <th className="px-4 py-3 text-right">Max DD</th>
            <th className="px-4 py-3 text-right">Sharpe</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.botId} className="border-t border-border/18 transition-colors hover:bg-border/8">
              <td className="px-4 py-3.5 font-medium text-white">#{startRank + idx}</td>
              <td className="px-4 py-3.5 font-medium text-white">
                <div className="flex items-center gap-2">
                  <span>{row.botName}</span>
                  {getDataSourceBadge(row.dataSource)}
                </div>
              </td>
              <td className="px-4 py-3.5 text-muted">{row.creatorName}</td>
              <td className={`px-4 py-3.5 text-right font-semibold ${row.cagr >= 0 ? 'text-positive' : 'text-negative'}`}>
                {formatPercent(row.cagr)}
              </td>
              <td className="px-4 py-3.5 text-right text-muted">{Math.abs(row.drawdown).toFixed(2)}%</td>
              <td className="px-4 py-3.5 text-right text-white">{row.sharpe.toFixed(2)}</td>
              <td className="px-4 py-3.5 text-right">
                <Link
                  href={`/terminal/bots/${row.botId}`}
                  className="text-xs font-semibold text-white transition-colors hover:text-positive"
                >
                  {'Details ->'}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
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
      <header className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {activeTab === 'main' ? 'Verified Performance' : 'Bot Discovery'}
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white">
              {activeTab === 'main' ? 'Main Leaderboard' : 'Proving Grounds'}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {activeTab === 'main'
                ? 'Real-time verified metrics with live bot ranking.'
                : 'Explore backtested bots. Not yet verified in live markets.'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('main')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'main'
                ? 'cta-primary'
                : 'border border-border/24 text-muted hover:bg-border/8 hover:text-white'
            }`}
          >
            Main Leaderboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('proving-grounds')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'proving-grounds'
                ? 'cta-primary'
                : 'border border-border/24 text-muted hover:bg-border/8 hover:text-white'
            }`}
          >
            Proving Grounds
          </button>
        </div>

        {activeTab === 'proving-grounds' ? (
          <div className="rounded-xl border border-orange-500/50 bg-orange-900/20 p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">!</span>
              <div>
                <h3 className="font-semibold text-orange-400">Risk Warning</h3>
                <p className="mt-1 text-sm text-orange-300">
                  Historical backtest data does not guarantee future results. These bots have not been verified in live
                  markets. Capital at risk.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSortBy('CAGR')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              sortBy === 'CAGR'
                ? 'cta-primary'
                : 'border border-border/24 text-muted hover:bg-border/8 hover:text-white'
            }`}
          >
            Sort by CAGR
          </button>
          <button
            type="button"
            onClick={() => setSortBy('SHARPE')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              sortBy === 'SHARPE'
                ? 'cta-primary'
                : 'border border-border/24 text-muted hover:bg-border/8 hover:text-white'
            }`}
          >
            Sort by Sharpe
          </button>
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

          <div className="flex items-center justify-between rounded-2xl border border-border/18 bg-[rgba(8,13,22,0.34)] px-4 py-3 text-sm">
            <span className="text-muted">
              Showing {sortedRows.length} bots · {activeTab === 'main' ? 'DRY_RUN (OOS)' : 'HISTORICAL'} · Sorted by {sortBy}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
