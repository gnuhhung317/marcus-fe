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
      <div className="group relative rounded-xl border border-border bg-surface p-5 hover:border-slate-500/30 transition-all duration-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Fleet Size</p>
            <p className="mt-2 text-3xl font-bold text-white tracking-tight font-mono">{total}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-slate-200 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-1.5 font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          Total provisioned instances
        </p>
      </div>

      {/* Card 2: Active Status */}
      <div className="group relative rounded-xl border border-border bg-surface p-5 hover:border-positive/30 transition-all duration-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-positive font-mono">Active Status</p>
            <p className="mt-2 text-3xl font-bold text-positive tracking-tight font-mono">{active}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-positive/10 border border-positive/20 flex items-center justify-center text-positive group-hover:bg-positive/20 transition-all duration-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <p className="text-[10px] text-positive/85 mt-3 flex items-center gap-1.5 font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-positive" />
          Broadcasting live signals
        </p>
      </div>

      {/* Card 3: Paused Instances */}
      <div className="group relative rounded-xl border border-border bg-surface p-5 hover:border-warning/30 transition-all duration-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-warning font-mono">Paused Instances</p>
            <p className="mt-2 text-3xl font-bold text-warning tracking-tight font-mono">{paused}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center text-warning group-hover:bg-warning/20 transition-all duration-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="text-[10px] text-warning/85 mt-3 flex items-center gap-1.5 font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-warning" />
          Standby queue status
        </p>
      </div>

      {/* Card 4: System Faults */}
      <div className={`group relative rounded-xl border bg-surface p-5 transition-all duration-200 ${
        down > 0 ? 'border-negative/30' : 'border-border hover:border-negative/30'
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider font-mono ${down > 0 ? 'text-negative' : 'text-slate-500'}`}>
              Down Bots
            </p>
            <p className={`mt-2 text-3xl font-bold tracking-tight font-mono ${down > 0 ? 'text-negative' : 'text-white'}`}>
              {down}
            </p>
          </div>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
            down > 0
              ? 'bg-negative/10 border border-negative/20 text-negative'
              : 'bg-white/5 border border-white/5 text-slate-400 group-hover:text-negative'
          }`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <p className={`text-[10px] mt-3 flex items-center gap-1.5 font-sans ${down > 0 ? 'text-negative/85' : 'text-slate-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${down > 0 ? 'bg-negative' : 'bg-slate-500'}`} />
          {down > 0 ? 'Technical outage detected' : 'No bots marked down'}
        </p>
      </div>
    </div>
  );
}
