import { EmptyStateCard, ErrorStateCard } from '@/components/shared/api-state';
import { SubscriptionTable } from '@/components/terminal/developer-dashboard/subscription-table';
import { listActiveSubscriptionsForBot } from '@/lib/contracts/client';

export default async function SubscriptionsPage({ params }: { params: { botId: string } }) {
  const { botId } = params;

  try {
    const subscriptions = await listActiveSubscriptionsForBot(botId);

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-10 md:px-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-positive">Developer Dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Active subscriptions</h1>
          <p className="max-w-2xl text-sm text-muted">
            View connected executor sessions for this bot. The list reflects live subscription access only.
          </p>
        </header>

        {subscriptions.length > 0 ? (
          <SubscriptionTable subscriptions={subscriptions} />
        ) : (
          <EmptyStateCard
            title="No active subscriptions"
            message="This bot does not have any connected executor sessions right now."
            actionLabel="Open developer dashboard"
            actionHref={`/terminal/developer-dashboard/${botId}`}
          />
        )}
      </main>
    );
  } catch (error) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-10 md:px-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-positive">Developer Dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Active subscriptions</h1>
          <p className="max-w-2xl text-sm text-muted">
            View connected executor sessions for this bot. The list reflects live subscription access only.
          </p>
        </header>

        <ErrorStateCard
          title="Active subscriptions unavailable"
          message={error instanceof Error ? error.message : 'Could not load active subscriptions right now.'}
          actionLabel="Retry"
          actionHref={`/developer/bots/${botId}/subscriptions`}
        />
      </main>
    );
  }
}
