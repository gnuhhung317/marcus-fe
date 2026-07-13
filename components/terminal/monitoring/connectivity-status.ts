import type { BadgeProps } from '@/components/ui/badge';

export type ConnectivityStatus = 'UP' | 'DEGRADED' | 'DOWN' | 'UNKNOWN';

export interface ConnectivityStatusLabels {
  checking: string;
  up: string;
  degraded: string;
  down: string;
  unavailable: string;
}

export function normalizeConnectivityStatus(status?: string | null): ConnectivityStatus {
  const normalized = status?.trim().toUpperCase();

  if (normalized === 'UP' || normalized === 'OK' || normalized === 'HEALTHY') {
    return 'UP';
  }

  if (normalized === 'DEGRADED' || normalized === 'WARN' || normalized === 'WARNING') {
    return 'DEGRADED';
  }

  if (normalized === 'DOWN' || normalized === 'ERROR' || normalized === 'FAILED' || normalized === 'OFFLINE') {
    return 'DOWN';
  }

  return 'UNKNOWN';
}

export function getConnectivityBadgeVariant(
  status: ConnectivityStatus,
  isChecking = false,
): BadgeProps['variant'] {
  if (isChecking) {
    return 'info';
  }

  if (status === 'UP') {
    return 'success';
  }

  if (status === 'DOWN') {
    return 'error';
  }

  return 'warning';
}

export function getConnectivityStatusLabel(
  status: ConnectivityStatus,
  labels: ConnectivityStatusLabels,
  isChecking = false,
) {
  if (isChecking) {
    return labels.checking;
  }

  switch (status) {
    case 'UP':
      return labels.up;
    case 'DEGRADED':
      return labels.degraded;
    case 'DOWN':
      return labels.down;
    case 'UNKNOWN':
      return labels.unavailable;
  }
}
