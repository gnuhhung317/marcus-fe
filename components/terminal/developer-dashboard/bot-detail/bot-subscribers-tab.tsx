import { DeveloperSubscriptionSummary } from '@/lib/contracts/types';
import { cn } from '@/lib/utils';

interface BotSubscribersTabProps {
  subscriptions: DeveloperSubscriptionSummary[];
  isSwitching?: boolean;
}

export function BotSubscribersTab({ subscriptions, isSwitching }: BotSubscribersTabProps) {
  const subscriberCount = subscriptions.length;
  const connectedCount = subscriptions.filter((sub) => sub.status === 'CONNECTED').length;
  const activeCount = subscriptions.filter((sub) => sub.status === 'ACTIVE').length;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Active Subscribers</h2>
          <p className="mt-1 text-xs text-slate-400 font-sans">Active subscriptions and connection health.</p>
        </div>
        <span className="rounded-lg border border-border bg-surface px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          {subscriberCount} Sessions
        </span>
      </div>

      {isSwitching ? (
        <div className="space-y-3">
          <div className="h-20 animate-pulse rounded-xl bg-surface" />
          <div className="h-12 animate-pulse rounded-xl bg-surface" />
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center text-xs text-slate-400 font-sans">        
          No active subscriber sessions found.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Subscribers', value: subscriberCount },
              { label: 'Connected', value: connectedCount },
              { label: 'Active', value: activeCount },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-surface p-3 font-mono">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">{item.label}</p>
                <p className="mt-2 text-lg font-bold text-white tracking-tight">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-surface font-mono">
            <table className="min-w-full border-collapse text-left text-[11px] leading-relaxed">
              <thead className="border-b border-border bg-surface-strong uppercase text-[9px] font-bold tracking-wider text-slate-500 font-sans">
                <tr>
                  <th className="px-4 py-3">Subscriber</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {subscriptions.map((sub, index) => {
                  const isActive = sub.status === 'ACTIVE' || sub.status === 'CONNECTED';
                  return (
                    <tr key={`${sub.botId}-${index}`} className="text-slate-300">
                      <td className="px-4 py-3 font-medium font-sans">
                        Subscriber #{index + 1}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                          isActive 
                            ? 'border-positive/20 bg-positive/10 text-positive' 
                            : 'border-border bg-surface text-slate-400'
                        }`}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", isActive ? 'bg-positive' : 'bg-slate-400')} />
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
