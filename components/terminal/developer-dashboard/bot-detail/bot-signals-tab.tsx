import { DeveloperSignalItem } from '@/lib/contracts/types';
import { SignalStreamTable } from '../signal-stream-table';
import { Badge } from '@/components/ui/badge';

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
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted font-sans">Signal Feed</h2>
        </div>
        <Badge variant="outline" className="rounded-lg px-2.5 py-1 text-[9px] font-mono">
          {signals.length} Signals
        </Badge>
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
