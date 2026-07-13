import { TerminalKpi, BotTrade, AllocationSlice } from './shared';

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  role: string;
}

export interface RegisterUserInput {
  email: string;
  password: string;
  displayName?: string;
  role?: 'TRADER' | 'DEVELOPER';
}

export interface ProfileApiKey {
  id: string;
  label: string;
  maskedKey: string;
  createdAt: string;
}

export interface ProfilePreferences {
  timezone: string;
  baseCurrency: string;
  emailNotifications: boolean;
  sessionTimeoutMinutes: number;
}

export interface ProfileLoginActivity {
  id: string;
  device: string;
  location: string;
  ipMasked: string;
  createdAt: string;
  status: string;
}

export interface ProfilePageData {
  profile: UserProfile;
  preferences: ProfilePreferences;
  apiKeys: ProfileApiKey[];
  loginActivities: ProfileLoginActivity[];
}

export interface DashboardPageData {
  terminalKpis: TerminalKpi[];
  botTrades: BotTrade[];
  allocations: AllocationSlice[];
  lastUpdated: string | null;
}
