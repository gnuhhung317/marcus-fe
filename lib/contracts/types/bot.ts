import { TimeSeriesValue, BotTrade } from './shared';

export interface BotPerformance {
  annualReturn: number;
  maxDrawdown: number;
  sharpe: number;
  winRate: number;
  avgTradeReturn: number;
  tradesPerDay: number;
}

export type BotPerformanceSource = 'DRY_RUN' | 'HISTORICAL' | 'SIGNAL_BASED';
export type BotPerformanceQuerySource = 'AUTO' | 'DRY_RUN' | 'HISTORICAL';

export interface BotSignalItem {
  signalId: string;
  botId: string;
  symbol?: string | null;
  action?: string | null;
  status?: string | null;
  generatedTimestamp?: string | null;
}

export interface BotMetricTile {
  label: string;
  value: string;
}

export interface BotMetricBlock {
  title: 'Total Data' | 'Historical' | 'Out-of-sample';
  annualReturn: string;
  maxDrawdown: string;
  sharpe: string;
  sortino: string;
  calmar: string;
  profitFactor: string;
  winRate: string;
  sampleSizeDays: number;
  sampleSizeTrades: number;
  warning?: string | null;
}

export interface BotAnalyticsData {
  metricBlocks: BotMetricBlock[];
  performanceSeries: TimeSeriesValue[];
  splitTimestamp?: string | null;
}

export interface ViewerSubscription {
  status: string;
  wsToken?: string | null;
}

export interface BotDetail {
  botId: string;
  name: string;
  description: string;
  status: string;
  tradingPair: string;
  exchange: string;
  performanceSource?: BotPerformanceSource | null;
  apiKey?: string;
  createdAt?: string;
  updatedAt?: string;
  performance?: BotPerformance;
  analytics?: BotAnalyticsData | null;
  signals?: BotSignalItem[];
  viewerSubscription?: ViewerSubscription | null;
}

export interface MarketplaceBot {
  botId: string;
  name: string;
  tags: string[];
  annualReturn: number | null;
  winRate: number | null;
  drawdown: number | null;
  performanceSource?: BotPerformanceSource | null;
}

export type MarketplaceSortBy = 'CAGR' | 'RETURN_30D' | 'DRAWDOWN' | 'SUBSCRIBERS';

export interface MarketplaceQueryParams {
  search?: string;
  asset?: string;
  risk?: string;
  sortBy?: MarketplaceSortBy;
  page?: number;
  pageSize?: number;
}

export interface MarketplacePageData {
  bots: MarketplaceBot[];
  page: number;
  pageSize: number;
  total: number;
}

export interface SubscriptionResult {
  botId: string;
  wsToken: string;
  status: string;
}

export interface BotAnalyticsPageData {
  botId: string;
  botName: string;
  exchange: string;
  status: string;
  splitTimestamp?: string | null;
  metricBlocks: BotMetricBlock[];
  metrics: BotMetricTile[];
  performanceSeries: TimeSeriesValue[];
  trades: BotTrade[];
}
