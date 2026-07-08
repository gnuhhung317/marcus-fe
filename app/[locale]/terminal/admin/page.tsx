import type { ReactNode } from 'react';
import { Activity, Bot, Shield, Users } from 'lucide-react';
import { getFormatter, getTranslations } from 'next-intl/server';
import { AdminPageHeader } from '@/components/terminal/admin/admin-page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from '@/lib/navigation';
import { getAdminDashboardData } from '@/lib/services/admin.service';

function StatCard({
  label,
  value,
  icon,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: 'default' | 'success' | 'warning' | 'error';
}) {
  const toneClass =
    tone === 'success'
      ? 'bg-primary-soft text-positive'
      : tone === 'warning'
        ? 'bg-warning-soft text-warning'
        : tone === 'error'
          ? 'bg-negative-soft text-negative'
          : 'bg-surface-strong text-main';

  return (
    <Card className="rounded-2xl border-border/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
          <p className="text-2xl font-semibold text-main">{value}</p>
        </div>
        <div className={`flex size-10 items-center justify-center rounded-xl ${toneClass}`}>{icon}</div>
      </div>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();
  const t = await getTranslations('Admin.Overview');
  const tLabels = await getTranslations('Common.labels');
  const tHealth = await getTranslations('Common.systemHealth');
  const formatter = await getFormatter();
  const health = data.systemHealth === 'UP' ? 'success' : data.systemHealth === 'DEGRADED' ? 'warning' : 'error';

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('title')} description={t('description')} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('stats.users')} value={data.totalUsers} icon={<Users className="size-4" />} />
        <StatCard label={t('stats.banned')} value={data.bannedUsers} icon={<Shield className="size-4" />} tone="error" />
        <StatCard label={t('stats.bots')} value={data.totalBots} icon={<Bot className="size-4" />} />
        <StatCard label={t('stats.activeSubscriptions')} value={data.activeSubscriptions} icon={<Activity className="size-4" />} tone="success" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-2xl border-border/70 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-main">{t('panels.operationalMix.title')}</h2>
              <p className="text-sm text-muted">{t('panels.operationalMix.description')}</p>
            </div>
            <Badge variant={health}>{tHealth(data.systemHealth as 'UP' | 'DEGRADED' | 'DOWN')}</Badge>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t('states.active')}</p>
              <p className="mt-2 text-2xl font-semibold text-main">{data.activeBots}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t('states.paused')}</p>
              <p className="mt-2 text-2xl font-semibold text-main">{data.pausedBots}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t('states.deleted')}</p>
              <p className="mt-2 text-2xl font-semibold text-main">{data.deletedBots}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t('states.disconnectedExecutors')}</p>
              <p className="mt-2 text-2xl font-semibold text-main">{data.disconnectedExecutors}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-surface/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t('states.checkedAt')}</p>
              <p className="mt-2 text-sm text-main">
                {data.checkedAt ? formatter.dateTime(new Date(data.checkedAt), { dateStyle: 'medium', timeStyle: 'short' }) : tLabels('unknown')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/70 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-main">{t('panels.recentActions.title')}</h2>
              <p className="text-sm text-muted">{t('panels.recentActions.description')}</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/terminal/admin/system">{t('actions.systemLogs')}</Link>
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {data.recentActions.length ? (
              data.recentActions.map((event) => (
                <div key={event.adminAuditEventId} className="rounded-xl border border-border/60 bg-surface/70 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-main">{event.action}</p>
                      <p className="mt-1 text-xs text-muted">
                        {event.targetType} · {event.targetId}
                      </p>
                    </div>
                    <span className="text-[11px] text-muted">
                      {event.createdAt ? formatter.dateTime(new Date(event.createdAt), { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-surface/50 p-6 text-sm text-muted">
                {t('emptyAudit')}
              </div>
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Button asChild className="h-12 justify-start px-4">
          <Link href="/terminal/admin/users">{t('actions.manageUsers')}</Link>
        </Button>
        <Button asChild variant="outline" className="h-12 justify-start px-4">
          <Link href="/terminal/admin/bots">{t('actions.inspectBots')}</Link>
        </Button>
        <Button asChild variant="outline" className="h-12 justify-start px-4">
          <Link href="/terminal/admin/system">{t('actions.reviewSystemHealth')}</Link>
        </Button>
      </section>
    </div>
  );
}
