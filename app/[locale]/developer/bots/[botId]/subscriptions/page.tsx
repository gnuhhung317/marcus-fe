import { EmptyStateCard, ErrorStateCard } from '@/components/shared/api-state';
import { SubscriptionTable } from '@/components/terminal/developer-dashboard/subscription-table';
import { listActiveSubscriptionsForBot } from '@/lib/contracts/client';
import { getTranslations } from 'next-intl/server';

export default async function SubscriptionsPage({ params }: { params: { botId: string } }) {
  const { botId } = params;
  const t = await getTranslations('DeveloperDashboard.subscriptionPage');

  try {
    const subscriptions = await listActiveSubscriptionsForBot(botId);

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-10 md:px-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-positive">{t('eyebrow')}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{t('title')}</h1>
          <p className="max-w-2xl text-sm text-muted">{t('description')}</p>
        </header>

        {subscriptions.length > 0 ? (
          <SubscriptionTable subscriptions={subscriptions} />
        ) : (
          <EmptyStateCard
            title={t('emptyTitle')}
            message={t('emptyMessage')}
            actionLabel={t('emptyAction')}
            actionHref={`/terminal/developer-dashboard/${botId}`}
          />
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-10 md:px-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-positive">{t('eyebrow')}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{t('title')}</h1>
          <p className="max-w-2xl text-sm text-muted">{t('description')}</p>
        </header>

        <ErrorStateCard
          title={t('errorTitle')}
          message={error instanceof Error ? error.message : t('errorMessage')}
          actionLabel={t('retry')}
          actionHref={`/developer/bots/${botId}/subscriptions`}
        />
      </main>
    );
  }
}
