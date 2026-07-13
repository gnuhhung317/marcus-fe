import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getBotAnalyticsPageData } from '@/lib/contracts/client';
import { PerformanceChart } from '@/components/shared/performance-chart';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function formatBlockTitle(title: string, t: Awaited<ReturnType<typeof getTranslations>>) {
  if (title === 'Out-of-sample') return t('blockTitles.outOfSample');
  if (title === 'Historical') return t('blockTitles.historical');
  return t('blockTitles.totalData');
}

export default async function TerminalBotPage({ params }: { params: { botId: string } }) {
  const t = await getTranslations('TerminalBot');
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role !== 'OPERATOR' && role !== 'ADMIN') {
    redirect('/terminal');
  }

  const bot = await getBotAnalyticsPageData(params.botId);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('eyebrow')}</p>
          <h1 className="mt-3 text-4xl font-semibold text-main">{bot.botName}</h1>
          <p className="mt-2 text-sm text-muted">{t('description', { exchange: bot.exchange })}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">{t('export')}</Button>
          <Button variant="primary">{t('review')}</Button>
        </div>
      </header>

      <section className="grid gap-5 xl:grid-cols-[minmax(280px,0.32fr)_minmax(0,0.68fr)]">
        <div className="space-y-5">
          {bot.metricBlocks.map((block) => (
            <Card key={block.title} variant="glass-strong" className="rounded-lg p-5 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-semibold text-main">{formatBlockTitle(block.title, t)}</h2>
              <div className="mt-6 overflow-hidden rounded-xl border border-border/40 bg-surface/30">
                <div className="flex items-center justify-between border-b border-border/40 px-3 py-3">
                <span className="text-sm text-main">{t('metrics.annualReturn')}</span>
                <span className="font-semibold text-positive">{block.annualReturn}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 px-3 py-3">
                <span className="text-sm text-main">{t('metrics.maxDrawdown')}</span>
                <span className="font-semibold text-positive">{block.maxDrawdown}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-3">
                <span className="text-sm text-main">{t('metrics.sharpeRatio')}</span>
                <span className="font-semibold text-main">{block.sharpe}</span>
              </div>
              </div>
              {block.warning ? (
                <p className="mt-4 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning" title={block.warning}>
                  {block.warning}
                </p>
              ) : null}
            </Card>
          ))}
        </div>

        <div className="space-y-5">
          <Card variant="glass-strong" className="rounded-lg p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-2xl font-semibold text-main">{t('sections.chart')}</h2>
            <div className="mt-6">
              <PerformanceChart data={bot.performanceSeries} splitTimestamp={bot.splitTimestamp} />
            </div>
          </Card>

          <Card variant="glass-strong" className="rounded-lg p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-2xl font-semibold text-main">{t('sections.metrics')}</h2>
            <div className="mt-5 overflow-hidden rounded-xl border border-border/40 bg-surface/30 md:grid md:grid-cols-2">
              {bot.metrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between border-b border-border/40 px-3 py-3 last:border-b-0 md:odd:border-r md:odd:border-border/40">
                  <span className="text-sm font-medium text-main">{metric.label}</span>
                  <span className="text-lg font-semibold text-positive">{metric.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <Card variant="glass-strong" className="rounded-2xl p-5 shadow-[var(--shadow-soft)]">
        <h2 className="text-2xl font-semibold text-main">{t('sections.trades')}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.15em] text-muted">
              <tr>
                <th className="py-3">{t('table.timestamp')}</th>
                <th className="py-3">{t('table.pair')}</th>
                <th className="py-3">{t('table.side')}</th>
                <th className="py-3 text-right">{t('table.pnl')}</th>
              </tr>
            </thead>
            <tbody>
              {bot.trades.map((trade) => (
                <tr key={`${trade.timestamp}-${trade.pair}`} className="border-t border-border/50">
                  <td className="py-3 text-muted">
                    {Number.isNaN(Date.parse(trade.timestamp))
                      ? trade.timestamp
                      : new Date(trade.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 text-main">{trade.pair}</td>
                  <td className="py-3 text-main">{trade.side}</td>
                  <td className={`py-3 text-right font-semibold ${trade.pnl >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {trade.pnl >= 0 ? '+' : ''}
                    {trade.pnl.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
