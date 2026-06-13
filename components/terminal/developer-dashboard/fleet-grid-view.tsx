'use client';

import { useSearchParams } from 'next/navigation';
import { BotGridCard } from './bot-grid-card';
import { DeveloperBotStatus, DeveloperBotSummary } from '@/lib/contracts/types';
import { FleetStatsGrid } from './fleet-stats-grid';
import { FleetFiltersBar } from './fleet-filters-bar';
import { EmptyFleetState } from './empty-fleet-state';
import { useUrlFilters } from '@/lib/hooks/use-url-filters';

interface FleetGridViewProps {
  bots: DeveloperBotSummary[];
  onBotStatusChange?: (botId: string, status: DeveloperBotStatus) => void;
}

export function FleetGridView({ bots, onBotStatusChange }: FleetGridViewProps) {
  const { getFilter, resetFilters } = useUrlFilters();
  
  const searchQuery = getFilter('q', '');
  const selectedStatus = getFilter('status', 'ALL');
  const selectedExchange = getFilter('venue', 'ALL');

  const stats = {
    total: bots.length,
    active: bots.filter((b) => b.status === 'ACTIVE').length,
    paused: bots.filter((b) => b.status === 'PAUSED').length,
    down: bots.filter((b) => b.status === 'DOWN').length,
  };

  const uniqueExchanges = Array.from(new Set(bots.map((b) => b.exchange).filter(Boolean))) as string[];

  const filteredBots = bots.filter((bot) => {
    const matchesSearch =
      bot.botName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.botId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || bot.status === selectedStatus;

    const matchesExchange =
      selectedExchange === 'ALL' ||
      (bot.exchange && bot.exchange.toUpperCase() === selectedExchange.toUpperCase());

    return matchesSearch && matchesStatus && matchesExchange;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <FleetStatsGrid {...stats} />

      <FleetFiltersBar uniqueExchanges={uniqueExchanges} />

      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Router Fleet Overview</h2>
          <span className="text-[10px] text-slate-500 font-mono">Select a card to view console telemetry & credentials</span>
        </div>

        {filteredBots.length === 0 ? (
          <EmptyFleetState onReset={() => resetFilters(['q', 'status', 'venue'])} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBots.map((bot) => (
              <BotGridCard key={bot.botId} bot={bot} onStatusChange={onBotStatusChange} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
