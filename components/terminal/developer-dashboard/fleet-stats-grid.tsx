interface FleetStatsGridProps {
  total: number;
  active: number;
  paused: number;
  down: number;
}

export function FleetStatsGrid({ total, active, paused, down }: FleetStatsGridProps) {
  return (
    <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Fleet Size */}
      <div className="group relative rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)] hover:border-slate-500/30 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fleet Size</p>
            <p className="mt-2.5 text-3xl font-black text-white tracking-tight">{total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-500/5 border border-slate-500/10 flex items-center justify-center text-slate-400 group-hover:text-slate-200 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-3 font-semibold flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-slate-500" />
          Total provisioned instances
        </p>
      </div>

      {/* Card 2: Active Status */}
      <div className="group relative rounded-2xl border border-positive/10 bg-gradient-to-br from-[var(--bg-surface)] to-positive/5 p-5 shadow-[var(--shadow-soft)] hover:border-positive/30 transition-all duration-300">
        <div className="absolute top-0 right-0 w-16 h-16 bg-positive/[0.01] rounded-full blur-xl pointer-events-none" />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-positive">Active Status</p>
            <p className="mt-2.5 text-3xl font-black text-positive tracking-tight">{active}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-positive-soft border border-positive/10 flex items-center justify-center text-positive group-hover:bg-positive/10 transition-all duration-300">
            <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <p className="text-[10px] text-positive/85 mt-3 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-positive animate-ping" />
          Broadcasting live signals
        </p>
      </div>

      {/* Card 3: Paused Instances */}
      <div className="group relative rounded-2xl border border-warning/10 bg-gradient-to-br from-[var(--bg-surface)] to-warning/5 p-5 shadow-[var(--shadow-soft)] hover:border-warning/30 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-warning">Paused Instances</p>
            <p className="mt-2.5 text-3xl font-black text-warning tracking-tight">{paused}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning-soft border border-warning/10 flex items-center justify-center text-warning group-hover:bg-warning/10 transition-all duration-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="text-[10px] text-warning/85 mt-3 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-warning" />
          Standby queue status
        </p>
      </div>

      {/* Card 4: System Faults */}
      <div className={`group relative rounded-2xl border p-5 shadow-[var(--shadow-soft)] transition-all duration-300 ${
        down > 0
          ? 'border-negative/30 bg-gradient-to-br from-[var(--bg-surface)] to-negative/10'
          : 'border-border bg-surface hover:border-negative/20'
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${down > 0 ? 'text-negative' : 'text-muted'}`}>
              Down Bots
            </p>
            <p className={`mt-2.5 text-3xl font-black tracking-tight ${down > 0 ? 'text-negative' : 'text-white'}`}>
              {down}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            down > 0
              ? 'bg-negative-soft border border-negative/20 text-negative animate-bounce'
              : 'bg-muted/5 border border-muted/10 text-muted group-hover:text-negative'
          }`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <p className={`text-[10px] mt-3 font-semibold flex items-center gap-1.5 ${down > 0 ? 'text-negative' : 'text-muted'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${down > 0 ? 'bg-negative animate-ping' : 'bg-muted'}`} />
          {down > 0 ? 'Technical outage detected' : 'No bots marked down'}
        </p>
      </div>
    </div>
  );
}
