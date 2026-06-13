'use client';

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
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Decision filters</p>
          <p className="mt-1 text-sm text-muted">
            Showing <span className="font-semibold text-white">{resultCount}</span> of <span className="font-semibold text-white">{totalCount}</span> subscriptions
          </p>
        </div>

        <div className="relative w-full md:max-w-md">
          <label htmlFor="decision-search" className="sr-only">
            Search subscriptions by bot name
          </label>
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            id="decision-search"
            type="text"
            placeholder="Search bot name..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full rounded-xl border border-white/8 bg-white/[0.02] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-colors focus:border-positive/45 focus:bg-white/[0.04] focus:outline-none"
            aria-label="Search subscriptions by bot name"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['ALL', 'ACTIVE', 'AT_RISK'] as const).map((status) => (
          <button
            key={status}
            onClick={() => onStatusFilterChange(status)}
            aria-pressed={statusFilter === status}
            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
              statusFilter === status
                ? 'border-positive/35 bg-positive/8 font-semibold text-positive'
                : 'border-white/8 bg-white/[0.02] text-muted hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            {status === 'ALL'
              ? `All Bots (${totalCount})`
              : status === 'ACTIVE'
                ? `Active (${counts.active})`
                : `At-Risk (${counts.atRisk})`}
          </button>
        ))}
      </div>
    </div>
  );
}
