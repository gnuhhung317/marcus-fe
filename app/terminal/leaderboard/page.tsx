import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getLeaderboardPageData } from '../../../lib/contracts/client';
import { LeaderboardQueryParams, LeaderboardSortBy } from '../../../lib/contracts/types';

interface LeaderboardSearchParams {
  timeframe?: string | string[];
  sortBy?: string | string[];
  page?: string | string[];
  pageSize?: string | string[];
}

function toSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseLeaderboardSearchParams(searchParams?: LeaderboardSearchParams): LeaderboardQueryParams {
  const timeframe = toSingleValue(searchParams?.timeframe);
  const sortBy = toSingleValue(searchParams?.sortBy);

  return {
    timeframe: timeframe === '7D' || timeframe === '30D' ? timeframe : '24H',
    sortBy: sortBy === 'DRAWDOWN' || sortBy === 'SHARPE' || sortBy === 'RETURN_24H' ? (sortBy as LeaderboardSortBy) : 'RETURN_24H',
    page: parseInteger(toSingleValue(searchParams?.page), 1),
    pageSize: parseInteger(toSingleValue(searchParams?.pageSize), 12),
  };
}

function buildLeaderboardHref(query: LeaderboardQueryParams, page: number) {
  const searchParams = new URLSearchParams();

  searchParams.set('timeframe', query.timeframe ?? '24H');
  searchParams.set('sortBy', query.sortBy ?? 'RETURN_24H');
  searchParams.set('page', String(page));
  searchParams.set('pageSize', String(query.pageSize ?? 12));

  const queryString = searchParams.toString();
  return queryString ? `/terminal/leaderboard?${queryString}` : '/terminal/leaderboard';
}

function sortLabel(sortBy: LeaderboardSortBy) {
  if (sortBy === 'DRAWDOWN') {
    return 'Lowest Drawdown';
  }

  if (sortBy === 'SHARPE') {
    return 'Highest Sharpe';
  }

  return 'Highest Return';
}

export default async function TerminalLeaderboardPage({ searchParams }: { searchParams?: LeaderboardSearchParams }) {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role !== 'TRADER' && role !== 'OPERATOR' && role !== 'ADMIN') {
    redirect('/terminal');
  }

  const query = parseLeaderboardSearchParams(searchParams);
  const leaderboardPage = await getLeaderboardPageData(query);
  const hasPrev = leaderboardPage.page > 1;
  const hasNext = leaderboardPage.rows.length >= leaderboardPage.pageSize;

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Verified Performance</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Leaderboard</h1>
            <p className="mt-2 text-sm text-muted">Third-party verified metrics with live strategy ranking.</p>
          </div>
          <button className="rounded-xl border border-[rgba(132,162,191,0.3)] px-4 py-2 text-sm text-white">Advanced Filters</button>
        </div>

        <form method="get" className="grid gap-3 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[rgba(8,13,22,0.42)] p-4 lg:grid-cols-[0.8fr_0.95fr_0.65fr_auto]">
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted">Timeframe</span>
            <select
              name="timeframe"
              defaultValue={query.timeframe ?? '24H'}
              className="w-full rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[rgba(16,185,129,0.45)]"
            >
              <option value="24H">24H</option>
              <option value="7D">7D</option>
              <option value="30D">30D</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted">Sort</span>
            <select
              name="sortBy"
              defaultValue={query.sortBy ?? 'RETURN_24H'}
              className="w-full rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[rgba(16,185,129,0.45)]"
            >
              <option value="RETURN_24H">Highest Return</option>
              <option value="DRAWDOWN">Lowest Drawdown</option>
              <option value="SHARPE">Highest Sharpe</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted">Page Size</span>
            <select
              name="pageSize"
              defaultValue={String(query.pageSize ?? 12)}
              className="w-full rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[rgba(16,185,129,0.45)]"
            >
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
            </select>
          </label>

          <input type="hidden" name="page" value="1" />

          <button type="submit" className="rounded-xl cta-primary px-4 py-2.5 text-sm font-semibold">
            Apply Filters
          </button>
        </form>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <p>
          Showing {leaderboardPage.rows.length} strategies · {sortLabel(query.sortBy ?? 'RETURN_24H')}
        </p>
        <p>
          Page {leaderboardPage.page}
        </p>
      </div>

      <section className="grid gap-5 xl:grid-cols-3">
        {leaderboardPage.featured.map((row) => (
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
            {leaderboardPage.rows.map((row) => (
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

      <nav className="flex items-center justify-between rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[rgba(8,13,22,0.34)] px-4 py-3 text-sm">
        <span className="text-muted">
          Page {leaderboardPage.page}
        </span>
        <div className="flex items-center gap-2">
          <Link
            aria-disabled={!hasPrev}
            href={hasPrev ? buildLeaderboardHref(query, leaderboardPage.page - 1) : buildLeaderboardHref(query, leaderboardPage.page)}
            className={`rounded-lg border px-3 py-2 transition-colors ${hasPrev ? 'border-[rgba(148,163,184,0.24)] text-white hover:bg-[rgba(148,163,184,0.1)]' : 'pointer-events-none border-[rgba(148,163,184,0.12)] text-muted opacity-50'}`}
          >
            Previous
          </Link>
          <Link
            aria-disabled={!hasNext}
            href={hasNext ? buildLeaderboardHref(query, leaderboardPage.page + 1) : buildLeaderboardHref(query, leaderboardPage.page)}
            className={`rounded-lg border px-3 py-2 transition-colors ${hasNext ? 'border-[rgba(148,163,184,0.24)] text-white hover:bg-[rgba(148,163,184,0.1)]' : 'pointer-events-none border-[rgba(148,163,184,0.12)] text-muted opacity-50'}`}
          >
            Next
          </Link>
        </div>
      </nav>
    </div>
  );
}
