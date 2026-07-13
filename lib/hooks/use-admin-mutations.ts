'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  forceCancelAdminSubscription,
  updateAdminBotStatus,
  updateAdminUserBan,
  updateAdminUserRole,
} from '@/lib/services/admin.service';
import { adminKeys } from './use-admin-queries';
import type { AdminBotStatus } from '@/lib/contracts/types';
import type { AdminAssignableUserRole } from '@/lib/validations/admin.schema';

export interface UpdateAdminUserRoleInput {
  userId: string;
  role: AdminAssignableUserRole;
  reason: string;
}

export interface UpdateAdminUserBanInput {
  userId: string;
  banned: boolean;
  reason: string;
}

export interface UpdateAdminBotStatusInput {
  botId: string;
  status: AdminBotStatus;
  reason: string;
  cancelActiveSubscriptions: boolean;
}

export interface ForceCancelAdminSubscriptionInput {
  botId: string;
  userSubscriptionId: string;
  reason: string;
}

export function useAdminUserMutations() {
  const queryClient = useQueryClient();

  const updateRole = useMutation({
    mutationFn: ({ userId, role, reason }: UpdateAdminUserRoleInput) =>
      updateAdminUserRole(userId, { role, reason }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.usersRoot });
    },
  });

  const updateBan = useMutation({
    mutationFn: ({ userId, banned, reason }: UpdateAdminUserBanInput) =>
      updateAdminUserBan(userId, { banned, reason }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.usersRoot });
    },
  });

  return { updateRole, updateBan };
}

export function useAdminBotMutations() {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: ({ botId, status, reason, cancelActiveSubscriptions }: UpdateAdminBotStatusInput) =>
      updateAdminBotStatus(botId, { status, reason, cancelActiveSubscriptions }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.botsRoot });
      void queryClient.invalidateQueries({ queryKey: adminKeys.botDetailPage(variables.botId) });
    },
  });

  const forceCancelSubscription = useMutation({
    mutationFn: ({ userSubscriptionId, reason }: ForceCancelAdminSubscriptionInput) =>
      forceCancelAdminSubscription(userSubscriptionId, { reason }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.botsRoot });
      void queryClient.invalidateQueries({ queryKey: adminKeys.botDetailPage(variables.botId) });
    },
  });

  return { updateStatus, forceCancelSubscription };
}
