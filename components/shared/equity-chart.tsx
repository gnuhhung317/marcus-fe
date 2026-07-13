'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  AreaSeries,
  LineSeries,
  Time,
  createChart,
  isBusinessDay,
  type AutoscaleInfoProvider,
  type IChartApi,
  type ISeriesApi,
} from 'lightweight-charts';
import {
  createEquityAreaOptions,
  createEquityChartLayoutOptions,
  createEquityLineOptions,
  type EquityChartTimeframe,
} from '@/lib/configs/equity-chart.config';

interface EquityPoint {
  timestamp: string;
  value: number;
}

interface EquityChartProps {
  data: EquityPoint[];
  height?: number;
  timeframe?: EquityChartTimeframe;
}

const TARGET_POINTS_BY_TIMEFRAME: Record<EquityChartTimeframe, number> = {
  '1D': 24,
  '7D': 42,
  '30D': 30,
  ALL: 52,
};

function toChartTime(timestamp: string): Time {
  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) {
    return timestamp.slice(0, 10) as Time;
  }
  return Math.floor(parsed / 1000) as Time;
}

function toDedupedPoints(data: EquityPoint[]) {
  const formattedData = data
    .map((point) => ({
      time: toChartTime(point.timestamp),
      value: point.value,
      rawTime: Date.parse(point.timestamp),
    }))
    .filter((point) => !Number.isNaN(point.rawTime))
    .sort((a, b) => a.rawTime - b.rawTime);

  const uniqueData: { time: Time; value: number; rawTime: number }[] = [];
  for (const item of formattedData) {
    const previous = uniqueData[uniqueData.length - 1];
    const previousTime = previous ? (typeof previous.time === 'number' ? previous.time : String(previous.time)) : null;
    const currentTime = typeof item.time === 'number' ? item.time : String(item.time);

    if (previous && previousTime === currentTime) {
      uniqueData[uniqueData.length - 1] = {
        time: item.time,
        value: item.value,
        rawTime: item.rawTime,
      };
      continue;
    }

    uniqueData.push({
      time: item.time,
      value: item.value,
      rawTime: item.rawTime,
    });
  }

  return uniqueData;
}

function downsamplePoints(
  points: { time: Time; value: number; rawTime: number }[],
  timeframe: EquityChartTimeframe
) {
  if (points.length < 3) {
    return points;
  }

  const targetPoints = TARGET_POINTS_BY_TIMEFRAME[timeframe];
  if (points.length <= targetPoints) {
    return points;
  }

  const startTime = points[0].rawTime;
  const endTime = points[points.length - 1].rawTime;
  const timeSpan = Math.max(endTime - startTime, 1);
  const bucketCountTarget = Math.max(2, Math.floor(targetPoints / 4));
  const bucketSize = Math.max(Math.ceil(timeSpan / (bucketCountTarget - 1)), 1);
  const bucketed = new Map<number, { time: Time; value: number; rawTime: number }[]>();

  for (const point of points) {
    const bucketKey = Math.floor((point.rawTime - startTime) / bucketSize);
    const bucket = bucketed.get(bucketKey);
    if (bucket) {
      bucket.push(point);
    } else {
      bucketed.set(bucketKey, [point]);
    }
  }

  const resampled = Array.from(bucketed.values())
    .flatMap((bucket) => {
      const firstPoint = bucket[0];
      const lastPoint = bucket[bucket.length - 1];
      let minPoint = firstPoint;
      let maxPoint = firstPoint;

      for (const point of bucket) {
        if (point.value < minPoint.value) {
          minPoint = point;
        }

        if (point.value > maxPoint.value) {
          maxPoint = point;
        }
      }

      return [firstPoint, minPoint, maxPoint, lastPoint]
        .sort((a, b) => a.rawTime - b.rawTime)
        .filter((point, index, source) => index === 0 || point.rawTime !== source[index - 1].rawTime);
    })
    .sort((a, b) => a.rawTime - b.rawTime);
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  if (resampled[0]?.rawTime !== firstPoint.rawTime) {
    resampled.unshift(firstPoint);
  }

  if (resampled[resampled.length - 1]?.rawTime !== lastPoint.rawTime) {
    resampled.push(lastPoint);
  }

  return resampled.filter((point, index, source) => index === 0 || point.rawTime !== source[index - 1].rawTime);
}

function prepareChartData(data: EquityPoint[], timeframe: EquityChartTimeframe) {
  return downsamplePoints(toDedupedPoints(data), timeframe).map(({ time, value }) => ({
    time,
    value,
  }));
}

