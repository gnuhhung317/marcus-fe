import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyStateCard } from '@/components/shared/api-state';
import type { DeveloperConsolePageData, ExecutionLogLine, SignalLogLine } from '@/lib/contracts/types';
import { cn } from '@/lib/utils';
import { 
  Terminal, 
  Search, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface MonitoringLogsProps {
  ops: DeveloperConsolePageData;
}

function formatTimeOnly(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toTimeString().split(' ')[0];
}

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString();
}

export function MonitoringLogs({ ops }: MonitoringLogsProps) {
  const [logSearch, setLogSearch] = useState('');
  const [signalSearch, setSignalSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  
  // Custom streaming simulation state to make the dashboard feel alive
  const [simulatedLogs, setSimulatedLogs] = useState<ExecutionLogLine[]>([]);
  const [simulatedSignals, setSimulatedSignals] = useState<SignalLogLine[]>([]);
  
  const logsEndRef = useRef<HTMLDivElement>(null);
  const signalsEndRef = useRef<HTMLTableRowElement>(null);

  // Synchronize state with incoming real data, but respect the streaming pause
  useEffect(() => {
    if (isPaused) return;
    setSimulatedLogs(ops.executionLogs);
    setSimulatedSignals(ops.signalStream);
  }, [ops, isPaused]);

  // Scroll to bottom helper
  useEffect(() => {
    if (autoScroll && !isPaused) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      signalsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [simulatedLogs, simulatedSignals, autoScroll, isPaused]);

  // Filters
  const filteredLogs = useMemo(() => {
    return simulatedLogs.filter(log => {
      const matchSearch = 
        log.message.toLowerCase().includes(logSearch.toLowerCase()) || 
        log.source.toLowerCase().includes(logSearch.toLowerCase());
      
      const matchLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
      return matchSearch && matchLevel;
    });
  }, [simulatedLogs, logSearch, selectedLevel]);

  const filteredSignals = useMemo(() => {
    return simulatedSignals.filter(sig => {
      return (
        sig.symbol.toLowerCase().includes(signalSearch.toLowerCase()) ||
        sig.botId.toLowerCase().includes(signalSearch.toLowerCase()) ||
        sig.action.toLowerCase().includes(signalSearch.toLowerCase()) ||
        sig.status.toLowerCase().includes(signalSearch.toLowerCase())
      );
    });
  }, [simulatedSignals, signalSearch]);

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR': return 'text-negative font-bold';
      case 'WARN': return 'text-warning font-semibold';
      case 'INFO': return 'text-positive';
      case 'DEBUG': return 'text-muted/60';
      default: return 'text-white';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR': 
        return <Badge className="bg-negative/10 border-negative/20 text-negative text-[9px] py-0 px-1 hover:bg-negative/10 uppercase">ERROR</Badge>;
      case 'WARN': 
        return <Badge className="bg-warning/10 border-warning/20 text-warning text-[9px] py-0 px-1 hover:bg-warning/10 uppercase">WARN</Badge>;
      case 'INFO': 
        return <Badge className="bg-positive/10 border-positive/20 text-positive text-[9px] py-0 px-1 hover:bg-positive/10 uppercase">INFO</Badge>;
      default: 
        return <Badge className="bg-white/5 border-white/10 text-muted text-[9px] py-0 px-1 hover:bg-white/5 uppercase">DEBUG</Badge>;
    }
  };

  const getActionColor = (action: string) => {
    if (action.toUpperCase() === 'BUY') return 'text-positive';
    if (action.toUpperCase() === 'SELL') return 'text-negative';
    return 'text-muted';
  };

  const getStatusBadge = (status: string) => {
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
          <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
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
  };

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      {/* Execution Logs Terminal */}
      <Card variant="glass-strong" className="flex flex-col overflow-hidden border border-border bg-canvas/30 p-5">
        <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-muted">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-main">Execution Logs</h2>
              <p className="text-xs text-muted">Real-time observability terminal feed.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className={cn(
                "h-7 border-border px-2 text-xs",
                isPaused ? "bg-warning/10 text-warning border-warning/20" : "bg-transparent text-muted"
              )}
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
            <Badge variant="outline" className="bg-white/5 py-0.5 border-border text-[11px] text-muted">
              {filteredLogs.length} events
            </Badge>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/50" />
            <Input
              placeholder="Search logs by source or message..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="h-8 pl-8 text-xs bg-black/20 border-white/5 text-main placeholder:text-muted/40 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/10"
            />
          </div>
          <div className="flex gap-1 bg-black/20 border border-white/5 p-0.5 rounded-md">
            {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={cn(
                  "px-2 py-1 text-[10px] font-semibold tracking-wider rounded transition-all",
                  selectedLevel === lvl
                    ? "bg-white/10 text-main"
                    : "text-muted/60 hover:text-muted"
                )}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Monospace Code Console */}
        <div className="relative mt-4 flex-1">
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[10px] text-muted/60">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded border-white/10 bg-black/40 text-white focus:ring-0 focus:ring-offset-0 h-3 w-3"
              />
              Auto-Scroll
            </label>
          </div>

          <div className="h-[380px] overflow-y-auto rounded-lg border border-white/5 bg-black/60 p-4 font-mono text-[11px] leading-relaxed text-muted shadow-inner custom-scrollbar select-text">
            {filteredLogs.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <Info className="h-6 w-6 text-muted/30" />
                <p className="mt-2 text-xs text-muted/60">No console logs match filters.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {[...filteredLogs].reverse().map((log, index) => (
                  <div key={index} className="group flex items-start gap-2 border-b border-white/[0.01] py-0.5 hover:bg-white/[0.02] rounded px-1 transition-all">
                    <span className="w-16 shrink-0 text-muted/40 text-[10px]">
                      {formatTimeOnly(log.timestamp)}
                    </span>
                    <span className="w-14 shrink-0 text-[10px]">
                      {getLevelBadge(log.level)}
                    </span>
                    <span className="w-28 shrink-0 truncate text-main/80 text-[10px] font-semibold border-r border-white/5 pr-1">
                      {log.source}
                    </span>
                    <span className={cn("flex-1 whitespace-pre-wrap select-text pl-1 break-all", getLevelColor(log.level))}>
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

      {/* Live Signals Stream Terminal */}
      <Card variant="glass-strong" className="flex flex-col overflow-hidden border border-border bg-canvas/30 p-5">
        <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-muted">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-main">Signal Routing Stream</h2>
              <p className="text-xs text-muted">Live routing telemetry for automated strategies.</p>
            </div>
          </div>
          <Badge variant="success" className="bg-positive/8 h-6 border-positive/20 text-[11px]">
            Active listener
          </Badge>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/50" />
            <Input
              placeholder="Filter by Symbol, Side, Action, Bot..."
              value={signalSearch}
              onChange={(e) => setSignalSearch(e.target.value)}
              className="h-8 pl-8 text-xs bg-black/20 border-white/5 text-main placeholder:text-muted/40 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/10"
            />
          </div>
        </div>

        {/* Table Console Container */}
        <div className="mt-4 flex-1">
          <div className="h-[380px] overflow-y-auto rounded-lg border border-white/5 bg-black/60 font-mono text-[11px] leading-relaxed text-muted shadow-inner custom-scrollbar">
            {filteredSignals.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <Info className="h-6 w-6 text-muted/30" />
                <p className="mt-2 text-xs text-muted/60">No signals currently match criteria.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-neutral-950 text-[10px] text-muted/50 uppercase tracking-wider border-b border-white/5 z-10">
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
                    <tr 
                      key={signal.signalId} 
                      className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-3 py-2 text-muted/40">
                        {formatTimeOnly(signal.generatedTimestamp)}
                      </td>
                      <td className="px-3 py-2 text-main font-semibold">
                        {signal.symbol}
                      </td>
                      <td className="px-3 py-2 text-muted/80">
                        {signal.botId}
                      </td>
                      <td className={cn("px-3 py-2 font-bold", getActionColor(signal.action))}>
                        {signal.action}
                      </td>
                      <td className="px-3 py-2">
                        {getStatusBadge(signal.status)}
                      </td>
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
