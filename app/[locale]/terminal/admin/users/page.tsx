import { cookies } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import { AdminPageHeader } from '@/components/terminal/admin/admin-page-header';
import { AdminUsersClient } from '@/components/terminal/admin/admin-users-client';
import { listAdminUsers } from '@/lib/services/admin.service';
import { normalizeAdminUsersQueryParams, type AdminUsersSearchParams } from '@/lib/validations/admin.schema';
import { redirect } from '@/lib/navigation';

interface AdminUsersPageProps {
  searchParams?: AdminUsersSearchParams;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;
  const locale = await getLocale();
  const t = await getTranslations('Admin.Users.page');

  if (role !== 'ADMIN') {
    redirect({ href: '/terminal', locale });
  }

  const filters = normalizeAdminUsersQueryParams(searchParams);
  const users = await listAdminUsers(filters);

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('title')} description={t('description')} />
      <AdminUsersClient initialData={users} filters={filters} />
    </div>
  );
}
