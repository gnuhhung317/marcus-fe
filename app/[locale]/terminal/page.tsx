import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { redirect } from '@/lib/navigation';

/**
 * Terminal dashboard router.
 * Routes to Developer Dashboard if role is DEVELOPER.
 * Otherwise routes to Decision Dashboard (Phase 1) or Monitoring Dashboard (Phase 2)
 * based on feature flag.
 */
export default async function TerminalDashboardPage() {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;
  const normalizedRole = role === 'USER' ? 'TRADER' : role;
  const locale = await getLocale();

  if (normalizedRole === 'ADMIN') {
    redirect({ href: '/terminal/admin', locale });
  }

  if (normalizedRole === 'DEVELOPER') {
    redirect({ href: '/terminal/developer-dashboard', locale });
  }

  const dashboardV2Enabled = process.env.NEXT_PUBLIC_FEATURE_FLAG_DASHBOARD_V2 === 'true';

  if (dashboardV2Enabled) {
    redirect({ href: '/terminal/decision', locale });
  } else {
    redirect({ href: '/terminal/monitoring', locale });
  }
}
