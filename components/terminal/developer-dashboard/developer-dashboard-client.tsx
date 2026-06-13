'use client';

import { useDeveloperDashboard } from '@/lib/hooks/use-developer-dashboard';
import { FleetGridView } from './fleet-grid-view';
import { DeveloperOnboardingState } from './developer-onboarding-state';
import { DeveloperDashboardPageData } from '@/lib/contracts/types';

interface DeveloperDashboardClientProps {
  initialData: DeveloperDashboardPageData;
}

export function DeveloperDashboardClient({ initialData }: DeveloperDashboardClientProps) {
  const { data, optimisticallyUpdateBotStatus } = useDeveloperDashboard(undefined, initialData);

  const hasBots = (data?.bots ?? []).length > 0;

  if (!hasBots) {
    return <DeveloperOnboardingState />;
  }

  return (
    <FleetGridView bots={data?.bots ?? []} onBotStatusChange={optimisticallyUpdateBotStatus} />
  );
}
