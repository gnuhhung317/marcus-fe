import {
  BotAnalyticsData,
  BotAnalyticsPageData,
  BotDetail,
  BotMetricBlock,
  MarketplaceBot,
  MarketplacePageData,
  MarketplaceQueryParams,
  MarketplaceSortBy,
  SubscriptionResult,
  DeveloperSubscriptionSummary,
  TimeSeriesValue,
  BotTrade,
} from '@/lib/contracts/types';
import {
  DEFAULT_BOT_ID,
  requestContractJson,
  toNumber,
  formatSignedPercent,
  formatRatio,
  normalizeTradeSide,
} from '@/lib/services/base.service';

// --- Internal Response Interfaces ---

interface BotSummaryResponse {
  botId?: string;
  botName?: string;
  description?: string;
  status?: string;
  tradingPair?: string;
  exchange?: string;
  asset?: string;
  risk?: string;
  annualReturn?: number;
  maxDrawdown?: number;
  winRate?: number;
  subscribers?: number;
}

interface BotPerformanceResponse {
  annualReturn?: number;
  maxDrawdown?: number;
  sharpe?: number;
  winRate?: number;
  avgTradeReturn?: number;
  tradesPerDay?: number;
}

interface BotDetailResponse extends BotSummaryResponse {
  developerId?: string;
  apiKey?: string;
  createdAt?: string;
  updatedAt?: string;
  performance?: BotPerformanceResponse;
}

interface BotSummaryPageResponse {
  items?: BotSummaryResponse[];
  meta?: {
    page?: number;
    size?: number;
    totalElements?: number;
    totalPages?: number;
    hasNext?: boolean;
  };
}

interface SubscribeBotResultResponse {
  botId?: string;
  wsToken?: string;
  status?: string;
}

interface BotSubscriptionResultResponse {
  botId?: string;
  wsToken?: string;
  status?: string;
}

interface BotAnalyticsMetricBlockResponse {
  annualReturn?: number;
  maxDrawdown?: number;
  sharpe?: number;
  sortino?: number;
  calmar?: number;
  profitFactor?: number;
  sampleSizeDays?: number;
  statisticalSignificanceWarning?: string | null;
}

interface BotAnalyticsMetricsResponse {
  total?: BotAnalyticsMetricBlockResponse;
  historical?: BotAnalyticsMetricBlockResponse;
  outOfSample?: BotAnalyticsMetricBlockResponse;
}

interface TimeSeriesPointResponse {
  timestamp?: string;
  value?: number;
  phase?: 'HISTORICAL' | 'OUT_OF_SAMPLE';
}

interface BotAnalyticsSeriesResponse {
  splitTimestamp?: string | null;
  points?: TimeSeriesPointResponse[];
}

interface TradeLogItemResponse {
  timestamp?: string;
  assetPair?: string;
  side?: string;
  netPnl?: number;
  size?: number;
  entryPrice?: number;
  exitPrice?: number;
}

interface TradeLogPageResponse {
  items?: TradeLogItemResponse[];
}

// --- Mapping Helpers ---

function mapBotSummary(bot: BotSummaryResponse): MarketplaceBot {
  const annualReturnPct = (bot.annualReturn ?? 0) * 100;
  const maxDrawdownPct = Math.abs(bot.maxDrawdown ?? 0) * 100;
  const winRatePct = (bot.winRate ?? 0) * 100;

  const tags: string[] = [];
  if (bot.asset) {
    tags.push(bot.asset);
  }
  if (bot.risk) {
    tags.push(bot.risk);
  }

  if (tags.length === 0) {
    tags.push(bot.exchange ?? 'UNKNOWN');
    tags.push(bot.status ?? 'ACTIVE');
  }

  if (!bot.botId) {
    throw new Error('Marketplace bot item is missing botId');
  }

  return {
    botId: bot.botId,
    name: bot.botName ?? 'Unnamed Bot',
    tags: tags,
    pnl30d: annualReturnPct,
    winRate: winRatePct,
    drawdown: maxDrawdownPct,
  };
}

function mapBotDetail(bot: BotDetailResponse): BotDetail {
  if (!bot.botId) {
    throw new Error('Marketplace bot detail is missing botId');
  }

  const performance = bot.performance
    ? {
        annualReturn: toNumber(bot.performance.annualReturn),
        maxDrawdown: toNumber(bot.performance.maxDrawdown),
        sharpe: toNumber(bot.performance.sharpe),
        winRate: toNumber(bot.performance.winRate),
        avgTradeReturn: toNumber(bot.performance.avgTradeReturn),
        tradesPerDay: toNumber(bot.performance.tradesPerDay),
      }
    : undefined;

  return {
    botId: bot.botId,
    name: bot.botName ?? 'Unnamed Bot',
    description: bot.description ?? 'No description available.',
    status: bot.status ?? 'ACTIVE',
    tradingPair: bot.tradingPair ?? 'BTC/USDT',
    exchange: bot.exchange ?? 'BINANCE',
    apiKey: bot.apiKey,
    createdAt: bot.createdAt,
    updatedAt: bot.updatedAt,
    performance,
  };
}

