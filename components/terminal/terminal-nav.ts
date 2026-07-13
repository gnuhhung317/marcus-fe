import {
  Bot,
  Server,
  Shield,
  Users,
  LayoutDashboard,
  Radar,
  Rocket,
  Store,
  Terminal,
  Trophy,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

export type TerminalNavItem = {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  roles: readonly string[];
};

export type TerminalNavSection = {
  labelKey: string;
  items: readonly TerminalNavItem[];
};

export const terminalNavSections = [
  {
    labelKey: 'trade',
    items: [
      { href: '/terminal/decision', labelKey: 'decision', icon: LayoutDashboard, roles: ['TRADER', 'OPERATOR'] },
      { href: '/terminal/monitoring', labelKey: 'monitoring', icon: Radar, roles: ['TRADER', 'OPERATOR'] },
      { href: '/terminal/marketplace', labelKey: 'market', icon: Store, roles: ['TRADER', 'OPERATOR'] },
      { href: '/terminal/leaderboard', labelKey: 'leaderboard', icon: Trophy, roles: ['TRADER', 'OPERATOR'] },
    ],
  },
  {
    labelKey: 'build',
    items: [
      { href: '/terminal/create-bot', labelKey: 'deploy', icon: Rocket, roles: ['OPERATOR'] },
      { href: '/terminal/developer-dashboard', labelKey: 'bots', icon: Bot, roles: ['DEVELOPER', 'OPERATOR'] },
      { href: '/terminal/developer-console', labelKey: 'console', icon: Terminal, roles: ['OPERATOR', 'ADMIN'] },
    ],
  },
  {
    labelKey: 'account',
    items: [{ href: '/terminal/profile', labelKey: 'profile', icon: UserRound, roles: ['TRADER', 'DEVELOPER', 'OPERATOR', 'ADMIN'] }],
  },
  {
    labelKey: 'admin',
    items: [
      { href: '/terminal/admin', labelKey: 'overview', icon: Shield, roles: ['ADMIN'] },
      { href: '/terminal/admin/users', labelKey: 'users', icon: Users, roles: ['ADMIN'] },
      { href: '/terminal/admin/bots', labelKey: 'bots', icon: Bot, roles: ['ADMIN'] },
      { href: '/terminal/admin/system', labelKey: 'system', icon: Server, roles: ['ADMIN'] },
    ],
  },
] as const satisfies readonly TerminalNavSection[];

export function getVisibleTerminalSections(role: string) {
  const normalizedRole = role === 'USER' ? 'TRADER' : role;

  return terminalNavSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.some((allowedRole) => allowedRole === normalizedRole)),
    }))
    .filter((section) => section.items.length > 0);
}
