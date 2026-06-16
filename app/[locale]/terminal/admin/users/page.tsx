import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/terminal/admin/admin-page-header';
import { AdminUsersClient } from '@/components/terminal/admin/admin-users-client';
import { listAdminUsers } from '@/lib/services/admin.service';
import { normalizeAdminUsersQueryParams, type AdminUsersSearchParams } from '@/lib/validations/admin.schema';

interface AdminUsersPageProps {
  searchParams?: AdminUsersSearchParams;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role !== 'ADMIN') {
    redirect('/terminal');
  }

  const filters = normalizeAdminUsersQueryParams(searchParams);
  const users = await listAdminUsers(filters);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Users" description="Search, promote, ban, and audit user accounts." />
      <AdminUsersClient initialData={users} filters={filters} />
    </div>
  );
}
