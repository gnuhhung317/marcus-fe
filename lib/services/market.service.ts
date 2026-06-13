import {
  HomePageData,
  LeaderboardPageData,
  LeaderboardQueryParams,
  LeaderboardRow,
  MarketTicker,
} from '@/lib/contracts/types';
import {
  requestContractJson,
  toNumber,
  formatCurrency,
} from '@/lib/services/base.service';
import { getTrainingPageData, getBlogPageData, getResearchPageData } from '@/lib/services/academy.service';

// --- Internal Response Interfaces ---

interface MarketTickerResponse {
  symbol?: string;
  asset?: string;
  price?: number;
  change24h?: number;
}

interface MarketOverviewResponse {
  topVolume24h?: number;
  activeBots?: number;
  liveTickers?: MarketTickerResponse[];
}

interface LeaderboardBotItemResponse {
  rank?: number;
  botId?: string;
  botName?: string;
  creatorName?: string;
  cagr?: number;
  sharpe?: number;
  maxDrawdown?: number;
  dataSource?: string;
}

interface LeaderboardBotsPageResponse {
  items?: LeaderboardBotItemResponse[];
  meta?: {
    page?: number;
    size?: number;
    totalElements?: number;
    totalPages?: number;
    hasNext?: boolean;
  };
}

interface LeaderboardFeaturedItemResponse {
  botId?: string;
  botName?: string;
  rankLabel?: string;
  sharpe?: number;
}

interface LeaderboardFeaturedResponse {
  items?: LeaderboardFeaturedItemResponse[];
}

// --- Defaults ---

const defaultTopVolume24h = 0;

// --- Mapping Helpers ---

function mapMarketTickerItem(item: MarketTickerResponse, index: number): MarketTicker {
  const symbol = item.symbol ?? `ASSET-${index + 1}`;
  const price = toNumber(item.price, NaN);

  return {
    symbol,
    asset: item.asset ?? symbol,
    price: Number.isFinite(price) ? formatCurrency(price) : '$0.00',
    change: toNumber(item.change24h, 0),
  };
}

function sortLeaderboardRows(rows: LeaderboardRow[], sortBy?: LeaderboardQueryParams['sortBy']) {
  const sorted = [...rows];

  if (sortBy === 'DRAWDOWN') {
    sorted.sort((left, right) => left.drawdown - right.drawdown);
  } else if (sortBy === 'SHARPE') {
    sorted.sort((left, right) => right.sharpe - left.sharpe);
  } else {
    sorted.sort((left, right) => right.cagr - left.cagr);
  }

  return sorted;
}

function applyLeaderboardFilters(rows: LeaderboardRow[], query: { page: number; pageSize: number }) {
  const pageSize = Math.max(1, Math.min(48, query.pageSize ?? 12));
  const page = Math.max(1, query.page ?? 1);
  const startIndex = (page - 1) * pageSize;

  return {
    rows: rows.slice(startIndex, startIndex + pageSize),
    total: rows.length,
    page,
    pageSize,
  };
}

function mapLeaderboardRow(item: LeaderboardBotItemResponse, index: number): LeaderboardRow {
  const dataSource = item.dataSource?.toUpperCase();
  const normalizedDataSource = dataSource === 'DRY_RUN' || dataSource === 'HISTORICAL' ? dataSource : undefined;

  return {
    rank: Math.max(1, Math.round(toNumber(item.rank, index + 1))),
    botId: item.botId ?? `bot-${index + 1}`,
    botName: item.botName ?? `Bot ${index + 1}`,
    creatorName: item.creatorName ?? 'System',
    cagr: toNumber(item.cagr, 0),
    drawdown: toNumber(item.maxDrawdown, 0),
    sharpe: toNumber(item.sharpe, 0),
    status: 'ACTIVE',
    dataSource: normalizedDataSource,
  };
}

function mapLeaderboardSortToBackend(sortBy?: LeaderboardQueryParams['sortBy']) {
  return sortBy === 'SHARPE' ? 'SHARPE' : 'CAGR';
}

// --- Service Functions ---

