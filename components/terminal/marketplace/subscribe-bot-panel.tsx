'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { subscribeToBot, unsubscribeFromBot } from '@/lib/contracts/client';
import { SubscriptionResult, ViewerSubscription } from '@/lib/contracts/types';
import { LifecycleBadge } from '@/components/shared/lifecycle-badge';
import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SubscribeBotPanelProps {
  botId: string;
  botStatus?: string;
  initialSubscription?: ViewerSubscription | null;
}

type PanelAction = 'subscribe' | 'unsubscribe';

function normalizeStatus(status?: string | null) {
  return (status ?? '').trim().toUpperCase() || null;
}

function normalizeViewerSubscription(subscription?: ViewerSubscription | SubscriptionResult | null): ViewerSubscription | null {
  if (!subscription) {
    return null;
  }

  const status = normalizeStatus(subscription.status);
  if (!status || status === 'UNSUBSCRIBED') {
    return null;
  }

  return {
    status,
    wsToken: subscription.wsToken ?? null,
  };
}

function getPanelMode(subscription: ViewerSubscription | null, pendingAction: PanelAction | null) {
  if (pendingAction === 'subscribe') {
    return 'subscribe-pending' as const;
  }

  if (pendingAction === 'unsubscribe') {
    return 'unsubscribe-pending' as const;
  }

  const status = normalizeStatus(subscription?.status);
  if (!status || status === 'UNSUBSCRIBED') {
    return 'subscribe' as const;
  }

  if (status === 'UNSUBSCRIBING') {
    return 'unsubscribe-pending' as const;
  }

  return 'unsubscribe' as const;
}

