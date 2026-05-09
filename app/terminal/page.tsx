"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFeatureFlag } from '@/lib/hooks/useFeatureFlag';

/**
 * Terminal dashboard router.
 * Routes to Decision Dashboard (Phase 1) or Monitoring Dashboard (Phase 2)
 * based on feature flag.
 */
export default function TerminalDashboardPage() {
  const router = useRouter();
  const dashboardV2Enabled = useFeatureFlag('dashboard-v2');

  useEffect(() => {
    // Route to appropriate dashboard based on feature flag
    if (dashboardV2Enabled) {
      router.replace('/terminal/decision');
    } else {
      router.replace('/terminal/monitoring');
    }
  }, [dashboardV2Enabled, router]);

  // Show loading state while routing
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4" />
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    </div>
  );
}