function mapMarketplaceSortToBackend(sortBy?: MarketplaceSortBy) {
  switch (sortBy) {
    case 'DRAWDOWN':
      return 'drawdown';
    case 'SUBSCRIBERS':
      return '-subscribers';
    case 'RETURN_30D':
    default:
      return '-return';
  }
}

function mapBotAnalyticsData(
  metricsResponse?: BotAnalyticsMetricsResponse,
  seriesResponse: BotAnalyticsSeriesResponse = { points: [] },
): BotAnalyticsData {
  const totalMetrics = metricsResponse?.total ?? {};
  const historicalMetrics = metricsResponse?.historical ?? {};
  const oosMetrics = metricsResponse?.outOfSample ?? {};

  const performanceSeries = (seriesResponse.points ?? [])
    .map((point) => ({
      timestamp: point.timestamp ?? new Date().toISOString(),
      value: toNumber(point.value),
      phase: point.phase,
    }))
    .filter((point) => Number.isFinite(point.value));

  return {
    metricBlocks: [
      mapMetricBlock('Total Data', totalMetrics),
      mapMetricBlock('Historical', historicalMetrics),
      mapMetricBlock('Out-of-sample', oosMetrics),
    ],
    performanceSeries,
    splitTimestamp: seriesResponse.splitTimestamp ?? null,
  };
}

function mapMetricBlock(title: BotMetricBlock['title'], block: BotAnalyticsMetricBlockResponse): BotMetricBlock {
  return {
    title,
    annualReturn: formatSignedPercent(toNumber(block.annualReturn, 0) * 100, 2),
    maxDrawdown: formatSignedPercent(toNumber(block.maxDrawdown, 0) * 100, 2),
    sharpe: formatRatio(toNumber(block.sharpe, 0), 2),
    warning: block.statisticalSignificanceWarning ?? null,
  };
}

function mapTradeLogItem(item: TradeLogItemResponse): BotTrade | null {
  if (!item.timestamp || !item.assetPair) {
    return null;
  }

  return {
    timestamp: item.timestamp,
    pair: item.assetPair,
    side: normalizeTradeSide(item.side),
    pnl: toNumber(item.netPnl),
    size: toNumber(item.size, 0),
    entryPrice: toNumber(item.entryPrice, 0),
    exitPrice: toNumber(item.exitPrice, 0),
  };
}

// --- Service Functions ---

async function fetchMarketplacePage(query: MarketplaceQueryParams = {}): Promise<MarketplacePageData> {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.max(1, Math.min(48, query.pageSize ?? 12));
  const response = await requestContractJson<BotSummaryPageResponse>('bots-list', {
    queryParams: {
      q: query.search,
      asset: query.asset,
      risk: query.risk,
      sort: mapMarketplaceSortToBackend(query.sortBy),
      page: page - 1,
      size: pageSize,
    },
  });

  const bots = (response.items ?? []).map((bot) => mapBotSummary(bot));
  const meta = response.meta;

  return {
    bots,
    page: Math.max(1, (meta?.page ?? page - 1) + 1),
    pageSize: Math.max(1, meta?.size ?? pageSize),
    total: Math.max(0, meta?.totalElements ?? bots.length),
  };
}

export async function getMarketplacePageData(query: MarketplaceQueryParams = {}): Promise<MarketplacePageData> {
  return fetchMarketplacePage(query);
}

export async function listMarketplaceBots(query: MarketplaceQueryParams = {}): Promise<MarketplaceBot[]> {
  const pageData = await getMarketplacePageData(query);
  return pageData.bots;
}

export async function getMarketplaceBotDetail(botId: string): Promise<BotDetail> {
  const [response, analytics] = await Promise.all([
    requestContractJson<BotDetailResponse>('bot-detail', {
      pathParams: { botId },
    }),
    getBotAnalyticsData(botId),
  ]);

  if (!response.botId) {
    throw new Error('Marketplace bot detail is missing botId');
  }

  return {
    ...mapBotDetail(response),
    analytics,
  };
}

