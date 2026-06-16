import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Terminal dashboard router.
 * Routes to Developer Dashboard if role is DEVELOPER.
 * Otherwise routes to Decision Dashboard (Phase 1) or Monitoring Dashboard (Phase 2)
 * based on feature flag.
 */
export default async function TerminalDashboardPage() {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role === 'DEVELOPER') {
    redirect('/terminal/developer-dashboard');
  }

  const dashboardV2Enabled = process.env.NEXT_PUBLIC_FEATURE_FLAG_DASHBOARD_V2 === 'true';

  if (dashboardV2Enabled) {
    redirect('/terminal/decision');
  } else {
    redirect('/terminal/monitoring');
  }
}
