import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/terminal/admin/admin-page-header';
import { AdminBotsClient } from '@/components/terminal/admin/admin-bots-client';
import { listAdminBots } from '@/lib/services/admin.service';
import { normalizeAdminBotsQueryParams, type AdminBotsSearchParams } from '@/lib/validations/admin.schema';

interface AdminBotsPageProps {
  searchParams?: AdminBotsSearchParams;
}

export default async function AdminBotsPage({ searchParams }: AdminBotsPageProps) {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role !== 'ADMIN') {
    redirect('/terminal');
  }

  const filters = normalizeAdminBotsQueryParams(searchParams);
  const bots = await listAdminBots(filters);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Bots" description="Inspect and control all bots across the platform." />
      <AdminBotsClient initialData={bots} filters={filters} />
    </div>
  );
}
