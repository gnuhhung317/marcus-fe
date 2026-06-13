import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MarketplacePaginationProps {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  buildHref: (page: number) => string;
}

export function MarketplacePagination({ page, hasPrev, hasNext, buildHref }: MarketplacePaginationProps) {
  return (
    <Card variant="default" className="flex items-center justify-between px-4 py-3 shadow-[var(--shadow-soft)]">
      <span className="text-muted text-sm">Page {page}</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={!hasPrev} asChild={hasPrev}>
          {hasPrev ? (
            <Link href={buildHref(page - 1)}>
              Previous
            </Link>
          ) : (
            "Previous"
          )}
        </Button>
        <Button variant="outline" size="sm" disabled={!hasNext} asChild={hasNext}>
          {hasNext ? (
            <Link href={buildHref(page + 1)}>
              Next
            </Link>
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </Card>
  );
}
