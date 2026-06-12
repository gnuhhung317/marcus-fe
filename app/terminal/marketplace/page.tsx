import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { EmptyStateCard, ErrorStateCard } from '@/components/shared/api-state';
import { getMarketplacePageData } from '@/lib/contracts/client';
import { MarketplaceQueryParams, MarketplaceSortBy } from '@/lib/contracts/types';

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
    sortBy:
      sortBy === 'DRAWDOWN' || sortBy === 'SUBSCRIBERS' || sortBy === 'RETURN_30D'
        ? (sortBy as MarketplaceSortBy)
        : 'RETURN_30D',
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

  if (sortBy === 'SUBSCRIBERS') {
    return 'Most Subscribers';
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

  let marketplacePage;
  try {
    marketplacePage = await getMarketplacePageData(query);
  } catch (error) {
    return (
      <ErrorStateCard
        title="Marketplace unavailable"
        message={error instanceof Error ? error.message : 'Unable to load marketplace bots right now.'}
        actionLabel="Retry"
        actionHref="/terminal/marketplace"
      />
    );
  }

  const hasPrev = marketplacePage.page > 1;
  const hasNext = marketplacePage.page * marketplacePage.pageSize < marketplacePage.total;
  const start = marketplacePage.total === 0 ? 0 : (marketplacePage.page - 1) * marketplacePage.pageSize + 1;
  const end = Math.min(marketplacePage.total, marketplacePage.page * marketplacePage.pageSize);

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-fg-muted">Marketplace</p>
          <h1 className="mt-3 text-4xl font-semibold text-fg">Bot marketplace</h1>
          <p className="mt-2 text-sm text-fg-muted">
            Compare verified strategy bots, inspect bot-level analytics, and review deployment routing before subscribing.
          </p>
        </div>

        <form
          method="get"
          className="grid gap-3 rounded-2xl border border-[var(--panel-border)] bg-surface p-4 shadow-[var(--shadow-soft)] lg:grid-cols-[1.4fr_0.85fr_0.65fr_auto]"
        >
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-fg-muted">Search</span>
            <input
              type="search"
              name="search"
              defaultValue={query.search ?? ''}
              placeholder="Bot name, ID, or tag"
              className="w-full rounded-xl border border-[var(--panel-border)] bg-surface-strong px-4 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-fg-muted focus:border-[var(--primary-soft)]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-fg-muted">Sort</span>
            <select
              name="sortBy"
              defaultValue={query.sortBy ?? 'RETURN_30D'}
              className="w-full rounded-xl border border-[var(--panel-border)] bg-surface-strong px-4 py-2.5 text-sm text-fg outline-none transition-colors focus:border-[var(--primary-soft)]"
            >
              <option value="RETURN_30D">Highest Return</option>
              <option value="DRAWDOWN">Lowest Drawdown</option>
              <option value="SUBSCRIBERS">Most Subscribers</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-fg-muted">Page size</span>
            <select
              name="pageSize"
              defaultValue={String(query.pageSize ?? 12)}
              className="w-full rounded-xl border border-[var(--panel-border)] bg-surface-strong px-4 py-2.5 text-sm text-fg outline-none transition-colors focus:border-[var(--primary-soft)]"
            >
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
            </select>
          </label>

          <input type="hidden" name="page" value="1" />

          <button type="submit" className="rounded-xl cta-primary px-4 py-2.5 text-sm font-semibold">
            Apply filters
          </button>
        </form>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-fg-muted">
        <p>
          Showing {start}-{end} of {marketplacePage.total} bots / {sortLabel(query.sortBy ?? 'RETURN_30D')}
        </p>
        <p>Page {marketplacePage.page}</p>
      </div>

      {marketplacePage.bots.length === 0 ? (
        <EmptyStateCard
          title="No bots match the current filters"
          message="Try changing the search term, sort order, or page size."
          actionLabel="Reset filters"
          actionHref="/terminal/marketplace"
        />
      ) : (
        <section className="grid auto-rows-fr items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
          {marketplacePage.bots.map((bot) => (
            <article
              key={bot.botId}
              className="glass-strong h-full rounded-2xl border border-[var(--panel-border)] p-5 shadow-[var(--shadow-soft)]"
            >
              <div className="flex h-full flex-col">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-2xl font-semibold text-fg">{bot.name}</h2>
                      <p className="mt-1 font-mono text-xs text-fg-muted">{bot.botId}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {bot.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[var(--panel-border)] bg-surface px-2 py-1 text-[11px] text-fg-muted">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-[var(--panel-border)] bg-surface px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Return</p>
                      <p className={`mt-2 text-lg font-semibold ${bot.pnl30d >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {bot.pnl30d >= 0 ? '+' : ''}
                        {bot.pnl30d.toFixed(1)}%
                      </p>
                    </div>
                    <div className="rounded-xl border border-[var(--panel-border)] bg-surface px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Win rate</p>
                      <p className="mt-2 text-lg font-semibold text-fg">{bot.winRate.toFixed(1)}%</p>
                    </div>
                    <div className="rounded-xl border border-[var(--panel-border)] bg-surface px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Drawdown</p>
                      <p className="mt-2 text-lg font-semibold text-negative">-{bot.drawdown.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/terminal/marketplace/${encodeURIComponent(bot.botId)}`}
                  className="mt-auto rounded-xl cta-primary px-4 py-2 text-center text-sm font-semibold"
                >
                  Open bot
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}

      <nav className="flex items-center justify-between rounded-2xl border border-[var(--panel-border)] bg-surface px-4 py-3 text-sm shadow-[var(--shadow-soft)]">
        <span className="text-fg-muted">Page {marketplacePage.page}</span>
        <div className="flex items-center gap-2">
          <Link
            aria-disabled={!hasPrev}
            href={hasPrev ? buildMarketplaceHref(query, marketplacePage.page - 1) : buildMarketplaceHref(query, marketplacePage.page)}
            className={`rounded-lg border px-3 py-2 transition-colors ${
              hasPrev
                ? 'border-[var(--panel-border)] text-fg hover:bg-surface-strong'
                : 'pointer-events-none border-[var(--panel-border)] text-fg-muted opacity-50'
            }`}
          >
            Previous
          </Link>
          <Link
            aria-disabled={!hasNext}
            href={hasNext ? buildMarketplaceHref(query, marketplacePage.page + 1) : buildMarketplaceHref(query, marketplacePage.page)}
            className={`rounded-lg border px-3 py-2 transition-colors ${
              hasNext
                ? 'border-[var(--panel-border)] text-fg hover:bg-surface-strong'
                : 'pointer-events-none border-[var(--panel-border)] text-fg-muted opacity-50'
            }`}
          >
            Next
          </Link>
        </div>
      </nav>
    </div>
  );
}
