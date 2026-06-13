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
  activeBots: number;
  liveTickers: MarketTicker[];
}

export interface MarketingStats {
  verifiedDevelopers: number;
  activeCloudExecutors: number;
  systemUptime: string;
  supportedExchanges: number;
}

export interface HomePageData {
  marketOverview: MarketOverviewData;
  principles: Principle[];
  marketingStats?: MarketingStats;
}

export interface LeaderboardRow {
  rank: number;
  botId: string;
  botName: string;
  creatorName: string;
  cagr: number;
  drawdown: number;
  sharpe: number;
  status: 'ACTIVE' | 'HIBERNATING';
  dataSource?: 'DRY_RUN' | 'HISTORICAL';
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
  dataSource?: 'DRY_RUN' | 'HISTORICAL' | 'ALL';
  market?: string;
  asset?: string;
  sortBy?: LeaderboardSortBy;
  page?: number;
  pageSize?: number;
}
