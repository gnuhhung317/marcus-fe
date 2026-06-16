import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/terminal/admin/admin-page-header';
import { AdminBotDetailClient } from '@/components/terminal/admin/admin-bot-detail-client';
import { getAdminBotDetail, listAdminAuditEvents, listAdminBotSignals, listAdminBotSubscribers } from '@/lib/services/admin.service';

interface AdminBotDetailPageProps {
  params: { botId: string };
}

export default async function AdminBotDetailPage({ params }: AdminBotDetailPageProps) {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role !== 'ADMIN') {
    redirect('/terminal');
  }

  const [detail, signals, subscribers, auditEvents] = await Promise.all([
    getAdminBotDetail(params.botId),
    listAdminBotSignals(params.botId, { limit: 50 }),
    listAdminBotSubscribers(params.botId, { page: 0, size: 50 }),
    listAdminAuditEvents({ targetType: 'BOT', targetId: params.botId, page: 0, size: 50 }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader title={detail.name} description="Audit the bot, inspect subscribers, and override status." backHref="/terminal/admin/bots" />
      <AdminBotDetailClient data={{ detail, signals, subscribers, auditEvents }} />
    </div>
  );
}
