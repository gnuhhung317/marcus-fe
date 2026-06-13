'use client';

import { useUrlFilters } from '@/lib/hooks/use-url-filters';

interface FleetFiltersBarProps {
  uniqueExchanges: string[];
}

export function FleetFiltersBar({ uniqueExchanges }: FleetFiltersBarProps) {
  const { getFilter, setFilter, resetFilters } = useUrlFilters();

  const searchQuery = getFilter('q', '');
  const selectedStatus = getFilter('status', 'ALL');
  const selectedExchange = getFilter('venue', 'ALL');

  const hasActiveFilters = searchQuery || selectedStatus !== 'ALL' || selectedExchange !== 'ALL';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-surface shadow-[var(--shadow-soft)]">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search by bot name or ID..."
          value={searchQuery}
          onChange={(e) => setFilter('q', e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 bg-slate-950/40 rounded-xl border border-border focus:border-positive/50 focus:outline-none transition-colors"
        />
      </div>

      {/* Selection Dropdowns */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Status Select */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setFilter('status', e.target.value)}
            className="bg-slate-950/40 border border-border rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-positive/50 cursor-pointer transition-colors"
          >
            <option value="ALL" className="bg-slate-950">All Statuses</option>
            <option value="ACTIVE" className="bg-slate-950">Active Only</option>
            <option value="PAUSED" className="bg-slate-950">Paused Only</option>
            <option value="DOWN" className="bg-slate-950">Down Only</option>
            <option value="DELETED" className="bg-slate-950">Deleted Only</option>
          </select>
        </div>

        {/* Venue Select */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Venue:</span>
          <select
            value={selectedExchange}
            onChange={(e) => setFilter('venue', e.target.value)}
            className="bg-slate-950/40 border border-border rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-positive/50 cursor-pointer transition-colors"
          >
            <option value="ALL" className="bg-slate-950">All Venues</option>
            {uniqueExchanges.map((ex) => (
              <option key={ex} value={ex.toUpperCase()} className="bg-slate-950">
                {ex}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Active Filters */}
        {hasActiveFilters && (
          <button
            onClick={() => resetFilters(['q', 'status', 'venue'])}
            className="text-xs text-positive hover:text-emerald-300 font-bold px-2 py-1 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
