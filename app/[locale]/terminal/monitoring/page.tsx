import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MonitoringHeader } from '@/components/terminal/monitoring/monitoring-header';
import { MonitoringKpis } from '@/components/terminal/monitoring/monitoring-kpis';
import { MonitoringPerformance } from '@/components/terminal/monitoring/monitoring-performance';
import { MonitoringLogs } from '@/components/terminal/monitoring/monitoring-logs';
import { MonitoringTrades } from '@/components/terminal/monitoring/monitoring-trades';

export default async function MonitoringDashboardPage() {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;
  const canViewSystemOps = role === 'ADMIN';

  if (role === 'DEVELOPER') {
    redirect('/terminal/developer-dashboard');
  }

  if (!role || (role !== 'TRADER' && role !== 'OPERATOR' && role !== 'ADMIN')) {
    redirect('/login');
  }

  return (
    <div className="space-y-8">
      <MonitoringHeader showConnectivity={canViewSystemOps} />
      <MonitoringKpis showSystemOps={canViewSystemOps} />
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <MonitoringPerformance />
        <MonitoringTrades />
      </div>
      <MonitoringLogs />
    </div>
  );
}
