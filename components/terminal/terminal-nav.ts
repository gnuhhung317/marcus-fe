import {
  Bot,
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
  label: string;
  icon: LucideIcon;
  roles: readonly string[];
};

export type TerminalNavSection = {
  label: string;
  items: readonly TerminalNavItem[];
};

export const terminalNavSections = [
  {
    label: 'Trade',
    items: [
      { href: '/terminal/decision', label: 'Decision', icon: LayoutDashboard, roles: ['TRADER', 'OPERATOR', 'ADMIN'] },
      { href: '/terminal/monitoring', label: 'Monitoring', icon: Radar, roles: ['TRADER', 'OPERATOR', 'ADMIN'] },
      { href: '/terminal/marketplace', label: 'Market', icon: Store, roles: ['TRADER', 'OPERATOR', 'ADMIN'] },
      { href: '/terminal/leaderboard', label: 'Leaderboard', icon: Trophy, roles: ['TRADER', 'OPERATOR', 'ADMIN'] },
    ],
  },
  {
    label: 'Build',
    items: [
      { href: '/terminal/create-bot', label: 'Deploy', icon: Rocket, roles: ['OPERATOR', 'ADMIN'] },
      { href: '/terminal/developer-dashboard', label: 'Bots', icon: Bot, roles: ['DEVELOPER', 'OPERATOR', 'ADMIN'] },
      { href: '/terminal/developer-console', label: 'Console', icon: Terminal, roles: ['OPERATOR', 'ADMIN'] },
    ],
  },
  {
    label: 'Account',
    items: [{ href: '/terminal/profile', label: 'Profile', icon: UserRound, roles: ['TRADER', 'DEVELOPER', 'OPERATOR', 'ADMIN'] }],
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
