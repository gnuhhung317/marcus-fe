'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useBotMutations } from '@/lib/hooks/use-bot-mutations';
import { DeveloperBotStatus, DeveloperBotSummary } from '@/lib/contracts/types';

const statusStyles: Record<DeveloperBotStatus, { badge: string; dot: string; label: string }> = {
  ACTIVE: {
    badge: 'bg-positive/10 text-positive border-positive/20',
    dot: 'bg-positive',
    label: 'Active',
  },
  PAUSED: {
    badge: 'bg-warning/10 text-warning border-warning/20',
    dot: 'bg-warning',
    label: 'Paused',
  },
  DOWN: {
    badge: 'bg-negative/10 text-negative border-negative/20',
    dot: 'bg-negative',
    label: 'Down',
  },
  DELETED: {
    badge: 'bg-white/5 text-slate-400 border-white/5',
    dot: 'bg-slate-400',
    label: 'Deleted',
  },
};

function getSeededBotData(botId: string, customPnlPct?: number | null) {
  let hash = 0;

  for (let i = 0; i < botId.length; i++) {
    hash = botId.charCodeAt(i) + ((hash << 5) - hash);
  }

  const absHash = Math.abs(hash);
  const pnlPct = customPnlPct !== undefined && customPnlPct !== null ? customPnlPct : ((absHash % 2000) / 100 - 5);
  const isPositive = pnlPct >= 0;

  const points: number[] = [];
  let currentVal = 50;
  points.push(currentVal);

  for (let i = 0; i < 11; i++) {
    const seed = Math.sin(hash + i) * 1000;
    const step = (seed - Math.floor(seed)) * 24 - 12;
    currentVal = Math.max(10, Math.min(90, currentVal + step));
    points.push(currentVal);
  }

  if (customPnlPct !== undefined && customPnlPct !== null) {
    const startsAt = points[0];
    const endsAt = points[points.length - 1];
    const actualTrendIsPositive = endsAt >= startsAt;
    const targetTrendIsPositive = customPnlPct >= 0;
    if (actualTrendIsPositive !== targetTrendIsPositive) {
      for (let i = 1; i < points.length; i++) {
        const diff = points[i] - startsAt;
        points[i] = startsAt - diff;
      }
    }
  }

  const width = 120;
  const height = 36;
  const padding = 2;
  const usableHeight = height - padding * 2;
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const valRange = maxVal - minVal || 1;

  const svgPoints = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const normalizedY = (val - minVal) / valRange;
    const y = padding + usableHeight - normalizedY * usableHeight;
    return { x, y };
  });

  const linePath = svgPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${width.toFixed(1)} ${height.toFixed(1)} L 0 ${height.toFixed(1)} Z`;

  return {
    pnlPct,
    isPositive,
    linePath,
    areaPath,
  };
}

export function useBotStatus(bot: DeveloperBotSummary, onStatusChange?: (botId: string, newStatus: DeveloperBotStatus) => void) {
  const t = useTranslations('DeveloperDashboard.botGridCard');
  const tStatus = useTranslations('Common.botStatus');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<DeveloperBotStatus>(bot.status);
  const { updateStatus } = useBotMutations();
  const { pnlPct, isPositive, linePath, areaPath } = getSeededBotData(
    bot.botId,
    bot.annualReturn !== undefined && bot.annualReturn !== null ? bot.annualReturn * 100 : undefined
  );

  useEffect(() => {
    setLocalStatus(bot.status);
    setStatusError(null);
    setIsDropdownOpen(false);
  }, [bot.botId, bot.status]);

  const handleStatusToggle = (nextStatus: DeveloperBotStatus) => {
    updateStatus.mutate(
      { botId: bot.botId, status: nextStatus },
      {
        onSuccess: (updated) => {
          const newStatus = (updated.status as DeveloperBotStatus) ?? nextStatus;
          setLocalStatus(newStatus);
          setIsDropdownOpen(false);
          setStatusError(null);
          onStatusChange?.(bot.botId, newStatus);
        },
        onError: (error) => {
          setStatusError(error.message);
        },
      }
    );
  };

  const nextLifecycleStatus: DeveloperBotStatus | null =
    localStatus === 'ACTIVE' ? 'PAUSED' : localStatus === 'PAUSED' || localStatus === 'DOWN' ? 'ACTIVE' : null;

  const lifecycleLabel =
    nextLifecycleStatus === 'PAUSED'
      ? t('lifecycleLabel.stop')
      : nextLifecycleStatus === 'ACTIVE'
        ? t('lifecycleLabel.resume')
        : t('lifecycleLabel.locked');

  const currentStatusStyle = statusStyles[localStatus] ?? statusStyles.DELETED;

  return {
    isDropdownOpen,
    setIsDropdownOpen,
    statusError,
    statusStyle: {
      ...currentStatusStyle,
      label: tStatus(localStatus),
    },
    localStatus,
    apiKey: bot.apiKey ?? t('notAvailable'),
    nextLifecycleStatus,
    lifecycleLabel,
    updatePending: updateStatus.isPending,
    handleStatusToggle,
    pnlPct,
    isPositive,
    linePath,
    areaPath,
  };
}
