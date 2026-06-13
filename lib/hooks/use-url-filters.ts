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

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'ALL' || !value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const resetFilters = useCallback(
    (keys: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      keys.forEach((key) => params.delete(key));
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  return {
    getFilter,
    setFilter,
    resetFilters,
    isPending,
  };
}
