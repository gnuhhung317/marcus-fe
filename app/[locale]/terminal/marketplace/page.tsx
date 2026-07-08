import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { EmptyStateCard, ErrorStateCard } from '@/components/shared/api-state';
import { getMarketplacePageData } from '@/lib/contracts/client';
import { MarketplaceQueryParams, MarketplaceSortBy } from '@/lib/contracts/types';

// Sub-components
import { MarketplaceFilter } from '@/components/terminal/marketplace/marketplace-filter';
import { MarketplaceBotCard } from '@/components/terminal/marketplace/marketplace-bot-card';
import { MarketplacePagination } from '@/components/terminal/marketplace/marketplace-pagination';

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
      sortBy === 'CAGR' || sortBy === 'DRAWDOWN' || sortBy === 'SUBSCRIBERS' || sortBy === 'RETURN_30D'
        ? (sortBy as MarketplaceSortBy)
        : 'CAGR',
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

function sortLabel(sortBy: MarketplaceSortBy, t: (key: string) => string) {
  if (sortBy === 'DRAWDOWN') {
    return t('sort.lowestDrawdown');
  }

  if (sortBy === 'SUBSCRIBERS') {
    return t('sort.mostSubscribers');
  }

  return t('sort.highestCagr');
}

export default async function TerminalMarketplacePage({ searchParams }: { searchParams?: MarketplaceSearchParams }) {
  const t = await getTranslations('TerminalMarketplace');
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
        title={t('error.title')}
        message={error instanceof Error ? error.message : t('error.message')}
        actionLabel={t('retry')}
        actionHref="/terminal/marketplace"
      />
    );
  }

  const hasPrev = marketplacePage.page > 1;
  const hasNext = marketplacePage.page * marketplacePage.pageSize < marketplacePage.total;
  const start = marketplacePage.total === 0 ? 0 : (marketplacePage.page - 1) * marketplacePage.pageSize + 1;
  const end = Math.min(marketplacePage.total, marketplacePage.page * marketplacePage.pageSize);

  return (
    <div className="space-y-5">
      <header className="space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{t('eyebrow')}</p>
          <h1 className="mt-1 text-2xl font-bold text-main">{t('title')}</h1>
          <p className="mt-1 text-xs text-muted">{t('description')}</p>
        </div>

        <MarketplaceFilter query={query} />
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <p>
          {t('results', { start, end, total: marketplacePage.total, sort: sortLabel(query.sortBy ?? 'CAGR', t) })}
        </p>
        <p>{t('page', { page: marketplacePage.page })}</p>
      </div>

      {marketplacePage.bots.length === 0 ? (
        <EmptyStateCard
          title={t('empty.title')}
          message={t('empty.message')}
          actionLabel={t('resetFilters')}
          actionHref="/terminal/marketplace"
        />
      ) : (
        <section className="grid auto-rows-fr items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
          {marketplacePage.bots.map((bot) => (
            <MarketplaceBotCard key={bot.botId} bot={bot} />
          ))}
        </section>
      )}

      <MarketplacePagination 
        page={marketplacePage.page} 
        hasPrev={hasPrev} 
        hasNext={hasNext} 
        buildHref={(page) => buildMarketplaceHref(query, page)} 
      />
    </div>
  );
}
