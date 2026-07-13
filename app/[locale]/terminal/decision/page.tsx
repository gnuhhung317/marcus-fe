import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { DecisionOverviewSection } from '@/components/terminal/decision/decision-overview-section';
import { DecisionPerformanceSection } from '@/components/terminal/decision/decision-performance-section';
import { DecisionRefreshButton } from '@/components/terminal/decision/decision-refresh-button';
import { DecisionSubscriptionsSection } from '@/components/terminal/decision/decision-subscriptions-section';

export default async function DecisionDashboardPage() {
  const t = await getTranslations('Decision.page');
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role === 'DEVELOPER') {
    redirect('/terminal/developer-dashboard');
  }

  if (!role || (role !== 'TRADER' && role !== 'OPERATOR' && role !== 'ADMIN')) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-main">{t('title')}</h1>
        </div>

        <DecisionRefreshButton />
      </div>

      <DecisionOverviewSection />
      <DecisionPerformanceSection />

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-main">{t('triage')}</h3>
        </div>

        <DecisionSubscriptionsSection />
      </div>
    </div>
  );
}
