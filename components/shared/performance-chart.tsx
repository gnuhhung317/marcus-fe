'use client';

import React, { useEffect, useRef } from 'react';
import { ColorType, createChart, LineSeries, LineStyle, Time } from 'lightweight-charts';

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
  return new Date(parsed).toISOString().slice(0, 10) as Time;
}

export function PerformanceChart({ data, splitTimestamp }: PerformanceChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || data.length < 2) {
      return;
    }

    const chart = createChart(container, {
      autoSize: true,
      height: 320,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: 'rgba(148,163,184,0.12)' },
        horzLines: { color: 'rgba(148,163,184,0.12)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(148,163,184,0.18)',
      },
      timeScale: {
        borderColor: 'rgba(148,163,184,0.18)',
        timeVisible: true,
      },
      localization: {
        priceFormatter: (price: number) => `${price.toFixed(2)}%`,
      },
      crosshair: {
        vertLine: { color: 'rgba(16,185,129,0.45)' },
        horzLine: { color: 'rgba(16,185,129,0.35)' },
      },
    });

    const historical = data
      .filter((point) => point.phase !== 'OUT_OF_SAMPLE')
      .map((point) => ({ time: toChartTime(point.timestamp), value: point.value }));
    const oosStartIndex = data.findIndex((point) => point.phase === 'OUT_OF_SAMPLE');
    const oosSource = oosStartIndex > 0 ? data.slice(oosStartIndex - 1) : data.filter((point) => point.phase === 'OUT_OF_SAMPLE');
    const outOfSample = oosSource.map((point) => ({ time: toChartTime(point.timestamp), value: point.value }));

    const historicalSeries = chart.addSeries(LineSeries, {
      color: '#94a3b8',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    historicalSeries.setData(historical);

    if (outOfSample.length > 1) {
      const oosSeries = chart.addSeries(LineSeries, {
        color: '#10b981',
        lineWidth: 3,
        priceLineVisible: false,
      });
      oosSeries.setData(outOfSample);
    }

    if (splitTimestamp) {
      historicalSeries.createPriceLine({
        price: data[Math.max(0, oosStartIndex)]?.value ?? data[data.length - 1].value,
        color: 'rgba(16,185,129,0)',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: false,
        title: 'Out-of-sample start',
      });
    }

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [data, splitTimestamp]);

  if (!data || data.length < 2) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg border border-[rgba(132,162,191,0.18)] bg-white/5 text-sm text-muted">
        Insufficient data for performance chart
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={containerRef} className="h-80 w-full" />
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-2"><span className="h-2 w-5 bg-slate-400" /> Historical</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-5 bg-emerald-500" /> Out-of-sample</span>
        <span className="ml-auto">Y-axis: normalized return (%)</span>
      </div>
    </div>
  );
}
