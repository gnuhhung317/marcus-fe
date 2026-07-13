import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MarketplacePaginationProps {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  buildHref: (page: number) => string;
}

export function MarketplacePagination({ page, hasPrev, hasNext, buildHref }: MarketplacePaginationProps) {
  if (!hasPrev && !hasNext) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-2">
      {hasPrev ? (
        <Button variant="outline" size="icon" asChild className="h-8 w-8 border-border hover:border-primary/40 hover:bg-primary/5 transition-all rounded-lg shadow-none">
          <Link href={buildHref(page - 1)} aria-label="Previous page">
            <ChevronLeft className="w-4 h-4 text-main" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled className="h-8 w-8 border-border/40 opacity-40 rounded-lg shadow-none">
          <ChevronLeft className="w-4 h-4 text-muted" />
        </Button>
      )}

      <div className="flex items-center justify-center min-w-[2.5rem] h-8 bg-surface-strong/20 border border-border rounded-lg text-xs font-medium text-main px-2">
        Page {page}
      </div>

      {hasNext ? (
        <Button variant="outline" size="icon" asChild className="h-8 w-8 border-border hover:border-primary/40 hover:bg-primary/5 transition-all rounded-lg shadow-none">
          <Link href={buildHref(page + 1)} aria-label="Next page">
            <ChevronRight className="w-4 h-4 text-main" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled className="h-8 w-8 border-border/40 opacity-40 rounded-lg shadow-none">
          <ChevronRight className="w-4 h-4 text-muted" />
        </Button>
      )}
    </div>
  );
}
