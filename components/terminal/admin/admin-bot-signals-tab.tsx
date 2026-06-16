'use client';

import type { DeveloperSignalItem } from '@/lib/contracts/types/developer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyStateCard } from '@/components/shared/api-state';

interface AdminBotSignalsTabProps {
  signals: DeveloperSignalItem[];
}

function signalBadgeVariant(status?: string | null) {
  if (status === 'FAILED') return 'error';
  if (status === 'DELIVERED' || status === 'SUCCESS') return 'success';
  return 'outline';
}

export function AdminBotSignalsTab({ signals }: AdminBotSignalsTabProps) {
  if (!signals.length) {
    return <EmptyStateCard title="No signals found" message="This bot has not emitted any signals yet." />;
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-strong text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">Signal</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Symbol</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {signals.map((signal) => (
              <tr key={signal.signalId} className="hover:bg-surface/80">
                <td className="px-4 py-3 font-mono text-xs text-main">{signal.signalId}</td>
                <td className="px-4 py-3 text-main">{signal.action ?? 'Unknown'}</td>
                <td className="px-4 py-3 text-main">{signal.symbol ?? 'Unknown'}</td>
                <td className="px-4 py-3">
                  <Badge variant={signalBadgeVariant(signal.status)}>{signal.status ?? 'UNKNOWN'}</Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {signal.generatedTimestamp ? new Date(signal.generatedTimestamp).toLocaleString() : 'Unknown'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
