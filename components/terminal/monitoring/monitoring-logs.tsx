import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { DeveloperConsolePageData, ExecutionLogLine, SignalLogLine } from '@/lib/contracts/types';
import { cn } from '@/lib/utils';
import { Terminal, Search, Play, Pause, Info, SlidersHorizontal } from 'lucide-react';

interface MonitoringLogsProps {
  ops: DeveloperConsolePageData;
}

function formatTimeOnly(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toTimeString().split(' ')[0];
}

function getLevelBadge(level: string) {
  switch (level.toUpperCase()) {
    case 'ERROR':
      return <Badge variant="error">ERROR</Badge>;
    case 'WARN':
      return <Badge variant="warning">WARN</Badge>;
    case 'INFO':
      return <Badge variant="success">INFO</Badge>;
    default:
      return <Badge variant="outline">DEBUG</Badge>;
  }
}

function getLevelTextClass(level: string) {
  switch (level.toUpperCase()) {
    case 'ERROR':
      return 'text-negative font-semibold';
    case 'WARN':
      return 'text-warning font-semibold';
    case 'INFO':
      return 'text-positive';
    case 'DEBUG':
      return 'text-muted/60';
    default:
      return 'text-main';
  }
}

function getActionBadge(action: string) {
  if (action.toUpperCase() === 'BUY') {
    return (
      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border border-positive/20 bg-positive/10 text-positive">
        {action}
      </span>
    );
  }

  if (action.toUpperCase() === 'SELL') {
    return (
      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border border-negative/20 bg-negative/10 text-negative">
        {action}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border border-border bg-surface text-muted">
      {action}
    </span>
  );
}

function getStatusBadge(status: string) {
  if (status.toUpperCase() === 'EXECUTED') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-positive">
        <span className="h-1.5 w-1.5 rounded-full bg-positive" />
        EXECUTED
      </span>
    );
  }

  if (status.toUpperCase() === 'PENDING') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-warning">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warning" />
        PENDING
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-negative">
      <span className="h-1.5 w-1.5 rounded-full bg-negative" />
      REJECTED
    </span>
  );
}

