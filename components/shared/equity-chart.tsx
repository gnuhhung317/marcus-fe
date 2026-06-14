'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, LineSeries, Time, AreaSeries } from 'lightweight-charts';
import { equityChartLayoutOptions, equityLineOptions } from '@/lib/configs/equity-chart.config';

interface EquityPoint {
  timestamp: string;
  value: number;
}

interface EquityChartProps {
  data: EquityPoint[];
  height?: number;
}

function toChartTime(timestamp: string): Time {
  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) {
    return timestamp.slice(0, 10) as Time;
  }
  return Math.floor(parsed / 1000) as Time;
}

export function EquityChart({ data, height = 300 }: EquityChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || data.length < 2) return;

    const chart = createChart(container, {
      ...equityChartLayoutOptions,
      height,
      localization: {
        priceFormatter: (price: number) => {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(price);
        },
      },
    });

    const formattedData = data
      .map(point => ({
        time: toChartTime(point.timestamp),
        value: point.value,
        rawTime: Date.parse(point.timestamp),
      }))
      .filter(point => !Number.isNaN(point.rawTime))
      .sort((a, b) => a.rawTime - b.rawTime);

    const uniqueData: { time: Time; value: number }[] = [];
    const seenTimes = new Set<number | string>();
    for (const item of formattedData) {
      const timeVal = typeof item.time === 'number' ? item.time : String(item.time);
      if (!seenTimes.has(timeVal)) {
        seenTimes.add(timeVal);
        uniqueData.push({
          time: item.time,
          value: item.value,
        });
      }
    }

    // Area series for professional trading appearance
    const areaSeries = chart.addSeries(AreaSeries, {
      topColor: 'rgba(16, 185, 129, 0.2)',
      bottomColor: 'rgba(16, 185, 129, 0.0)',
      lineColor: '#10b981',
      lineWidth: 2,
      priceLineVisible: false,
    });

    areaSeries.setData(uniqueData);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (container) {
        chart.applyOptions({ width: container.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, height]);

  if (!data || data.length < 2) {
    return (
      <div className="panel flex h-80 items-center justify-center text-sm text-muted">
        Insufficient data for equity chart
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full" style={{ height }} />
    </div>
  );
}
