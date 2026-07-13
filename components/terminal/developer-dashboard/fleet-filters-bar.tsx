'use client';

import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useUrlFilters } from '@/lib/hooks/use-url-filters';

interface FleetFiltersBarProps {
  uniqueExchanges: string[];
}

export function FleetFiltersBar({ uniqueExchanges }: FleetFiltersBarProps) {
  const t = useTranslations('DeveloperDashboard.fleetFilters');
  const { getFilter, setFilter, resetFilters } = useUrlFilters();

  const searchQuery = getFilter('q', '');
  const selectedStatus = getFilter('status', 'ALL');
  const selectedExchange = getFilter('venue', 'ALL');

  const hasActiveFilters = Boolean(searchQuery) || selectedStatus !== 'ALL' || selectedExchange !== 'ALL';

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-soft)] md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setFilter('q', e.target.value)}
          className="h-11 pl-10 text-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-1.5">
          <Select
            value={selectedStatus}
            onChange={(e) => setFilter('status', e.target.value)}
            className="h-11 w-auto min-w-[10rem] text-xs"
          >
            <option value="ALL">{t('status.all')}</option>
            <option value="ACTIVE">{t('status.active')}</option>
            <option value="PAUSED">{t('status.paused')}</option>
            <option value="DOWN">{t('status.down')}</option>
            <option value="DELETED">{t('status.deleted')}</option>
          </Select>
        </label>

        <label className="flex items-center gap-1.5">
          <Select
            value={selectedExchange}
            onChange={(e) => setFilter('venue', e.target.value)}
            className="h-11 w-auto min-w-[10rem] text-xs"
          >
            <option value="ALL">{t('venues.all')}</option>
            {uniqueExchanges.map((ex) => (
              <option key={ex} value={ex.toUpperCase()}>
                {ex}
              </option>
            ))}
          </Select>
        </label>

        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" onClick={() => resetFilters(['q', 'status', 'venue'])} className="h-9 px-3 text-xs font-bold">
            {t('clear')}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
