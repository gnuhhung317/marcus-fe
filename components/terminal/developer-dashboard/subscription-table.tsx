import { DeveloperSubscriptionSummary } from '@/lib/contracts/types';
import { CopyButton } from './copy-button';

interface SubscriptionTableProps {
  subscriptions: DeveloperSubscriptionSummary[];
}

function maskToken(token: string) {
  if (token.length <= 8) {
    return token;
  }
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

export function SubscriptionTable({ subscriptions }: SubscriptionTableProps) {
  return (
    <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Subscriptions</h2>
        <p className="text-sm text-muted">{subscriptions.length} active</p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--panel-border)]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[var(--panel-border)] text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3">Bot</th>
              <th className="px-4 py-3">WS Token</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr
                key={`${sub.botId}-${sub.wsToken}`}
                className="group border-t border-[var(--panel-border)] hover:bg-[var(--panel-border)] transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 max-w-[150px]">
                    <span className="text-white font-mono text-xs truncate" title={sub.botId}>
                      {sub.botId}
                    </span>
                    <CopyButton value={sub.botId} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 max-w-[200px]">
                    <span className="text-muted font-mono text-xs truncate" title={sub.wsToken}>
                      {maskToken(sub.wsToken)}
                    </span>
                    <CopyButton value={sub.wsToken} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    sub.status === 'ACTIVE' || sub.status === 'CONNECTED'
                      ? 'bg-[var(--primary-soft)] text-emerald-300 border border-[var(--primary-soft)]'
                      : 'bg-[var(--panel-border)] text-slate-300 border border-[var(--panel-border)]'
                  }`}>
                    {sub.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
