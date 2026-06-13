import { PaperSignal } from '@/lib/contracts/types';

interface OrderExecutionFormProps {
  assetPair: string;
  setAssetPair: (val: string) => void;
  quantity: string;
  setQuantity: (val: string) => void;
  estimatedPrice: string;
  setEstimatedPrice: (val: string) => void;
  side: 'BUY' | 'SELL';
  setSide: (val: 'BUY' | 'SELL') => void;
  selectedSignalId: string;
  setSelectedSignalId: (val: string) => void;
  signals: PaperSignal[];
  estimatedNotional: string;
}

export function OrderExecutionForm({
  assetPair,
  setAssetPair,
  quantity,
  setQuantity,
  estimatedPrice,
  setEstimatedPrice,
  side,
  setSide,
  selectedSignalId,
  setSelectedSignalId,
  signals,
  estimatedNotional,
}: OrderExecutionFormProps) {
  return (
    <div className="mt-5 grid gap-3 md:grid-cols-2">
      <label className="text-sm text-muted">
        Asset
        <input
          className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-white outline-none focus:border-emerald-500/50"
          value={assetPair}
          onChange={(event) => setAssetPair(event.target.value)}
        />
      </label>
      <label className="text-sm text-muted">
        Quantity
        <input
          className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-white outline-none focus:border-emerald-500/50"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
      </label>
      <label className="text-sm text-muted">
        Estimated Price
        <input
          className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-white outline-none focus:border-emerald-500/50"
          value={estimatedPrice}
          onChange={(event) => setEstimatedPrice(event.target.value)}
        />
      </label>
      <label className="text-sm text-muted">
        Side
        <select
          className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-white outline-none focus:border-emerald-500/50"
          value={side}
          onChange={(event) => setSide(event.target.value as 'BUY' | 'SELL')}
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
      </label>
      <label className="text-sm text-muted md:col-span-2">
        Reference Signal
        <select
          className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-white outline-none focus:border-emerald-500/50"
          value={selectedSignalId}
          onChange={(event) => setSelectedSignalId(event.target.value)}
        >
          <option value="">No signal selected</option>
          {signals.map((signal) => (
            <option key={signal.signalId} value={signal.signalId}>
              {signal.assetPair} · {(signal.confidence * 100).toFixed(1)}% · {signal.signalId}
            </option>
          ))}
        </select>
      </label>
      <p className="text-sm text-muted md:col-span-2">Estimated order notional: {estimatedNotional}</p>
    </div>
  );
}
