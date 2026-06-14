'use client';

import React from 'react';
import { TimeSeriesValue, AllocationSlice } from '@/lib/contracts/types';
import { EquityChart } from '@/components/shared/equity-chart';
import { SvgDonut } from '@/components/shared/svg-donut';

interface EquityOverviewProps {
  performanceSeries: TimeSeriesValue[];
  allocations: AllocationSlice[];
}

const PRESET_COLORS = [
  '#10b981', // Emerald / Green
  '#3b82f6', // Blue
  '#f59e0b', // Amber / Orange
  '#8b5cf6', // Violet / Purple
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#14b8a6', // Teal
];

export function EquityOverview({ performanceSeries, allocations }: EquityOverviewProps) {
  // Map allocations to DonutSegment structure
  const donutData = allocations.map((slice, index) => ({
    label: slice.name,
    value: slice.value,
    color: PRESET_COLORS[index % PRESET_COLORS.length],
  }));

  // Calculate total allocated
  const totalAllocated = allocations.reduce((acc, curr) => acc + curr.value, 0);

  // Format total allocated to $ USD
  const totalAllocatedStr = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalAllocated);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
      {/* Equity Chart - 60% (6 cols on lg) */}
      <div className="flex flex-col rounded border border-white/5 bg-[#0b0e14] p-4 lg:col-span-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Equity Curve (Out-of-Sample / Live)
          </h3>
          <span className="font-mono text-xs text-muted">
            {performanceSeries.length} points
          </span>
        </div>
        <div className="flex-1">
          <EquityChart data={performanceSeries} height={260} />
        </div>
      </div>

      {/* Allocation Donut - 40% (4 cols on lg) */}
      <div className="flex flex-col rounded border border-white/5 bg-[#0b0e14] p-4 lg:col-span-4">
        <div className="mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Capital Allocation By Asset
          </h3>
        </div>
        <div className="flex flex-1 items-center justify-center py-2">
          {donutData.length > 0 ? (
            <SvgDonut
              data={donutData}
              centerLabel="Allocated"
              centerValue={totalAllocatedStr}
              className="w-full flex-col items-center gap-6 sm:flex-row lg:flex-col lg:gap-4 xl:flex-row xl:gap-6"
            />
          ) : (
            <div className="text-sm text-muted">No allocation data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
