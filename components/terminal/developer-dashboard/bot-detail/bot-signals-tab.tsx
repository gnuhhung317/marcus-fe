import { DeveloperSignalItem } from '@/lib/contracts/types';
import { SignalStreamTable } from '../signal-stream-table';

interface BotSignalsTabProps {
  signals: DeveloperSignalItem[];
  isSwitching?: boolean;
  onSelectSignal: (signal: DeveloperSignalItem) => void;
}

export function BotSignalsTab({ signals, isSwitching, onSelectSignal }: BotSignalsTabProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Signal Feed</h2>
          <p className="mt-1 text-xs text-slate-400 font-sans">Recent signals received for this bot. Click a row to inspect payload payload.</p>
        </div>
        <span className="rounded-lg border border-border bg-surface px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          {signals.length} Signals
        </span>
      </div>

      {isSwitching ? (
        <div className="space-y-3">
          <div className="h-10 animate-pulse rounded-xl bg-surface" />
          <div className="h-10 animate-pulse rounded-xl bg-surface" />
          <div className="h-10 animate-pulse rounded-xl bg-surface" />
        </div>
      ) : (
        <SignalStreamTable signals={signals} onSelect={onSelectSignal} />
      )}
    </section>
  );
}
