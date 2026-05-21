import { availableContracts, contractRoutes, missingContracts } from './endpoints';
import {
  AuthLoginResponse,
  AuthRefreshRequest,
  requestAuthJson,
  requestJson,
} from '../api/http';
import {
  blogPosts,
  developerActiveBot,
  developerBots,
  developerSubscriptions,
  leaderboardRows,
  marketplaceBots,
  marketTickers,
  principles,
  profileApiKeys,
  researchReports,
  strategyTrades,
  terminalKpis,
  trainingCourses,
} from './seed-data';
import {
  AcademyMetricsData,
  AllocationSlice,
  BlogPageData,
  BotDetail,
  BlogPost,
  BotProvisioningCredentials,
  DashboardPageData,
  DeveloperBotDetail,
  DeveloperBotSummary,
  DeveloperConsolePageData,
  DeveloperDashboardPageData,
  DeveloperSubscriptionSummary,
  HomePageData,
  LeaderboardPageData,
  LeaderboardRow,
  LeaderboardQueryParams,
  MarketTicker,
  MarketplaceBot,
  MarketplacePageData,
  MarketplaceQueryParams,
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
  StrategyPageData,
  StrategyTrade,
  SubscriptionResult,
  TerminalKpi,
  TimeSeriesValue,
  TrainingCourse,
  TrainingPageData,
  UserProfile,
} from './types';

const DEFAULT_STRATEGY_ID = 'kinetic-alpha-v4';
const ACCESS_TOKEN_COOKIE = 'marcus_access_token';
const REFRESH_TOKEN_COOKIE = 'marcus_refresh_token';

let browserRefreshInFlight: Promise<string | undefined> | null = null;

const defaultAllocations: AllocationSlice[] = [
  { name: 'Binance Global', value: 52.4 },
  { name: 'OKX', value: 31.2 },
  { name: 'Bybit', value: 16.4 },
];

const defaultProfile: UserProfile = {
  userId: 'user_terminal_fallback',
  username: 'Marcus Vane',
  email: 'marcus.vane@marcus.trade',
  role: 'TRADER',
};

const defaultProfilePreferences: ProfilePreferences = {
  timezone: 'UTC+7',
  baseCurrency: 'USD',
  emailNotifications: true,
  sessionTimeoutMinutes: 30,
};

const defaultLoginActivities: ProfileLoginActivity[] = [
  {
    id: 'login-1',
    device: 'MacBook Pro · Chrome',
    location: 'Singapore',
    ipMasked: '192.168.**.24',
    createdAt: '2026-04-10T19:22:00Z',
    status: 'SUCCESS',
  },
  {
    id: 'login-2',
    device: 'iPhone · Safari',
    location: 'Ho Chi Minh City',
    ipMasked: '10.8.**.13',
    createdAt: '2026-04-09T06:40:00Z',
    status: 'SUCCESS',
  },
];

const defaultConnectivity = {
  overallStatus: 'UP',
  checkedAt: new Date().toISOString(),
  dependencies: [
    { name: 'Signal Router', status: 'UP', latencyMs: 8 },
    { name: 'Price Feed', status: 'UP', latencyMs: 12 },
    { name: 'Order Executor', status: 'DEGRADED', latencyMs: 38 },
  ],
};

const defaultAcademyMetrics: AcademyMetricsData = {
  activeStudents: 1240,
  strategiesDeployed: 368,
  averagePerformancePercent: 12.4,
  academyRating: 4.8,
};

const defaultTopVolume24h = 245_000_000;

const defaultExecutionLogs = [
  {
    timestamp: '2026-04-07T08:30:10Z',
    level: 'INFO',
    source: 'routing-engine',
    message: 'Signal dispatched to active subscribers',
  },
  {
    timestamp: '2026-04-07T08:29:42Z',
    level: 'WARN',
    source: 'schema-validator',
    message: 'Optional metadata field missing',
  },
  {
    timestamp: '2026-04-07T08:28:15Z',
    level: 'INFO',
    source: 'execution-core',
    message: 'Paper order executed in simulation mode',
  },
];

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

