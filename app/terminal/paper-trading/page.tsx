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
import { SessionMetricsCard } from '@/components/terminal/paper-trading/session-metrics-card';
import { PreTradeChecks } from '@/components/terminal/paper-trading/pre-trade-checks';
import { SignalTerminalTable } from '@/components/terminal/paper-trading/signal-terminal-table';
import { OrderExecutionForm } from '@/components/terminal/paper-trading/order-execution-form';

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
    if (!session) return;

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
            className="rounded-xl border border-border/32 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-55 transition-all hover:bg-white/5 active:scale-95"
          >
            {session.status === 'RUNNING' ? 'Pause Session' : 'Resume Session'}
          </button>
          <button
            type="button"
            onClick={handleExecuteOrder}
            disabled={isMutating || !canSubmitOrder}
            className="rounded-xl cta-primary px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-55 active:scale-95 transition-all"
          >
            Execute Order
          </button>
        </div>
      </header>

      {errorMessage ? <ErrorStateCard title="Paper action failed" message={errorMessage} onAction={() => void loadPaperData()} /> : null}
      
      {orderMessage ? (
        <article className="rounded-xl border border-positive/30 bg-positive/10 px-4 py-3 text-sm text-positive">
          Order {orderMessage.orderId} accepted · {orderMessage.filledQuantity.toFixed(4)} filled @ {formatCurrency(orderMessage.avgFillPrice)}
        </article>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <div className="space-y-5">
          <SessionMetricsCard session={session} signalCount={signals.length} />
          <PreTradeChecks checks={checks} />
        </div>

        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-semibold text-white">Signal Terminal</h2>
          
          <SignalTerminalTable signals={signals} />

          <OrderExecutionForm 
            assetPair={assetPair}
            setAssetPair={setAssetPair}
            quantity={quantity}
            setQuantity={setQuantity}
            estimatedPrice={estimatedPrice}
            setEstimatedPrice={setEstimatedPrice}
            side={side}
            setSide={setSide}
            selectedSignalId={selectedSignalId}
            setSelectedSignalId={setSelectedSignalId}
            signals={signals}
            estimatedNotional={formatCurrency(notional)}
          />
        </article>
      </section>
    </div>
  );
}
