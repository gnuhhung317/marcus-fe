import { availableContracts, contractRoutes, missingContracts } from './endpoints';
import {
  AuthLoginResponse,
  AuthRefreshRequest,
  requestAuthJson,
  requestJson,
} from '../api/http';
import {
  AcademyMetricsData,
  AllocationSlice,
  BlogPageData,
  BotDetail,
  BotAnalyticsData,
  BlogPost,
  BotProvisioningCredentials,
  BotIntegrationHealth,
  DashboardPageData,
  DeveloperBotDetail,
  DeveloperBotStatus,
  DeveloperBotSummary,
  DeveloperConsolePageData,
  DeveloperDashboardPageData,
  DeveloperSignalItem,
  DeveloperSubscriptionSummary,
  HomePageData,
  LeaderboardPageData,
  LeaderboardRow,
  LeaderboardQueryParams,
  MarketTicker,
  MarketplaceBot,
  MarketplacePageData,
  MarketplaceQueryParams,
  MarketplaceSortBy,
  PaperTradingPageData,
  PaperOrderInput,
  PaperOrderResult,
  PaperSessionData,
  ProfileApiKey,
  ProfilePageData,
  ProfileLoginActivity,
  ProfilePreferences,
  RegisterBotInput,
  RegisterUserInput,
  ResearchLibraryFile,
  ResearchPageData,
  ResearchReport,
  BotAnalyticsPageData,
  BotMetricBlock,
  BotTrade,
  SubscriptionResult,
  TerminalKpi,
  TimeSeriesValue,
  TrainingCourse,
  TrainingPageData,
  UserProfile,
} from './types';

const DEFAULT_BOT_ID = 'kinetic-alpha-v4';
const ACCESS_TOKEN_COOKIE = 'marcus_access_token';
const REFRESH_TOKEN_COOKIE = 'marcus_refresh_token';

let browserRefreshInFlight: Promise<string | undefined> | null = null;

const defaultAllocations: AllocationSlice[] = [
  { name: 'Binance Global', value: 52.4 },
  { name: 'OKX', value: 31.2 },
  { name: 'Bybit', value: 16.4 },
];

const defaultProfile: UserProfile = {
  userId: '',
  username: '',
  email: '',
  role: 'TRADER',
};

const defaultProfilePreferences: ProfilePreferences = {
  timezone: 'UTC+7',
  baseCurrency: 'USD',
  emailNotifications: true,
  sessionTimeoutMinutes: 30,
};

const defaultLoginActivities: ProfileLoginActivity[] = [];

const defaultConnectivity = {
  overallStatus: 'UNKNOWN',
  checkedAt: new Date().toISOString(),
};

const defaultAcademyMetrics: AcademyMetricsData = {
  activeStudents: 0,
  botsDeployed: 0,
  averagePerformancePercent: 0,
  academyRating: 0,
};

const defaultTopVolume24h = 0;

const defaultExecutionLogs: { timestamp: string; level: string; source: string; message: string }[] = [];

interface DashboardOverviewResponse {
  totalEquity?: number;
  openPnl?: number;
  winRate?: number;
  activeBots?: number;
}