export async function subscribeToBot(botId: string): Promise<SubscriptionResult> {
  const response = await requestContractJson<SubscribeBotResultResponse>('bot-subscribe', {
    pathParams: { botId },
    init: { method: 'POST' },
  });

  if (!response.botId || !response.wsToken || !response.status) {
    throw new Error('Subscribe bot response is missing required fields');
  }

  return {
    botId: response.botId,
    wsToken: response.wsToken,
    status: response.status,
  };
}

export async function unsubscribeFromBot(botId: string): Promise<SubscriptionResult> {
  const response = await requestContractJson<SubscribeBotResultResponse>('bot-unsubscribe', {
    pathParams: { botId },
    init: { method: 'DELETE' },
  });

  if (!response.botId || !response.status) {
    throw new Error('Unsubscribe bot response is missing required fields');
  }

  return {
    botId: response.botId,
    wsToken: response.wsToken ?? '',
    status: response.status,
  };
}

export async function listActiveSubscriptionsForBot(botId: string): Promise<DeveloperSubscriptionSummary[]> {
  const response = await requestContractJson<BotSubscriptionResultResponse[]>('developer-bot-subscriptions', {
    pathParams: { botId },
  });

  return response.map((item, index) => ({
    botId: item.botId ?? botId,
    wsToken: item.wsToken ?? `ws_${index + 1}`,
    status: item.status ?? 'UNKNOWN',
  }));
}

export async function getBotAnalyticsData(botId: string, range = 'ALL'): Promise<BotAnalyticsData> {
  const [metricsResponse, seriesResponse] = await Promise.all([
    requestContractJson<BotAnalyticsMetricsResponse>('bot-analytics-metrics', {
      pathParams: { botId },
    }),
    requestContractJson<BotAnalyticsSeriesResponse>('bot-analytics-series', {
      pathParams: { botId },
      queryParams: { range },
    }),
  ]);

  return mapBotAnalyticsData(metricsResponse, seriesResponse);
}

export async function getBotAnalyticsPageData(botId: string = DEFAULT_BOT_ID): Promise<BotAnalyticsPageData> {
  const safeBotId = botId || DEFAULT_BOT_ID;

  const [detailResponse, metricsResponse, seriesResponse, tradeLogPage] = await Promise.all([
    requestContractJson<BotDetailResponse>('bot-detail', {
      pathParams: { botId: safeBotId },
    }),
    requestContractJson<BotAnalyticsMetricsResponse>('bot-analytics-metrics', {
      pathParams: { botId: safeBotId },
    }),
    requestContractJson<BotAnalyticsSeriesResponse>('bot-analytics-series', {
      pathParams: { botId: safeBotId },
      queryParams: { range: 'ALL' },
    }),
    requestContractJson<TradeLogPageResponse>('bot-trades', {
      pathParams: { botId: safeBotId },
      queryParams: { page: 0, size: 12 },
    }),
  ]);

  const totalMetrics = metricsResponse?.total ?? {};
  const analytics = mapBotAnalyticsData(metricsResponse, seriesResponse);

  const metrics = [
    { label: 'Average return', value: formatSignedPercent(toNumber(totalMetrics.annualReturn, 0) * 100, 2) },
    { label: 'Maximum drawdown', value: formatSignedPercent(toNumber(totalMetrics.maxDrawdown, 0) * 100, 2) },
    { label: 'Sharpe ratio', value: formatRatio(toNumber(totalMetrics.sharpe, 0), 2) },
    { label: 'Sortino ratio', value: formatRatio(toNumber(totalMetrics.sortino, 0), 2) },
    { label: 'Calmar ratio', value: formatRatio(toNumber(totalMetrics.calmar, 0), 2) },
    { label: 'Profit factor', value: formatRatio(toNumber(totalMetrics.profitFactor, 0), 2) },
  ];

  const trades = (tradeLogPage.items ?? [])
    .map((item) => mapTradeLogItem(item))
    .filter((item): item is BotTrade => item !== null);

  return {
    botId: detailResponse?.botId ?? safeBotId,
    botName: detailResponse?.botName ?? 'NEURAL_MOMENTUM_V24',
    exchange: detailResponse?.exchange ?? 'BINANCE',
    status: detailResponse?.status ?? 'ACTIVE',
    splitTimestamp: analytics.splitTimestamp,
    metricBlocks: analytics.metricBlocks,
    metrics,
    performanceSeries: analytics.performanceSeries,
    trades,
  };
}

export async function favoriteBot(botId: string): Promise<{ botId: string; favorited: boolean }> {
  return requestContractJson<{ botId: string; favorited: boolean }>('bot-favorite', {
    pathParams: { botId },
    init: {
      method: 'POST',
    },
  });
}
