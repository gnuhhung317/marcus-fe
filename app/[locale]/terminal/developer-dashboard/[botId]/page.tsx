import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDeveloperDashboardPageData } from '@/lib/contracts/client';
import { DeveloperDashboardClient } from '@/components/terminal/developer-dashboard/developer-dashboard-client';

interface DeveloperBotConsolePageProps {
  params: {
    botId: string;
  };
}

export default async function DeveloperBotConsolePage({ params }: DeveloperBotConsolePageProps) {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  // Server-side auth check
  if (!role || (role !== 'DEVELOPER' && role !== 'OPERATOR' && role !== 'ADMIN')) {
    redirect('/terminal');
  }

  // Pre-fetch specific bot console data on server side
  const initialData = await getDeveloperDashboardPageData(params.botId);

  // If bot is not found or invalid, we can handle it inside client, or redirect
  if (!initialData.activeBot) {
    redirect('/terminal/developer-dashboard');
  }

  return <DeveloperDashboardClient initialData={initialData} initialBotId={params.botId} />;
}
