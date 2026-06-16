import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/terminal/admin/admin-page-header';
import { AdminBotsClient } from '@/components/terminal/admin/admin-bots-client';
import { listAdminBots } from '@/lib/services/admin.service';

interface AdminBotsPageProps {
  searchParams?: {
    query?: string;
    status?: string;
    developerId?: string;
    page?: string;
    size?: string;
  };
}

export default async function AdminBotsPage({ searchParams }: AdminBotsPageProps) {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role !== 'ADMIN') {
    redirect('/terminal');
  }

  const page = Number.parseInt(searchParams?.page ?? '0', 10) || 0;
  const size = Number.parseInt(searchParams?.size ?? '20', 10) || 20;

  const bots = await listAdminBots({
    query: searchParams?.query,
    status: searchParams?.status as any,
    developerId: searchParams?.developerId,
    page,
    size,
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Bots" description="Inspect and control all bots across the platform." />
      <AdminBotsClient
        data={bots}
        filters={{
          query: searchParams?.query,
          status: searchParams?.status,
          developerId: searchParams?.developerId,
          page,
          size,
        }}
      />
    </div>
  );
}
