import React from 'react';
import { cn } from '@/lib/utils';

interface RiskBarProps {
  value: number; // percentage (0 to 100) or absolute risk score
  max?: number; // max value to normalize (default 100)
  warningThreshold?: number;
  dangerThreshold?: number;
  className?: string;
  showText?: boolean;
}

export function RiskBar({
  value,
  max = 100,
  warningThreshold = 40,
  dangerThreshold = 70,
  className,
  showText = false,
}: RiskBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getBarColor = () => {
    if (percentage >= dangerThreshold) return 'bg-negative';
    if (percentage >= warningThreshold) return 'bg-warning';
    return 'bg-positive';
  };

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <div className="relative h-2 w-full overflow-hidden rounded-sm bg-surface-strong">
        <div
          className={cn('h-full rounded-sm transition-all duration-500', getBarColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-muted">
          <span>Risk Level</span>
          <span className="font-semibold text-main">{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}