export function MonitoringLogs({ ops }: MonitoringLogsProps) {
  const [logSearch, setLogSearch] = useState('');
  const [signalSearch, setSignalSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [simulatedLogs, setSimulatedLogs] = useState<ExecutionLogLine[]>([]);
  const [simulatedSignals, setSimulatedSignals] = useState<SignalLogLine[]>([]);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const signalsEndRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (isPaused) return;
    setSimulatedLogs(ops.executionLogs);
    setSimulatedSignals(ops.signalStream);
  }, [ops, isPaused]);

  useEffect(() => {
    if (autoScroll && !isPaused) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      signalsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [simulatedLogs, simulatedSignals, autoScroll, isPaused]);

  const filteredLogs = useMemo(
    () =>
      simulatedLogs.filter((log) => {
        const matchSearch =
          log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
          log.source.toLowerCase().includes(logSearch.toLowerCase());

        const matchLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
        return matchSearch && matchLevel;
      }),
    [simulatedLogs, logSearch, selectedLevel]
  );

  const filteredSignals = useMemo(
    () =>
      simulatedSignals.filter((sig) =>
        [sig.symbol, sig.botId, sig.action, sig.status].some((field) =>
          field.toLowerCase().includes(signalSearch.toLowerCase())
        )
      ),
    [simulatedSignals, signalSearch]
  );

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <Card variant="glass-strong" className="flex flex-col overflow-hidden p-5">
        <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-main">Execution Logs</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className={cn('h-7 px-2 text-xs', isPaused ? 'border-warning/30 bg-warning/10 text-warning hover:bg-warning/20' : '')}
            >
              {isPaused ? (
                <>
                  <Play className="mr-1 h-3.5 w-3.5" /> Resume Stream
                </>
              ) : (
                <>
                  <Pause className="mr-1 h-3.5 w-3.5" /> Pause Stream
                </>
              )}
            </Button>
            <Badge variant="outline" className="text-[11px]">
              {filteredLogs.length} events
            </Badge>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/60" />
            <Input
              placeholder="Search logs by source or message..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="h-8 border-border bg-surface pl-8 text-xs placeholder:text-muted/50"
            />
          </div>
          <div className="flex gap-1 rounded-md border border-border bg-surface p-0.5">
            {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={cn(
                  'rounded px-2 py-1 text-[10px] font-semibold tracking-wider transition-colors',
                  selectedLevel === lvl ? 'bg-surface-strong text-main' : 'text-muted hover:text-main'
                )}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-4 flex-1">
          <div className="absolute right-2 top-2 z-10 flex gap-2">
            <label className="flex cursor-pointer select-none items-center gap-1.5 text-[10px] text-muted">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="h-3 w-3 rounded border-border bg-surface text-positive focus:ring-0 focus:ring-offset-0"
              />
              Auto-Scroll
            </label>
          </div>

          <div className="custom-scrollbar mt-0 h-[380px] overflow-y-auto rounded-lg border border-border bg-surface p-4 font-mono text-[11px] leading-relaxed text-muted shadow-inner">
            {filteredLogs.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <Info className="h-6 w-6 text-muted/40" />
                <p className="mt-2 text-xs text-muted">No console logs match filters.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {[...filteredLogs].reverse().map((log, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-2 rounded px-1 py-0.5 transition-colors hover:bg-surface-strong"
                  >
                    <span className="w-16 shrink-0 text-[10px] text-muted/60">{formatTimeOnly(log.timestamp)}</span>
                    <span className="w-14 shrink-0 text-[10px]">{getLevelBadge(log.level)}</span>
                    <span className="w-28 shrink-0 truncate border-r border-border pr-1 text-[10px] font-semibold text-main/80">
                      {log.source}
                    </span>
                    <span className={cn('flex-1 break-all whitespace-pre-wrap pl-1 select-text', getLevelTextClass(log.level))}>
                      {log.message}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card variant="glass-strong" className="flex flex-col overflow-hidden p-5">
        <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-main">Signal Routing Stream</h2>
            </div>
          </div>
          <Badge variant="success">Active listener</Badge>
        </div>

        <div className="mt-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/60" />
            <Input
              placeholder="Filter by Symbol, Side, Action, Bot..."
              value={signalSearch}
              onChange={(e) => setSignalSearch(e.target.value)}
              className="h-8 border-border bg-surface pl-8 text-xs placeholder:text-muted/50"
            />
          </div>
        </div>

        <div className="mt-4 flex-1">
          <div className="custom-scrollbar h-[380px] overflow-y-auto rounded-lg border border-border bg-surface font-mono text-[11px] leading-relaxed text-muted shadow-inner">
            {filteredSignals.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <Info className="h-6 w-6 text-muted/40" />
                <p className="mt-2 text-xs text-muted">No signals currently match criteria.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10 border-b border-border bg-surface-strong text-[10px] uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-3 py-2">Time</th>
                    <th className="px-3 py-2">Symbol</th>
                    <th className="px-3 py-2">Bot ID</th>
                    <th className="px-3 py-2">Action</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSignals.map((signal) => (
                    <tr key={signal.signalId} className="border-b border-border/50 transition-colors hover:bg-surface-strong">
                      <td className="px-3 py-2 text-muted/60">{formatTimeOnly(signal.generatedTimestamp)}</td>
                      <td className="px-3 py-2 font-semibold text-main">{signal.symbol}</td>
                      <td className="px-3 py-2 text-muted">{signal.botId}</td>
                      <td className="px-3 py-2">{getActionBadge(signal.action)}</td>
                      <td className="px-3 py-2">{getStatusBadge(signal.status)}</td>
                    </tr>
                  ))}
                  <tr ref={signalsEndRef} />
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}
