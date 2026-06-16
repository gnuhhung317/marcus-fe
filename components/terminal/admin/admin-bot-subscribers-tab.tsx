'use client';

import type { AdminBotSubscriberRow } from '@/lib/contracts/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyStateCard } from '@/components/shared/api-state';

interface AdminBotSubscribersTabProps {
  subscribers: AdminBotSubscriberRow[];
  onForceCancel: (subscriber: AdminBotSubscriberRow) => void;
}

function subscriberStatusVariant(status: string) {
  if (status === 'ACTIVE') return 'success';
  if (status === 'CANCELED') return 'error';
  return 'outline';
}

function executorVariant(connected: boolean) {
  return connected ? 'success' : 'warning';
}

export function AdminBotSubscribersTab({ subscribers, onForceCancel }: AdminBotSubscribersTabProps) {
  if (!subscribers.length) {
    return <EmptyStateCard title="No subscribers found" message="This bot has no linked executor sessions." />;
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-strong text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">Subscriber</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Executor</th>
              <th className="px-4 py-3">Lifecycle</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.userSubscriptionId} className="hover:bg-surface/80">
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <p className="text-sm text-main">{subscriber.username ?? subscriber.userId}</p>
                    <p className="text-[11px] font-mono text-muted">{subscriber.userId}</p>
                    <p className="text-[11px] text-muted">{subscriber.email ?? 'No email'}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={subscriberStatusVariant(subscriber.status)}>{subscriber.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={executorVariant(subscriber.executorConnected)}>
                    {subscriber.executorConnected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {subscriber.cancellationReason
                    ? subscriber.cancellationReason
                    : subscriber.startDate
                      ? new Date(subscriber.startDate).toLocaleString()
                      : 'Unknown'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Button
                      variant={subscriber.status === 'ACTIVE' ? 'destructive' : 'outline'}
                      size="sm"
                      disabled={subscriber.status !== 'ACTIVE'}
                      onClick={() => onForceCancel(subscriber)}
                    >
                      Force cancel
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
