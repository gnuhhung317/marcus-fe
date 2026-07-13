'use client';

import { useTranslations } from 'next-intl';
import { type DecisionStatusFilter } from '@/lib/hooks/use-portfolio-decisions';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface DecisionFilterProps {
  statusFilter: DecisionStatusFilter;
  onStatusFilterChange: (status: DecisionStatusFilter) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
  counts: {
    active: number;
    atRisk: number;
  };
  isFiltering?: boolean;
}

export function DecisionFilter({
  statusFilter,
  onStatusFilterChange,
  searchTerm,
  onSearchTermChange,
  resultCount,
  totalCount,
  counts,
  isFiltering = false,
}: DecisionFilterProps) {
  const t = useTranslations('Decision.filter');
  const filters: Array<{ value: DecisionStatusFilter; label: string }> = [
    { value: 'ALL', label: t('all', { count: totalCount }) },
    { value: 'ACTIVE', label: t('active', { count: counts.active }) },
    { value: 'AT_RISK', label: t('atRisk', { count: counts.atRisk }) },
  ];

  return (
    <Card variant="glass" className="p-4 sm:p-5" aria-busy={isFiltering}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('title')}</p>
            <p className="text-sm text-muted">{t('showing', { resultCount, totalCount })}</p>
          </div>

          <div className="relative w-full lg:max-w-md">
            <label htmlFor="decision-search" className="sr-only">
              {t('searchLabel')}
            </label>
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <Input
              id="decision-search"
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10"
              aria-label={t('searchLabel')}
            />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3" role="tablist" aria-label={t('title')}>
          {filters.map((filter) => {
            const isActive = statusFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onStatusFilterChange(filter.value)}
                className={[
                  'rounded-2xl border px-4 py-3 text-left transition-colors',
                  isActive
                    ? 'border-positive/30 bg-primary-soft text-main shadow-sm'
                    : 'border-border bg-background/30 text-muted hover:border-border-line hover:bg-background/60 hover:text-main',
                ].join(' ')}
              >
                <span className="block text-sm font-semibold">{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