export function SubscribeBotPanel({ botId, botStatus, initialSubscription }: SubscribeBotPanelProps) {
  const router = useRouter();
  const t = useTranslations('Marketplace.subscribe');
  const { pushToast } = useToast();
  const [subscription, setSubscription] = useState<ViewerSubscription | null>(() => normalizeViewerSubscription(initialSubscription));
  const [pendingAction, setPendingAction] = useState<PanelAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [riskConfirmed, setRiskConfirmed] = useState(false);
  const previousBotIdRef = useRef(botId);

  const normalizedStatus = (botStatus ?? 'ACTIVE').toUpperCase();
  const canSubscribe = normalizedStatus === 'ACTIVE';
  const subscriptionBlockedMessage = canSubscribe
    ? null
    : t('blocked', { status: normalizedStatus.toLowerCase() });
  const panelMode = getPanelMode(subscription, pendingAction);
  const hasSubscription = panelMode === 'unsubscribe' || panelMode === 'unsubscribe-pending';
  const showSubscribeAction = panelMode === 'subscribe' || panelMode === 'subscribe-pending';
  const showUnsubscribeAction = hasSubscription;
  const displayStatus =
    panelMode === 'subscribe'
      ? null
      : panelMode === 'subscribe-pending'
        ? 'SUBSCRIBING'
        : panelMode === 'unsubscribe-pending'
          ? 'UNSUBSCRIBING'
          : normalizeStatus(subscription?.status);

  useEffect(() => {
    const normalizedInitialSubscription = normalizeViewerSubscription(initialSubscription);
    const didBotChange = previousBotIdRef.current !== botId;

    previousBotIdRef.current = botId;
    setPendingAction(null);
    setError(null);
    setSubscription((current) => {
      if (didBotChange) {
        return normalizedInitialSubscription;
      }

      return normalizedInitialSubscription ?? current;
    });
  }, [botId, initialSubscription]);

  const subscribeMutation = useMutation<SubscriptionResult, Error, void, { previousSubscription: ViewerSubscription | null }>({
    mutationFn: () => subscribeToBot(botId),
    onMutate: async () => {
      setError(null);
      setPendingAction('subscribe');
      return { previousSubscription: subscription };
    },
    onSuccess: (response) => {
      setSubscription(normalizeViewerSubscription(response));
      setPendingAction(null);
      setError(null);
      pushToast({ title: t('toast.subscribeTitle'), message: t('toast.subscribeMessage'), tone: 'success' });
      router.refresh();
    },
    onError: (_error, _variables, context) => {
      setSubscription(context?.previousSubscription ?? null);
      setPendingAction(null);
      setError(t('errors.subscribe'));
      pushToast({ title: t('toast.subscribeFailedTitle'), message: t('toast.subscribeFailedMessage'), tone: 'error' });
    },
  });

  const unsubscribeMutation = useMutation<SubscriptionResult, Error, void, { previousResult: SubscriptionResult | null }>({
    mutationFn: () => unsubscribeFromBot(botId),
    onMutate: async () => {
      const previousResult = subscription ? { botId, status: subscription.status, wsToken: subscription.wsToken ?? '' } : null;
      setError(null);
      setPendingAction('unsubscribe');
      return { previousResult };
    },
    onSuccess: (response) => {
      setSubscription(normalizeViewerSubscription(response));
      setPendingAction(null);
      pushToast({ title: t('toast.unsubscribeTitle'), message: t('toast.unsubscribeMessage'), tone: 'success' });
      router.refresh();
    },
    onError: (_error, _variables, context) => {
      setSubscription(normalizeViewerSubscription(context?.previousResult));
      setPendingAction(null);
      setError(t('errors.unsubscribe'));
      pushToast({ title: t('toast.unsubscribeFailedTitle'), message: t('toast.unsubscribeFailedMessage'), tone: 'error' });
    },
  });

  const isSubmitting = subscribeMutation.isPending || unsubscribeMutation.isPending || pendingAction !== null;

  const handleSubscribe = () => {
    if (!canSubscribe) {
      setError(subscriptionBlockedMessage ?? t('errors.notAvailable'));
      return;
    }

    if (!riskConfirmed) {
      setError(t('errors.confirmRisk'));
      return;
    }

    setError(null);
    subscribeMutation.mutate();
  };

  const handleUnsubscribe = () => {
    const confirmed = window.confirm(t('confirmUnsubscribe'));
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
            <h2 className="text-xl font-semibold text-main">{t('title')}</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <LifecycleBadge status={normalizedStatus} mode="LIVE" />
            {displayStatus ? <LifecycleBadge status={displayStatus} /> : null}
          </div>

          {subscriptionBlockedMessage ? (
            <div className="rounded-xl border border-negative/20 bg-negative-soft px-4 py-3 text-sm text-negative">
              {subscriptionBlockedMessage}
            </div>
          ) : null}

          {showSubscribeAction ? (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-warning-soft p-3 text-sm text-warning">
              <input
                type="checkbox"
                checked={riskConfirmed}
                onChange={(event) => setRiskConfirmed(event.target.checked)}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-border bg-surface text-positive focus:ring-0"
                disabled={!canSubscribe || isSubmitting}
              />
              <span className="select-none leading-relaxed">{t('riskAcknowledgement')}</span>
            </label>
          ) : null}

          {error ? <p className="text-sm text-negative">{error}</p> : null}

          {showUnsubscribeAction || pendingAction === 'subscribe' ? (
            <div className="overflow-hidden rounded-xl border border-border/40 bg-surface/40">
              <div className="grid divide-y divide-border/40 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
                <div className="px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{t('status')}</p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-main">{displayStatus ?? t('empty')}</p>
                </div>
                <div className="px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{t('botId')}</p>
                  <p className="mt-1 truncate font-mono text-xs text-main" title={botId}>
                    {botId}
                  </p>
                </div>
              </div>
              <div className="border-t border-border/40 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{t('runtimeToken')}</p>
                <p className="mt-2 break-all font-mono text-sm text-main">
                  {subscription?.wsToken || (pendingAction === 'subscribe' ? t('requesting') : t('empty'))}
                </p>
              </div>
            </div>
          ) : isSubmitting ? (
            <div className="rounded-xl border border-border/40 bg-surface/40 px-4 py-4 text-sm text-muted">
              {t('requesting')}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/40 bg-surface/40 px-4 py-4 text-sm text-muted">
              {t('empty')}
            </div>
          )}
        </div>

        <div className="mt-auto space-y-3 pt-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            {showSubscribeAction ? (
              <Button
                type="button"
                onClick={handleSubscribe}
                disabled={!riskConfirmed || !canSubscribe || isSubmitting}
                isLoading={pendingAction === 'subscribe' || subscribeMutation.isPending}
                variant="primary"
                className="flex-1"
              >
                {t('subscribe')}
              </Button>
            ) : null}

            {showUnsubscribeAction ? (
              <Button
                type="button"
                onClick={handleUnsubscribe}
                disabled={pendingAction === 'unsubscribe' || unsubscribeMutation.isPending}
                isLoading={pendingAction === 'unsubscribe' || unsubscribeMutation.isPending}
                variant="outline"
                className="flex-1"
              >
                {t('unsubscribe')}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
