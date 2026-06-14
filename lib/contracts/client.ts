import { availableContracts, missingContracts } from './endpoints';

export * from '../services/base.service';
export * from '../services/auth.service';
export * from '../services/bot.service';
export * from '../services/user.service';
export * from '../services/portfolio.service';
export * from '../services/market.service';
export * from '../services/academy.service';
export * from '../services/developer.service';

export async function getContractSnapshot() {
  return {
    available: availableContracts,
    gaps: missingContracts,
  };
}