interface ExchangeAllocationItemResponse {
  exchange?: string;
  percentage?: number;
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

interface SubscribeBotResultResponse {
  botId?: string;
  wsToken?: string;
  status?: string;
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

interface LeaderboardFeaturedItemResponse {
  botId?: string;
  botName?: string;
  rankLabel?: string;
  sharpe?: number;
}

interface LeaderboardFeaturedResponse {
  items?: LeaderboardFeaturedItemResponse[];
}

interface PaperSessionSummaryResponse {
  sessionId?: string;
  status?: string;
  virtualBalance?: number;
  openPnl?: number;
  buyingPower?: number;
}

interface PaperSignalResponse {
  signalId?: string;
  botId?: string;
  assetPair?: string;
  side?: string;
  confidence?: number;
  status?: string;
  generatedAt?: string;
}

interface PaperOrderResponse {
  orderId?: string;
  status?: string;
  filledQuantity?: number;
  avgFillPrice?: number;
  submittedAt?: string;
}

interface UserProfileResponse {
  userId?: string;
  username?: string;
  email?: string;
  role?: string;
}

interface AuthLoginRequest {
  username: string;
  password: string;
}

interface UserPreferencesResponse {
  timezone?: string;
  baseCurrency?: string;
  emailNotifications?: boolean;
  sessionTimeoutMinutes?: number;
}

interface LoginActivityResponse {
  activityId?: string;
  device?: string;
  location?: string;
  ipAddress?: string;
  createdAt?: string;
  status?: string;
}

interface LoginActivityPageResponse {
  items?: LoginActivityResponse[];
  meta?: {
    page?: number;
    size?: number;
    totalElements?: number;
    totalPages?: number;
    hasNext?: boolean;
  };
}

interface ApiKeySummaryResponse {
  apiKeyId?: string;
  label?: string;
  maskedKey?: string;
  createdAt?: string;
  lastUsedAt?: string;
}

interface ApiKeyCreateResponse {
  apiKeyId?: string;
  label?: string;
  maskedKey?: string;
  createdAt?: string;
}

interface ApiKeyCreateRequest {
  label: string;
}

interface UpdateProfileRequest {
  username?: string;
  email?: string;
}

interface UpdatePreferencesRequest {
  timezone?: string;
  baseCurrency?: string;
  emailNotifications?: boolean;
  sessionTimeoutMinutes?: number;
}

interface TimeSeriesPointResponse {
  timestamp?: string;
  value?: number;
  phase?: 'HISTORICAL' | 'OUT_OF_SAMPLE';
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

interface BotAnalyticsSeriesResponse {
  splitTimestamp?: string | null;
  points?: TimeSeriesPointResponse[];
}

interface SignalItemResponse {
  signalId?: string;
  botId?: string;
  symbol?: string;
  action?: string;
  status?: string;
  generatedTimestamp?: string;
}

interface ConnectivityDependencyResponse {
  name?: string;
  status?: string;
  latencyMs?: number;
}

interface ConnectivityHealthResponse {
  overallStatus?: string;
  checkedAt?: string;
  dependencies?: ConnectivityDependencyResponse[];
}

interface ExecutionLogItemResponse {
  timestamp?: string;
  level?: string;
  source?: string;
  message?: string;
}

interface ExecutionLogPageResponse {
  items?: ExecutionLogItemResponse[];
}

interface BotRegistrationResponse {
  botId?: string;
  apiKey?: string;
  rawSecret?: string;
}

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

interface AcademyCourseSummaryResponse {
  courseId?: string;
  title?: string;
  level?: string;
  progress?: number;
  modules?: number;
  durationHours?: number;
}

interface AcademyCoursesResponse {
  items?: AcademyCourseSummaryResponse[];
}

interface AcademyMetricsResponse {
  activeStudents?: number;
  botsDeployed?: number;
  averagePerformancePercent?: number;
  academyRating?: number;
}

interface BlogPostSummaryResponse {
  postId?: string;
  title?: string;
  category?: string;
  excerpt?: string;
  readTimeMinutes?: number;
  publishedAt?: string;
}

interface BlogPostsResponse {
  items?: BlogPostSummaryResponse[];
}

interface ResearchReportSummaryResponse {
  reportId?: string;
  title?: string;
  category?: string;
  summary?: string;
  readTimeMinutes?: number;
  publishedAt?: string;
}

interface ResearchReportsResponse {
  items?: ResearchReportSummaryResponse[];
}

interface ResearchLibraryFileResponse {
  fileId?: string;
  title?: string;
  format?: string;
  sizeMb?: number;
}

function normalizePath(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

type PathParams = Record<string, string | number>;

function getContractRoute(routeId: string) {
  const route = contractRoutes.find((item) => item.id === routeId);
  if (!route) {
    throw new Error(`Contract route not found: ${routeId}`);
  }

  return route;
}

function buildContractPath(
  routeId: string,
  pathParams?: PathParams,
  queryParams?: Record<string, string | number | boolean | undefined>,
) {
  const route = getContractRoute(routeId);
  let path = route.path;

  path = path.replace(/\{([^}]+)\}/g, (_match, key) => {
    const value = pathParams?.[key];
    if (value === undefined || value === null) {
      throw new Error(`Missing path parameter '${key}' for route '${routeId}'`);
    }
    return encodeURIComponent(String(value));
  });

  return `${normalizePath(path)}${toQuery(queryParams ?? {})}`;
}

export async function requestContractJson<T>(
  routeId: string,
  options?: {
    pathParams?: PathParams;
    queryParams?: Record<string, string | number | boolean | undefined>;
    init?: RequestInit;
  },
): Promise<T> {
  const route = getContractRoute(routeId);
  const normalizedPath = buildContractPath(routeId, options?.pathParams, options?.queryParams);

  return requestJson<T>(normalizedPath, {
    method: options?.init?.method ?? route.method,
    ...options?.init,
  });
}

function toQuery(params: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

async function withFallback<T>(work: () => Promise<T>, fallback?: () => Promise<T> | T): Promise<T> {
  try {
    return await work();
  } catch (error) {
    console.warn('Contract request failed, using fallback:', error);
    if (fallback !== undefined) {
      if (typeof fallback === 'function') {
        return await (fallback as () => Promise<T> | T)();
      }
      return fallback;
    }
    throw error;
  }
}

function mapAuthSession(response?: AuthLoginResponse) {
  return {
    accessToken: response?.accessToken ?? '',
    refreshToken: response?.refreshToken ?? '',
    tokenType: response?.tokenType ?? 'Bearer',
    accessTokenExpiresInSeconds: Math.max(60, Math.round(toNumber(response?.accessTokenExpiresInSeconds, 3600))),
    refreshTokenExpiresInSeconds: Math.max(60, Math.round(toNumber(response?.refreshTokenExpiresInSeconds, 604800))),
    userId: response?.userId ?? '',
    username: response?.username ?? '',
    role: response?.role ?? 'TRADER',
  };
}

export async function loginWithCredentials(payload: AuthLoginRequest) {
  const response = await requestAuthJson('/auth/login', payload);

  return mapAuthSession(response);
}

export async function refreshWithToken(payload: AuthRefreshRequest) {
  const response = await requestAuthJson('/auth/refresh', payload);

  return mapAuthSession(response);
}

export async function registerWithCredentials(payload: RegisterUserInput) {
  const response = await requestAuthJson('/auth/register', payload);

  return mapAuthSession(response);
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }

  return value;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatSignedCurrency(value: number, digits = 2) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });

