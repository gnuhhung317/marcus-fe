import React from 'react';
import { cn } from '@/lib/utils';

type DotStatus = 'live' | 'active' | 'warning' | 'critical' | 'danger' | 'offline' | 'inactive';

interface StatusDotProps {
  status: DotStatus;
  pulse?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusColors: Record<DotStatus, string> = {
  live: 'bg-positive',
  active: 'bg-positive',
  warning: 'bg-warning',
  critical: 'bg-negative',
  danger: 'bg-negative',
  offline: 'bg-muted',
  inactive: 'bg-muted',
};

const dotSizes = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-3 w-3',
};

export function StatusDot({
  status,
  pulse = true,
  className,
  size = 'md',
}: StatusDotProps) {
  const colorClass = statusColors[status] || 'bg-muted';
  const sizeClass = dotSizes[size];
  const shouldPulse = pulse && (status !== 'offline' && status !== 'inactive');

  return (
    <span className={cn("relative flex", sizeClass, className)}>
      {shouldPulse && (
        <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", colorClass)} />
      )}
      <span className={cn("relative inline-flex rounded-full", sizeClass, colorClass)} />
    </span>
  );
}
