import { MarketplaceQueryParams } from '@/lib/contracts/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface MarketplaceFilterProps {
  query: MarketplaceQueryParams;
}

export function MarketplaceFilter({ query }: MarketplaceFilterProps) {
  return (
    <Card variant="default" className="p-4 shadow-[var(--shadow-soft)]">
      <form
        method="get"
        className="grid gap-3 lg:grid-cols-[1.4fr_0.85fr_0.65fr_auto] items-end"
      >
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted">Search</span>
          <Input
            type="search"
            name="search"
            defaultValue={query.search ?? ''}
            placeholder="Bot name, ID, or tag"
          />
        </label>

        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted">Sort</span>
          <Select
            name="sortBy"
            defaultValue={query.sortBy ?? 'RETURN_30D'}
          >
            <option value="RETURN_30D">Highest Return</option>
            <option value="DRAWDOWN">Lowest Drawdown</option>
            <option value="SUBSCRIBERS">Most Subscribers</option>
          </Select>
        </label>

        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted">Page size</span>
          <Select
            name="pageSize"
            defaultValue={String(query.pageSize ?? 12)}
          >
            <option value="6">6</option>
            <option value="12">12</option>
            <option value="24">24</option>
          </Select>
        </label>

        <input type="hidden" name="page" value="1" />

        <Button type="submit">
          Apply filters
        </Button>
      </form>
    </Card>
  );
}
