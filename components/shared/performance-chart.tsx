import React from 'react';

interface DataPoint {
  timestamp: string;
  value: number;
}

interface PerformanceChartProps {
  data: DataPoint[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data || data.length < 2) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-white/5 text-muted">
        Insufficient data for performance chart
      </div>
    );
  }

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = (max - min) || 1;
  const padding = range * 0.1;
  
  const chartMin = min - padding;
  const chartMax = max + padding;
  const chartRange = chartMax - chartMin;

  const width = 800;
  const height = 300;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - chartMin) / chartRange) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Horizontal Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1="0"
            y1={p * height}
            x2={width}
            y2={p * height}
            stroke="var(--panel-border)"
            strokeWidth="1"
          />
        ))}

        {/* Main Line */}
        <polyline
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Area Fill */}
        <polygon
          fill="url(#chart-gradient)"
          points={`${points} ${width},${height} 0,${height}`}
        />

        {/* Last Point Indicator */}
        <circle
          cx={(data.length - 1) / (data.length - 1) * width}
          cy={height - ((data[data.length - 1].value - chartMin) / chartRange) * height}
          r="6"
          fill="var(--primary)"
          stroke="var(--bg-1)"
          strokeWidth="3"
        />
      </svg>
      
      {/* Legend / Info */}
      <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted/50 font-bold">
        <span>{Number.isNaN(new Date(data[0].timestamp).getTime()) ? data[0].timestamp : new Date(data[0].timestamp).toLocaleDateString()}</span>
        <span>Portfolio Performance (Live)</span>
        <span>{Number.isNaN(new Date(data[data.length - 1].timestamp).getTime()) ? data[data.length - 1].timestamp : new Date(data[data.length - 1].timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
