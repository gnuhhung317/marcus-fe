'use client';

import { ErrorStateCard } from '../../components/shared/api-state';

export default function TerminalError({ reset }: { reset: () => void }) {
  return (
    <ErrorStateCard
      title="Terminal load failed"
      message="A contract request failed while preparing this view."
      actionLabel="Retry Load"
      onAction={reset}
    />
  );
}