import React from 'react';
import { cn } from '@/lib/utils';

interface TrendValueProps {
  value: number;
  type?: 'currency' | 'percent' | 'raw';
  showIcon?: boolean;
  className?: string;
  decimals?: number;
}

export function TrendValue({
  value,
  type = 'raw',
  showIcon = true,
  className,
  decimals,
}: TrendValueProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  const colorClass = isPositive
    ? 'text-positive'
    : isNegative
    ? 'text-negative'
    : 'text-muted';

  const formatValue = () => {
    const absVal = Math.abs(value);
    const resolvedDecimals = decimals !== undefined ? decimals : type === 'currency' ? 2 : type === 'percent' ? 2 : 2;

    const formatted = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: resolvedDecimals,
      minimumFractionDigits: resolvedDecimals,
    }).format(absVal);

    if (type === 'currency') return `$${formatted}`;
    if (type === 'percent') return `${formatted}%`;
    return formatted;
  };

  const getIcon = () => {
    if (!showIcon) return null;
    if (isPositive) return '↑';
    if (isNegative) return '↓';
    return '→';
  };

  const sign = isPositive ? '+' : isNegative ? '-' : '';

  return (
    <span className={cn("inline-flex items-center gap-1 font-mono font-semibold", colorClass, className)}>
      {showIcon && <span className="text-[10px]">{getIcon()}</span>}
      <span>{sign}{formatValue()}</span>
    </span>
  );
}