function getSeriesStats(data: { time: Time; value: number }[]) {
  if (data.length === 0) {
    return {
      isFlat: true,
      useLineSeries: true,
      padding: 0.05,
    };
  }

  let minValue = Number.POSITIVE_INFINITY;
  let maxValue = Number.NEGATIVE_INFINITY;
  for (const point of data) {
    minValue = Math.min(minValue, point.value);
    maxValue = Math.max(maxValue, point.value);
  }

  const range = maxValue - minValue;
  const flatThreshold = Math.max(Math.abs(maxValue), 1) * 0.001;
  const isFlat = range <= flatThreshold;

  return {
    isFlat,
    useLineSeries: data.length < 3 || isFlat,
    padding: isFlat ? Math.max(Math.abs(maxValue) * 0.0025, 0.05) : 0,
  };
}

function toDisplayDate(time: Time) {
  if (typeof time === 'number') {
    return new Date(time * 1000);
  }

  if (isBusinessDay(time)) {
    return new Date(Date.UTC(time.year, time.month - 1, time.day));
  }

  return new Date(time);
}

export function EquityChart({
  data,
  height = 300,
  timeframe = '7D',
}: EquityChartProps) {
  const t = useTranslations('Common.chart');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area', Time> | ISeriesApi<'Line', Time> | null>(null);
  const seriesModeRef = useRef<'area' | 'line' | null>(null);
  const preparedData = useMemo(() => prepareChartData(data, timeframe), [data, timeframe]);
  const seriesStats = useMemo(() => getSeriesStats(preparedData), [preparedData]);
  const seriesMode = seriesStats.useLineSeries ? 'line' : 'area';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const chart = createChart(container, {
      ...createEquityChartLayoutOptions(timeframe),
      height,
      width: container.clientWidth,
      localization: {
        priceFormatter: (price: number) => {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(price);
        },
        timeFormatter: (time: Time) => {
          const date = toDisplayDate(time);
          if (Number.isNaN(date.getTime())) {
            return String(time);
          }

          if (timeframe === '1D') {
            return new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }).format(date);
          }

          return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }).format(date);
        },
      },
    });

    chartRef.current = chart;

    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth, height });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      seriesRef.current = null;
      seriesModeRef.current = null;
      chartRef.current = null;
      chart.remove();
    };
  }, [height, timeframe]);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const autoscaleInfoProvider: AutoscaleInfoProvider | undefined = seriesStats.isFlat
      ? (original => {
          const autoscale = original();
          const padding = seriesStats.padding;

          if (autoscale?.priceRange) {
            autoscale.priceRange.minValue -= padding;
            autoscale.priceRange.maxValue += padding;
            return autoscale;
          }

          const pivot = preparedData[preparedData.length - 1]?.value ?? 0;
          return {
            priceRange: {
              minValue: pivot - padding,
              maxValue: pivot + padding,
            },
          };
        })
      : undefined;

    if (!seriesRef.current || seriesModeRef.current !== seriesMode) {
      if (seriesRef.current) {
        chartRef.current.removeSeries(seriesRef.current);
      }

      seriesRef.current =
        seriesMode === 'line'
          ? chartRef.current.addSeries(LineSeries, {
              ...createEquityLineOptions(),
              autoscaleInfoProvider,
            })
          : chartRef.current.addSeries(AreaSeries, {
              ...createEquityAreaOptions(),
              autoscaleInfoProvider,
            });
      seriesModeRef.current = seriesMode;
    } else {
      seriesRef.current.applyOptions(
        seriesMode === 'line'
          ? {
              ...createEquityLineOptions(),
              autoscaleInfoProvider,
            }
          : {
              ...createEquityAreaOptions(),
              autoscaleInfoProvider,
            }
      );
    }

    seriesRef.current.setData(preparedData);
  }, [preparedData, seriesMode, seriesStats]);

  useEffect(() => {
    if (!chartRef.current || preparedData.length < 2) {
      return;
    }

    chartRef.current.timeScale().fitContent();
  }, [preparedData, timeframe]);

  if (!data || data.length < 2) {
    return (
      <div className="panel flex h-80 items-center justify-center text-sm text-muted">
        {t('insufficientData')}
      </div>
    );
  }

  return (
    <div className="w-full" data-testid="equity-chart">
      <div ref={containerRef} className="w-full" style={{ height }} />
    </div>
  );
}
