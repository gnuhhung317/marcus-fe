import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  updateBotStatus,
  updateBotMetadata,
  deleteBot,
  registerBotProvisioning,
} from '@/lib/contracts/client';
import { DeveloperBotStatus, RegisterBotInput } from '@/lib/contracts/types';
import { developerDashboardKeys } from './use-developer-dashboard';

export function useBotMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const statusMutation = useMutation<any, Error, { botId: string; status: DeveloperBotStatus }>({
    mutationFn: ({ botId, status }) => updateBotStatus(botId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerDashboardKeys.all });
      router.refresh();
    },
  });

  const metadataMutation = useMutation<any, Error, { botId: string; payload: Partial<RegisterBotInput> }>({
    mutationFn: ({ botId, payload }) => updateBotMetadata(botId, payload as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerDashboardKeys.all });
      router.refresh();
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (botId) => deleteBot(botId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerDashboardKeys.all });
      router.refresh();
    },
  });

  const registerMutation = useMutation<any, Error, RegisterBotInput>({
    mutationFn: (payload) => registerBotProvisioning(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerDashboardKeys.all });
      router.refresh();
    },
  });

  return {
    updateStatus: statusMutation,
    updateMetadata: metadataMutation,
    removeBot: deleteMutation,
    registerBot: registerMutation,
  };
}
