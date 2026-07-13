import {
  ProfilePageData,
  UserProfile,
  ProfilePreferences,
  ProfileApiKey,
  ProfileLoginActivity,
  DashboardPageData,
  TimeSeriesValue,
  BotTrade,
  TerminalKpi,
} from '@/lib/contracts/types';
import {
  requestContractJson,
  toNumber,
  formatCurrency,
  formatSignedCurrency,
  formatSignedPercent,
  normalizeTradeSide,
} from '@/lib/services/base.service';

// --- Internal Response Interfaces ---

interface UserProfileResponse {
  userId?: string;
  username?: string;
  email?: string;
  role?: string;
}

interface UserPreferencesResponse {
  timezone?: string;
  baseCurrency?: string;
  emailNotifications?: boolean;
  sessionTimeoutMinutes?: number;
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

interface DashboardOverviewResponse {
  totalEquity?: number;
  openPnl?: number;
  winRate?: number;
  activeBots?: number;
  freshAccountsCount?: number;
  staleAccountsCount?: number;
  dataFreshness?: string;
  lastUpdated?: string | null;
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

interface TimeSeriesPointResponse {
  timestamp?: string;
  value?: number;
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, value));
}

export interface ApiKeyCreateRequest {
  label: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePreferencesRequest {
  timezone?: string;
  baseCurrency?: string;
  emailNotifications?: boolean;
  sessionTimeoutMinutes?: number;
}

// --- Defaults ---

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

// --- Mapping Helpers ---

function mapProfilePreferences(item?: UserPreferencesResponse): ProfilePreferences {
  return {
    timezone: item?.timezone ?? defaultProfilePreferences.timezone,
    baseCurrency: item?.baseCurrency ?? defaultProfilePreferences.baseCurrency,
    emailNotifications: item?.emailNotifications ?? defaultProfilePreferences.emailNotifications,
    sessionTimeoutMinutes: Math.max(5, Math.round(toNumber(item?.sessionTimeoutMinutes, defaultProfilePreferences.sessionTimeoutMinutes))),
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

function mapLoginActivity(item: LoginActivityResponse, index: number): ProfileLoginActivity {
  return {
    id: item.activityId ?? `activity-${index + 1}`,
    device: item.device ?? 'Unknown Device',
    location: item.location ?? 'Unknown Location',
    ipMasked: item.ipAddress ?? '0.0.0.0',
    createdAt: item.createdAt ?? new Date().toISOString(),
    status: (item.status ?? 'SUCCESS') as 'SUCCESS' | 'FAILED',
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
      delta: '',
      context: '',
      trend: 'neutral',
    },
    {
      label: 'Today PnL',
      value: formatSignedCurrency(openPnl),
      delta: '',
      context: '',
      trend: openPnl > 0 ? 'up' : openPnl < 0 ? 'down' : 'neutral',
    },
    {
      label: 'Active Bots',
      value: String(activeBots).padStart(2, '0'),
      delta: '',
      context: '',
      trend: activeBots > 0 ? 'up' : 'neutral',
    },
    {
      label: 'Win Rate 24h',
      value: `${winRate.toFixed(1)}%`,
      delta: '',
      context: '',
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

// --- Service Functions ---

export async function getProfilePageData(): Promise<ProfilePageData> {
  const [profileResponse, preferencesResponse, apiKeyResponse, loginActivityResponse] = await Promise.all([
    requestContractJson<UserProfileResponse>('profile-me'),
    requestContractJson<UserPreferencesResponse>('profile-preferences'),
    requestContractJson<ApiKeySummaryResponse[]>('profile-api-keys'),
    requestContractJson<LoginActivityPageResponse>('profile-login-activities'),
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
  const response = await requestContractJson<UserProfileResponse>('profile-me');

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

export async function changeCurrentUserPassword(payload: ChangePasswordRequest): Promise<UserProfile> {
  const response = await requestContractJson<UserProfileResponse>('profile-password-update', {
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
  const response = await requestContractJson<UserPreferencesResponse>('profile-preferences');
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
  const response = await requestContractJson<ApiKeySummaryResponse[]>('profile-api-keys');

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
  };
}

export async function deleteCurrentUserApiKey(apiKeyId: string) {
  await requestContractJson<void>('profile-api-key-delete', {
    pathParams: { apiKeyId },
    init: {
      method: 'DELETE',
    },
  });
}

export async function listCurrentUserLoginActivities(): Promise<ProfileLoginActivity[]> {
  const response = await requestContractJson<LoginActivityPageResponse>('profile-login-activities');

  return (response.items ?? []).map((activity, index) => mapLoginActivity(activity, index));
}

export async function getDashboardOverviewData(): Promise<DashboardPageData> {
  const [overview, allocationItems, tradeLogPage] = await Promise.all([
    requestContractJson<DashboardOverviewResponse>('dashboard-overview'),
    requestContractJson<ExchangeAllocationItemResponse[]>('dashboard-allocation'),
    requestContractJson<TradeLogPageResponse>('dashboard-trades', {
      queryParams: { page: 0, size: 8 },
    }),
  ]);

  const mappedAllocations = allocationItems
    .map((item) => ({
      name: item.exchange ?? 'Unknown Exchange',
      percent: clampPercent(toNumber(item.percentage)),
    }))
    .filter((item) => item.name.length > 0);

  const mappedTrades = (tradeLogPage.items ?? [])
    .map((item) => mapTradeLogItem(item))
    .filter((item): item is BotTrade => item !== null);

  return {
    terminalKpis: overview ? mapDashboardKpis(overview) : [],
    botTrades: mappedTrades,
    allocations: mappedAllocations,
    lastUpdated: overview?.lastUpdated ?? null,
  };
}

export async function getDashboardPerformanceSeries(range: string = '7D'): Promise<TimeSeriesValue[]> {
  const equitySeriesResponse = await requestContractJson<TimeSeriesPointResponse[]>('dashboard-equity', {
    queryParams: { range },
  });

  return (equitySeriesResponse ?? [])
    .flatMap((point) => {
      if (typeof point?.timestamp !== 'string' || point.timestamp.length === 0) {
        return [];
      }

      if (typeof point.value !== 'number' || !Number.isFinite(point.value)) {
        return [];
      }

      return [{
        timestamp: point.timestamp,
        value: point.value,
      }];
    });
}

export async function getDashboardPageData(range: string = '7D'): Promise<DashboardPageData & { performanceSeries: TimeSeriesValue[] }> {
  const [dashboard, performanceSeries] = await Promise.all([
    getDashboardOverviewData(),
    getDashboardPerformanceSeries(range),
  ]);

  return {
    ...dashboard,
    performanceSeries,
  };
}
