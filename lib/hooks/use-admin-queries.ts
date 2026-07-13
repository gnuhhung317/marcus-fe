'use client';

import { useQuery } from '@tanstack/react-query';
import type { AdminBotDetailPageData, AdminBotRow, AdminPage, AdminUserRow } from '@/lib/contracts/types';
import {
  getAdminBotDetailPageData,
  listAdminBots,
  listAdminUsers,
} from '@/lib/services/admin.service';
import type {
  AdminBotsQueryParams,
  AdminUsersQueryParams,
} from '@/lib/validations/admin.schema';

export const adminKeys = {
  root: ['admin'] as const,
  usersRoot: ['admin', 'users'] as const,
  users: (filters: AdminUsersQueryParams) => [...adminKeys.usersRoot, filters] as const,
  botsRoot: ['admin', 'bots'] as const,
  bots: (filters: AdminBotsQueryParams) => [...adminKeys.botsRoot, filters] as const,
  botDetailPageRoot: ['admin', 'bot-detail'] as const,
  botDetailPage: (botId: string) => [...adminKeys.botDetailPageRoot, botId] as const,
};

export function useAdminUsersQuery(filters: AdminUsersQueryParams, initialData?: AdminPage<AdminUserRow>) {
  return useQuery<AdminPage<AdminUserRow>>({
    queryKey: adminKeys.users(filters),
    queryFn: () => listAdminUsers(filters),
    initialData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useAdminBotsQuery(filters: AdminBotsQueryParams, initialData?: AdminPage<AdminBotRow>) {
  return useQuery<AdminPage<AdminBotRow>>({
    queryKey: adminKeys.bots(filters),
    queryFn: () => listAdminBots(filters),
    initialData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useAdminBotDetailQuery(
  botId: string,
  initialData?: AdminBotDetailPageData,
) {
  return useQuery<AdminBotDetailPageData>({
    queryKey: adminKeys.botDetailPage(botId),
    queryFn: () => getAdminBotDetailPageData(botId),
    initialData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
