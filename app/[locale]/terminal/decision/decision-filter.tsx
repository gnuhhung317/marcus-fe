'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type DecisionStatusFilter = 'ALL' | 'ACTIVE' | 'AT_RISK';

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
}

export function DecisionFilter({
  statusFilter,
  onStatusFilterChange,
  searchTerm,
  onSearchTermChange,
  resultCount,
  totalCount,
  counts,
}: DecisionFilterProps) {
  const filters: Array<{ value: DecisionStatusFilter; label: string }> = [
    { value: 'ALL', label: `All Bots (${totalCount})` },
    { value: 'ACTIVE', label: `Active (${counts.active})` },
    { value: 'AT_RISK', label: `At-Risk (${counts.atRisk})` },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Decision filters</p>
          <p className="mt-1 text-sm text-muted">
            Showing <span className="font-semibold text-main">{resultCount}</span> of <span className="font-semibold text-main">{totalCount}</span> subscriptions
          </p>
        </div>

        <div className="relative w-full md:max-w-md">
          <label htmlFor="decision-search" className="sr-only">
            Search subscriptions by bot name
          </label>
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <Input
            id="decision-search"
            type="text"
            placeholder="Search bot name..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10"
            aria-label="Search subscriptions by bot name"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            type="button"
            variant={statusFilter === filter.value ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onStatusFilterChange(filter.value)}
            aria-pressed={statusFilter === filter.value}
            className={statusFilter === filter.value ? 'border-positive/20 bg-primary-soft text-positive hover:bg-primary-soft' : ''}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
