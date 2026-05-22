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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl border-l border-white/10 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Signal Detail</p>
            <h3 className="text-lg font-semibold text-white">{signal.signalId}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition-colors hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Action</p>
              <p className="mt-1 text-sm text-white">{signal.action ?? '—'}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Symbol</p>
              <p className="mt-1 text-sm text-white">{signal.symbol ?? '—'}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Status</p>
              <p className="mt-1 text-sm text-white">{signal.status ?? '—'}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Generated</p>
              <p className="mt-1 text-sm text-white">{formatTimestamp(signal.generatedTimestamp)}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Leverage</p>
              <p className="mt-1 text-sm text-white">{signal.leverage ?? '—'}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Market Type</p>
              <p className="mt-1 text-sm text-white">{signal.marketType ?? '—'}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Reduce Only</p>
              <p className="mt-1 text-sm text-white">{signal.reduceOnly === null || signal.reduceOnly === undefined ? '—' : signal.reduceOnly ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Size</p>
              <p className="mt-1 text-sm text-white">{signal.size ?? '—'}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">TP</p>
              <p className="mt-1 text-sm text-white">{signal.tp ?? '—'}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">SL</p>
              <p className="mt-1 text-sm text-white">{signal.sl ?? '—'}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Raw Payload</p>
            <pre className="mt-2 max-h-[260px] overflow-auto rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-slate-200">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        </div>
      </aside>
    </div>
  );
}
