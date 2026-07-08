import { AdminPageHeader } from '@/components/terminal/admin/admin-page-header';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getFormatter, getTranslations } from 'next-intl/server';
import { getAdminSystemPageData } from '@/lib/services/admin.service';

function levelTone(level: string) {
  if (level === 'ERROR') return 'error';
  if (level === 'WARN') return 'warning';
  return 'success';
}

export default async function AdminSystemPage() {
  const data = await getAdminSystemPageData();
  const t = await getTranslations('Admin.System');
  const tLabels = await getTranslations('Common.labels');
  const tHealth = await getTranslations('Common.systemHealth');
  const formatter = await getFormatter();

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('page.title')} description={t('page.description')} />

      <Card className="rounded-2xl border-border/70 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-main">{t('connectivity.title')}</h2>
            <p className="text-sm text-muted">{t('connectivity.description')}</p>
          </div>
          <Badge variant={data.connectivity.overallStatus === 'UP' ? 'success' : data.connectivity.overallStatus === 'DEGRADED' ? 'warning' : 'error'}>
            {tHealth(data.connectivity.overallStatus as 'UP' | 'DEGRADED' | 'DOWN')}
          </Badge>
        </div>
        <p className="mt-3 text-sm text-muted">
          {t('connectivity.checkedAt')} {data.connectivity.checkedAt ? formatter.dateTime(new Date(data.connectivity.checkedAt), { dateStyle: 'medium', timeStyle: 'short' }) : tLabels('unknown')}
        </p>
      </Card>

      <Card className="rounded-2xl border-border/70 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-main">{t('logs.title')}</h2>
            <p className="text-sm text-muted">{t('logs.description')}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {data.executionLogs.length ? (
            data.executionLogs.map((log, index) => (
              <div key={`${log.timestamp}-${index}`} className="grid gap-2 rounded-xl border border-border/60 bg-surface/70 p-3 md:grid-cols-[160px_80px_120px_1fr]">
                <p className="text-xs text-muted">{formatter.dateTime(new Date(log.timestamp), { dateStyle: 'medium', timeStyle: 'short' })}</p>
                <Badge variant={levelTone(log.level)}>{log.level}</Badge>
                <p className="text-xs text-muted">{log.source}</p>
                <p className="text-sm text-main">{log.message}</p>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 bg-surface/50 p-6 text-sm text-muted">
              {t('emptyLogs')}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
