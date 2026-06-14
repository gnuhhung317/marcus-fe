'use client';

import { useState } from 'react';
import { subscribeToBot, unsubscribeFromBot } from '@/lib/contracts/client';
import { SubscriptionResult } from '@/lib/contracts/types';
import { LifecycleBadge } from '@/components/shared/lifecycle-badge';
import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <Card className="h-full p-5 bg-surface border-border shadow-soft">
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-main">Subscribe bot</h2>
            <p className="mt-2 text-sm text-muted">Request deployment access and receive a runtime token for your local executor.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <LifecycleBadge status={botStatus ?? 'ACTIVE'} mode="LIVE" />
            {result ? <LifecycleBadge status={result.status} /> : null}
          </div>

          {subscriptionBlockedMessage ? (
            <div className="rounded-xl border border-negative/20 bg-negative-soft px-4 py-3 text-sm text-negative">
              {subscriptionBlockedMessage}
            </div>
          ) : null}

          <label className="flex items-start gap-3 rounded-xl border border-border bg-warning-soft p-3 text-sm text-warning cursor-pointer">
            <input
              type="checkbox"
              checked={riskConfirmed}
              onChange={(event) => setRiskConfirmed(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border bg-surface text-positive focus:ring-0 cursor-pointer"
              disabled={!canSubscribe}
            />
            <span className="leading-relaxed select-none">
              I understand this strategy can lose capital and past performance does not guarantee future returns.
            </span>
          </label>

          {error ? <p className="text-sm text-negative">{error}</p> : null}

          {result ? (
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-surface-strong px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Status</p>
                  <p className="mt-2 text-sm font-semibold text-main">{result.status}</p>
                </div>
                <div className="rounded-lg border border-border bg-surface-strong px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Bot</p>
                  <p className="mt-2 font-mono text-xs text-main truncate" title={botId}>{botId}</p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-surface-strong px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Runtime token</p>
                <p className="mt-2 break-all font-mono text-sm text-main">{result.wsToken}</p>
              </div>
            </div>
          ) : isSubmitting ? (
            <div className="rounded-xl border border-border bg-surface px-4 py-4 text-sm text-muted">
              Requesting runtime token from the backend...
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-4 text-sm text-muted">
              Subscribe to surface the runtime token here.
            </div>
          )}
        </div>

        <div className="mt-auto space-y-3 pt-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={handleSubscribe}
              disabled={!riskConfirmed || !canSubscribe}
              isLoading={isSubmitting}
              variant="primary"
              className="flex-1"
            >
              Subscribe bot
            </Button>

            <Button
              type="button"
              onClick={handleUnsubscribe}
              disabled={!result || result.status === 'UNSUBSCRIBED' || result.status === 'UNSUBSCRIBING'}
              isLoading={isSubmitting}
              variant="outline"
              className="flex-1"
            >
              Unsubscribe
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
