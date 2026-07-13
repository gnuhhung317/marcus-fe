'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useUrlFilters } from '@/lib/hooks/use-url-filters';

interface AdminPaginationProps {
  page: number;
  pageSize: number;
  totalElements: number;
  hasNext: boolean;
}

export function AdminPagination({ page, pageSize, totalElements, hasNext }: AdminPaginationProps) {
  const { setFilters } = useUrlFilters();
  const t = useTranslations('Admin.Users.pagination');
  const tCommon = useTranslations('Common.pagination');
  const formatter = useFormatter();
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted">
        {t('pageOfItems', {
          page: formatter.number(page + 1),
          totalPages: formatter.number(totalPages),
          totalElements: formatter.number(totalElements),
        })}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 0} onClick={() => setFilters({ page: Math.max(0, page - 1) })}>
          <ChevronLeft className="size-4" />
          {tCommon('prev')}
        </Button>
        <Button variant="outline" size="sm" disabled={!hasNext} onClick={() => setFilters({ page: page + 1 })}>
          {tCommon('next')}
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
