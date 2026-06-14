import React from 'react';
import { cn } from '@/lib/utils';

interface DonutSegment {
  label: string;
  value: number; // percentage or absolute value
  color: string;
}

interface SvgDonutProps {
  data: DonutSegment[];
  className?: string;
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function SvgDonut({
  data,
  className,
  size = 160,
  thickness = 8,
  centerLabel,
  centerValue,
}: SvgDonutProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  
  let accumulatedPercent = 0;

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="-rotate-90 transform"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="hsl(var(--border-line) / 0.35)"
            strokeWidth={thickness}
          />
          {/* Segments */}
          {data.map((seg, idx) => {
            const percentage = (seg.value / total) * 100;
            const strokeLength = (percentage / 100) * circumference;
            const strokeOffset = circumference - (accumulatedPercent / 100) * circumference;
            accumulatedPercent += percentage;

            return (
              <circle
                key={`${seg.label}-${idx}`}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={thickness}
                strokeDasharray={`${strokeLength} ${circumference}`}
                strokeDashoffset={strokeOffset}
                strokeLinecap={percentage > 0 ? "round" : "butt"}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Center labels */}
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {centerValue && (
              <span className="font-mono text-lg font-bold leading-none tracking-tight text-main">
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.16em] text-muted/65">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-2">
        {data.map((seg, idx) => {
          const percentage = (seg.value / total) * 100;
          return (
            <div key={`${seg.label}-legend-${idx}`} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
                <span className="font-medium text-muted">{seg.label}</span>
              </div>
              <span className="font-mono font-semibold text-main">
                {percentage.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
