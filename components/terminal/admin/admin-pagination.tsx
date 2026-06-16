'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUrlFilters } from '@/lib/hooks/use-url-filters';

interface AdminPaginationProps {
  page: number;
  pageSize: number;
  totalElements: number;
  hasNext: boolean;
  itemLabel: string;
}

export function AdminPagination({ page, pageSize, totalElements, hasNext, itemLabel }: AdminPaginationProps) {
  const { setFilters } = useUrlFilters();
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted">
        Page {page + 1} of {totalPages} · {totalElements} {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 0}
          onClick={() => setFilters({ page: Math.max(0, page - 1) })}
        >
          <ChevronLeft className="size-4" />
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext}
          onClick={() => setFilters({ page: page + 1 })}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
