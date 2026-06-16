import { DeveloperSignalItem, ExecutionLogLine, ConnectivityHealth } from './developer';

export interface AdminPage<T> {
  items: T[];
  totalElements: number;
  page: number;
  size: number;
  hasNext: boolean;
}

export type AdminUserRole = 'ADMIN' | 'TRADER' | 'DEVELOPER';
export type AdminBotStatus = 'ACTIVE' | 'PAUSED' | 'DOWN' | 'DELETED';
export type AdminSubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELED' | 'TRIAL';

export interface AdminUserRow {
  userId: string;
  username: string;
  email: string;
  role: AdminUserRole;
  banned: boolean;
  bannedAt?: string | null;
  bannedByUserId?: string | null;
  banReason?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminBotRow {
  botId: string;
  name: string;
  developerId: string;
  developerUsername?: string | null;
  status: AdminBotStatus;
  tradingPair?: string | null;
  exchangeId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  activeSubscriberCount: number;
}

export interface AdminBotDetail {
  botId: string;
  name: string;
  developerId: string;
  developerUsername?: string | null;
  description?: string | null;
  status: AdminBotStatus;
  tradingPair?: string | null;
  exchangeId?: string | null;
  price?: number | null;
  riskLevel?: string | null;
  assetPairs?: string[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  activeSubscriberCount: number;
  totalSubscriberCount: number;
}

export interface AdminBotSubscriberRow {
  userSubscriptionId: string;
  userId: string;
  username?: string | null;
  email?: string | null;
  status: AdminSubscriptionStatus;
  executorConnected: boolean;
  packageId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  canceledByAdminId?: string | null;
  cancellationReason?: string | null;
  canceledAt?: string | null;
}

export interface AdminAuditEventRow {
  adminAuditEventId: string;
  actorUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string | null;
  beforeStateJson?: string | null;
  afterStateJson?: string | null;
  createdAt?: string | null;
}

export interface AdminSystemOverview {
  totalUsers: number;
  bannedUsers: number;
  totalBots: number;
  activeBots: number;
  pausedBots: number;
  deletedBots: number;
  activeSubscriptions: number;
  disconnectedExecutors: number;
  recentActions: AdminAuditEventRow[];
  systemHealth: string;
  checkedAt?: string | null;
}

export interface AdminUsersPageData {
  users: AdminPage<AdminUserRow>;
}

export interface AdminBotsPageData {
  bots: AdminPage<AdminBotRow>;
}

export interface AdminBotDetailPageData {
  detail: AdminBotDetail;
  signals: DeveloperSignalItem[];
  subscribers: AdminPage<AdminBotSubscriberRow>;
  auditEvents: AdminPage<AdminAuditEventRow>;
}

export interface AdminSystemPageData {
  connectivity: ConnectivityHealth;
  executionLogs: ExecutionLogLine[];
}
