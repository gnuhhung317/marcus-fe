'use client';

import React, { useEffect, useRef } from 'react';
import { AreaSeries, Time, createChart } from 'lightweight-charts';
import { Calendar, ListFilter, Play, ShieldAlert, TrendingUp } from 'lucide-react';
import {
  createBacktestAreaOptions,
  createChartLayoutOptions,
  createLiveAreaOptions,
} from '@/lib/configs/chart-configs';
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

type ChartMode = 'backtest' | 'live';

function toChartTime(timestamp: string): Time {
  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) {
    return timestamp.slice(0, 10) as Time;
  }
  return Math.floor(parsed / 1000) as Time;
}

function prepareSeriesData(points: DataPoint[]) {
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
      unique.push({ time: item.time, value: item.value });
    }
  }
  return unique;
}

function getStats(points: DataPoint[]) {
  if (points.length < 2) return null;
  const startVal = points[0].value;
  const endVal = points[points.length - 1].value;
  const returnVal = endVal - startVal;
  const diffTime = Math.abs(new Date(points[points.length - 1].timestamp).getTime() - new Date(points[0].timestamp).getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  return { returnVal, diffDays, pointsCount: points.length };
}

function ChartCard({ mode, data }: { mode: ChartMode; data: DataPoint[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stats = getStats(data);
  const isLive = mode === 'live';
  const title = isLive ? 'Live Performance' : 'Backtest Performance';
  const eyebrow = isLive ? 'Out-of-sample paper' : 'Simulation Environment';
  const titleTone = isLive ? 'text-positive' : 'text-main';
  const eyebrowTone = isLive ? 'text-positive' : 'text-muted';

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

    const series = chart.addSeries(AreaSeries, isLive ? createLiveAreaOptions() : createBacktestAreaOptions());
    series.setData(prepareSeriesData(data));
    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, isLive]);

  if (!stats) {
    return (
      <Card variant="glass-strong" className="flex min-h-[320px] flex-col justify-center p-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-strong">
            <ShieldAlert className="h-6 w-6 text-muted" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-main">{isLive ? 'Live Trading Inactive' : 'Backtest Data Inactive'}</h4>
            <p className="max-w-xs text-xs leading-relaxed text-muted">
              {isLive
                ? 'Paper trading has not started yet. Subscribe and deploy this bot to initialize out-of-sample performance tracking.'
                : 'Historical performance has not populated yet. Wait for backtest data to render the simulation track.'}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="glass-strong" className="flex flex-col justify-between p-5">
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className={`text-xs font-medium uppercase tracking-widest ${eyebrowTone}`}>{eyebrow}</span>
            <h3 className={`mt-0.5 flex items-center gap-2 text-sm font-semibold ${titleTone}`}>
              {isLive ? <Play className="h-4 w-4" /> : <ListFilter className="h-4 w-4" />}
              {title}
            </h3>
          </div>
          <Badge variant={stats.returnVal >= 0 ? 'success' : 'error'} className="font-mono text-sm">
            {stats.returnVal >= 0 ? '+' : ''}
            {stats.returnVal.toFixed(2)}%
          </Badge>
        </div>

        <div ref={containerRef} className="h-64 w-full" />
      </div>

      <div className={`mt-4 flex items-center justify-between border-t border-border pt-3 text-xs font-mono ${isLive ? 'text-positive' : 'text-muted'}`}>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> {stats.diffDays} Days
        </span>
        <span className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5" /> {stats.pointsCount} Points
        </span>
        <span>{isLive ? 'Live Mode' : 'Historical Backtest'}</span>
      </div>
    </Card>
  );
}

export function SplitPerformanceChart({ data }: SplitPerformanceChartProps) {
  const backtestData = data.filter((point) => point.phase !== 'OUT_OF_SAMPLE');
  const liveData = data.filter((point) => point.phase === 'OUT_OF_SAMPLE');

  const hasBacktestChart = backtestData.length >= 2;
  const hasLiveChart = liveData.length >= 2;

  if (!hasBacktestChart && !hasLiveChart) {
    return (
      <div className="panel flex h-80 items-center justify-center text-sm text-muted">
        Insufficient performance data available
      </div>
    );
  }

  return (
    <div className={`grid w-full grid-cols-1 gap-6 ${hasBacktestChart && hasLiveChart ? 'xl:grid-cols-2' : ''}`}>
      {hasBacktestChart ? <ChartCard mode="backtest" data={backtestData} /> : null}
      {hasLiveChart ? <ChartCard mode="live" data={liveData} /> : null}
    </div>
  );
}
