import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMarketplacePageData } from '../../../lib/contracts/client';
import { MarketplaceQueryParams, MarketplaceSortBy } from '../../../lib/contracts/types';

interface MarketplaceSearchParams {
  search?: string | string[];
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

function parseMarketplaceSearchParams(searchParams?: MarketplaceSearchParams): MarketplaceQueryParams {
  const sortBy = toSingleValue(searchParams?.sortBy);

  return {
    search: toSingleValue(searchParams?.search)?.trim() || undefined,
    sortBy: sortBy === 'DRAWDOWN' || sortBy === 'WIN_RATE' || sortBy === 'RETURN_30D' ? (sortBy as MarketplaceSortBy) : 'RETURN_30D',
    page: parseInteger(toSingleValue(searchParams?.page), 1),
    pageSize: parseInteger(toSingleValue(searchParams?.pageSize), 12),
  };
}

function buildMarketplaceHref(query: MarketplaceQueryParams, page: number) {
  const searchParams = new URLSearchParams();

  if (query.search) {
    searchParams.set('search', query.search);
  }

  if (query.sortBy) {
    searchParams.set('sortBy', query.sortBy);
  }

  searchParams.set('page', String(page));
  searchParams.set('pageSize', String(query.pageSize ?? 12));

  const queryString = searchParams.toString();
  return queryString ? `/terminal/marketplace?${queryString}` : '/terminal/marketplace';
}

function sortLabel(sortBy: MarketplaceSortBy) {
  if (sortBy === 'DRAWDOWN') {
    return 'Lowest Drawdown';
  }

  if (sortBy === 'WIN_RATE') {
    return 'Highest Win Rate';
  }

  return 'Highest Return';
}

export default async function TerminalMarketplacePage({ searchParams }: { searchParams?: MarketplaceSearchParams }) {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role !== 'TRADER' && role !== 'OPERATOR' && role !== 'ADMIN') {
    redirect('/terminal');
  }

  const query = parseMarketplaceSearchParams(searchParams);
  const marketplacePage = await getMarketplacePageData(query);
  const hasPrev = marketplacePage.page > 1;
  const hasNext = marketplacePage.bots.length >= marketplacePage.pageSize;

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Marketplace</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Strategy Marketplace</h1>
          <p className="mt-2 text-sm text-muted">Compare verified strategy profiles and deploy only what matches your risk budget.</p>
        </div>

        <form method="get" className="grid gap-3 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[rgba(8,13,22,0.42)] p-4 lg:grid-cols-[1.4fr_0.85fr_0.65fr_auto]">
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted">Search</span>
            <input
              type="search"
              name="search"
              defaultValue={query.search ?? ''}
              placeholder="Bot name, ID, or tag"
              className="w-full rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-muted focus:border-[rgba(16,185,129,0.45)]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted">Sort</span>
            <select
              name="sortBy"
              defaultValue={query.sortBy ?? 'RETURN_30D'}
              className="w-full rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[rgba(16,185,129,0.45)]"
            >
              <option value="RETURN_30D">Highest Return</option>
              <option value="DRAWDOWN">Lowest Drawdown</option>
              <option value="WIN_RATE">Highest Win Rate</option>
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
          Showing {marketplacePage.bots.length} bots · {sortLabel(query.sortBy ?? 'RETURN_30D')}
        </p>
        <p>
          Page {marketplacePage.page}
        </p>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {marketplacePage.bots.length ? (
          marketplacePage.bots.map((bot) => (
            <article key={bot.botId} className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-semibold text-white">{bot.name}</h2>
                <span className="rounded-lg border border-[rgba(148,163,184,0.25)] px-2 py-1 text-[11px] text-muted">{bot.botId}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {bot.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-2 py-1 text-[11px] text-muted">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-muted">30D Return</p>
                  <p className="mt-1 text-lg font-semibold text-positive">+{bot.pnl30d.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-muted">Win Rate</p>
                  <p className="mt-1 text-lg font-semibold text-white">{bot.winRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-muted">Drawdown</p>
                  <p className="mt-1 text-lg font-semibold text-negative">-{bot.drawdown.toFixed(1)}%</p>
                </div>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <Link
                  href={`/terminal/marketplace/${encodeURIComponent(bot.botId)}`}
                  className="rounded-xl border border-[rgba(148,163,184,0.26)] px-4 py-2 text-center text-sm text-white transition-colors hover:bg-[rgba(148,163,184,0.12)]"
                >
                  View Detail
                </Link>
                <Link href={`/terminal/marketplace/${encodeURIComponent(bot.botId)}`} className="rounded-xl cta-primary px-4 py-2 text-center text-sm font-semibold">
                  Deploy Strategy
                </Link>
              </div>
            </article>
          ))
        ) : (
          <article className="glass-strong rounded-2xl p-6 text-sm text-muted">No bots match the current filters.</article>
        )}
      </section>

      <nav className="flex items-center justify-between rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[rgba(8,13,22,0.34)] px-4 py-3 text-sm">
        <span className="text-muted">
          Page {marketplacePage.page}
        </span>
        <div className="flex items-center gap-2">
          <Link
            aria-disabled={!hasPrev}
            href={hasPrev ? buildMarketplaceHref(query, marketplacePage.page - 1) : buildMarketplaceHref(query, marketplacePage.page)}
            className={`rounded-lg border px-3 py-2 transition-colors ${hasPrev ? 'border-[rgba(148,163,184,0.24)] text-white hover:bg-[rgba(148,163,184,0.1)]' : 'pointer-events-none border-[rgba(148,163,184,0.12)] text-muted opacity-50'}`}
          >
            Previous
          </Link>
          <Link
            aria-disabled={!hasNext}
            href={hasNext ? buildMarketplaceHref(query, marketplacePage.page + 1) : buildMarketplaceHref(query, marketplacePage.page)}
            className={`rounded-lg border px-3 py-2 transition-colors ${hasNext ? 'border-[rgba(148,163,184,0.24)] text-white hover:bg-[rgba(148,163,184,0.1)]' : 'pointer-events-none border-[rgba(148,163,184,0.12)] text-muted opacity-50'}`}
          >
            Next
          </Link>
        </div>
      </nav>
    </div>
  );
}
