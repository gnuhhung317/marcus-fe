import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export function useUrlFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const getFilter = (key: string, defaultValue = 'ALL') => {
    return searchParams.get(key) || defaultValue;
  };

  const setFilters = useCallback(
    (updates: Record<string, string | number | boolean | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          value === 'ALL'
        ) {
          params.delete(key);
          return;
        }

        params.set(key, String(value));
      });

      startTransition(() => {
        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const setFilter = useCallback(
    (key: string, value: string) => {
      setFilters({ [key]: value });
    },
    [setFilters]
  );

  const resetFilters = useCallback(
    (keys: string[]) => {
      const updates = keys.reduce<Record<string, null>>((acc, key) => {
        acc[key] = null;
        return acc;
      }, {});

      setFilters(updates);
    },
    [setFilters]
  );

  return {
    getFilter,
    setFilters,
    setFilter,
    resetFilters,
    isPending,
  };
}
