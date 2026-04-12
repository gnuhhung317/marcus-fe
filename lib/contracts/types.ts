export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ContractStatus = 'available' | 'gap';

export interface ContractRoute {
  id: string;
  method: ApiMethod;
  path: string;
  operationId: string;
  page: string;
  feature: string;
  status: ContractStatus;
  notes?: string;
}

export interface MarketTicker {
  symbol: string;
  asset: string;
  price: string;
  change: number;
}

export interface Principle {
  title: string;
  description: string;
  badge: string;
}

export interface MarketOverviewData {
  topVolume24h: number;
  activeStrategies: number;
  liveTickers: MarketTicker[];
}

export interface HomePageData {
  marketOverview: MarketOverviewData;
  principles: Principle[];
}

export interface MarketplacePageData {
  bots: MarketplaceBot[];
  page: number;
  pageSize: number;
  total: number;
}

export interface TrainingCourse {
  id: string;
  title: string;
  level: 'FOUNDATION' | 'ADVANCED' | 'EXPERT';
  progress: number;
  summary: string;
}

export interface AcademyMetricsData {
  activeStudents: number;
  strategiesDeployed: number;
  averagePerformancePercent: number;
  academyRating: number;
}

export interface TrainingPageData {
  courses: TrainingCourse[];
  metrics: AcademyMetricsData;
}

export interface MarketplaceBot {
  botId: string;
  name: string;
  tags: string[];
  pnl30d: number;
  winRate: number;
  drawdown: number;
}

export type MarketplaceSortBy = 'RETURN_30D' | 'DRAWDOWN' | 'WIN_RATE';

export interface MarketplaceQueryParams {
  search?: string;
  sortBy?: MarketplaceSortBy;
  page?: number;
  pageSize?: number;
}

export interface LeaderboardRow {
  rank: number;
  strategyId: string;
  strategyName: string;
  category: string;
  return24h: number;
  drawdown: number;
  sharpe: number;
  status: 'ACTIVE' | 'HIBERNATING';
}

export interface ResearchReport {
  id: string;
  title: string;
  category: string;
  readTime: string;
  publishedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
}

export interface BlogPageData {
  posts: BlogPost[];
}

export interface ResearchLibraryFile {
  fileId: string;
  title: string;
  format: string;
  sizeMb: number;
}

export interface ResearchPageData {
  reports: ResearchReport[];
  library: ResearchLibraryFile[];
}

export interface TerminalKpi {
  label: string;
  value: string;
  delta: string;
  context: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface AllocationSlice {
  name: string;
  value: number;
}

export interface StrategyTrade {
  timestamp: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  pnl: number;
}

export interface ProfileApiKey {
  id: string;
  label: string;
  maskedKey: string;
  createdAt: string;
}

export interface ProfilePreferences {
  timezone: string;
  baseCurrency: string;
  emailNotifications: boolean;
  sessionTimeoutMinutes: number;
}

export interface ProfileLoginActivity {
  id: string;
  device: string;
  location: string;
  ipMasked: string;
  createdAt: string;
  status: string;
}

export interface BotPerformance {
  annualReturn: number;
  maxDrawdown: number;
  sharpe: number;
  winRate: number;
  avgTradeReturn: number;
  tradesPerDay: number;
}

export interface BotDetail {
  botId: string;
  name: string;
  description: string;
  status: string;
  tradingPair: string;
  exchange: string;
  apiKey?: string;
  createdAt?: string;
  updatedAt?: string;
  performance?: BotPerformance;
}

export interface SubscriptionResult {
  botId: string;
  wsToken: string;
  status: string;
}

export interface DashboardPageData {
  terminalKpis: TerminalKpi[];
  strategyTrades: StrategyTrade[];
  allocations: AllocationSlice[];
}

export interface StrategyMetricTile {
  label: string;
  value: string;
}

export interface TimeSeriesValue {
  timestamp: string;
  value: number;
}

export interface StrategyPageData {
  strategyId: string;
  strategyName: string;
  ownerName: string;
  market: string;
  status: string;
  metrics: StrategyMetricTile[];
  performanceSeries: TimeSeriesValue[];
  trades: StrategyTrade[];
}

export interface PaperSignal {
  signalId: string;
  botId: string;
  assetPair: string;
  side: string;
  confidence: number;
  status: string;
  generatedAt: string;
}

export interface PaperSessionData {
  sessionId: string;
  status: string;
  virtualBalance: number;
  openPnl: number;
  buyingPower: number;
}

export interface PaperTradingPageData {
  session: PaperSessionData;
  signals: PaperSignal[];
}

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  role: string;
}

export interface ProfilePageData {
  profile: UserProfile;
  preferences: ProfilePreferences;
  apiKeys: ProfileApiKey[];
  loginActivities: ProfileLoginActivity[];
}

export interface ConnectivityDependency {
  name: string;
  status: string;
  latencyMs: number;
}

export interface ConnectivityHealth {
  overallStatus: string;
  checkedAt: string;
  dependencies: ConnectivityDependency[];
}

export interface SignalLogLine {
  signalId: string;
  botId: string;
  symbol: string;
  action: string;
  status: string;
  generatedTimestamp: string;
}

export interface ExecutionLogLine {
  timestamp: string;
  level: string;
  source: string;
  message: string;
}

export interface DeveloperConsolePageData {
  connectivity: ConnectivityHealth;
  signalStream: SignalLogLine[];
  executionLogs: ExecutionLogLine[];
}

export interface LeaderboardPageData {
  rows: LeaderboardRow[];
  featured: LeaderboardRow[];
  page: number;
  pageSize: number;
  total: number;
}

export type LeaderboardSortBy = 'RETURN_24H' | 'DRAWDOWN' | 'SHARPE';

export interface LeaderboardQueryParams {
  timeframe?: '24H' | '7D' | '30D';
  sortBy?: LeaderboardSortBy;
  page?: number;
  pageSize?: number;
}

export interface RegisterBotInput {
  botName: string;
  exchange: 'BINANCE' | 'BYBIT' | 'OKX';
  tradingPair: string;
}

export interface BotProvisioningCredentials {
  botId: string;
  apiKey: string;
  rawSecret: string;
}
