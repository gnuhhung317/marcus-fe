import { cookies } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import { AdminPageHeader } from '@/components/terminal/admin/admin-page-header';
import { AdminBotsClient } from '@/components/terminal/admin/admin-bots-client';
import { listAdminBots } from '@/lib/services/admin.service';
import { normalizeAdminBotsQueryParams, type AdminBotsSearchParams } from '@/lib/validations/admin.schema';
import { redirect } from '@/lib/navigation';

interface AdminBotsPageProps {
  searchParams?: AdminBotsSearchParams;
}

export default async function AdminBotsPage({ searchParams }: AdminBotsPageProps) {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;
  const locale = await getLocale();
  const t = await getTranslations('Admin.Bots.page');

  if (role !== 'ADMIN') {
    redirect({ href: '/terminal', locale });
  }

  const filters = normalizeAdminBotsQueryParams(searchParams);
  const bots = await listAdminBots(filters);

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('title')} description={t('description')} />
      <AdminBotsClient initialData={bots} filters={filters} />
    </div>
  );
}
