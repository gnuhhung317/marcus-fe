import { requestContractJson } from '@/lib/services/base.service';
import {
  AdminAuditEventRow,
  AdminBotDetail,
  AdminBotSubscriberRow,
  AdminBotStatus,
  AdminBotsPageData,
  AdminBotDetailPageData,
  AdminPage,
  AdminSubscriptionStatus,
  AdminSystemOverview,
  AdminSystemPageData,
  AdminUserRole,
  AdminUsersPageData,
  AdminUserRow,
  AdminBotRow,
} from '@/lib/contracts/types';
import { DeveloperSignalItem } from '@/lib/contracts/types/developer';

export interface AdminListUsersQuery {
  query?: string;
  role?: AdminUserRole;
  banned?: boolean;
  page?: number;
  size?: number;
}

export interface AdminListBotsQuery {
  query?: string;
  status?: AdminBotStatus;
  developerId?: string;
  page?: number;
  size?: number;
}

export interface AdminListSubscribersQuery {
  status?: AdminSubscriptionStatus;
  page?: number;
  size?: number;
}

export interface AdminListAuditQuery {
  targetType?: string;
  targetId?: string;
  actorUserId?: string;
  action?: string;
  page?: number;
  size?: number;
}

export async function getAdminDashboardData(): Promise<AdminSystemOverview> {
  return requestContractJson<AdminSystemOverview>('admin-dashboard');
}

export async function listAdminUsers(query: AdminListUsersQuery = {}): Promise<AdminPage<AdminUserRow>> {
  return requestContractJson<AdminPage<AdminUserRow>>('admin-users', {
    queryParams: {
      query: query.query,
      role: query.role,
      banned: query.banned,
      page: query.page ?? 0,
      size: query.size ?? 20,
    },
  });
}

export async function updateAdminUserRole(
  userId: string,
  payload: { role: AdminUserRole; reason: string },
): Promise<AdminUserRow> {
  return requestContractJson<AdminUserRow>('admin-user-role-update', {
    pathParams: { userId },
    init: {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  });
}

export async function updateAdminUserBan(
  userId: string,
  payload: { banned: boolean; reason: string },
): Promise<AdminUserRow> {
  return requestContractJson<AdminUserRow>('admin-user-ban-update', {
    pathParams: { userId },
    init: {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  });
}

export async function listAdminBots(query: AdminListBotsQuery = {}): Promise<AdminPage<AdminBotRow>> {
  return requestContractJson<AdminPage<AdminBotRow>>('admin-bots', {
    queryParams: {
      query: query.query,
      status: query.status,
      developerId: query.developerId,
      page: query.page ?? 0,
      size: query.size ?? 20,
    },
  });
}

export async function getAdminBotDetail(botId: string): Promise<AdminBotDetail> {
  return requestContractJson<AdminBotDetail>('admin-bot-detail', {
    pathParams: { botId },
  });
}

export async function getAdminBotDetailPageData(botId: string): Promise<AdminBotDetailPageData> {
  const [detail, signals, subscribers, auditEvents] = await Promise.all([
    getAdminBotDetail(botId),
    listAdminBotSignals(botId, { limit: 50 }),
    listAdminBotSubscribers(botId, { page: 0, size: 50 }),
    listAdminAuditEvents({ targetType: 'BOT', targetId: botId, page: 0, size: 50 }),
  ]);

  return {
    detail,
    signals,
    subscribers,
    auditEvents,
  };
}

export async function updateAdminBotStatus(
  botId: string,
  payload: { status: AdminBotStatus; reason: string; cancelActiveSubscriptions: boolean },
): Promise<AdminBotRow> {
  return requestContractJson<AdminBotRow>('admin-bot-status-update', {
    pathParams: { botId },
    init: {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  });
}

export async function listAdminBotSignals(
  botId: string,
  query: { status?: string; limit?: number } = {},
): Promise<DeveloperSignalItem[]> {
  return requestContractJson<DeveloperSignalItem[]>('admin-bot-signals', {
    pathParams: { botId },
    queryParams: {
      status: query.status ?? 'ALL',
      limit: query.limit ?? 50,
    },
  });
}

export async function listAdminBotSubscribers(
  botId: string,
  query: AdminListSubscribersQuery = {},
): Promise<AdminPage<AdminBotSubscriberRow>> {
  return requestContractJson<AdminPage<AdminBotSubscriberRow>>('admin-bot-subscribers', {
    pathParams: { botId },
    queryParams: {
      status: query.status,
      page: query.page ?? 0,
      size: query.size ?? 20,
    },
  });
}

export async function forceCancelAdminSubscription(
  userSubscriptionId: string,
  payload: { reason: string },
): Promise<AdminBotSubscriberRow> {
  return requestContractJson<AdminBotSubscriberRow>('admin-subscription-force-cancel', {
    pathParams: { userSubscriptionId },
    init: {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  });
}

export async function listAdminAuditEvents(query: AdminListAuditQuery = {}): Promise<AdminPage<AdminAuditEventRow>> {
  return requestContractJson<AdminPage<AdminAuditEventRow>>('admin-audit-events', {
    queryParams: {
      targetType: query.targetType,
      targetId: query.targetId,
      actorUserId: query.actorUserId,
      action: query.action,
      page: query.page ?? 0,
      size: query.size ?? 20,
    },
  });
}

export async function getAdminSystemPageData(): Promise<AdminSystemPageData> {
  const [connectivity, executionLogs] = await Promise.all([
    requestContractJson<AdminSystemPageData['connectivity']>('admin-system-connectivity'),
    requestContractJson<{ cursor?: string | null; items?: AdminSystemPageData['executionLogs'] }>('admin-system-execution-logs', {
      queryParams: { limit: 50 },
    }),
  ]);

  return {
    connectivity,
    executionLogs: executionLogs.items ?? [],
  };
}
