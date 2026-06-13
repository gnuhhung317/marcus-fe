import { DeveloperSignalItem } from '@/lib/contracts/types';
import { Badge } from '@/components/ui/badge';
import { SignalStreamTable } from '../signal-stream-table';

interface BotSignalsTabProps {
  signals: DeveloperSignalItem[];
  isSwitching?: boolean;
  onSelectSignal: (signal: DeveloperSignalItem) => void;
}

export function BotSignalsTab({ signals, isSwitching, onSelectSignal }: BotSignalsTabProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-main">Signals</h2>
          <p className="mt-1 text-sm text-muted">Recent signals received for this bot. Select a row for payload inspection.</p>
        </div>
        <Badge variant="outline">{signals.length}</Badge>
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
