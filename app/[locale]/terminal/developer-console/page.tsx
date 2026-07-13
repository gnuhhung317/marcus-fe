import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { getDeveloperConsolePageData } from '@/lib/contracts/client';

export default async function TerminalDeveloperConsolePage() {
  const t = await getTranslations('DeveloperConsole');
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role !== 'OPERATOR' && role !== 'ADMIN') {
    redirect('/terminal');
  }

  const { connectivity, signalStream, executionLogs } = await getDeveloperConsolePageData();
  const isConnected = connectivity.overallStatus === 'UP';

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('eyebrow')}</p>
        <h1 className="mt-3 text-4xl font-semibold text-main">{t('title')}</h1>
      </header>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-semibold text-main">{t('platformConnection')}</h2>
          <div className="mt-4 rounded-xl border border-border bg-surface p-4">
            <p className="text-sm text-muted">{t('overallStatus')}</p>
            <p className={`mt-2 text-3xl font-semibold ${isConnected ? 'text-positive' : 'text-negative'}`}>
              {connectivity.overallStatus}
            </p>
            <p className="mt-1 text-xs text-muted">{t('checkedAt', { value: new Date(connectivity.checkedAt).toLocaleString() })}</p>
          </div>
        </article>

        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-semibold text-main">{t('schema')}</h2>
          <pre className="mt-4 overflow-auto rounded-xl border border-info/30 bg-surface-strong p-4 text-xs text-info">
{`{
  "version": "1.2",
  "timestamp": "ISO8601",
  "strategy_id": "QUANT_BETA_9",
    "signal": {
    "action": "BUY | SELL",
    "asset": "BTCUSDT",
    "size": "float64",
    "limit_price": "float64"
  }
}`}
          </pre>
        </article>
      </section>

      <section className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-main">{t('recentSignals')}</h2>
          <p className="text-sm text-muted">{t('records', { count: signalStream.length })}</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-border/8 text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-4 py-3">{t('table.signalId')}</th>
                <th className="px-4 py-3">{t('table.bot')}</th>
                <th className="px-4 py-3">{t('table.symbol')}</th>
                <th className="px-4 py-3">{t('table.action')}</th>
                <th className="px-4 py-3">{t('table.status')}</th>
              </tr>
            </thead>
            <tbody>
              {signalStream.map((signal) => (
                <tr key={signal.signalId} className="border-t border-border/18 transition-colors hover:bg-border/8">
                  <td className="px-4 py-3.5 text-main">{signal.signalId}</td>
                  <td className="px-4 py-3.5 text-muted">{signal.botId}</td>
                  <td className="px-4 py-3.5 text-main">{signal.symbol}</td>
                  <td className="px-4 py-3.5 text-main">{signal.action}</td>
                  <td className="px-4 py-3.5 text-muted">{signal.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-main">{t('streamingLog')}</h2>
          <p className={`text-sm ${isConnected ? 'text-positive' : 'text-negative'}`}>{isConnected ? t('connected') : t('degraded')}</p>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {executionLogs.map((log, index) => (
            <li key={`${log.timestamp}-${index}`} className="rounded-lg border border-border bg-surface px-3 py-2 text-muted">
              [{log.level}] {log.source} · {log.message}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
