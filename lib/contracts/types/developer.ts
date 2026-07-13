import { BotPerformance, BotAnalyticsData } from './bot';
import { BotTrade } from './shared';

export interface ConnectivityHealth {
  overallStatus: string;
  checkedAt: string;
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

export type DeveloperBotStatus = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'DOWN';

export interface DeveloperBotSummary {
  botId: string;
  botName: string;
  description?: string | null;
  status: DeveloperBotStatus;
  tradingPair?: string | null;
  exchange?: string | null;
  apiKey?: string | null;
  annualReturn?: number | null;
  maxDrawdown?: number | null;
  winRate?: number | null;
  performanceSource?: string | null;
}

export interface DeveloperBotDetail extends DeveloperBotSummary {
  developerId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  performance?: BotPerformance | null;
  analytics?: BotAnalyticsData | null;
}

export interface DeveloperSubscriptionSummary {
  botId: string;
  wsToken: string;
  status: string;
}

export interface BotIntegrationHealth {
  overallStatus: string;
  lastCheckedAt: string;
  lastSignalAt?: string | null;
  message?: string | null;
}

export interface DeveloperSignalItem {
  signalId: string;
  botId: string;
  exchangeSlug?: string | null;
  symbol?: string | null;
  action?: string | null;
  price?: number | null;
  status?: string | null;
  generatedTimestamp?: string | null;
  leverage?: number | null;
  marketType?: string | null;
  reduceOnly?: boolean | null;
  size?: number | null;
  tp?: number | null;
  sl?: number | null;
  metadata?: Record<string, unknown> | null;
  rawPayload?: Record<string, unknown> | null;
}

export interface DeveloperDashboardPageData {
  bots: DeveloperBotSummary[];
  activeBot: DeveloperBotDetail | null;
  subscriptions: DeveloperSubscriptionSummary[];
  integrationHealth?: BotIntegrationHealth | null;
  signals?: DeveloperSignalItem[];
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
