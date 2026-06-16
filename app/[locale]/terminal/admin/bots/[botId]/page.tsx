import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/terminal/admin/admin-page-header';
import { AdminBotDetailClient } from '@/components/terminal/admin/admin-bot-detail-client';
import { getAdminBotDetailPageData } from '@/lib/services/admin.service';

interface AdminBotDetailPageProps {
  params: { botId: string };
}

export default async function AdminBotDetailPage({ params }: AdminBotDetailPageProps) {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role !== 'ADMIN') {
    redirect('/terminal');
  }

  const initialData = await getAdminBotDetailPageData(params.botId);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={initialData.detail.name}
        description="Audit the bot, inspect subscribers, and override status."
        backHref="/terminal/admin/bots"
      />
      <AdminBotDetailClient botId={params.botId} initialData={initialData} />
    </div>
  );
}
