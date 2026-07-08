'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { createChart, LineSeries, LineStyle, Time } from 'lightweight-charts';
import {
  createChartLayoutOptions,
  createHistoricalLineOptions,
  createOutOfSampleLineOptions,
} from '@/lib/configs/chart-configs';

interface DataPoint {
  timestamp: string;
  value: number;
  phase?: 'HISTORICAL' | 'OUT_OF_SAMPLE';
}

interface PerformanceChartProps {
  data: DataPoint[];
  splitTimestamp?: string | null;
}

function toChartTime(timestamp: string): Time {
  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) {
    return timestamp.slice(0, 10) as Time;
  }
  return Math.floor(parsed / 1000) as Time;
}

export function PerformanceChart({ data, splitTimestamp }: PerformanceChartProps) {
  const t = useTranslations('TerminalBot.chart');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || data.length < 2) {
      return;
    }

    const chart = createChart(container, {
      ...createChartLayoutOptions(),
      localization: {
        priceFormatter: (price: number) => `${price.toFixed(2)}%`,
      },
    });

    const prepareSeriesData = (points: DataPoint[]) => {
      const formatted = points
        .map((point) => ({
          time: toChartTime(point.timestamp),
          value: point.value,
          rawTime: Date.parse(point.timestamp),
        }))
        .filter((point) => !Number.isNaN(point.rawTime))
        .sort((a, b) => a.rawTime - b.rawTime);

      const unique: { time: Time; value: number }[] = [];
      const seenTimes = new Set<number | string>();
      for (const item of formatted) {
        const timeVal = typeof item.time === 'number' ? item.time : String(item.time);
        if (!seenTimes.has(timeVal)) {
          seenTimes.add(timeVal);
          unique.push({
            time: item.time,
            value: item.value,
          });
        }
      }
      return unique;
    };

    const historical = prepareSeriesData(data.filter((point) => point.phase !== 'OUT_OF_SAMPLE'));
    const oosStartIndex = data.findIndex((point) => point.phase === 'OUT_OF_SAMPLE');
    const oosSource = oosStartIndex > 0 ? data.slice(oosStartIndex - 1) : data.filter((point) => point.phase === 'OUT_OF_SAMPLE');
    const outOfSample = prepareSeriesData(oosSource);

    const historicalSeries = chart.addSeries(LineSeries, createHistoricalLineOptions());
    historicalSeries.setData(historical);

    if (outOfSample.length > 1) {
      const oosSeries = chart.addSeries(LineSeries, createOutOfSampleLineOptions());
      oosSeries.setData(outOfSample);
    }

    if (splitTimestamp) {
      historicalSeries.createPriceLine({
        price: data[Math.max(0, oosStartIndex)]?.value ?? data[data.length - 1].value,
        color: 'transparent',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: false,
        title: t('outOfSampleStart'),
      });
    }

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [data, splitTimestamp]);

  if (!data || data.length < 2) {
    return (
      <div className="panel flex h-80 items-center justify-center text-sm text-muted">
        {t('insufficientData')}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={containerRef} className="h-80 w-full" />
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-5 rounded-full bg-border" />
          {t('historical')}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-5 rounded-full bg-positive" />
          {t('outOfSample')}
        </span>
        <span className="ml-auto">{t('normalizedReturnAxis')}</span>
      </div>
    </div>
  );
}
