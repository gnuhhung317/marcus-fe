import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { getDeveloperDashboardPageData } from '@/lib/contracts/client';
import { DeveloperDashboardClient } from '@/components/terminal/developer-dashboard/developer-dashboard-client';
import { redirect } from '@/lib/navigation';

export default async function DeveloperDashboardPage() {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;
  const locale = await getLocale();

  // Server-side auth check
  if (!role || (role !== 'DEVELOPER' && role !== 'OPERATOR' && role !== 'ADMIN')) {
    redirect({ href: '/terminal', locale });
  }

  // Pre-fetch initial data on server side
  const initialData = await getDeveloperDashboardPageData();

  return <DeveloperDashboardClient initialData={initialData} />;
}