  return `${value >= 0 ? '+' : ''}${formatter.format(value)}`;
}

function formatSignedPercent(value: number, digits = 2) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`;
}

function formatRatio(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : '0.00';
}

function normalizeTradeSide(side: string | undefined): BotTrade['side'] {
  return (side ?? '').toUpperCase().includes('SHORT') ? 'SHORT' : 'LONG';
}

function normalizeCourseLevel(level: string | undefined): TrainingCourse['level'] {
  const normalized = (level ?? '').toUpperCase();

  if (normalized === 'EXPERT') {
    return 'EXPERT';
  }

  if (normalized === 'ADVANCED') {
    return 'ADVANCED';
  }

  return 'FOUNDATION';
}

function toDateOnly(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Date(parsed).toISOString().slice(0, 10);
}

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

function mapAcademyCourse(item: AcademyCourseSummaryResponse, index: number): TrainingCourse {
  const modules = Math.max(0, Math.round(toNumber(item.modules)));
  const durationHours = Math.max(0, toNumber(item.durationHours));
  const generatedSummary = modules > 0 || durationHours > 0
    ? `${modules || 0} modules · ${durationHours.toFixed(1)}h guided content.`
    : 'Practical algorithmic modules with execution-focused labs.';

  return {
    id: item.courseId ?? `course-${index + 1}`,
    title: item.title ?? `Academy Course ${index + 1}`,
    level: normalizeCourseLevel(item.level),
    progress: clamp(Math.round(toNumber(item.progress, 0)), 0, 100),
    summary: generatedSummary,
  };
}

function mapBlogPost(item: BlogPostSummaryResponse, index: number): BlogPost {
  const readTimeMinutes = Math.max(1, Math.round(toNumber(item.readTimeMinutes, NaN)));

  return {
    id: item.postId ?? `post-${index + 1}`,
    title: item.title ?? `Market Insight ${index + 1}`,
    category: item.category ?? 'Insights',
    excerpt: item.excerpt ?? 'No excerpt available yet.',
    readTime: Number.isFinite(readTimeMinutes) ? `${readTimeMinutes} min` : '5 min',
  };
}

function mapResearchReport(item: ResearchReportSummaryResponse, index: number): ResearchReport {
  const readTimeMinutes = Math.max(1, Math.round(toNumber(item.readTimeMinutes, NaN)));

  return {
    id: item.reportId ?? `report-${index + 1}`,
    title: item.title ?? `Research Report ${index + 1}`,
    category: item.category ?? 'Research',
    readTime: Number.isFinite(readTimeMinutes) ? `${readTimeMinutes} min` : '8 min',
    publishedAt: toDateOnly(item.publishedAt, '2026-01-01'),
  };
}

function mapResearchLibraryFile(item: ResearchLibraryFileResponse, index: number): ResearchLibraryFile {
  return {
    fileId: item.fileId ?? `file-${index + 1}`,
    title: item.title ?? `Research File ${index + 1}`,
    format: item.format ?? 'PDF',
    sizeMb: Math.max(0, toNumber(item.sizeMb, 1.2)),
  };
}

function mapDashboardKpis(overview: DashboardOverviewResponse): TerminalKpi[] {
  const totalEquity = toNumber(overview.totalEquity);
  const openPnl = toNumber(overview.openPnl);
  const winRate = toNumber(overview.winRate);
  const activeBots = Math.max(0, Math.round(toNumber(overview.activeBots)));

  return [
    {
      label: 'Total Equity',
      value: formatCurrency(totalEquity),
      delta: 'Live snapshot',
      context: 'from dashboard overview',
      trend: 'neutral',
    },
    {
      label: 'Today PnL',
      value: formatSignedCurrency(openPnl),
      delta: formatSignedCurrency(openPnl, 0),
      context: 'open pnl snapshot',
      trend: openPnl > 0 ? 'up' : openPnl < 0 ? 'down' : 'neutral',
    },
    {
      label: 'Active Bots',
      value: String(activeBots).padStart(2, '0'),
      delta: `${activeBots} running`,
      context: 'runtime status',
      trend: activeBots > 0 ? 'up' : 'neutral',
    },
    {
      label: 'Win Rate 24h',
      value: `${winRate.toFixed(1)}%`,
      delta: formatSignedPercent(winRate - 50, 1),
      context: 'from strategy metrics',
      trend: winRate >= 65 ? 'up' : winRate < 50 ? 'down' : 'neutral',
    },
  ];
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
  
  // Backwards compatibility/default fallback tags if empty
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

function normalizeSearchText(value: string | undefined) {
  return (value ?? '').trim().toLowerCase();
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

function applyLeaderboardFilters(rows: LeaderboardRow[], query: LeaderboardQueryParams = {}) {
  const sorted = sortLeaderboardRows(rows, query.sortBy);
  const pageSize = Math.max(1, Math.min(48, query.pageSize ?? 12));
  const page = Math.max(1, query.page ?? 1);
  const startIndex = (page - 1) * pageSize;

  return {
    rows: sorted.slice(startIndex, startIndex + pageSize),
    total: sorted.length,
    page,
    pageSize,
  };
}

function mapLeaderboardSortToBackend(sortBy?: LeaderboardQueryParams['sortBy']) {
  return sortBy === 'SHARPE' ? 'SHARPE' : 'CAGR';
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

function mapApiKeySummary(item: ApiKeySummaryResponse): ProfileApiKey | null {
  if (!item.apiKeyId || !item.label || !item.maskedKey || !item.createdAt) {
    return null;
  }

  return {
    id: item.apiKeyId,
    label: item.label,
    maskedKey: item.maskedKey,
    createdAt: item.createdAt,
  };
}

function mapProfilePreferences(item?: UserPreferencesResponse): ProfilePreferences {
  return {
    timezone: item?.timezone ?? defaultProfilePreferences.timezone,
    baseCurrency: item?.baseCurrency ?? defaultProfilePreferences.baseCurrency,
    emailNotifications: item?.emailNotifications ?? defaultProfilePreferences.emailNotifications,
    sessionTimeoutMinutes: Math.max(5, Math.round(toNumber(item?.sessionTimeoutMinutes, defaultProfilePreferences.sessionTimeoutMinutes))),
  };
}

function mapLoginActivity(item: LoginActivityResponse, index: number): ProfileLoginActivity {
  return {
    id: item.activityId ?? `login-${index + 1}`,
    device: item.device ?? 'Unknown device',
    location: item.location ?? 'Unknown location',
    ipMasked: item.ipAddress ?? '0.0.**.**',
    createdAt: item.createdAt ?? new Date().toISOString(),
    status: item.status ?? 'SUCCESS',
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

function buildFallbackBotSeries(): TimeSeriesValue[] {
  const values = [100, 102, 104, 101, 106, 109, 111, 108, 114, 117];

  return values.map((value, index) => ({
    timestamp: new Date(Date.now() - (values.length - index) * 60 * 60 * 1000).toISOString(),
    value,
  }));
}

export async function getContractSnapshot() {
  return {
    available: availableContracts,
    gaps: missingContracts,
  };
}

export async function getHomePageData(): Promise<HomePageData> {
  const [response, marketingStats] = await Promise.all([
    withFallback(
      () => requestContractJson<MarketOverviewResponse>('market-hero-stats'),
      async () => undefined,
    ),
    withFallback(
      () => requestContractJson<{ verifiedDevelopers: number; activeCloudExecutors: number; systemUptime: string; supportedExchanges: number; }>('marketing-stats'),
      async () => undefined,
    )
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

export async function getTrainingPageData(): Promise<TrainingPageData> {
  const [coursesResponse, metricsResponse] = await Promise.all([
    withFallback(
      () => requestContractJson<AcademyCoursesResponse>('academy-courses', {
        queryParams: { limit: 12 },
      }),
      async () => ({ items: [] }),
    ),
    withFallback(() => requestContractJson<AcademyMetricsResponse>('academy-metrics'), async () => undefined),
  ]);

  const courses = (coursesResponse.items ?? []).map((course, index) => mapAcademyCourse(course, index));
  const metrics: AcademyMetricsData = {
    activeStudents: Math.max(0, Math.round(toNumber(metricsResponse?.activeStudents, defaultAcademyMetrics.activeStudents))),
    botsDeployed: Math.max(0, Math.round(toNumber(metricsResponse?.botsDeployed, defaultAcademyMetrics.botsDeployed))),
    averagePerformancePercent: toNumber(metricsResponse?.averagePerformancePercent, defaultAcademyMetrics.averagePerformancePercent),
    academyRating: toNumber(metricsResponse?.academyRating, defaultAcademyMetrics.academyRating),
  };

  return {
    courses,
    metrics,
  };
}

export async function getBlogPageData(): Promise<BlogPageData> {
  const response = await withFallback(
    () => requestContractJson<BlogPostsResponse>('content-blog', {
      queryParams: { page: 0, size: 12 },
    }),
    async () => ({ items: [] }),
  );

  const posts = (response.items ?? []).map((item, index) => mapBlogPost(item, index));

  return {
    posts,
  };
}

export async function getResearchPageData(): Promise<ResearchPageData> {
  const [reportsResponse, libraryResponse] = await Promise.all([
    withFallback(
      () => requestContractJson<ResearchReportsResponse>('content-research', {
        queryParams: { page: 0, size: 12 },
      }),
      async () => ({ items: [] }),
    ),
    withFallback(
      () => requestContractJson<ResearchLibraryFileResponse[]>('content-research-library', {
        queryParams: { limit: 8 },
      }),
      async () => [],
    ),
  ]);

  const reports = (reportsResponse.items ?? []).map((item, index) => mapResearchReport(item, index));
  const resolvedReports = reports;
  const library = libraryResponse.map((item, index) => mapResearchLibraryFile(item, index));

  return {
    reports: resolvedReports,
    library,
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

export async function getDashboardPageData(): Promise<DashboardPageData & { performanceSeries: TimeSeriesValue[] }> {
  const [overview, allocationItems, tradeLogPage, equitySeriesResponse] = await Promise.all([
    withFallback(() => requestContractJson<DashboardOverviewResponse>('dashboard-overview'), async () => undefined),
    withFallback(() => requestContractJson<ExchangeAllocationItemResponse[]>('dashboard-allocation'), async () => []),
    withFallback(
      () => requestContractJson<TradeLogPageResponse>('dashboard-trades', {
        queryParams: { page: 0, size: 8 },
      }),
      async () => ({ items: [] }),
    ),
    withFallback(
      () => requestContractJson<TimeSeriesPointResponse[]>('dashboard-equity', {
        queryParams: { range: '1W' },
      }),
      async () => [],
    ),
  ]);

  const mappedAllocations = allocationItems
    .map((item) => ({
      name: item.exchange ?? 'Unknown Exchange',
      value: Math.max(0, toNumber(item.percentage)),
    }))
    .filter((item) => item.name.length > 0);

  const mappedTrades = (tradeLogPage.items ?? [])
    .map((item) => mapTradeLogItem(item))
    .filter((item): item is BotTrade => item !== null);

  const performanceSeries = (equitySeriesResponse ?? [])
    .map((point) => ({
      timestamp: point.timestamp ?? new Date().toISOString(),
      value: toNumber(point.value),
    }))
    .filter((point) => Number.isFinite(point.value));

  return {
    terminalKpis: overview ? mapDashboardKpis(overview) : [],
    botTrades: mappedTrades,
    allocations: mappedAllocations,
    performanceSeries,
  };
}

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

export async function getLeaderboardPageData(query: LeaderboardQueryParams = {}): Promise<LeaderboardPageData> {
  const requestedDataSource = query.dataSource ?? 'ALL';
  const [featuredResponse, rows] = await Promise.all([
    withFallback(() => requestContractJson<LeaderboardFeaturedResponse>('leaderboard-featured'), async () => ({ items: [] })),
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
      };
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

export async function getPaperTradingPageData(): Promise<PaperTradingPageData> {
  const [sessionResponse, signalResponse] = await Promise.all([
    requestContractJson<PaperSessionSummaryResponse>('paper-session'),
    requestContractJson<PaperSignalResponse[]>('paper-signals', {
      queryParams: { limit: 8, status: 'ALL' },
    }),
  ]);

  if (!sessionResponse.sessionId || !sessionResponse.status) {
    throw new Error('Paper trading session response is missing required fields');
  }

  const session = {
    sessionId: sessionResponse.sessionId,
    status: sessionResponse.status,
    virtualBalance: toNumber(sessionResponse.virtualBalance, 248502.94),
    openPnl: toNumber(sessionResponse.openPnl, 4210),
    buyingPower: toNumber(sessionResponse.buyingPower, 1200000),
  };

  const signals = signalResponse
    .map((signal, index) => ({
      signalId: signal.signalId ?? `paper-signal-${index + 1}`,
      botId: signal.botId ?? 'fallback-bot',
      assetPair: signal.assetPair ?? 'BTC/USDT',
      side: signal.side ?? 'BUY',
      confidence: toNumber(signal.confidence, 0.7),
      status: signal.status ?? 'ACTIVE',
      generatedAt: signal.generatedAt ?? new Date().toISOString(),
    }))
    .slice(0, 8);

  return {
    session,
    signals,
  };
}

export async function createPaperOrder(payload: PaperOrderInput): Promise<PaperOrderResult> {
  const response = await requestContractJson<PaperOrderResponse>('paper-order', {
    init: {
      method: 'POST',
      body: JSON.stringify({
        assetPair: payload.assetPair,
        side: payload.side,
        quantity: payload.quantity,
        estimatedPrice: payload.estimatedPrice,
        signalId: payload.signalId,
      }),
    },
  });

  if (!response.orderId || !response.status) {
    throw new Error('Paper order response is missing required fields');
  }

  return {
    orderId: response.orderId,
    status: response.status,
    filledQuantity: toNumber(response.filledQuantity, payload.quantity),
    avgFillPrice: toNumber(response.avgFillPrice, payload.estimatedPrice),
    submittedAt: response.submittedAt ?? new Date().toISOString(),
  };
}

export async function pausePaperSession(): Promise<PaperSessionData> {
  const response = await requestContractJson<PaperSessionSummaryResponse>('paper-session-pause', {
    init: { method: 'POST' },
  });

  if (!response.sessionId || !response.status) {
    throw new Error('Paper session pause response is missing required fields');
  }

  return {
    sessionId: response.sessionId,
    status: response.status,
    virtualBalance: toNumber(response.virtualBalance, 248502.94),
    openPnl: toNumber(response.openPnl, 4210),
    buyingPower: toNumber(response.buyingPower, 1200000),
  };
}

export async function resumePaperSession(): Promise<PaperSessionData> {
  const response = await requestContractJson<PaperSessionSummaryResponse>('paper-session-resume', {
    init: { method: 'POST' },
  });

  if (!response.sessionId || !response.status) {
    throw new Error('Paper session resume response is missing required fields');
  }

  return {
    sessionId: response.sessionId,
    status: response.status,
    virtualBalance: toNumber(response.virtualBalance, 248502.94),
    openPnl: toNumber(response.openPnl, 4210),
    buyingPower: toNumber(response.buyingPower, 1200000),
  };
}

export async function getProfilePageData(): Promise<ProfilePageData> {
  const [profileResponse, preferencesResponse, apiKeyResponse, loginActivityResponse] = await Promise.all([
    withFallback(() => requestContractJson<UserProfileResponse>('profile-me'), async () => undefined),
    withFallback(() => requestContractJson<UserPreferencesResponse>('profile-preferences'), async () => undefined),
    withFallback(() => requestContractJson<ApiKeySummaryResponse[]>('profile-api-keys'), async () => []),
    withFallback(() => requestContractJson<LoginActivityPageResponse>('profile-login-activities'), async () => ({ items: [] })),
  ]);

  const profile: UserProfile = {
    userId: profileResponse?.userId ?? defaultProfile.userId,
    username: profileResponse?.username ?? defaultProfile.username,
    email: profileResponse?.email ?? defaultProfile.email,
    role: profileResponse?.role ?? defaultProfile.role,
  };

  const preferences = mapProfilePreferences(preferencesResponse);

  const mappedApiKeys = apiKeyResponse
    .map((key) => mapApiKeySummary(key))
    .filter((key): key is ProfileApiKey => key !== null);

  const loginActivities = (loginActivityResponse?.items ?? []).map((activity, index) => mapLoginActivity(activity, index));

  return {
    profile,
    preferences,
    apiKeys: mappedApiKeys,
    loginActivities,
  };
}

export async function getCurrentUserProfile(): Promise<UserProfile> {
  const response = await withFallback(() => requestContractJson<UserProfileResponse>('profile-me'), async () => undefined);

  return {
    userId: response?.userId ?? defaultProfile.userId,
    username: response?.username ?? defaultProfile.username,
    email: response?.email ?? defaultProfile.email,
    role: response?.role ?? defaultProfile.role,
  };
}

export async function updateCurrentUserProfile(payload: UpdateProfileRequest): Promise<UserProfile> {
  const response = await requestContractJson<UserProfileResponse>('profile-update', {
    init: {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  });

  return {
    userId: response?.userId ?? defaultProfile.userId,
    username: response?.username ?? defaultProfile.username,
    email: response?.email ?? defaultProfile.email,
    role: response?.role ?? defaultProfile.role,
  };
}

export async function getCurrentUserPreferences(): Promise<ProfilePreferences> {
  const response = await withFallback(() => requestContractJson<UserPreferencesResponse>('profile-preferences'), async () => undefined);
  return mapProfilePreferences(response);
}

export async function updateCurrentUserPreferences(payload: UpdatePreferencesRequest): Promise<ProfilePreferences> {
  const response = await requestContractJson<UserPreferencesResponse>('profile-preferences-update', {
    init: {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  });

  return mapProfilePreferences(response);
}

export async function listCurrentUserApiKeys(): Promise<ProfileApiKey[]> {
  const response = await withFallback(() => requestContractJson<ApiKeySummaryResponse[]>('profile-api-keys'), async () => []);

  return response
    .map((key) => mapApiKeySummary(key))
    .filter((key): key is ProfileApiKey => key !== null);
}

export async function createCurrentUserApiKey(payload: ApiKeyCreateRequest): Promise<ProfileApiKey> {
  const response = await requestContractJson<ApiKeyCreateResponse>('profile-api-key-create', {
    init: {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  });

  if (!response.apiKeyId || !response.maskedKey || !response.createdAt) {
    throw new Error('API key creation response is missing required fields');
  }

  return {
    id: response.apiKeyId,
    label: response.label ?? payload.label,
    maskedKey: response.maskedKey,
    createdAt: response.createdAt,
  } satisfies ProfileApiKey;
}

export async function deleteCurrentUserApiKey(apiKeyId: string) {
  await requestContractJson<void>('profile-api-key-delete', {
    pathParams: { apiKeyId },
    init: { method: 'DELETE' },
  });
}

export async function listCurrentUserLoginActivities(): Promise<ProfileLoginActivity[]> {
  const response = await withFallback(() => requestContractJson<LoginActivityPageResponse>('profile-login-activities'), async () => ({ items: [] }));
  const activities = (response.items ?? []).map((activity, index) => mapLoginActivity(activity, index));

  return activities;
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

export async function getBotAnalyticsData(botId: string, range = 'ALL'): Promise<BotAnalyticsData> {
  const [metricsResponse, seriesResponse] = await Promise.all([
    withFallback(
      () => requestContractJson<BotAnalyticsMetricsResponse>('bot-analytics-metrics', {
        pathParams: { botId },
      }),
      async () => undefined,
    ),
    withFallback(
      () => requestContractJson<BotAnalyticsSeriesResponse>('bot-analytics-series', {
        pathParams: { botId },
        queryParams: { range },
      }),
      async () => ({ points: [] }),
    ),
  ]);

  return mapBotAnalyticsData(metricsResponse, seriesResponse);
}

export async function getBotAnalyticsPageData(botId: string = DEFAULT_BOT_ID): Promise<BotAnalyticsPageData> {
  const safeBotId = botId || DEFAULT_BOT_ID;

  const [detailResponse, metricsResponse, seriesResponse, tradeLogPage] = await Promise.all([
    withFallback(
      () => requestContractJson<BotDetailResponse>('bot-detail', {
        pathParams: { botId: safeBotId },
      }),
      async () => undefined,
    ),
    withFallback(
      () => requestContractJson<BotAnalyticsMetricsResponse>('bot-analytics-metrics', {
        pathParams: { botId: safeBotId },
      }),
      async () => undefined,
    ),
    withFallback(
      () => requestContractJson<BotAnalyticsSeriesResponse>('bot-analytics-series', {
        pathParams: { botId: safeBotId },
        queryParams: { range: 'ALL' },
      }),
      async () => ({ points: [] }),
    ),
    withFallback(
      () => requestContractJson<TradeLogPageResponse>('bot-trades', {
        pathParams: { botId: safeBotId },
        queryParams: { page: 0, size: 12 },
      }),
      async () => ({ items: [] }),
    ),
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

function mapMetricBlock(title: BotMetricBlock['title'], block: BotAnalyticsMetricBlockResponse): BotMetricBlock {
  return {
    title,
    annualReturn: formatSignedPercent(toNumber(block.annualReturn, 0) * 100, 2),
    maxDrawdown: formatSignedPercent(toNumber(block.maxDrawdown, 0) * 100, 2),
    sharpe: formatRatio(toNumber(block.sharpe, 0), 2),
    warning: block.statisticalSignificanceWarning ?? null,
  };
}

export async function getDeveloperConsolePageData(): Promise<DeveloperConsolePageData> {
  const [connectivityResponse, signalResponse, executionResponse] = await Promise.all([
    withFallback(() => requestContractJson<ConnectivityHealthResponse>('system-connectivity'), async () => undefined),
    withFallback(
      () => requestContractJson<SignalItemResponse[]>('system-signals', {
        queryParams: { limit: 8, status: 'ALL' },
      }),
      async () => [],
    ),
    withFallback(
      () => requestContractJson<ExecutionLogPageResponse>('system-execution-logs', {
        queryParams: { limit: 10 },
      }),
      async () => ({ items: [] }),
    ),
  ]);

  const connectivity = {
    overallStatus: connectivityResponse?.overallStatus ?? defaultConnectivity.overallStatus,
    checkedAt: connectivityResponse?.checkedAt ?? defaultConnectivity.checkedAt,
  };

  const signalStream = signalResponse.map((signal, index) => ({
    signalId: signal.signalId ?? `signal-${index + 1}`,
    botId: signal.botId ?? 'bot_unknown',
    symbol: signal.symbol ?? 'BTC/USDT',
    action: signal.action ?? 'OPEN_LONG',
    status: signal.status ?? 'PENDING',
    generatedTimestamp: signal.generatedTimestamp ?? new Date().toISOString(),
  }));

  const executionLogs = (executionResponse.items ?? []).map((log, index) => ({
    timestamp: log.timestamp ?? new Date(Date.now() - index * 60000).toISOString(),
    level: log.level ?? 'INFO',
    source: log.source ?? 'runtime',
    message: log.message ?? 'No message',
  }));

  return {
    connectivity,
    signalStream: signalStream.length ? signalStream : [],
    executionLogs,
  };
}

interface DeveloperBotSummaryResponse {
  botId?: string;
  name?: string;
  botName?: string;
  description?: string;
  status?: string;
  tradingPair?: string;
  exchange?: string;
  apiKey?: string;
}

interface DeveloperBotDetailResponse extends DeveloperBotSummaryResponse {
  developerId?: string;
  createdAt?: string;
  updatedAt?: string;
  performance?: BotPerformanceResponse;
}

interface BotSubscriptionResultResponse {
  botId?: string;
  wsToken?: string;
  status?: string;
}

interface BotIntegrationHealthResponse {
  overallStatus?: string;
  lastCheckedAt?: string;
  dependencies?: { name?: string; status?: string; latencyMs?: number }[];
  lastSignalAt?: string;
  message?: string;
}

interface SignalItemResponse {
  signalId?: string;
  botId?: string;
  exchangeSlug?: string;
  symbol?: string;
  action?: string;
  price?: number;
  status?: string;
  generatedTimestamp?: string;
  leverage?: number;
  marketType?: string;
  reduceOnly?: boolean;
  size?: number;
  tp?: number;
  sl?: number;
  metadata?: Record<string, unknown>;
  rawPayload?: Record<string, unknown>;
}

function normalizeDeveloperBotStatus(status?: string): DeveloperBotStatus {
  const normalized = (status ?? 'ACTIVE').toUpperCase();

  if (normalized === 'PAUSED' || normalized === 'DELETED' || normalized === 'DOWN') {
    return normalized;
  }

  return 'ACTIVE';
}

export async function getDeveloperDashboardPageData(activeBotId?: string): Promise<DeveloperDashboardPageData> {
  const botsResponse = await withFallback(
    () => requestContractJson<DeveloperBotSummaryResponse[]>('developer-bots'),
    async () => [],
  );

  const bots = botsResponse.map((item, index) => ({
    botId: item.botId ?? `bot_${index + 1}`,
    botName: item.botName ?? item.name ?? 'Unnamed Bot',
    description: item.description ?? null,
    status: normalizeDeveloperBotStatus(item.status),
    tradingPair: item.tradingPair ?? null,
    exchange: item.exchange ?? null,
    apiKey: item.apiKey ?? null,
  }));

  const resolvedBots = bots;
  const selectedBotId = activeBotId && resolvedBots.some(b => b.botId === activeBotId)
    ? activeBotId
    : '';

  if (!selectedBotId) {
    return {
      bots: resolvedBots,
      activeBot: null,
      subscriptions: [],
      integrationHealth: null,
      signals: [],
    };
  }

  const [detailResponse, subscriptions, integrationHealthResponse, signalsResponse, analytics] = await Promise.all([
    withFallback(
      () => requestContractJson<DeveloperBotDetailResponse>('developer-bot-detail', { pathParams: { botId: selectedBotId } }),
      async () => undefined,
    ),
    withFallback(
      () => listActiveSubscriptionsForBot(selectedBotId),
      async () => [],
    ),
    withFallback(
      () => requestContractJson<BotIntegrationHealthResponse>('developer-bot-integration-health', { pathParams: { botId: selectedBotId } }),
      async () => undefined,
    ),
    withFallback(
      () => requestContractJson<SignalItemResponse[]>('system-signals', { queryParams: { botId: selectedBotId, limit: 50 } }),
      async () => [],
    ),
    getBotAnalyticsData(selectedBotId),
  ]);

  const matchedSummary = resolvedBots.find(b => b.botId === selectedBotId);

  const activeBot: DeveloperBotDetail = {
    botId: detailResponse?.botId ?? selectedBotId,
    botName: detailResponse?.botName ?? detailResponse?.name ?? matchedSummary?.botName ?? 'Unnamed Bot',
    description: detailResponse?.description ?? matchedSummary?.description ?? null,
    status: normalizeDeveloperBotStatus(detailResponse?.status ?? matchedSummary?.status),
    tradingPair: detailResponse?.tradingPair ?? matchedSummary?.tradingPair ?? null,
    exchange: detailResponse?.exchange ?? matchedSummary?.exchange ?? null,
    apiKey: detailResponse?.apiKey ?? matchedSummary?.apiKey ?? null,
    developerId: detailResponse?.developerId ?? null,
    createdAt: detailResponse?.createdAt ?? null,
    updatedAt: detailResponse?.updatedAt ?? null,
    performance: detailResponse?.performance
      ? {
          annualReturn: toNumber(detailResponse.performance.annualReturn),
          maxDrawdown: toNumber(detailResponse.performance.maxDrawdown),
          sharpe: toNumber(detailResponse.performance.sharpe),
          winRate: toNumber(detailResponse.performance.winRate),
          avgTradeReturn: toNumber(detailResponse.performance.avgTradeReturn),
          tradesPerDay: toNumber(detailResponse.performance.tradesPerDay),
        }
    : null,
    analytics,
  };

  const integrationHealth: BotIntegrationHealth | null = integrationHealthResponse
    ? {
        overallStatus: integrationHealthResponse.overallStatus ?? 'UNKNOWN',
        lastCheckedAt: integrationHealthResponse.lastCheckedAt ?? new Date().toISOString(),
        lastSignalAt: integrationHealthResponse.lastSignalAt ?? null,
        message: integrationHealthResponse.message ?? null,
      }
    : null;

  const signals: DeveloperSignalItem[] = (signalsResponse ?? []).map((item, index) => ({
    signalId: item.signalId ?? `sig_${index + 1}`,
    botId: item.botId ?? selectedBotId,
    exchangeSlug: item.exchangeSlug ?? null,
    symbol: item.symbol ?? null,
    action: item.action ?? null,
    price: item.price ?? null,
    status: item.status ?? null,
    generatedTimestamp: item.generatedTimestamp ?? null,
    leverage: item.leverage ?? null,
    marketType: item.marketType ?? null,
    reduceOnly: item.reduceOnly ?? null,
    size: item.size ?? null,
    tp: item.tp ?? null,
    sl: item.sl ?? null,
    metadata: item.metadata ?? null,
    rawPayload: item.rawPayload ?? null,
  }));

  return {
    bots: resolvedBots,
    activeBot,
    subscriptions,
    integrationHealth,
    signals,
  };
}

export async function getTerminalData() {
  const [dashboardData, marketplaceData, botAnalyticsData, profileData, leaderboardData] = await Promise.all([
    getDashboardPageData(),
    listMarketplaceBots(),
    getBotAnalyticsPageData(),
    getProfilePageData(),
    getLeaderboardPageData(),
  ]);

  return {
    terminalKpis: dashboardData.terminalKpis,
    marketplaceBots: marketplaceData,
    botTrades: botAnalyticsData.trades,
    profileApiKeys: profileData.apiKeys,
    leaderboardRows: leaderboardData.rows,
  };
}

// ========== Phase 1: Decision Dashboard ==========

import {
  PortfolioOverview,
  BotDecisionCard,
  PortfolioDecisionsResponse,
  DecisionReason,
  DecisionDashboardData,
} from './types';

interface PortfolioOverviewResponse {
  activeBotsCount?: number;
  totalSubscribedCapital?: number;
  aggregateWinRate24h?: number;
  atRiskSubscriptionCount?: number;
  totalEquity?: number;
  aggregateOpenPnL?: number;
  lastUpdated?: string;
}

interface BotDecisionCardResponse {
  subscriptionId?: string;
  botId?: string;
  botName?: string;
  botIcon?: string;
  status?: string;
  currentPnL?: number;
  pnlPercent?: number;
  drawdownPercent?: number;
  winRate?: number;
  signalCount24h?: number;
  successfulSignals24h?: number;
  reason?: string;
  reasonExplanation?: string;
  riskScore?: number;
  subscribedSinceDay?: number;
  daysAtRisk?: number;
  lastSignal?: string | null;
  exchange?: string;
}

interface PortfolioDecisionsResponseData {
  decisions?: BotDecisionCardResponse[];
  summary?: {
    totalCount?: number;
    activeCount?: number;
    reviewNeededCount?: number;
    highRiskCount?: number;
  };
}

/**
 * Fetch portfolio overview for Decision Dashboard header.
 * Returns aggregated portfolio metrics (active bots, equity, win rate, at-risk count).
 */
export async function getPortfolioOverview(): Promise<PortfolioOverview> {
  try {
    const res = await requestContractJson<PortfolioOverviewResponse>('portfolio-overview', {
      init: { method: 'GET' },
    });
    return {
      activeBotsCount: res.activeBotsCount ?? 0,
      totalSubscribedCapital: res.totalSubscribedCapital ?? 0,
      aggregateWinRate24h: res.aggregateWinRate24h ?? 0,
      atRiskSubscriptionCount: res.atRiskSubscriptionCount ?? 0,
      totalEquity: res.totalEquity ?? 0,
      aggregateOpenPnL: res.aggregateOpenPnL ?? 0,
      lastUpdated: res.lastUpdated ?? new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(`Portfolio overview failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Fetch decision-enriched subscription list with reason tags.
 * Returns subscriptions sorted by decision priority (HIGH_RISK first).
 */
export async function getPortfolioDecisions(
  statusFilter: 'ALL' | 'ACTIVE' | 'AT_RISK' = 'ALL',
): Promise<PortfolioDecisionsResponse> {
  try {
    const res = await requestContractJson<PortfolioDecisionsResponseData>('portfolio-decisions', {
      queryParams: {
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      },
      init: { method: 'GET' },
    });

    return {
      decisions: (res.decisions ?? []).map((d) => ({
        subscriptionId: d.subscriptionId ?? '',
        botId: d.botId ?? '',
        botName: d.botName ?? '',
        botIcon: d.botIcon ?? '',
        status: (d.status ?? 'ACTIVE') as 'ACTIVE' | 'INACTIVE' | 'PAUSED',
        currentPnL: d.currentPnL ?? 0,
        pnlPercent: d.pnlPercent ?? 0,
        drawdownPercent: d.drawdownPercent ?? 0,
        winRate: d.winRate ?? 0,
        signalCount24h: d.signalCount24h ?? 0,
        successfulSignals24h: d.successfulSignals24h ?? 0,
        reason: (d.reason as DecisionReason) ?? DecisionReason.NEEDS_REVIEW,
        reasonExplanation: d.reasonExplanation ?? '',
        riskScore: d.riskScore ?? 0,
        subscribedSinceDay: d.subscribedSinceDay ?? 0,
        daysAtRisk: d.daysAtRisk ?? 0,
        lastSignal: d.lastSignal ?? null,
        exchange: d.exchange ?? '',
      })),
      summary: {
        totalCount: res.summary?.totalCount ?? 0,
        activeCount: res.summary?.activeCount ?? 0,
        reviewNeededCount: res.summary?.reviewNeededCount ?? 0,
        highRiskCount: res.summary?.highRiskCount ?? 0,
      },
    };
  } catch (error) {
    throw new Error(`Portfolio decisions failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Fetch complete Decision Dashboard data (overview + decisions).
 * Orchestrates both portfolio and subscription queries in parallel.
 */
export async function getDecisionDashboardData(
  statusFilter: 'ALL' | 'ACTIVE' | 'AT_RISK' = 'ALL',
): Promise<DecisionDashboardData> {
  try {
    const allDecisionsPromise = getPortfolioDecisions('ALL');
    const [overview, summaryResponse, decisionsResponse] = await Promise.all([
      getPortfolioOverview(),
      allDecisionsPromise,
      statusFilter === 'ALL' ? allDecisionsPromise : getPortfolioDecisions(statusFilter),
    ]);

    return {
      overview,
      decisions: {
        decisions: decisionsResponse.decisions,
        summary: summaryResponse.summary,
      },
    };
  } catch (error) {
    throw new Error(`Decision dashboard data failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function registerBotProvisioning(payload: RegisterBotInput): Promise<BotProvisioningCredentials> {
  const response = await requestContractJson<BotRegistrationResponse>('bot-register', {
    init: {
      method: 'POST',
      body: JSON.stringify({
        botName: payload.botName,
        exchange: payload.exchange,
        tradingPair: payload.tradingPair,
        description: payload.botName,
      }),
    },
  });

  if (!response.botId || !response.apiKey || !response.rawSecret) {
    throw new Error('Bot provisioning response is missing required fields');
  }

  return {
    botId: response.botId,
    apiKey: response.apiKey,
    rawSecret: response.rawSecret,
  };
}

export async function updateBotStatus(
  botId: string,
  status: DeveloperBotStatus,
): Promise<DeveloperBotDetail> {
  const response = await requestContractJson<DeveloperBotDetailResponse>('developer-bot-update-status', {
    pathParams: { botId },
    init: {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    },
  });

  return {
    botId: response.botId ?? botId,
    botName: response.botName ?? response.name ?? 'Unnamed Bot',
    description: response.description ?? null,
    status: normalizeDeveloperBotStatus(response.status ?? status),
    tradingPair: response.tradingPair ?? null,
    exchange: response.exchange ?? null,
    apiKey: response.apiKey ?? null,
    developerId: response.developerId ?? null,
    createdAt: response.createdAt ?? null,
    updatedAt: response.updatedAt ?? null,
  };
}

export async function updateBotMetadata(
  botId: string,
  payload: { botName: string; exchange: 'BINANCE' | 'BYBIT' | 'OKX'; tradingPair: string; description: string },
): Promise<DeveloperBotDetail> {
  const response = await requestContractJson<DeveloperBotDetailResponse>('developer-bot-update-metadata', {
    pathParams: { botId },
    init: {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.botName,
        description: payload.description,
        tradingPair: payload.tradingPair,
        exchangeId: payload.exchange,
      }),
    },
  });

  return {
    botId: response.botId ?? botId,
    botName: response.botName ?? response.name ?? payload.botName,
    description: response.description ?? payload.description,
    status: normalizeDeveloperBotStatus(response.status),
    tradingPair: response.tradingPair ?? payload.tradingPair,
    exchange: response.exchange ?? payload.exchange,
    apiKey: response.apiKey ?? null,
    developerId: response.developerId ?? null,
    createdAt: response.createdAt ?? null,
    updatedAt: response.updatedAt ?? null,
  };
}

export async function deleteBot(botId: string): Promise<void> {
  await requestContractJson<void>('developer-bot-delete', {
    pathParams: { botId },
    init: {
      method: 'DELETE',
    },
  });
}

export async function favoriteBot(botId: string): Promise<{ botId: string; favorited: boolean }> {
  return requestContractJson<{ botId: string; favorited: boolean }>('bot-favorite', {
    pathParams: { botId },
    init: {
      method: 'POST',
    },
  });
}
