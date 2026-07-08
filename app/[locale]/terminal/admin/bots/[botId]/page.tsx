import { cookies } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import { AdminPageHeader } from '@/components/terminal/admin/admin-page-header';
import { AdminBotDetailClient } from '@/components/terminal/admin/admin-bot-detail-client';
import { getAdminBotDetailPageData } from '@/lib/services/admin.service';
import { redirect } from '@/lib/navigation';

interface AdminBotDetailPageProps {
  params: { botId: string };
}

export default async function AdminBotDetailPage({ params }: AdminBotDetailPageProps) {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;
  const locale = await getLocale();
  const t = await getTranslations('Admin.Bots.detail');

  if (role !== 'ADMIN') {
    redirect({ href: '/terminal', locale });
  }

  const initialData = await getAdminBotDetailPageData(params.botId);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={initialData.detail.name}
        description={t('page.description')}
        backHref="/terminal/admin/bots"
      />
      <AdminBotDetailClient botId={params.botId} initialData={initialData} />
    </div>
  );
}
