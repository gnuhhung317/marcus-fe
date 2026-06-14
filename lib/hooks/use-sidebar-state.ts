'use client';

import { useEffect, useState } from 'react';

type UseSidebarStateOptions = {
  storageKey?: string;
  defaultCollapsed?: boolean;
};

export function useSidebarState(options: UseSidebarStateOptions = {}) {
  const { storageKey = 'marcus_terminal_sidebar_collapsed', defaultCollapsed = false } = options;
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(storageKey);
      if (storedValue !== null) {
        setIsCollapsed(storedValue === 'true');
      }
    } catch {
      // Ignore storage failures and keep the in-memory default.
    } finally {
      setHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, String(isCollapsed));
    } catch {
      // Ignore storage failures and keep the in-memory state.
    }
  }, [hydrated, isCollapsed, storageKey]);

  const toggleCollapsed = () => setIsCollapsed((current) => !current);

  return {
    hydrated,
    isCollapsed,
    setIsCollapsed,
    toggleCollapsed,
  };
}
