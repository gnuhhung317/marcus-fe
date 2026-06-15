import { MarketplaceQueryParams } from '@/lib/contracts/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface MarketplaceFilterProps {
  query: MarketplaceQueryParams;
}

export function MarketplaceFilter({ query }: MarketplaceFilterProps) {
  return (
    <Card variant="default" className="p-3 shadow-[var(--shadow-soft)]">
      <form
        method="get"
        className="grid gap-2.5 lg:grid-cols-[1.4fr_0.85fr_0.65fr_auto] items-end"
      >
        <label className="space-y-1.5 flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted">Search</span>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted" />
            <Input
              type="search"
              name="search"
              defaultValue={query.search ?? ''}
              placeholder="Bot name, ID, or tag"
              className="pl-9 h-10"
            />
          </div>
        </label>

        <label className="space-y-1.5 flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted">Sort</span>
          <Select
            name="sortBy"
            defaultValue={query.sortBy ?? 'RETURN_30D'}
            className="h-10"
          >
            <option value="RETURN_30D">Highest Return</option>
            <option value="DRAWDOWN">Lowest Drawdown</option>
            <option value="SUBSCRIBERS">Most Subscribers</option>
          </Select>
        </label>

        <label className="space-y-1.5 flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted">Page size</span>
          <Select
            name="pageSize"
            defaultValue={String(query.pageSize ?? 12)}
            className="h-10"
          >
            <option value="6">6</option>
            <option value="12">12</option>
            <option value="24">24</option>
          </Select>
        </label>

        <input type="hidden" name="page" value="1" />

        <div className="space-y-1.5 flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted invisible select-none">Action</span>
          <Button type="submit" className="h-10 px-5">
            Apply filters
          </Button>
        </div>
      </form>
    </Card>
  );
}