interface LeaderboardStrategyItemResponse {
  rank?: number;
  strategyId?: string;
  strategyName?: string;
  creatorName?: string;
  cagr?: number;
  sharpe?: number;
  maxDrawdown?: number;
}

interface LeaderboardStrategiesPageResponse {
  items?: LeaderboardStrategyItemResponse[];
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
  strategyId?: string;
  strategyName?: string;
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

interface StrategyDetailResponse {
  strategyId?: string;
  strategyName?: string;
  ownerName?: string;
  market?: string;
  status?: string;
}

interface StrategyMetricsResponse {
  annualReturn?: number;
  maxDrawdown?: number;
  sharpe?: number;
  sortino?: number;
  calmar?: number;
  profitFactor?: number;
}

interface TimeSeriesPointResponse {
  timestamp?: string;
  value?: number;
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
  activeStrategies?: number;
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
  strategiesDeployed?: number;
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

async function withFallback<T>(work: () => Promise<T>, fallback: () => Promise<T> | T): Promise<T> {
  try {
    return await work();
  } catch {
    return await fallback();
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

function normalizeTradeSide(side: string | undefined): StrategyTrade['side'] {
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
  const fallback = marketTickers[index];
  const symbol = item.symbol ?? fallback?.symbol ?? `ASSET-${index + 1}`;
  const price = toNumber(item.price, NaN);

  return {
    symbol,
    asset: item.asset ?? fallback?.asset ?? symbol,
    price: Number.isFinite(price) ? formatCurrency(price) : fallback?.price ?? '$0.00',
    change: toNumber(item.change24h, fallback?.change ?? 0),
  };
}

function mapAcademyCourse(item: AcademyCourseSummaryResponse, index: number): TrainingCourse {
  const fallback = trainingCourses[index];
  const modules = Math.max(0, Math.round(toNumber(item.modules)));
  const durationHours = Math.max(0, toNumber(item.durationHours));
  const generatedSummary = modules > 0 || durationHours > 0
    ? `${modules || 0} modules · ${durationHours.toFixed(1)}h guided content.`
    : 'Practical algorithmic modules with execution-focused labs.';

  return {
    id: item.courseId ?? fallback?.id ?? `course-${index + 1}`,
    title: item.title ?? fallback?.title ?? `Academy Course ${index + 1}`,
    level: normalizeCourseLevel(item.level ?? fallback?.level),
    progress: clamp(Math.round(toNumber(item.progress, fallback?.progress ?? 0)), 0, 100),
    summary: item.courseId || item.title || item.modules || item.durationHours
      ? generatedSummary
      : fallback?.summary ?? generatedSummary,
  };
}

function mapBlogPost(item: BlogPostSummaryResponse, index: number): BlogPost {
  const fallback = blogPosts[index];
  const readTimeMinutes = Math.max(1, Math.round(toNumber(item.readTimeMinutes, NaN)));

  return {
    id: item.postId ?? fallback?.id ?? `post-${index + 1}`,
    title: item.title ?? fallback?.title ?? `Market Insight ${index + 1}`,
    category: item.category ?? fallback?.category ?? 'Insights',
    excerpt: item.excerpt ?? fallback?.excerpt ?? 'No excerpt available yet.',
    readTime: Number.isFinite(readTimeMinutes) ? `${readTimeMinutes} min` : fallback?.readTime ?? '5 min',
  };
}

function mapResearchReport(item: ResearchReportSummaryResponse, index: number): ResearchReport {
  const fallback = researchReports[index];
  const readTimeMinutes = Math.max(1, Math.round(toNumber(item.readTimeMinutes, NaN)));

  return {
    id: item.reportId ?? fallback?.id ?? `report-${index + 1}`,
    title: item.title ?? fallback?.title ?? `Research Report ${index + 1}`,
    category: item.category ?? fallback?.category ?? 'Research',
    readTime: Number.isFinite(readTimeMinutes) ? `${readTimeMinutes} min` : fallback?.readTime ?? '8 min',
    publishedAt: toDateOnly(item.publishedAt, fallback?.publishedAt ?? '2026-01-01'),
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

function mapTradeLogItem(item: TradeLogItemResponse): StrategyTrade | null {
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
  const fallback = marketplaceBots.find((item) => item.botId === bot.botId || item.name === bot.botName);

  return {
    botId: bot.botId ?? fallback?.botId ?? randomToken('bot'),
    name: bot.botName ?? fallback?.name ?? 'Unnamed Bot',
    tags: [bot.exchange ?? fallback?.tags[0] ?? 'UNKNOWN', bot.status ?? fallback?.tags[1] ?? 'ACTIVE'],
    pnl30d: fallback?.pnl30d ?? 0,
    winRate: fallback?.winRate ?? 0,
    drawdown: fallback?.drawdown ?? 0,
  };
}

function normalizeSearchText(value: string | undefined) {
  return (value ?? '').trim().toLowerCase();
}

function sortMarketplaceBots(bots: MarketplaceBot[], sortBy?: MarketplaceQueryParams['sortBy']) {
  const sorted = [...bots];

  if (sortBy === 'DRAWDOWN') {
    sorted.sort((left, right) => left.drawdown - right.drawdown);
  } else if (sortBy === 'WIN_RATE') {
    sorted.sort((left, right) => right.winRate - left.winRate);
  } else {
    sorted.sort((left, right) => right.pnl30d - left.pnl30d);
  }

  return sorted;
}

function applyMarketplaceFilters(bots: MarketplaceBot[], query: MarketplaceQueryParams = {}) {
  const search = normalizeSearchText(query.search);
  const filtered = search
    ? bots.filter((bot) => {
        const searchable = [bot.botId, bot.name, ...bot.tags].join(' ').toLowerCase();
        return searchable.includes(search);
      })
    : bots;

  const sorted = sortMarketplaceBots(filtered, query.sortBy);
  const pageSize = Math.max(1, Math.min(48, query.pageSize ?? 12));
  const page = Math.max(1, query.page ?? 1);
  const startIndex = (page - 1) * pageSize;

  return {
    bots: sorted.slice(startIndex, startIndex + pageSize),
    total: sorted.length,
    page,
    pageSize,
  };
}

function sortLeaderboardRows(rows: LeaderboardRow[], sortBy?: LeaderboardQueryParams['sortBy']) {
  const sorted = [...rows];

  if (sortBy === 'DRAWDOWN') {
    sorted.sort((left, right) => left.drawdown - right.drawdown);
  } else if (sortBy === 'SHARPE') {
    sorted.sort((left, right) => right.sharpe - left.sharpe);
  } else {
    sorted.sort((left, right) => right.return24h - left.return24h);
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

function mapBotDetail(bot: BotDetailResponse, fallbackBot?: MarketplaceBot): BotDetail {
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
    botId: bot.botId ?? fallbackBot?.botId ?? randomToken('bot'),
    name: bot.botName ?? fallbackBot?.name ?? 'Unnamed Bot',
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

function mapLeaderboardRow(item: LeaderboardStrategyItemResponse, index: number): LeaderboardRow {
  const fallback = leaderboardRows[index];

  return {
    rank: Math.max(1, Math.round(toNumber(item.rank, fallback?.rank ?? index + 1))),
    strategyId: item.strategyId ?? fallback?.strategyId ?? `strategy-${index + 1}`,
    strategyName: item.strategyName ?? fallback?.strategyName ?? `Strategy ${index + 1}`,
    category: item.creatorName ?? fallback?.category ?? 'System',
    return24h: toNumber(item.cagr, fallback?.return24h ?? 0),
    drawdown: toNumber(item.maxDrawdown, fallback?.drawdown ?? 0),
    sharpe: toNumber(item.sharpe, fallback?.sharpe ?? 0),
    status: fallback?.status ?? 'ACTIVE',
  };
}

function buildFallbackStrategySeries(): TimeSeriesValue[] {
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
      activeStrategies: Math.max(0, Math.round(toNumber(response?.activeStrategies, leaderboardRows.length))),
      liveTickers: liveTickers.length ? liveTickers : marketTickers,
    },
    principles,
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
    strategiesDeployed: Math.max(0, Math.round(toNumber(metricsResponse?.strategiesDeployed, defaultAcademyMetrics.strategiesDeployed))),
    averagePerformancePercent: toNumber(metricsResponse?.averagePerformancePercent, defaultAcademyMetrics.averagePerformancePercent),
    academyRating: toNumber(metricsResponse?.academyRating, defaultAcademyMetrics.academyRating),
  };

  return {
    courses: courses.length ? courses : trainingCourses,
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
    posts: posts.length ? posts : blogPosts,
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
  const resolvedReports = reports.length ? reports : researchReports;
  const library = libraryResponse.map((item, index) => mapResearchLibraryFile(item, index));

  return {
    reports: resolvedReports,
    library: library.length
      ? library
      : resolvedReports.slice(0, 5).map((report, index) => ({
          fileId: `fallback-file-${index + 1}`,
          title: report.title,
          format: 'PDF',
          sizeMb: 1.6 + index * 0.2,
        })),
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
      () => requestContractJson<TradeLogPageResponse>('strategy-trades', {
        pathParams: { strategyId: DEFAULT_STRATEGY_ID },
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
    .filter((item): item is StrategyTrade => item !== null);

  const performanceSeries = (equitySeriesResponse ?? [])
    .map((point) => ({
      timestamp: point.timestamp ?? new Date().toISOString(),
      value: toNumber(point.value),
    }))
    .filter((point) => Number.isFinite(point.value));

  return {
    terminalKpis: overview ? mapDashboardKpis(overview) : [],
    strategyTrades: mappedTrades,
    allocations: mappedAllocations,
    performanceSeries,
  };
}

async function fetchMarketplaceBots(query: MarketplaceQueryParams = {}): Promise<MarketplaceBot[]> {
  const response = await withFallback(
    () => requestContractJson<BotSummaryPageResponse>('bots-list'),
    async () => ({ items: [] }),
  );

  const items = response.items ?? [];
  const mapped = items.map((bot) => mapBotSummary(bot));
  return mapped.length ? mapped : marketplaceBots;
}

export async function getMarketplacePageData(query: MarketplaceQueryParams = {}): Promise<MarketplacePageData> {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.max(1, Math.min(48, query.pageSize ?? 12));

  const resolvedBots = await fetchMarketplaceBots({ ...query, page, pageSize });
  const paged = applyMarketplaceFilters(resolvedBots, { ...query, page, pageSize });

  return {
    bots: paged.bots,
    page: paged.page,
    pageSize: paged.pageSize,
    total: paged.total,
  };
}

export async function listMarketplaceBots(query: MarketplaceQueryParams = {}): Promise<MarketplaceBot[]> {
  const pageData = await getMarketplacePageData(query);
  return pageData.bots;
}

export async function getMarketplaceBotDetail(botId: string): Promise<BotDetail> {
  const fallbackBot = marketplaceBots.find((bot) => bot.botId === botId);
  const response = await withFallback(
    () => requestContractJson<BotDetailResponse>('bot-detail', {
      pathParams: { botId },
    }),
    async () => undefined,
  );

  if (!response) {
    return {
      botId,
      name: fallbackBot?.name ?? 'Unknown Bot',
      description: 'Bot detail endpoint is not reachable. Showing fallback metadata.',
      status: 'ACTIVE',
      tradingPair: 'BTC/USDT',
      exchange: fallbackBot?.tags[0] ?? 'BINANCE',
      performance: {
        annualReturn: fallbackBot?.pnl30d ?? 0,
        maxDrawdown: fallbackBot?.drawdown ?? 0,
        sharpe: 0,
        winRate: fallbackBot?.winRate ?? 0,
        avgTradeReturn: 0,
        tradesPerDay: 0,
      },
    };
  }

  return mapBotDetail(response, fallbackBot);
}

export async function subscribeToBot(botId: string): Promise<SubscriptionResult> {
  const response = await withFallback(
    () => requestContractJson<SubscribeBotResultResponse>('bot-subscribe', {
      pathParams: { botId },
      init: { method: 'POST' },
    }),
    async () => ({
      botId,
      wsToken: randomToken('ws'),
      status: 'SUBSCRIBED',
    }),
  );

  return {
    botId: response.botId ?? botId,
    wsToken: response.wsToken ?? randomToken('ws'),
    status: response.status ?? 'SUBSCRIBED',
  };
}

export async function unsubscribeFromBot(botId: string): Promise<SubscriptionResult> {
  const response = await withFallback(
    () => requestContractJson<SubscribeBotResultResponse>('bot-unsubscribe', {
      pathParams: { botId },
      init: { method: 'DELETE' },
    }),
    async () => ({
      botId,
      wsToken: '',
      status: 'UNSUBSCRIBED',
    }),
  );

  return {
    botId: response.botId ?? botId,
    wsToken: response.wsToken ?? '',
    status: response.status ?? 'UNSUBSCRIBED',
  };
}

export async function getLeaderboardPageData(query: LeaderboardQueryParams = {}): Promise<LeaderboardPageData> {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.max(1, Math.min(48, query.pageSize ?? 12));
  const [strategiesPage, featuredResponse] = await Promise.all([
    withFallback(
      () => requestContractJson<LeaderboardStrategiesPageResponse>('leaderboard-list'),
      async () => ({ items: [] }),
    ),
    withFallback(() => requestContractJson<LeaderboardFeaturedResponse>('leaderboard-featured'), async () => ({ items: [] })),
  ]);

  const rows = (strategiesPage.items ?? []).map((item, index) => mapLeaderboardRow(item, index));
  const resolvedRows = rows.length ? rows : leaderboardRows;
  const pagedRows = applyLeaderboardFilters(resolvedRows, { ...query, page, pageSize });

  const featured = (featuredResponse.items ?? [])
    .map((item, index) => {
      const matchedRow = resolvedRows.find((row) => row.strategyId === item.strategyId);

      if (matchedRow) {
        return matchedRow;
      }

      return {
        rank: index + 1,
        strategyId: item.strategyId ?? `featured-${index + 1}`,
        strategyName: item.strategyName ?? `Featured Strategy ${index + 1}`,
        category: item.rankLabel ?? 'Featured',
        return24h: 0,
        drawdown: 0,
        sharpe: toNumber(item.sharpe),
        status: 'ACTIVE' as const,
      };
    })
    .slice(0, 3);

  return {
    rows: pagedRows.rows,
    featured: featured.length ? featured : resolvedRows.slice(0, 3),
    page: pagedRows.page,
    pageSize: pagedRows.pageSize,
    total: pagedRows.total,
  };
}

export async function getPaperTradingPageData(): Promise<PaperTradingPageData> {
  const [sessionResponse, signalResponse] = await Promise.all([
    withFallback(() => requestContractJson<PaperSessionSummaryResponse>('paper-session'), async () => undefined),
    withFallback(
      () => requestContractJson<PaperSignalResponse[]>('paper-signals', {
        queryParams: { limit: 8, status: 'ALL' },
      }),
      async () => [],
    ),
  ]);

  const session = {
    sessionId: sessionResponse?.sessionId ?? '992-ARC-04',
    status: sessionResponse?.status ?? 'RUNNING',
    virtualBalance: toNumber(sessionResponse?.virtualBalance, 248502.94),
    openPnl: toNumber(sessionResponse?.openPnl, 4210),
    buyingPower: toNumber(sessionResponse?.buyingPower, 1200000),
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

  const fallbackSignals = strategyTrades.slice(0, 4).map((trade, index) => ({
    signalId: `fallback-${index + 1}`,
    botId: 'fallback-bot',
    assetPair: trade.pair,
    side: trade.side,
    confidence: 0.7,
    status: 'EXECUTED',
    generatedAt: trade.timestamp,
  }));

  return {
    session,
    signals: signals.length ? signals : fallbackSignals,
  };
}

export async function createPaperOrder(payload: PaperOrderInput): Promise<PaperOrderResult> {
  const response = await withFallback(
    () =>
      requestContractJson<PaperOrderResponse>('paper-order', {
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
      }),
    async () => ({
      orderId: randomToken('paper_order'),
      status: 'ACCEPTED',
      filledQuantity: payload.quantity,
      avgFillPrice: payload.estimatedPrice,
      submittedAt: new Date().toISOString(),
    }),
  );

  return {
    orderId: response.orderId ?? randomToken('paper_order'),
    status: response.status ?? 'ACCEPTED',
    filledQuantity: toNumber(response.filledQuantity, payload.quantity),
    avgFillPrice: toNumber(response.avgFillPrice, payload.estimatedPrice),
    submittedAt: response.submittedAt ?? new Date().toISOString(),
  };
}

export async function pausePaperSession(): Promise<PaperSessionData> {
  const response = await withFallback(
    () => requestContractJson<PaperSessionSummaryResponse>('paper-session-pause', {
      init: { method: 'POST' },
    }),
    async () => undefined,
  );

  return {
    sessionId: response?.sessionId ?? '992-ARC-04',
    status: response?.status ?? 'PAUSED',
    virtualBalance: toNumber(response?.virtualBalance, 248502.94),
    openPnl: toNumber(response?.openPnl, 4210),
    buyingPower: toNumber(response?.buyingPower, 1200000),
  };
}

export async function resumePaperSession(): Promise<PaperSessionData> {
  const response = await withFallback(
    () => requestContractJson<PaperSessionSummaryResponse>('paper-session-resume', {
      init: { method: 'POST' },
    }),
    async () => undefined,
  );

  return {
    sessionId: response?.sessionId ?? '992-ARC-04',
    status: response?.status ?? 'RUNNING',
    virtualBalance: toNumber(response?.virtualBalance, 248502.94),
    openPnl: toNumber(response?.openPnl, 4210),
    buyingPower: toNumber(response?.buyingPower, 1200000),
  };
}

export async function getProfilePageData(): Promise<ProfilePageData> {
  const [profileResponse, preferencesResponse, apiKeyResponse, loginActivityResponse] = await Promise.all([
    withFallback(() => requestContractJson<UserProfileResponse>('profile-me'), async () => undefined),
    withFallback(() => requestContractJson<UserPreferencesResponse>('profile-preferences'), async () => undefined),
    withFallback(() => requestContractJson<ApiKeySummaryResponse[]>('profile-api-keys'), async () => []),
    withFallback(() => requestContractJson<LoginActivityResponse[]>('profile-login-activities'), async () => []),
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

  const loginActivities = (loginActivityResponse ?? []).map((activity, index) => mapLoginActivity(activity, index));

  return {
    profile,
    preferences,
    apiKeys: mappedApiKeys.length ? mappedApiKeys : profileApiKeys,
    loginActivities: loginActivities.length ? loginActivities : defaultLoginActivities,
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

  return {
    id: response.apiKeyId ?? randomToken('key'),
    label: response.label ?? payload.label,
    maskedKey: response.maskedKey ?? 'mt_ak_************0000',
    createdAt: response.createdAt ?? new Date().toISOString(),
  } satisfies ProfileApiKey;
}

export async function deleteCurrentUserApiKey(apiKeyId: string) {
  await requestContractJson<void>('profile-api-key-delete', {
    pathParams: { apiKeyId },
    init: { method: 'DELETE' },
  });
}

export async function listCurrentUserLoginActivities(): Promise<ProfileLoginActivity[]> {
  const response = await withFallback(() => requestContractJson<LoginActivityResponse[]>('profile-login-activities'), async () => []);
  const activities = response.map((activity, index) => mapLoginActivity(activity, index));

  return activities.length ? activities : defaultLoginActivities;
}

export async function getStrategyPageData(strategyId: string = DEFAULT_STRATEGY_ID): Promise<StrategyPageData> {
  const safeStrategyId = strategyId || DEFAULT_STRATEGY_ID;

  const [detailResponse, metricsResponse, seriesResponse, tradeLogPage] = await Promise.all([
    withFallback(
      () => requestContractJson<StrategyDetailResponse>('strategy-detail', {
        pathParams: { strategyId: safeStrategyId },
      }),
      async () => undefined,
    ),
    withFallback(
      () => requestContractJson<StrategyMetricsResponse>('strategy-metrics', {
        pathParams: { strategyId: safeStrategyId },
        queryParams: { feeMode: 'AFTER_FEES' },
      }),
      async () => undefined,
    ),
    withFallback(
      () => requestContractJson<TimeSeriesPointResponse[]>('strategy-series', {
        pathParams: { strategyId: safeStrategyId },
        queryParams: { range: '1W' },
      }),
      async () => [],
    ),
    withFallback(
      () => requestContractJson<TradeLogPageResponse>('strategy-trades', {
        pathParams: { strategyId: safeStrategyId },
        queryParams: { page: 0, size: 12 },
      }),
      async () => ({ items: [] }),
    ),
  ]);

  const metrics = [
    { label: 'Annual Return', value: formatSignedPercent(toNumber(metricsResponse?.annualReturn, 14.28), 2) },
    { label: 'Max Drawdown', value: `${toNumber(metricsResponse?.maxDrawdown, 2.14).toFixed(2)}%` },
    { label: 'Sharpe', value: toNumber(metricsResponse?.sharpe, 4.82).toFixed(2) },
    { label: 'Sortino', value: toNumber(metricsResponse?.sortino, 5.11).toFixed(2) },
    { label: 'Calmar', value: toNumber(metricsResponse?.calmar, 3.12).toFixed(2) },
    { label: 'Profit Factor', value: toNumber(metricsResponse?.profitFactor, 1.92).toFixed(2) },
  ];

  const performanceSeries = seriesResponse
    .map((point) => ({
      timestamp: point.timestamp ?? new Date().toISOString(),
      value: toNumber(point.value),
    }))
    .filter((point) => Number.isFinite(point.value));

  const trades = (tradeLogPage.items ?? [])
    .map((item) => mapTradeLogItem(item))
    .filter((item): item is StrategyTrade => item !== null);

  return {
    strategyId: detailResponse?.strategyId ?? safeStrategyId,
    strategyName: detailResponse?.strategyName ?? 'NEURAL_MOMENTUM_V24',
    ownerName: detailResponse?.ownerName ?? 'Marcus Quant Lab',
    market: detailResponse?.market ?? 'CRYPTO',
    status: detailResponse?.status ?? 'ACTIVE',
    metrics,
    performanceSeries: performanceSeries.length ? performanceSeries : buildFallbackStrategySeries(),
    trades: trades.length ? trades : strategyTrades,
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
    dependencies:
      connectivityResponse?.dependencies?.map((dependency) => ({
        name: dependency.name ?? 'Unknown dependency',
        status: dependency.status ?? 'UP',
        latencyMs: Math.max(0, Math.round(toNumber(dependency.latencyMs))),
      })) ?? defaultConnectivity.dependencies,
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
    executionLogs: executionLogs.length ? executionLogs : defaultExecutionLogs,
  };
}

interface DeveloperBotSummaryResponse {
  botId?: string;
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
}

interface BotSubscriptionResultResponse {
  botId?: string;
  wsToken?: string;
  status?: string;
}

export async function getDeveloperDashboardPageData(activeBotId?: string): Promise<DeveloperDashboardPageData> {
  const botsResponse = await withFallback(
    () => requestContractJson<DeveloperBotSummaryResponse[]>('developer-bots'),
    async () => [],
  );

  const bots = botsResponse.map((item, index) => ({
    botId: item.botId ?? `bot_${index + 1}`,
    botName: item.botName ?? 'Unnamed Bot',
    description: item.description ?? null,
    status: (item.status ?? 'CREATED') as DeveloperBotSummary['status'],
    tradingPair: item.tradingPair ?? null,
    exchange: item.exchange ?? null,
    apiKey: item.apiKey ?? null,
  }));

  const resolvedBots = bots;
  const selectedBotId = activeBotId && resolvedBots.some(b => b.botId === activeBotId)
    ? activeBotId
    : (resolvedBots[0]?.botId ?? '');

  const [detailResponse, subscriptionsResponse] = await Promise.all([
    withFallback(
      () => requestContractJson<DeveloperBotDetailResponse>('developer-bot-detail', { pathParams: { botId: selectedBotId } }),
      async () => undefined,
    ),
    withFallback(
      () => requestContractJson<BotSubscriptionResultResponse[]>('developer-bot-subscriptions', { pathParams: { botId: selectedBotId } }),
      async () => [],
    ),
  ]);

  const matchedSummary = resolvedBots.find(b => b.botId === selectedBotId);

  const activeBot: DeveloperBotDetail = {
    botId: detailResponse?.botId ?? selectedBotId,
    botName: detailResponse?.botName ?? matchedSummary?.botName ?? 'Unnamed Bot',
    description: detailResponse?.description ?? matchedSummary?.description ?? null,
    status: (detailResponse?.status ?? matchedSummary?.status ?? 'CREATED') as DeveloperBotSummary['status'],
    tradingPair: detailResponse?.tradingPair ?? matchedSummary?.tradingPair ?? null,
    exchange: detailResponse?.exchange ?? matchedSummary?.exchange ?? null,
    apiKey: detailResponse?.apiKey ?? matchedSummary?.apiKey ?? null,
    developerId: detailResponse?.developerId ?? null,
    createdAt: detailResponse?.createdAt ?? null,
    updatedAt: detailResponse?.updatedAt ?? null,
  };

  const subscriptions: DeveloperSubscriptionSummary[] = subscriptionsResponse.map((item, index) => ({
    botId: item.botId ?? selectedBotId,
    wsToken: item.wsToken ?? `ws_${index + 1}`,
    status: item.status ?? 'UNKNOWN',
  }));

  return {
    bots: resolvedBots,
    activeBot,
    subscriptions,
  };
}

export async function getTerminalData() {
  const [dashboardData, marketplaceData, strategyData, profileData, leaderboardData] = await Promise.all([
    getDashboardPageData(),
    listMarketplaceBots(),
    getStrategyPageData(),
    getProfilePageData(),
    getLeaderboardPageData(),
  ]);

  return {
    terminalKpis: dashboardData.terminalKpis,
    marketplaceBots: marketplaceData,
    strategyTrades: strategyData.trades,
    profileApiKeys: profileData.apiKeys,
    leaderboardRows: leaderboardData.rows,
  };
}

function randomToken(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
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
    const backendStatus = statusFilter === 'ALL' ? 'ACTIVE' : statusFilter;
    const res = await requestContractJson<PortfolioDecisionsResponseData>('portfolio-decisions', {
      queryParams: {
        status: backendStatus,
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
    const [overview, decisionsResponse] = await Promise.all([
      getPortfolioOverview(),
      getPortfolioDecisions(statusFilter),
    ]);
    return {
      overview,
      decisions: decisionsResponse,
    };
  } catch (error) {
    throw new Error(`Decision dashboard data failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function registerBotProvisioning(payload: RegisterBotInput): Promise<BotProvisioningCredentials> {
  const response = await withFallback(
    () =>
      requestContractJson<BotRegistrationResponse>('bot-register', {
        init: {
          method: 'POST',
          body: JSON.stringify({
            botName: payload.botName,
            exchange: payload.exchange,
            tradingPair: payload.tradingPair,
            description: payload.botName,
          }),
        },
      }),
    async () => ({
      botId: randomToken('bot'),
      apiKey: randomToken('mk_live'),
      rawSecret: randomToken('ms_live'),
    }),
  );

  return {
    botId: response.botId ?? randomToken('bot'),
    apiKey: response.apiKey ?? randomToken('mk_live'),
    rawSecret: response.rawSecret ?? randomToken('ms_live'),
  };
}
