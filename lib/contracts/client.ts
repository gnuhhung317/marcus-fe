import { availableContracts, missingContracts } from './endpoints';
import {
  blogPosts,
  leaderboardRows,
  marketplaceBots,
  marketTickers,
  principles,
  profileApiKeys,
  researchReports,
  strategyTrades,
  terminalKpis,
  trainingCourses,
} from './mock-data';
import {
  AcademyMetricsData,
  AllocationSlice,
  BlogPageData,
  BotDetail,
  BlogPost,
  BotProvisioningCredentials,
  DashboardPageData,
  DeveloperConsolePageData,
  HomePageData,
  LeaderboardPageData,
  LeaderboardRow,
  MarketTicker,
  MarketplaceBot,
  PaperTradingPageData,
  ProfileApiKey,
  ProfilePageData,
  RegisterBotInput,
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

const DEFAULT_API_BASE_URL = 'http://localhost:8080/api/v1';
const DEFAULT_STRATEGY_ID = 'kinetic-alpha-v4';

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

interface UserProfileResponse {
  userId?: string;
  username?: string;
  email?: string;
  role?: string;
}

interface ApiKeySummaryResponse {
  apiKeyId?: string;
  label?: string;
  maskedKey?: string;
  createdAt?: string;
  lastUsedAt?: string;
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

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');
}

function toQuery(params: Record<string, string | number | undefined>) {
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

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${getApiBaseUrl()}${normalizedPath}`, {
    cache: 'no-store',
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${normalizedPath}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function withFallback<T>(work: () => Promise<T>, fallback: () => Promise<T> | T): Promise<T> {
  try {
    return await work();
  } catch {
    return await fallback();
  }
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
  const response = await withFallback(
    () => requestJson<MarketOverviewResponse>('/market/overview'),
    async () => undefined,
  );

  const liveTickers = (response?.liveTickers ?? []).map((item, index) => mapMarketTickerItem(item, index));

  return {
    marketOverview: {
      topVolume24h: toNumber(response?.topVolume24h, defaultTopVolume24h),
      activeStrategies: Math.max(0, Math.round(toNumber(response?.activeStrategies, leaderboardRows.length))),
      liveTickers: liveTickers.length ? liveTickers : marketTickers,
    },
    principles,
  };
}

export async function getTrainingPageData(): Promise<TrainingPageData> {
  const [coursesResponse, metricsResponse] = await Promise.all([
    withFallback(() => requestJson<AcademyCoursesResponse>(`/academy/courses${toQuery({ limit: 12 })}`), async () => ({ items: [] })),
    withFallback(() => requestJson<AcademyMetricsResponse>('/academy/metrics'), async () => undefined),
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
    () => requestJson<BlogPostsResponse>(`/content/blog/posts${toQuery({ page: 0, size: 12 })}`),
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
      () => requestJson<ResearchReportsResponse>(`/content/research/reports${toQuery({ page: 0, size: 12 })}`),
      async () => ({ items: [] }),
    ),
    withFallback(
      () => requestJson<ResearchLibraryFileResponse[]>(`/content/research/reports/library${toQuery({ limit: 8 })}`),
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

export async function getDashboardPageData(): Promise<DashboardPageData> {
  const [overview, allocationItems, tradeLogPage] = await Promise.all([
    withFallback(() => requestJson<DashboardOverviewResponse>('/dashboard/overview'), async () => undefined),
    withFallback(() => requestJson<ExchangeAllocationItemResponse[]>('/dashboard/exchange-allocation'), async () => []),
    withFallback(
      () => requestJson<TradeLogPageResponse>(`/strategies/${encodeURIComponent(DEFAULT_STRATEGY_ID)}/trades${toQuery({ page: 0, size: 8 })}`),
      async () => ({ items: [] }),
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

  return {
    terminalKpis: overview ? mapDashboardKpis(overview) : terminalKpis,
    strategyTrades: mappedTrades.length ? mappedTrades : strategyTrades,
    allocations: mappedAllocations.length ? mappedAllocations : defaultAllocations,
  };
}

export async function listMarketplaceBots(): Promise<MarketplaceBot[]> {
  const response = await withFallback(
    () => requestJson<BotSummaryResponse[]>(`/bots${toQuery({ page: 0, size: 12 })}`),
    async () => [],
  );

  const mapped = response.map((bot) => mapBotSummary(bot));
  return mapped.length ? mapped : marketplaceBots;
}

export async function getMarketplaceBotDetail(botId: string): Promise<BotDetail> {
  const fallbackBot = marketplaceBots.find((bot) => bot.botId === botId);
  const response = await withFallback(
    () => requestJson<BotDetailResponse>(`/bots/${encodeURIComponent(botId)}`),
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
    () => requestJson<SubscribeBotResultResponse>(`/subscriptions/${encodeURIComponent(botId)}`, { method: 'POST' }),
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

export async function getLeaderboardPageData(): Promise<LeaderboardPageData> {
  const [strategiesPage, featuredResponse] = await Promise.all([
    withFallback(
      () => requestJson<LeaderboardStrategiesPageResponse>(`/leaderboard/strategies${toQuery({ timeframe: '24H', page: 0, size: 12 })}`),
      async () => ({ items: [] }),
    ),
    withFallback(() => requestJson<LeaderboardFeaturedResponse>('/leaderboard/featured'), async () => ({ items: [] })),
  ]);

  const rows = (strategiesPage.items ?? []).map((item, index) => mapLeaderboardRow(item, index));
  const resolvedRows = rows.length ? rows : leaderboardRows;

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
    rows: resolvedRows,
    featured: featured.length ? featured : resolvedRows.slice(0, 3),
  };
}

export async function getPaperTradingPageData(): Promise<PaperTradingPageData> {
  const [sessionResponse, signalResponse] = await Promise.all([
    withFallback(() => requestJson<PaperSessionSummaryResponse>('/paper/session'), async () => undefined),
    withFallback(() => requestJson<PaperSignalResponse[]>(`/paper/signals${toQuery({ limit: 8, status: 'ALL' })}`), async () => []),
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

export async function getProfilePageData(): Promise<ProfilePageData> {
  const [profileResponse, apiKeyResponse] = await Promise.all([
    withFallback(() => requestJson<UserProfileResponse>('/users/me'), async () => undefined),
    withFallback(() => requestJson<ApiKeySummaryResponse[]>('/users/me/api-keys'), async () => []),
  ]);

  const profile: UserProfile = {
    userId: profileResponse?.userId ?? defaultProfile.userId,
    username: profileResponse?.username ?? defaultProfile.username,
    email: profileResponse?.email ?? defaultProfile.email,
    role: profileResponse?.role ?? defaultProfile.role,
  };

  const mappedApiKeys = apiKeyResponse
    .map((key) => mapApiKeySummary(key))
    .filter((key): key is ProfileApiKey => key !== null);

  return {
    profile,
    apiKeys: mappedApiKeys.length ? mappedApiKeys : profileApiKeys,
  };
}

export async function getStrategyPageData(strategyId: string = DEFAULT_STRATEGY_ID): Promise<StrategyPageData> {
  const safeStrategyId = strategyId || DEFAULT_STRATEGY_ID;

  const [detailResponse, metricsResponse, seriesResponse, tradeLogPage] = await Promise.all([
    withFallback(() => requestJson<StrategyDetailResponse>(`/strategies/${encodeURIComponent(safeStrategyId)}`), async () => undefined),
    withFallback(() => requestJson<StrategyMetricsResponse>(`/strategies/${encodeURIComponent(safeStrategyId)}/metrics${toQuery({ feeMode: 'AFTER_FEES' })}`), async () => undefined),
    withFallback(() => requestJson<TimeSeriesPointResponse[]>(`/strategies/${encodeURIComponent(safeStrategyId)}/performance-series${toQuery({ range: '1W' })}`), async () => []),
    withFallback(
      () => requestJson<TradeLogPageResponse>(`/strategies/${encodeURIComponent(safeStrategyId)}/trades${toQuery({ page: 0, size: 12 })}`),
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
    withFallback(() => requestJson<ConnectivityHealthResponse>('/system/connectivity'), async () => undefined),
    withFallback(() => requestJson<SignalItemResponse[]>(`/signals${toQuery({ limit: 8, status: 'ALL' })}`), async () => []),
    withFallback(() => requestJson<ExecutionLogPageResponse>(`/system/execution-logs${toQuery({ limit: 10 })}`), async () => ({ items: [] })),
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

export async function registerBotProvisioning(payload: RegisterBotInput): Promise<BotProvisioningCredentials> {
  const response = await withFallback(
    () =>
      requestJson<BotRegistrationResponse>('/bots', {
        method: 'POST',
        body: JSON.stringify({
          botName: payload.botName,
          exchange: payload.exchange,
          tradingPair: payload.tradingPair,
          description: payload.botName,
        }),
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
