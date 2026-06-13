export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type ContractStatus = 'available' | 'gap';

export interface ContractRoute {
  id: string;
  method: ApiMethod;
  path: string;
  operationId: string;
  page: string;
  feature: string;
  status: ContractStatus;
  notes?: string;
}

export interface TerminalKpi {
  label: string;
  value: string;
  delta: string;
  context: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface TimeSeriesValue {
  timestamp: string;
  value: number;
  phase?: 'HISTORICAL' | 'OUT_OF_SAMPLE';
}

export interface AllocationSlice {
  name: string;
  value: number;
}

export interface BotTrade {
  timestamp: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  pnl: number;
  size?: number;
  entryPrice?: number;
  exitPrice?: number;
}
