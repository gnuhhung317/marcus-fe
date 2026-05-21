'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to check if a feature flag is enabled.
 * Checks server-side flag + allows localStorage override for dev testing.
 *
 * Dev usage:
 *   localStorage.setItem('ff_override_dashboard-v2', 'true');
 */
export function useFeatureFlag(flag: string): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Check localStorage for dev override first
    const overrideKey = `ff_override_${flag}`;
    const localOverride = localStorage.getItem(overrideKey);

    // If override exists, use it. Otherwise, check server-side flag (from env/config)
    // For now, we'll use a simple default: dashboard-v2 is enabled by default
    const serverDefault = process.env.NEXT_PUBLIC_FEATURE_FLAG_DASHBOARD_V2 === 'true';
    const finalValue = localOverride !== null ? localOverride === 'true' : serverDefault;

    setEnabled(finalValue);
  }, [flag]);

  return enabled;
}

/**
 * Helper to toggle a feature flag in localStorage for dev/testing.
 */
export function toggleFeatureFlag(flag: string, enabled?: boolean) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    // No-op on server
    return;
  }

  const overrideKey = `ff_override_${flag}`;
  if (enabled === undefined) {
    // Toggle current value
    const current = localStorage.getItem(overrideKey);
    localStorage.setItem(overrideKey, current === 'true' ? 'false' : 'true');
  } else {
    // Set to specific value
    localStorage.setItem(overrideKey, enabled ? 'true' : 'false');
  }
  // Trigger a page reload or state update
  try {
    window.location.reload();
  } catch (e) {
    // ignore in environments where reload is not available
  }
}
