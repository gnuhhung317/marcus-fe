import { DeveloperSubscriptionSummary } from '@/lib/contracts/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

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
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-main">Subscribers</h2>
          <p className="mt-1 text-sm text-muted">Active subscriptions and connection health.</p>
        </div>
        <Badge variant="outline">{subscriberCount}</Badge>
      </div>

      {isSwitching ? (
        <div className="space-y-3">
          <div className="h-20 animate-pulse rounded-xl bg-surface" />
          <div className="h-12 animate-pulse rounded-xl bg-surface" />
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted">        
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
              <Card key={item.label} variant="glass-strong" className="p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-main">{item.value}</p>
              </Card>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-surface text-xs uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-4 py-3">Subscriber</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub, index) => (
                  <tr key={`${sub.botId}-${index}`} className="border-t border-border text-muted">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm">Subscriber #{index + 1}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant={sub.status === 'ACTIVE' || sub.status === 'CONNECTED' ? 'success' : 'default'} className="gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", sub.status === 'ACTIVE' || sub.status === 'CONNECTED' ? 'bg-positive' : 'bg-muted')} />
                        {sub.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

// Fixed import for cn in local context if needed, but it should be from @/lib/utils
import { cn } from '@/lib/utils';
