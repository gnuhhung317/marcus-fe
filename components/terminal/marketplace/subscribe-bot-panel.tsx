'use client';

import { useState } from 'react';
import { subscribeToBot } from '../../../lib/contracts/client';
import { SubscriptionResult } from '../../../lib/contracts/types';

interface SubscribeBotPanelProps {
  botId: string;
}

export function SubscribeBotPanel({ botId }: SubscribeBotPanelProps) {
  const [result, setResult] = useState<SubscriptionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
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

  return (
    <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
      <h2 className="text-xl font-semibold text-white">Subscribe Bot</h2>
      <p className="mt-2 text-sm text-muted">Request deployment access and receive a runtime token for your local executor.</p>

      <button
        type="button"
        onClick={handleSubscribe}
        disabled={isSubmitting}
        className="mt-5 rounded-xl cta-primary px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe Bot'}
      </button>

      {error ? <p className="mt-3 text-sm text-negative">{error}</p> : null}

      {result ? (
        <div className="mt-4 rounded-xl border border-[rgba(148,163,184,0.24)] bg-[rgba(15,23,42,0.72)] p-4">
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
