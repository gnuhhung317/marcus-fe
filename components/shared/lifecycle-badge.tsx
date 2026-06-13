import { Badge } from "@/components/ui/badge";

interface LifecycleBadgeProps {
  status: string;
  mode?: 'PAPER' | 'LIVE';
}

function getStatusVariant(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === 'RUNNING' || normalized === 'ACTIVE' || normalized === 'SUBSCRIBED' || normalized === 'SUCCESS') {
    return 'success';
  }

  if (normalized === 'PAUSED' || normalized === 'PENDING' || normalized === 'QUEUED') {
    return 'warning';
  }

  if (normalized === 'FAILED' || normalized === 'REJECTED' || normalized === 'ERROR' || normalized === 'STOPPED') {        
    return 'error';
  }

  return 'default';
}

export function LifecycleBadge({ status, mode }: LifecycleBadgeProps) {
  return (
    <Badge variant={getStatusVariant(status)}>
      {mode ? `${mode} · ` : ''}
      {status}
    </Badge>
  );
}
