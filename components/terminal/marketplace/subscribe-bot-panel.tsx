'use client';

import { useState } from 'react';
import { subscribeToBot, unsubscribeFromBot } from '@/lib/contracts/client';
import { SubscriptionResult } from '@/lib/contracts/types';
import { LifecycleBadge } from '@/components/shared/lifecycle-badge';
import { useToast } from '@/components/providers/toast-provider';

interface SubscribeBotPanelProps {
  botId: string;
  botStatus?: string;
}

export function SubscribeBotPanel({ botId, botStatus }: SubscribeBotPanelProps) {
  const [result, setResult] = useState<SubscriptionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskConfirmed, setRiskConfirmed] = useState(false);
  const { pushToast } = useToast();

  const canSubscribe = (botStatus ?? 'ACTIVE') === 'ACTIVE';
  const subscriptionBlockedMessage =
    botStatus && botStatus !== 'ACTIVE'
      ? `This bot is currently ${botStatus.toLowerCase()} and cannot accept new subscriptions.`
      : null;

  const handleSubscribe = async () => {
    if (!canSubscribe) {
      setError(subscriptionBlockedMessage ?? 'This bot is not available for subscription.');
      return;
    }

    if (!riskConfirmed) {
      setError('Confirm risk warning before subscribing.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const previousResult = result;

    try {
      const response = await subscribeToBot(botId);
      setResult(response);
      pushToast({ title: 'Subscription requested', message: 'Runtime token is now available.', tone: 'success' });
    } catch {
      setResult(previousResult);
      setError('Unable to subscribe right now. Please retry.');
      pushToast({ title: 'Subscription failed', message: 'Please retry in a few seconds.', tone: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsubscribe = async () => {
    const confirmed = window.confirm('Unsubscribe this bot now? You can subscribe again later.');
    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const previousResult = result;
    setResult((prev) => (prev ? { ...prev, status: 'UNSUBSCRIBING' } : { botId, wsToken: '', status: 'UNSUBSCRIBING' }));

    try {
      const response = await unsubscribeFromBot(botId);
      setResult(response);
      pushToast({ title: 'Unsubscribed', message: 'The bot subscription has been stopped.', tone: 'success' });
    } catch {
      setResult(previousResult);
      setError('Unable to unsubscribe right now. Please retry.');
      pushToast({ title: 'Unsubscribe failed', message: 'Your current subscription remains unchanged.', tone: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="glass-strong h-full rounded-2xl border border-border p-5 shadow-[var(--shadow-soft)]">
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-fg">Subscribe bot</h2>
            <p className="mt-2 text-sm text-fg-muted">Request deployment access and receive a runtime token for your local executor.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <LifecycleBadge status={botStatus ?? 'ACTIVE'} mode="LIVE" />
            {result ? <LifecycleBadge status={result.status} /> : null}
          </div>

          {subscriptionBlockedMessage ? (
            <div className="rounded-xl border border-negative/18 bg-negative/8 px-4 py-3 text-sm text-negative">
              {subscriptionBlockedMessage}
            </div>
          ) : null}

          <label className="flex items-start gap-3 rounded-xl border border-border bg-warning-soft p-3 text-sm text-warning">
            <input
              type="checkbox"
              checked={riskConfirmed}
              onChange={(event) => setRiskConfirmed(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border bg-surface text-positive focus:ring-0"
              disabled={!canSubscribe}
            />
            <span className="leading-relaxed">
              I understand this strategy can lose capital and past performance does not guarantee future returns.
            </span>
          </label>

          {error ? <p className="text-sm text-negative">{error}</p> : null}

          {result ? (
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-surface-strong px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Status</p>
                  <p className="mt-2 text-sm font-semibold text-fg">{result.status}</p>
                </div>
                <div className="rounded-lg border border-border bg-surface-strong px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Bot</p>
                  <p className="mt-2 font-mono text-sm text-fg">{botId}</p>
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-border bg-surface-strong px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Runtime token</p>
                <p className="mt-2 break-all font-mono text-sm text-fg">{result.wsToken}</p>
              </div>
            </div>
          ) : isSubmitting ? (
            <div className="rounded-xl border border-border bg-surface px-4 py-4 text-sm text-fg-muted">
              Requesting runtime token from the backend...
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-4 text-sm text-fg-muted">
              Subscribe to surface the runtime token here.
            </div>
          )}
        </div>

        <div className="mt-auto space-y-3 pt-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={isSubmitting || !riskConfirmed || !canSubscribe}
              className="flex-1 rounded-xl cta-primary px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe bot'}
            </button>

            <button
              type="button"
              onClick={handleUnsubscribe}
              disabled={isSubmitting || !result || result.status === 'UNSUBSCRIBED' || result.status === 'UNSUBSCRIBING'}
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-surface-strong disabled:cursor-not-allowed disabled:opacity-55"
            >
              Unsubscribe
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
