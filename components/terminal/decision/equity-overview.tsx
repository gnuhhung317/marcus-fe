'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Decision.equityOverview');
  const palette = useMemo(() => buildSemanticChartPalette(), []);

  const donutData = useMemo(
    () =>
      allocations.map((slice, index) => ({
        label: slice.name,
        value: slice.percent,
        color: palette[index % palette.length],
      })),
    [allocations, palette]
  );

  const totalAllocated = useMemo(() => allocations.reduce((acc, curr) => acc + curr.percent, 0), [allocations]);
  const centerAllocated = Math.min(100, Math.max(0, totalAllocated));

  const totalAllocatedStr = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(centerAllocated / 100);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
      <Card variant="glass-strong" className="flex flex-col p-4 lg:col-span-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {t('equityCurve')}
          </h3>
          <span className="font-mono text-xs text-muted">
            {t('points', { count: performanceSeries.length })}
          </span>
        </div>
        <div className="flex-1">
          <EquityChart data={performanceSeries} height={260} timeframe="7D" />
        </div>
      </Card>

      <Card variant="glass-strong" className="flex flex-col p-4 lg:col-span-4">
        <div className="mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {t('allocationTitle')}
          </h3>
        </div>
        <div className="flex flex-1 items-center justify-center py-2">
          {donutData.length > 0 ? (
            <SvgDonut
              data={donutData}
              centerLabel={t('allocated')}
              centerValue={totalAllocatedStr}
              className="w-full flex-col items-center gap-6 sm:flex-row lg:flex-col lg:gap-4 xl:flex-row xl:gap-6"
            />
          ) : (
            <div className="text-sm text-muted">{t('empty')}</div>
          )}
        </div>
      </Card>
    </div>
  );
}
