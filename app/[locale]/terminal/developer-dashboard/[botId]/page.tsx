import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { getDeveloperDashboardPageData } from '@/lib/contracts/client';
import { BotConsoleClient } from '@/components/terminal/developer-dashboard/bot-console-client';
import { redirect } from '@/lib/navigation';

interface DeveloperBotConsolePageProps {
  params: {
    botId: string;
  };
}

export default async function DeveloperBotConsolePage({ params }: DeveloperBotConsolePageProps) {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;
  const locale = await getLocale();

  // Server-side auth check
  if (!role || (role !== 'DEVELOPER' && role !== 'OPERATOR' && role !== 'ADMIN')) {
    redirect({ href: '/terminal', locale });
  }

  // Pre-fetch specific bot console data on server side
  const initialData = await getDeveloperDashboardPageData(params.botId);

  // If bot is not found or invalid, we can handle it inside client, or redirect
  if (!initialData.activeBot) {
    redirect({ href: '/terminal/developer-dashboard', locale });
  }

  return <BotConsoleClient initialData={initialData} botId={params.botId} />;
}
