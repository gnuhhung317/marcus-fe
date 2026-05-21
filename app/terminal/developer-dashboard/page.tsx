import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardContent } from '@/components/terminal/developer-dashboard/dashboard-content';
import { getDeveloperDashboardPageData } from '@/lib/contracts/client';

export default async function DeveloperDashboardPage({
  searchParams,
}: {
  searchParams: { botId?: string };
}) {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (!role || (role !== 'DEVELOPER' && role !== 'OPERATOR' && role !== 'ADMIN')) {
    redirect('/terminal');
  }

  const activeBotId = searchParams?.botId;
  const data = await getDeveloperDashboardPageData(activeBotId);

  return (
    <DashboardContent
      bots={data.bots}
      activeBot={data.activeBot}
      subscriptions={data.subscriptions}
    />
  );
}
