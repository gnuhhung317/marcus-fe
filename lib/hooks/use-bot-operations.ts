import { useState, useEffect } from 'react';
import { useBotMutations } from './use-bot-mutations';
import { DeveloperBotStatus } from '@/lib/contracts/types';

export type DetailTab = 'overview' | 'analytics' | 'credentials' | 'integration' | 'signals' | 'subscribers';

export function useBotOperations(
  botId: string,
  initialStatus: DeveloperBotStatus,
  onStatusChange?: (botId: string, status: DeveloperBotStatus) => void
) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [localStatus, setLocalStatus] = useState<DeveloperBotStatus>(initialStatus);
  const [statusError, setStatusError] = useState<string | null>(null);

  const { updateStatus } = useBotMutations();

  useEffect(() => {
    setLocalStatus(initialStatus);
    setStatusError(null);
  }, [botId, initialStatus]);

  const handleUpdateStatus = (nextStatus: DeveloperBotStatus) => {
    updateStatus.mutate(
      { botId, status: nextStatus },
      {
        onSuccess: (updated) => {
          const newStatus = (updated.status as DeveloperBotStatus) ?? nextStatus;
          setLocalStatus(newStatus);
          setStatusError(null);
          onStatusChange?.(botId, newStatus);
        },
        onError: (error) => {
          setStatusError(error instanceof Error ? error.message : 'Unable to update bot status.');
        },
      }
    );
  };

  return {
    activeTab,
    setActiveTab,
    localStatus,
    updateStatus: handleUpdateStatus,
    isUpdatingStatus: updateStatus.isPending,
    statusError,
  };
}
