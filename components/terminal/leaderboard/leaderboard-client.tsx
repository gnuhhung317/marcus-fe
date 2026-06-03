'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { LeaderboardRow, LeaderboardPageData, LeaderboardSortBy } from '@/lib/contracts/types';

interface LeaderboardClientProps {
  initialData: LeaderboardPageData;
}

type TabKey = 'top-returns' | 'top-risk-adjusted';

function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function getDataSourceBadge(dataSource?: string) {
  if (!dataSource) return null;
  if (dataSource === 'DRY_RUN') {
    return (
      <span className="inline-flex items-center rounded-md bg-[rgba(16,185,129,0.15)] px-1.5 py-0.5 text-[10px] font-medium text-positive uppercase tracking-[0.08em]">
        OOS
      </span>
    );
  }
  if (dataSource === 'SIGNAL_BASED') {
    return (
      <span className="inline-flex items-center rounded-md bg-[rgba(59,130,246,0.15)] px-1.5 py-0.5 text-[10px] font-medium text-[rgba(59,130,246,1)] uppercase tracking-[0.08em]">
        Signal
      </span>
    );
  }
  return null;
}

function PodiumCard({ row, rank, variant }: { row: LeaderboardRow; rank: number; variant: 'gold' | 'silver' | 'bronze' }) {
  const isCenter = rank === 1;
  const borderColor = variant === 'gold' ? 'border-[rgba(251,191,36,0.5)]' : variant === 'silver' ? 'border-[rgba(148,163,184,0.4)]' : 'border-[rgba(204,128,72,0.4)]';
  const rankColor = variant === 'gold' ? 'text-[rgba(251,191,36,1)]' : variant === 'silver' ? 'text-[rgba(148,163,184,1)]' : 'text-[rgba(204,128,72,1)]';
  const heightClass = isCenter ? 'h-full' : '';

  return (
    <article className={`glass-strong rounded-2xl border ${borderColor} p-6 shadow-[var(--shadow-soft)] ${heightClass} flex flex-col`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs uppercase tracking-[0.16em] ${rankColor} font-semibold`}>Rank #{rank}</span>
        {getDataSourceBadge((row as any).dataSource)}
      </div>
      <h2 className="mt-3 text-2xl font-semibold text-white line-clamp-1">{row.strategyName}</h2>
      <p className="mt-1 text-sm text-muted">By {row.category}</p>

      <div className="mt-auto">
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted">CAGR</p>
            <p className={`mt-1 text-2xl font-semibold ${row.return24h >= 0 ? 'text-positive' : 'text-negative'}`}>
              {formatPercent(row.return24h)}
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
          href={`/terminal/strategies?id=${row.strategyId}`}
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
    <section className="overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.22)]">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-[rgba(148,163,184,0.08)] text-xs uppercase tracking-[0.12em] text-muted">
          <tr>
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Strategy</th>
            <th className="px-4 py-3">Creator</th>
            <th className="px-4 py-3 text-right">CAGR</th>
            <th className="px-4 py-3 text-right">Max DD</th>
            <th className="px-4 py-3 text-right">Sharpe</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.strategyId} className="border-t border-[rgba(148,163,184,0.18)] transition-colors hover:bg-[rgba(148,163,184,0.08)]">
              <td className="px-4 py-3.5 text-white font-medium">#{startRank + idx}</td>
              <td className="px-4 py-3.5 font-medium text-white">
                <div className="flex items-center gap-2">
                  <span>{row.strategyName}</span>
                  {getDataSourceBadge((row as any).dataSource)}
                </div>
              </td>
              <td className="px-4 py-3.5 text-muted">{row.category}</td>
              <td className={`px-4 py-3.5 text-right font-semibold ${row.return24h >= 0 ? 'text-positive' : 'text-negative'}`}>
                {formatPercent(row.return24h)}
              </td>
              <td className="px-4 py-3.5 text-right text-muted">{Math.abs(row.drawdown).toFixed(2)}%</td>
              <td className="px-4 py-3.5 text-right text-white">{row.sharpe.toFixed(2)}</td>
              <td className="px-4 py-3.5 text-right">
                <Link
                  href={`/terminal/strategies?id=${row.strategyId}`}
                  className="text-xs font-semibold text-white hover:text-positive transition-colors"
                >
                  Details →
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
  const [activeTab, setActiveTab] = useState<TabKey>('top-returns');

  const sortedRows = useMemo(() => {
    const rows = [...initialData.rows];
    if (activeTab === 'top-returns') {
      rows.sort((a, b) => b.return24h - a.return24h);
    } else {
      rows.sort((a, b) => b.sharpe - a.sharpe);
    }
    // Assign ranks based on sorted order
    return rows.map((row, idx) => ({ ...row, rank: idx + 1 }));
  }, [initialData.rows, activeTab]);

  const top3 = sortedRows.slice(0, 3);
  const restRows = sortedRows.slice(3);

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Verified Performance</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Leaderboard</h1>
            <p className="mt-2 text-sm text-muted">Third-party verified metrics with live strategy ranking.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('top-returns')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'top-returns'
                ? 'cta-primary'
                : 'border border-[rgba(148,163,184,0.24)] text-muted hover:text-white hover:bg-[rgba(148,163,184,0.08)]'
            }`}
          >
            Top Returns
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('top-risk-adjusted')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'top-risk-adjusted'
                ? 'cta-primary'
                : 'border border-[rgba(148,163,184,0.24)] text-muted hover:text-white hover:bg-[rgba(148,163,184,0.08)]'
            }`}
          >
            Top Risk-Adjusted
          </button>
        </div>
      </header>

      {top3.length > 0 ? (
        <PodiumSection top3={top3} />
      ) : (
        <div className="glass-strong rounded-2xl border border-[var(--panel-border)] p-8 text-center">
          <p className="text-lg font-semibold text-white">No strategies available</p>
          <p className="mt-2 text-sm text-muted">Check back later for updated rankings.</p>
        </div>
      )}

      {restRows.length > 0 ? (
        <DetailTable rows={restRows} startRank={4} />
      ) : null}

      <div className="flex items-center justify-between rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[rgba(8,13,22,0.34)] px-4 py-3 text-sm">
        <span className="text-muted">
          Showing {sortedRows.length} strategies · {activeTab === 'top-returns' ? 'Sorted by CAGR' : 'Sorted by Sharpe'}
        </span>
      </div>
    </div>
  );
}