export async function getHomePageData(): Promise<HomePageData> {
  const [response, marketingStats] = await Promise.all([
    requestContractJson<MarketOverviewResponse>('market-hero-stats'),
    requestContractJson<{ verifiedDevelopers: number; activeCloudExecutors: number; systemUptime: string; supportedExchanges: number; }>('marketing-stats'),
  ]);

  const liveTickers = (response?.liveTickers ?? []).map((item, index) => mapMarketTickerItem(item, index));

  return {
    marketOverview: {
      topVolume24h: toNumber(response?.topVolume24h, defaultTopVolume24h),
      activeBots: Math.max(0, Math.round(toNumber(response?.activeBots, 0))),
      liveTickers,
    },
    principles: [],
    marketingStats,
  };
}

async function fetchLeaderboardSourceRows(
  dataSource: 'DRY_RUN' | 'HISTORICAL',
  query: LeaderboardQueryParams = {},
): Promise<LeaderboardRow[]> {
  const pageSize = 100;
  const rows: LeaderboardRow[] = [];
  let page = 0;

  while (true) {
    const response = await requestContractJson<LeaderboardBotsPageResponse>('leaderboard-list', {
      queryParams: {
        dataSource,
        market: query.market,
        asset: query.asset,
        rankMetric: mapLeaderboardSortToBackend(query.sortBy),
        page,
        size: pageSize,
      },
    });

    const pageRows = (response.items ?? []).map((item, index) => mapLeaderboardRow(item, rows.length + index));
    rows.push(...pageRows);

    const hasNext = response.meta?.hasNext;
    if (pageRows.length === 0 || hasNext === false || (hasNext === undefined && pageRows.length < pageSize)) {
      break;
    }

    page += 1;
  }

  return rows;
}

export async function getLeaderboardPageData(query: LeaderboardQueryParams = {}): Promise<LeaderboardPageData> {
  const requestedDataSource = query.dataSource ?? 'ALL';
  const [featuredResponse, rows] = await Promise.all([
    requestContractJson<LeaderboardFeaturedResponse>('leaderboard-featured'),
    requestedDataSource === 'ALL'
      ? Promise.all([
          fetchLeaderboardSourceRows('DRY_RUN', query),
          fetchLeaderboardSourceRows('HISTORICAL', query),
        ]).then(([dryRunRows, historicalRows]) => [...dryRunRows, ...historicalRows])
      : fetchLeaderboardSourceRows(requestedDataSource, query),
  ]);

  const featured = (featuredResponse.items ?? [])
    .map((item, index) => {
      const matchedRow = rows.find((row) => row.botId === item.botId);

      if (matchedRow) {
        return matchedRow;
      }

      if (!item.botId) {
        return null;
      }

      return {
        rank: index + 1,
        botId: item.botId,
        botName: item.botName ?? `Featured Bot ${index + 1}`,
        creatorName: item.rankLabel ?? 'Featured',
        cagr: 0,
        drawdown: 0,
        sharpe: toNumber(item.sharpe),
        status: 'ACTIVE' as const,
      } as LeaderboardRow;
    })
    .filter((item): item is LeaderboardRow => item !== null)
    .slice(0, 3);

  if (requestedDataSource === 'ALL') {
    const sortedRows = sortLeaderboardRows(rows, query.sortBy).map((row, index) => ({
      ...row,
      rank: index + 1,
    }));

    return {
      rows: sortedRows,
      featured: featured.length ? featured : [],
      page: 1,
      pageSize: Math.max(1, sortedRows.length),
      total: sortedRows.length,
    };
  }

  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.max(1, Math.min(48, query.pageSize ?? 12));
  const pagedRows = applyLeaderboardFilters(sortLeaderboardRows(rows, query.sortBy), { page, pageSize });

  return {
    rows: pagedRows.rows.map((row, index) => ({
      ...row,
      rank: (pagedRows.page - 1) * pagedRows.pageSize + index + 1,
    })),
    featured: featured.length ? featured : [],
    page: pagedRows.page,
    pageSize: pagedRows.pageSize,
    total: pagedRows.total,
  };
}

export async function getMarketingData() {
  const [homeData, trainingData, blogData, researchData, leaderboardData] = await Promise.all([
    getHomePageData(),
    getTrainingPageData(),
    getBlogPageData(),
    getResearchPageData(),
    getLeaderboardPageData(),
  ]);

  return {
    marketTickers: homeData.marketOverview.liveTickers,
    marketOverview: homeData.marketOverview,
    principles: homeData.principles,
    trainingCourses: trainingData.courses,
    academyMetrics: trainingData.metrics,
    blogPosts: blogData.posts,
    researchReports: researchData.reports,
    researchLibrary: researchData.library,
    leaderboardRows: leaderboardData.rows,
  };
}
