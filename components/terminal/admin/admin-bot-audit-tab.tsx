'use client';

import type { AdminAuditEventRow } from '@/lib/contracts/types';
import { Card } from '@/components/ui/card';
import { EmptyStateCard } from '@/components/shared/api-state';

interface AdminBotAuditTabProps {
  auditEvents: AdminAuditEventRow[];
}

export function AdminBotAuditTab({ auditEvents }: AdminBotAuditTabProps) {
  if (!auditEvents.length) {
    return <EmptyStateCard title="No audit events found" message="There is no audit trail for this bot yet." />;
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-strong text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {auditEvents.map((event) => (
              <tr key={event.adminAuditEventId} className="hover:bg-surface/80">
                <td className="px-4 py-3 font-medium text-main">{event.action}</td>
                <td className="px-4 py-3 text-xs text-muted">
                  {event.targetType} - {event.targetId}
                </td>
                <td className="px-4 py-3 text-xs text-muted">{event.reason ?? 'No reason stored'}</td>
                <td className="px-4 py-3 text-xs text-muted">
                  {event.createdAt ? new Date(event.createdAt).toLocaleString() : 'Unknown'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
