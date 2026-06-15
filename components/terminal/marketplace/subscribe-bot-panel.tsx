'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { subscribeToBot, unsubscribeFromBot } from '@/lib/contracts/client';
import { SubscriptionResult } from '@/lib/contracts/types';
import { LifecycleBadge } from '@/components/shared/lifecycle-badge';
import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SubscribeBotPanelProps {
  botId: string;
  botStatus?: string;
}

export function SubscribeBotPanel({ botId, botStatus }: SubscribeBotPanelProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [result, setResult] = useState<SubscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [riskConfirmed, setRiskConfirmed] = useState(false);

  const normalizedStatus = (botStatus ?? 'ACTIVE').toUpperCase();
  const canSubscribe = normalizedStatus === 'ACTIVE';
  const subscriptionBlockedMessage = canSubscribe
    ? null
    : `This bot is currently ${normalizedStatus.toLowerCase()} and cannot accept new subscriptions.`;

  const subscribeMutation = useMutation<SubscriptionResult, Error>({
    mutationFn: () => subscribeToBot(botId),
    onSuccess: (response) => {
      setResult(response);
      setError(null);
      pushToast({ title: 'Subscription requested', message: 'Runtime token is now available.', tone: 'success' });
      router.refresh();
    },
    onError: () => {
      setError('Unable to subscribe right now. Please retry.');
      pushToast({ title: 'Subscription failed', message: 'Please retry in a few seconds.', tone: 'error' });
    },
  });

  const unsubscribeMutation = useMutation<SubscriptionResult, Error, void, { previousResult: SubscriptionResult | null }>({
    mutationFn: () => unsubscribeFromBot(botId),
    onMutate: async () => {
      const previousResult = result;
      setError(null);
      setResult(
        previousResult ? { ...previousResult, status: 'UNSUBSCRIBING' } : { botId, wsToken: '', status: 'UNSUBSCRIBING' }
      );
      return { previousResult };
    },
    onSuccess: (response) => {
      setResult(response);
      pushToast({ title: 'Unsubscribed', message: 'The bot subscription has been stopped.', tone: 'success' });
      router.refresh();
    },
    onError: (_error, _variables, context) => {
      setResult(context?.previousResult ?? null);
      setError('Unable to unsubscribe right now. Please retry.');
      pushToast({ title: 'Unsubscribe failed', message: 'Your current subscription remains unchanged.', tone: 'error' });
    },
  });

  const isSubmitting = subscribeMutation.isPending || unsubscribeMutation.isPending;

  const handleSubscribe = () => {
    if (!canSubscribe) {
      setError(subscriptionBlockedMessage ?? 'This bot is not available for subscription.');
      return;
    }

    if (!riskConfirmed) {
      setError('Confirm risk warning before subscribing.');
      return;
    }

    setError(null);
    subscribeMutation.mutate();
  };

  const handleUnsubscribe = () => {
    const confirmed = window.confirm('Unsubscribe this bot now? You can subscribe again later.');
    if (!confirmed) {
      return;
    }

    setError(null);
    unsubscribeMutation.mutate();
  };

  return (
    <Card className="h-full p-5">
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-main">Subscribe bot</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <LifecycleBadge status={normalizedStatus} mode="LIVE" />
            {result ? <LifecycleBadge status={result.status} /> : null}
          </div>

          {subscriptionBlockedMessage ? (
            <div className="rounded-xl border border-negative/20 bg-negative-soft px-4 py-3 text-sm text-negative">
              {subscriptionBlockedMessage}
            </div>
          ) : null}

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-warning-soft p-3 text-sm text-warning">
            <input
              type="checkbox"
              checked={riskConfirmed}
              onChange={(event) => setRiskConfirmed(event.target.checked)}
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-border bg-surface text-positive focus:ring-0"
              disabled={!canSubscribe}
            />
            <span className="select-none leading-relaxed">
              I understand this strategy can lose capital and past performance does not guarantee future returns.
            </span>
          </label>

          {error ? <p className="text-sm text-negative">{error}</p> : null}

          {result ? (
            <div className="overflow-hidden rounded-xl border border-border/40 bg-surface/40">
              <div className="grid divide-y divide-border/40 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
                <div className="px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Status</p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-main">{result.status}</p>
                </div>
                <div className="px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Bot ID</p>
                  <p className="mt-1 truncate font-mono text-xs text-main" title={botId}>
                    {botId}
                  </p>
                </div>
              </div>
              <div className="border-t border-border/40 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Runtime token</p>
                <p className="mt-2 break-all font-mono text-sm text-main">{result.wsToken}</p>
              </div>
            </div>
          ) : isSubmitting ? (
            <div className="rounded-xl border border-border/40 bg-surface/40 px-4 py-4 text-sm text-muted">
              Requesting runtime token from the backend...
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/40 bg-surface/40 px-4 py-4 text-sm text-muted">
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
