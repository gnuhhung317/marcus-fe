'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, AreaSeries, Time } from 'lightweight-charts';
import {
  createBacktestAreaOptions,
  createChartLayoutOptions,
  createLiveAreaOptions,
} from '@/lib/configs/chart-configs';
import { TrendingUp, Play, Calendar, ListFilter, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface DataPoint {
  timestamp: string;
  value: number;
  phase?: 'HISTORICAL' | 'OUT_OF_SAMPLE';
}

interface SplitPerformanceChartProps {
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

export function SplitPerformanceChart({ data }: SplitPerformanceChartProps) {
  const backtestContainerRef = useRef<HTMLDivElement | null>(null);
  const liveContainerRef = useRef<HTMLDivElement | null>(null);

  const backtestData = data.filter((point) => point.phase !== 'OUT_OF_SAMPLE');
  const liveData = data.filter((point) => point.phase === 'OUT_OF_SAMPLE');

  const getStats = (points: DataPoint[]) => {
    if (points.length < 2) return null;
    const startVal = points[0].value;
    const endVal = points[points.length - 1].value;
    const returnVal = endVal - startVal;

    const start = new Date(points[0].timestamp);
    const end = new Date(points[points.length - 1].timestamp);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return {
      returnVal,
      diffDays,
      pointsCount: points.length,
    };
  };

  const backtestStats = getStats(backtestData);
  const liveStats = getStats(liveData);

  useEffect(() => {
    const backtestContainer = backtestContainerRef.current;
    const liveContainer = liveContainerRef.current;

    let backtestChart: ReturnType<typeof createChart> | null = null;
    let liveChart: ReturnType<typeof createChart> | null = null;

    const prepareSeriesData = (points: DataPoint[]) => {
      const formatted = points
        .map((point) => ({
          time: toChartTime(point.timestamp),
          value: point.value,
          rawTime: Date.parse(point.timestamp),
        }))
        .filter((point) => !Number.isNaN(point.rawTime))
        .sort((a, b) => (a.rawTime as number) - (b.rawTime as number));

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

    if (backtestContainer && backtestData.length >= 2) {
      backtestChart = createChart(backtestContainer, {
        ...createChartLayoutOptions(),
        localization: {
          priceFormatter: (price: number) => `${price.toFixed(2)}%`,
        },
      });
      const series = backtestChart.addSeries(AreaSeries, createBacktestAreaOptions());
      series.setData(prepareSeriesData(backtestData));
      backtestChart.timeScale().fitContent();
    }

    if (liveContainer && liveData.length >= 2) {
      liveChart = createChart(liveContainer, {
        ...createChartLayoutOptions(),
        localization: {
          priceFormatter: (price: number) => `${price.toFixed(2)}%`,
        },
      });
      const series = liveChart.addSeries(AreaSeries, createLiveAreaOptions());
      series.setData(prepareSeriesData(liveData));
      liveChart.timeScale().fitContent();
    }

    const handleResize = () => {
      if (backtestChart && backtestContainer) {
        backtestChart.applyOptions({ width: backtestContainer.clientWidth });
      }
      if (liveChart && liveContainer) {
        liveChart.applyOptions({ width: liveContainer.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (backtestChart) backtestChart.remove();
      if (liveChart) liveChart.remove();
    };
  }, [backtestData, liveData]);

  if (!data || data.length < 2) {
    return (
      <div className="panel flex h-80 items-center justify-center text-sm text-muted">
        Insufficient performance data available
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-2">
      <Card variant="glass-strong" className="flex flex-col justify-between p-5">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-widest text-muted">Simulation Environment</span>
              <h3 className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-main">
                <ListFilter className="h-4 w-4 text-muted" /> Backtest Performance
              </h3>
            </div>
            {backtestStats && (
              <Badge variant={backtestStats.returnVal >= 0 ? 'success' : 'error'} className="font-mono text-sm">
                {backtestStats.returnVal >= 0 ? '+' : ''}
                {backtestStats.returnVal.toFixed(2)}%
              </Badge>
            )}
          </div>

          <div ref={backtestContainerRef} className="h-64 w-full" />
        </div>

        {backtestStats && (
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs font-mono text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {backtestStats.diffDays} Days
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> {backtestStats.pointsCount} Points
            </span>
            <span className="text-muted">Historical Backtest</span>
          </div>
        )}
      </Card>

      <Card variant="glass-strong" className="flex flex-col justify-between p-5">
        {liveData.length >= 2 ? (
          <>
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-medium uppercase tracking-widest text-positive">Out-of-sample Paper</span>
                  <h3 className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-positive">
                    <Play className="h-4 w-4" /> Live Performance
                  </h3>
                </div>
                {liveStats && (
                  <Badge variant={liveStats.returnVal >= 0 ? 'success' : 'error'} className="font-mono text-sm">
                    {liveStats.returnVal >= 0 ? '+' : ''}
                    {liveStats.returnVal.toFixed(2)}%
                  </Badge>
                )}
              </div>

              <div ref={liveContainerRef} className="h-64 w-full" />
            </div>

            {liveStats && (
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs font-mono text-positive">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> {liveStats.diffDays} Days
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" /> {liveStats.pointsCount} Points
                </span>
                <span className="text-positive">Live Mode</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center px-4 py-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-strong">
              <ShieldAlert className="h-6 w-6 text-muted" />
            </div>
            <h4 className="mb-1 text-sm font-semibold text-main">Live Trading Inactive</h4>
            <p className="max-w-xs text-xs leading-relaxed text-muted">
              Paper trading has not started yet. Subscribe and deploy this bot to initialize out-of-sample performance tracking.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
