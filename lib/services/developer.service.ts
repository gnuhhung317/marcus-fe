import {
  BotIntegrationHealth,
  BotProvisioningCredentials,
  DeveloperBotDetail,
  DeveloperConsolePageData,
  DeveloperDashboardPageData,
  DeveloperSignalItem,
  RegisterBotInput,
  DeveloperBotStatus,
} from '@/lib/contracts/types';
import {
  requestContractJson,
  toNumber,
  normalizeDeveloperBotStatus,
} from '@/lib/services/base.service';
import { getBotAnalyticsData, listActiveSubscriptionsForBot } from '@/lib/services/bot.service';
import { getDashboardPageData } from '@/lib/services/user.service';
import { listMarketplaceBots, getBotAnalyticsPageData } from '@/lib/services/bot.service';
import { getProfilePageData } from '@/lib/services/user.service';
import { getLeaderboardPageData } from '@/lib/services/market.service';

// --- Internal Response Interfaces ---

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
  performance?: {
    annualReturn?: number;
    maxDrawdown?: number;
    sharpe?: number;
    winRate?: number;
    avgTradeReturn?: number;
    tradesPerDay?: number;
  };
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

interface ConnectivityHealthResponse {
  overallStatus?: string;
  checkedAt?: string;
  dependencies?: { name?: string; status?: string; latencyMs?: number }[];
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

// --- Defaults ---

const defaultConnectivity = {
  overallStatus: 'UNKNOWN',
  checkedAt: new Date().toISOString(),
};

// --- Service Functions ---

export async function getDeveloperConsolePageData(): Promise<DeveloperConsolePageData> {
  // Check user role from cookie (browser or server)
  let role: string | undefined;
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(/(?:^|; )marcus_role=([^;]*)/);
    role = match ? decodeURIComponent(match[1]) : undefined;
  } else {
    try {
      const { cookies } = await import('next/headers');
      role = cookies().get('marcus_role')?.value;
    } catch {
      role = undefined;
    }
  }

  // If user is not OPERATOR, ADMIN, or TRADER, bypass backend calls to avoid unauthorized errors
  if (role !== 'OPERATOR' && role !== 'ADMIN' && role !== 'TRADER') {
    return {
      connectivity: {
        overallStatus: 'UNKNOWN',
        checkedAt: new Date().toISOString(),
      },
      signalStream: [],
      executionLogs: [],
    };
  }

  const [connectivityResponse, signalResponse, executionResponse] = await Promise.all([
    requestContractJson<ConnectivityHealthResponse>('system-connectivity'),
    requestContractJson<SignalItemResponse[]>('system-signals', {
      queryParams: { limit: 8, status: 'ALL' },
    }),
    requestContractJson<ExecutionLogPageResponse>('system-execution-logs', {
      queryParams: { limit: 100 },
    }),
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

export async function getDeveloperDashboardPageData(activeBotId?: string): Promise<DeveloperDashboardPageData> {
  const botsResponse = await requestContractJson<DeveloperBotSummaryResponse[]>('developer-bots');

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
    const globalSignalsResponse = await requestContractJson<SignalItemResponse[]>('system-signals', { queryParams: { limit: 50 } }).catch(() => []);
    const signals: DeveloperSignalItem[] = (globalSignalsResponse ?? []).map((item, index) => ({
      signalId: item.signalId ?? `sig_${index + 1}`,
      botId: item.botId ?? '',
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
      activeBot: null,
      subscriptions: [],
      integrationHealth: null,
      signals,
    };
  }

  const [detailResponse, subscriptions, integrationHealthResponse, signalsResponse, analytics] = await Promise.all([
    requestContractJson<DeveloperBotDetailResponse>('developer-bot-detail', { pathParams: { botId: selectedBotId } }),
    listActiveSubscriptionsForBot(selectedBotId),
    requestContractJson<BotIntegrationHealthResponse>('developer-bot-integration-health', { pathParams: { botId: selectedBotId } }),
    requestContractJson<SignalItemResponse[]>('system-signals', { queryParams: { botId: selectedBotId, limit: 50 } }),
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
