'use client';

import { useState } from 'react';
import { subscribeToBot, unsubscribeFromBot } from '../../../lib/contracts/client';
import { SubscriptionResult } from '../../../lib/contracts/types';
import { LifecycleBadge } from '../../shared/lifecycle-badge';

interface SubscribeBotPanelProps {
  botId: string;
  botStatus?: string;
}

export function SubscribeBotPanel({ botId, botStatus }: SubscribeBotPanelProps) {
  const [result, setResult] = useState<SubscriptionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskConfirmed, setRiskConfirmed] = useState(false);

  const handleSubscribe = async () => {
    if (!riskConfirmed) {
      setError('Confirm risk warning before subscribing.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await subscribeToBot(botId);
      setResult(response);
    } catch {
      setError('Unable to subscribe right now. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await unsubscribeFromBot(botId);
      setResult(response);
    } catch {
      setError('Unable to unsubscribe right now. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
      <h2 className="text-xl font-semibold text-white">Subscribe Bot</h2>
      <p className="mt-2 text-sm text-muted">Request deployment access and receive a runtime token for your local executor.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <LifecycleBadge status={botStatus ?? 'ACTIVE'} mode="LIVE" />
        {result ? <LifecycleBadge status={result.status} /> : null}
      </div>

      <label className="mt-4 flex items-start gap-2 rounded-xl border border-[var(--warning-soft)] bg-[var(--warning-soft)] p-3 text-sm text-warning">
        <input
          type="checkbox"
          checked={riskConfirmed}
          onChange={(event) => setRiskConfirmed(event.target.checked)}
          className="mt-0.5"
        />
        <span>
          I understand this strategy can lose capital and past performance does not guarantee future returns.
        </span>
      </label>

      <button
        type="button"
        onClick={handleSubscribe}
        disabled={isSubmitting || !riskConfirmed}
        className="mt-5 rounded-xl cta-primary px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe Bot'}
      </button>

      <button
        type="button"
        onClick={handleUnsubscribe}
        disabled={isSubmitting || !result || result.status === 'UNSUBSCRIBED'}
        className="ml-2 mt-5 rounded-xl border border-[var(--panel-border)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55"
      >
        Unsubscribe
      </button>

      {error ? <p className="mt-3 text-sm text-negative">{error}</p> : null}

      {result ? (
        <div className="mt-4 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Subscription Status</p>
          <p className="mt-2 text-sm text-white">{result.status}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted">Runtime wsToken</p>
          <p className="mt-2 break-all font-mono text-sm text-white">{result.wsToken}</p>
          <p className="mt-2 text-xs text-muted">Store this token in your runner config before starting signal stream.</p>
        </div>
      ) : null}
    </article>
  );
}
