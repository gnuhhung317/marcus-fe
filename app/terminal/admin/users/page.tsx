import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/terminal/admin/admin-page-header';
import { AdminUsersClient } from '@/components/terminal/admin/admin-users-client';
import { listAdminUsers } from '@/lib/services/admin.service';

interface AdminUsersPageProps {
  searchParams?: {
    query?: string;
    role?: string;
    banned?: string;
    page?: string;
    size?: string;
  };
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role !== 'ADMIN') {
    redirect('/terminal');
  }

  const page = Number.parseInt(searchParams?.page ?? '0', 10) || 0;
  const size = Number.parseInt(searchParams?.size ?? '20', 10) || 20;
  const banned = searchParams?.banned === 'true' ? true : searchParams?.banned === 'false' ? false : undefined;

  const users = await listAdminUsers({
    query: searchParams?.query,
    role: searchParams?.role as any,
    banned,
    page,
    size,
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Users" description="Search, promote, ban, and audit user accounts." />
      <AdminUsersClient
        data={users}
        filters={{
          query: searchParams?.query,
          role: searchParams?.role,
          banned: searchParams?.banned,
          page,
          size,
        }}
      />
    </div>
  );
}
