'use client';

type DecisionStatusFilter = 'ALL' | 'ACTIVE' | 'AT_RISK';

interface DecisionFilterProps {
  statusFilter: DecisionStatusFilter;
  onStatusFilterChange: (status: DecisionStatusFilter) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
}

export function DecisionFilter({
  statusFilter,
  onStatusFilterChange,
  searchTerm,
  onSearchTermChange,
}: DecisionFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'ACTIVE', 'AT_RISK'] as const).map((status) => (
          <button
            key={status}
            onClick={() => onStatusFilterChange(status)}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 ${
              statusFilter === status
                ? 'bg-emerald-500/10 text-emerald-400 border-[rgba(0,190,115,0.3)] font-semibold shadow-sm shadow-emerald-500/5'
                : 'bg-white/[0.02] border-[rgba(255,255,255,0.06)] text-muted hover:bg-white/[0.06] hover:text-white'
            }`}
          >
            {status === 'ALL' ? 'All Bots' : status === 'ACTIVE' ? 'Active' : 'At-Risk'}
          </button>
        ))}
      </div>

      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search bot name..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm placeholder-slate-500 focus:border-[rgba(16,185,129,0.45)] focus:outline-none focus:bg-white/[0.04] transition-all duration-200"
        />
      </div>
    </div>
  );
}
