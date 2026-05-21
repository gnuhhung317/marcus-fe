"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmptyStateCard, ErrorStateCard, LoadingStateCard } from '@/components/shared/api-state';
import { LifecycleBadge } from '@/components/shared/lifecycle-badge';
import {
  createPaperOrder,
  getPaperTradingPageData,
  pausePaperSession,
  resumePaperSession,
} from '@/lib/contracts/client';
import { PaperOrderResult, PaperTradingPageData } from '@/lib/contracts/types';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

export default function TerminalPaperTradingPage() {
  const router = useRouter();
  const [paperData, setPaperData] = useState<PaperTradingPageData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderMessage, setOrderMessage] = useState<PaperOrderResult | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )marcus_role=([^;]*)/);
    const role = match ? decodeURIComponent(match[1]) : null;
    if (role !== 'OPERATOR' && role !== 'ADMIN') {
      router.replace('/terminal');
    }
  }, [router]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [assetPair, setAssetPair] = useState('BTC/USDT');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState('0.50');
  const [estimatedPrice, setEstimatedPrice] = useState('65000');
  const [selectedSignalId, setSelectedSignalId] = useState<string>('');

  const loadPaperData = useCallback(async () => {
    setErrorMessage(null);

    try {
      const response = await getPaperTradingPageData();
      setPaperData(response);

      if (!selectedSignalId && response.signals.length) {
        const latest = response.signals[0];
        setSelectedSignalId(latest.signalId);
        setAssetPair(latest.assetPair);
      }
    } catch {
      setErrorMessage('Failed to load paper trading session.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSignalId]);

  useEffect(() => {
    void loadPaperData();
  }, [loadPaperData]);

  const session = paperData?.session;
  const signals = useMemo(() => paperData?.signals ?? [], [paperData]);
  const selectedSignal = useMemo(() => signals.find((signal) => signal.signalId === selectedSignalId), [signals, selectedSignalId]);
  const parsedQty = Number.parseFloat(quantity);
  const parsedPrice = Number.parseFloat(estimatedPrice);
  const notional = Number.isFinite(parsedQty) && Number.isFinite(parsedPrice) ? parsedQty * parsedPrice : 0;

  const checks = useMemo(() => {
    const sessionRunning = session?.status === 'RUNNING';
    const quantityValid = Number.isFinite(parsedQty) && parsedQty > 0;
    const priceValid = Number.isFinite(parsedPrice) && parsedPrice > 0;
    const buyingPowerValid = (session?.buyingPower ?? 0) >= notional;
    const confidenceValid = (selectedSignal?.confidence ?? 0) >= 0.6;

    return [
      { label: 'Session must be RUNNING', pass: sessionRunning },
      { label: 'Quantity and estimated price must be valid', pass: quantityValid && priceValid },
      { label: 'Notional must be within buying power', pass: buyingPowerValid },
      { label: 'Signal confidence must be at least 60%', pass: confidenceValid },
    ];
  }, [session, parsedQty, parsedPrice, notional, selectedSignal]);

  const canSubmitOrder = checks.every((check) => check.pass);

  const handlePauseResume = async () => {
    if (!session) {
      return;
    }

    setIsMutating(true);
    setErrorMessage(null);

    try {
      const updated = session.status === 'RUNNING' ? await pausePaperSession() : await resumePaperSession();
      setPaperData((prev) => (prev ? { ...prev, session: updated } : prev));
    } catch {
      setErrorMessage('Failed to update paper session lifecycle state.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleExecuteOrder = async () => {
    if (!session || !canSubmitOrder) {
      setErrorMessage('Pre-trade checks failed. Fix the highlighted items before submitting.');
      return;
    }

    setIsMutating(true);
    setErrorMessage(null);
    setOrderMessage(null);

    try {
      const result = await createPaperOrder({
        assetPair,
        side,
        quantity: parsedQty,
        estimatedPrice: parsedPrice,
        signalId: selectedSignal?.signalId,
      });

      setOrderMessage(result);
      await loadPaperData();
    } catch {
      setErrorMessage('Order submission failed. Retry after checking session state and buying power.');
    } finally {
      setIsMutating(false);
    }
  };

  if (isLoading) {
    return <LoadingStateCard title="Loading paper session" message="Syncing virtual account and signal stream." />;
  }

  if (errorMessage && !paperData) {
    return <ErrorStateCard title="Paper trading unavailable" message={errorMessage} onAction={() => void loadPaperData()} />;
  }

  if (!session) {
    return <EmptyStateCard title="No paper session found" message="Create or resume a paper session to start simulation." actionLabel="Retry" actionHref="/terminal/paper-trading" />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Paper Session</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Paper Trading Environment</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span>Session {session.sessionId}</span>
            <LifecycleBadge status={session.status} mode="PAPER" />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePauseResume}
            disabled={isMutating}
            className="rounded-xl border border-[rgba(148,163,184,0.32)] px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-55"
          >
            {session.status === 'RUNNING' ? 'Pause Session' : 'Resume Session'}
          </button>
          <button
            type="button"
            onClick={handleExecuteOrder}
            disabled={isMutating || !canSubmitOrder}
            className="rounded-xl cta-primary px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-55"
          >
            Execute Order
          </button>
        </div>
      </header>

      {errorMessage ? <ErrorStateCard title="Paper action failed" message={errorMessage} onAction={() => void loadPaperData()} /> : null}
      {orderMessage ? (
        <article className="rounded-xl border border-[rgba(16,185,129,0.36)] bg-[rgba(6,78,59,0.34)] px-4 py-3 text-sm text-[rgba(209,250,229,0.96)]">
          Order {orderMessage.orderId} accepted · {orderMessage.filledQuantity.toFixed(4)} filled @ {formatCurrency(orderMessage.avgFillPrice)}
        </article>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-semibold text-white">Session Metrics</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-[rgba(6,10,18,0.6)] px-3 py-2">
              <span className="text-muted">Virtual Balance</span>
              <span className="font-semibold text-white">{formatCurrency(session.virtualBalance)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[rgba(6,10,18,0.6)] px-3 py-2">
              <span className="text-muted">Open PnL</span>
              <span className={`font-semibold ${session.openPnl >= 0 ? 'text-positive' : 'text-negative'}`}>
                {session.openPnl >= 0 ? '+' : ''}
                {formatCurrency(session.openPnl)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[rgba(6,10,18,0.6)] px-3 py-2">
              <span className="text-muted">Buying Power</span>
              <span className="font-semibold text-white">{formatCurrency(session.buyingPower)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[rgba(6,10,18,0.6)] px-3 py-2">
              <span className="text-muted">Latest Signal Count</span>
              <span className="font-semibold text-white">{signals.length}</span>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(6,10,18,0.56)] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Pre-Trade Checks</p>
            <ul className="mt-3 space-y-2 text-sm">
              {checks.map((check) => (
                <li key={check.label} className={check.pass ? 'text-[rgba(167,243,208,0.95)]' : 'text-[rgba(254,226,226,0.95)]'}>
                  {check.pass ? 'PASS' : 'BLOCK'} · {check.label}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-semibold text-white">Signal Terminal</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-[rgba(148,163,184,0.22)]">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-[rgba(148,163,184,0.08)] text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Pair</th>
                  <th className="px-4 py-3">Side</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {signals.length ? signals.map((signal) => (
                  <tr key={signal.signalId} className="border-t border-[rgba(148,163,184,0.18)] transition-colors hover:bg-[rgba(148,163,184,0.08)]">
                    <td className="px-4 py-3.5 text-muted">
                      {Number.isNaN(Date.parse(signal.generatedAt))
                        ? signal.generatedAt
                        : new Date(signal.generatedAt).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3.5 text-white">{signal.assetPair}</td>
                    <td className="px-4 py-3.5 text-white">{signal.side}</td>
                    <td className="px-4 py-3.5 text-muted"><LifecycleBadge status={signal.status} /></td>
                    <td className="px-4 py-3.5 text-right text-white">{(signal.confidence * 100).toFixed(1)}%</td>
                  </tr>
                )) : (
                  <tr className="border-t border-[rgba(148,163,184,0.18)]">
                    <td colSpan={5} className="px-4 py-4">
                      <EmptyStateCard title="No incoming paper signals" message="No signals were returned for the selected session window." />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <label className="text-sm text-muted">
              Asset
              <input
                className="mt-2 w-full rounded-xl border border-[rgba(132,162,191,0.2)] bg-[rgba(6,10,18,0.6)] px-3 py-2 text-white"
                value={assetPair}
                onChange={(event) => setAssetPair(event.target.value)}
              />
            </label>
            <label className="text-sm text-muted">
              Quantity
              <input
                className="mt-2 w-full rounded-xl border border-[rgba(132,162,191,0.2)] bg-[rgba(6,10,18,0.6)] px-3 py-2 text-white"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </label>
            <label className="text-sm text-muted">
              Estimated Price
              <input
                className="mt-2 w-full rounded-xl border border-[rgba(132,162,191,0.2)] bg-[rgba(6,10,18,0.6)] px-3 py-2 text-white"
                value={estimatedPrice}
                onChange={(event) => setEstimatedPrice(event.target.value)}
              />
            </label>
            <label className="text-sm text-muted">
              Side
              <select
                className="mt-2 w-full rounded-xl border border-[rgba(132,162,191,0.2)] bg-[rgba(6,10,18,0.6)] px-3 py-2 text-white"
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
                className="mt-2 w-full rounded-xl border border-[rgba(132,162,191,0.2)] bg-[rgba(6,10,18,0.6)] px-3 py-2 text-white"
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
            <p className="text-sm text-muted md:col-span-2">Estimated order notional: {formatCurrency(notional)}</p>
          </div>
        </article>
      </section>
    </div>
  );
}
