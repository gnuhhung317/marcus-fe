'use client';

import React from 'react';
import { TimeSeriesValue, AllocationSlice } from '@/lib/contracts/types';
import { EquityChart } from '@/components/shared/equity-chart';
import { SvgDonut } from '@/components/shared/svg-donut';
import { Card } from '@/components/ui/card';
import { buildSemanticChartPalette } from '@/lib/configs/chart-theme';

interface EquityOverviewProps {
  performanceSeries: TimeSeriesValue[];
  allocations: AllocationSlice[];
}

export function EquityOverview({ performanceSeries, allocations }: EquityOverviewProps) {
  const palette = buildSemanticChartPalette();

  const donutData = allocations.map((slice, index) => ({
    label: slice.name,
    value: slice.value,
    color: palette[index % palette.length],
  }));

  const totalAllocated = allocations.reduce((acc, curr) => acc + curr.value, 0);

  const totalAllocatedStr = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalAllocated);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
      <Card variant="glass-strong" className="flex flex-col p-4 lg:col-span-6">
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
      </Card>

      <Card variant="glass-strong" className="flex flex-col p-4 lg:col-span-4">
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
      </Card>
    </div>
  );
}
