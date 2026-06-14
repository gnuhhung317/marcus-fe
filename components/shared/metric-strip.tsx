import React from 'react';
import { cn } from '@/lib/utils';

interface MetricItem {
  label: string;
  value: React.ReactNode;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  delta?: string;
}

interface MetricStripProps {
  items: MetricItem[];
  className?: string;
}

const trendColors = {
  up: 'text-positive bg-positive-soft',
  down: 'text-negative bg-negative-soft',
  neutral: 'text-muted bg-border-base',
};

const trendSymbols = {
  up: '↑',
  down: '↓',
  neutral: '→',
};

export function MetricStrip({ items, className }: MetricStripProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="panel flex flex-col justify-between p-4 min-h-[110px]"
        >
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              {item.label}
            </p>
            <p className="font-mono text-2xl font-semibold tracking-tight text-white">
              {item.value}
            </p>
          </div>
          {(item.subtext || item.delta) && (
            <div className="mt-3 flex items-center gap-2 text-xs">
              {item.delta && item.trend && (
                <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase", trendColors[item.trend])}>
                  {trendSymbols[item.trend]} {item.delta}
                </span>
              )}
              {item.subtext && (
                <span className="text-[11px] text-muted/60 uppercase tracking-wider">
                  {item.subtext}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
