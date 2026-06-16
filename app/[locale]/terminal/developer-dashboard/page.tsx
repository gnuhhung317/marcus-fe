import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDeveloperDashboardPageData } from '@/lib/contracts/client';
import { DeveloperDashboardClient } from '@/components/terminal/developer-dashboard/developer-dashboard-client';

export default async function DeveloperDashboardPage() {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  // Server-side auth check
  if (!role || (role !== 'DEVELOPER' && role !== 'OPERATOR' && role !== 'ADMIN')) {
    redirect('/terminal');
  }

  // Pre-fetch initial data on server side
  const initialData = await getDeveloperDashboardPageData();

  return <DeveloperDashboardClient initialData={initialData} />;
}
