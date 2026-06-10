import { DeveloperSignalItem } from '@/lib/contracts/types';

interface SignalDetailDrawerProps {
  signal: DeveloperSignalItem | null;
  onClose: () => void;
}

function formatTimestamp(value?: string | null) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function SignalDetailDrawer({ signal, onClose }: SignalDetailDrawerProps) {
  if (!signal) return null;

  const payload = signal.rawPayload ?? {
    signalId: signal.signalId,
    botId: signal.botId,
    exchangeSlug: signal.exchangeSlug,
    symbol: signal.symbol,
    action: signal.action,
    price: signal.price,
    status: signal.status,
    generatedTimestamp: signal.generatedTimestamp,
    leverage: signal.leverage,
    marketType: signal.marketType,
    reduceOnly: signal.reduceOnly,
    size: signal.size,
    tp: signal.tp,
    sl: signal.sl,
    metadata: signal.metadata,
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close signal detail drawer"
        className="absolute inset-0 bg-[var(--bg-0)] opacity-70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl border-l border-[var(--panel-border)] bg-surface-strong shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between border-b border-[var(--panel-border)] px-6 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Signal detail</p>
            <h3 className="text-lg font-semibold text-fg">{signal.signalId}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--panel-border)] bg-surface px-3 py-1.5 text-xs text-fg transition-colors hover:bg-[var(--panel)]"
          >
            Close
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--panel-border)] bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Action</p>
              <p className="mt-1 text-sm text-fg">{signal.action ?? '—'}</p>
            </div>
            <div className="rounded-xl border border-[var(--panel-border)] bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Symbol</p>
              <p className="mt-1 text-sm text-fg">{signal.symbol ?? '—'}</p>
            </div>
            <div className="rounded-xl border border-[var(--panel-border)] bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Status</p>
              <p className="mt-1 text-sm text-fg">{signal.status ?? '—'}</p>
            </div>
            <div className="rounded-xl border border-[var(--panel-border)] bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Generated</p>
              <p className="mt-1 text-sm text-fg">{formatTimestamp(signal.generatedTimestamp)}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--panel-border)] bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Leverage</p>
              <p className="mt-1 text-sm text-fg">{signal.leverage ?? '—'}</p>
            </div>
            <div className="rounded-xl border border-[var(--panel-border)] bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Market type</p>
              <p className="mt-1 text-sm text-fg">{signal.marketType ?? '—'}</p>
            </div>
            <div className="rounded-xl border border-[var(--panel-border)] bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Reduce only</p>
              <p className="mt-1 text-sm text-fg">
                {signal.reduceOnly === null || signal.reduceOnly === undefined ? '—' : signal.reduceOnly ? 'Yes' : 'No'}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--panel-border)] bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Size</p>
              <p className="mt-1 text-sm text-fg">{signal.size ?? '—'}</p>
            </div>
            <div className="rounded-xl border border-[var(--panel-border)] bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">TP</p>
              <p className="mt-1 text-sm text-fg">{signal.tp ?? '—'}</p>
            </div>
            <div className="rounded-xl border border-[var(--panel-border)] bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">SL</p>
              <p className="mt-1 text-sm text-fg">{signal.sl ?? '—'}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Raw payload</p>
            <pre className="mt-2 max-h-[260px] overflow-auto rounded-xl border border-[var(--panel-border)] bg-canvas-elevated p-3 text-xs text-info">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        </div>
      </aside>
    </div>
  );
}
