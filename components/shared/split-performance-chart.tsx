'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, AreaSeries, Time } from 'lightweight-charts';
import { chartLayoutOptions, backtestAreaOptions, liveAreaOptions } from '@/lib/configs/chart-configs';
import { TrendingUp, Play, Calendar, ListFilter, ShieldAlert } from 'lucide-react';

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

  // Split datasets
  const backtestData = data.filter((point) => point.phase !== 'OUT_OF_SAMPLE');
  const liveData = data.filter((point) => point.phase === 'OUT_OF_SAMPLE');

  // Helper to calculate statistics
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
        .map(point => ({
          time: toChartTime(point.timestamp),
          value: point.value,
          rawTime: Date.parse(point.timestamp),
        }))
        .filter(point => !Number.isNaN(point.rawTime))
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

    // Render Backtest Chart
    if (backtestContainer && backtestData.length >= 2) {
      backtestChart = createChart(backtestContainer, {
        ...chartLayoutOptions,
        localization: {
          priceFormatter: (price: number) => `${price.toFixed(2)}%`,
        },
      });
      const series = backtestChart.addSeries(AreaSeries, backtestAreaOptions);
      series.setData(prepareSeriesData(backtestData));
      backtestChart.timeScale().fitContent();
    }

    // Render Live Chart
    if (liveContainer && liveData.length >= 2) {
      liveChart = createChart(liveContainer, {
        ...chartLayoutOptions,
        localization: {
          priceFormatter: (price: number) => `${price.toFixed(2)}%`,
        },
      });
      const series = liveChart.addSeries(AreaSeries, liveAreaOptions);
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
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
      {/* Backtest Panel */}
      <div className="border border-slate-800 bg-[#070b19]/40 backdrop-blur-md rounded-lg p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">Simulation Environment</span>
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mt-0.5">
                <ListFilter className="w-4 h-4 text-slate-400" /> Backtest Performance
              </h3>
            </div>
            {backtestStats && (
              <div className={`text-sm font-semibold px-2.5 py-1 rounded bg-[#0d162d] border border-slate-800 font-mono ${backtestStats.returnVal >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {backtestStats.returnVal >= 0 ? '+' : ''}{backtestStats.returnVal.toFixed(2)}%
              </div>
            )}
          </div>
          
          <div ref={backtestContainerRef} className="h-64 w-full" />
        </div>

        {backtestStats && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {backtestStats.diffDays} Days</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-slate-500" /> {backtestStats.pointsCount} Points</span>
            <span className="text-slate-500">Historical Backtest</span>
          </div>
        )}
      </div>

      {/* Live Panel */}
      <div className="border border-slate-800 bg-[#070b19]/40 backdrop-blur-md rounded-lg p-5 flex flex-col justify-between">
        {liveData.length >= 2 ? (
          <>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-emerald-500/70 font-medium">Out-of-sample Paper</span>
                  <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 mt-0.5">
                    <Play className="w-4 h-4" /> Live Performance
                  </h3>
                </div>
                {liveStats && (
                  <div className={`text-sm font-semibold px-2.5 py-1 rounded bg-[#0d2222] border border-emerald-950/50 font-mono ${liveStats.returnVal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {liveStats.returnVal >= 0 ? '+' : ''}{liveStats.returnVal.toFixed(2)}%
                  </div>
                )}
              </div>
              
              <div ref={liveContainerRef} className="h-64 w-full" />
            </div>

            {liveStats && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-500/80 font-mono">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {liveStats.diffDays} Days</span>
                <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> {liveStats.pointsCount} Points</span>
                <span className="text-emerald-400/60 uppercase text-[10px] tracking-wider font-semibold">Live Mode</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-4 py-8">
            <div className="w-12 h-12 rounded-full bg-slate-800/40 border border-slate-800 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-slate-500" />
            </div>
            <h4 className="text-sm font-semibold text-slate-300 mb-1">Live Trading Inactive</h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Paper trading has not started yet. Subscribe and deploy this bot to initialize out-of-sample performance tracking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
