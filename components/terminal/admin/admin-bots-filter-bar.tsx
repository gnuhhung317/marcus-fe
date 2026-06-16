'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useDebouncedValue } from '@/lib/hooks/use-debounce';
import { useUrlFilters } from '@/lib/hooks/use-url-filters';
import type { AdminBotsQueryParams } from '@/lib/validations/admin.schema';

interface AdminBotsFilterBarProps {
  filters: AdminBotsQueryParams;
  totalElements: number;
}

export function AdminBotsFilterBar({ filters, totalElements }: AdminBotsFilterBarProps) {
  const { setFilters } = useUrlFilters();
  const [query, setQuery] = useState(filters.query ?? '');
  const [status, setStatus] = useState(filters.status ?? '');
  const [developerId, setDeveloperId] = useState(filters.developerId ?? '');
  const debouncedQuery = useDebouncedValue(query, 350);
  const debouncedDeveloperId = useDebouncedValue(developerId, 350);

  useEffect(() => {
    setQuery(filters.query ?? '');
  }, [filters.query]);

  useEffect(() => {
    setStatus(filters.status ?? '');
  }, [filters.status]);

  useEffect(() => {
    setDeveloperId(filters.developerId ?? '');
  }, [filters.developerId]);

  useEffect(() => {
    const normalized = debouncedQuery.trim();
    if (normalized === (filters.query ?? '').trim()) {
      return;
    }

    setFilters({ query: normalized || null, page: 0 });
  }, [debouncedQuery, filters.query, setFilters]);

  useEffect(() => {
    const nextValue = status || null;
    if ((filters.status ?? '') === status) {
      return;
    }

    setFilters({ status: nextValue, page: 0 });
  }, [filters.status, setFilters, status]);

  useEffect(() => {
    const normalized = debouncedDeveloperId.trim();
    if (normalized === (filters.developerId ?? '').trim()) {
      return;
    }

    setFilters({ developerId: normalized || null, page: 0 });
  }, [debouncedDeveloperId, filters.developerId, setFilters]);

  return (
    <Card className="rounded-2xl border-border/70 p-4">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_0.9fr_0.9fr]">
        <label className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
            <Search className="size-4" />
          </span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search bot name, id, pair, or developer"
            className="pl-10"
          />
        </label>

        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="DOWN">Down</option>
          <option value="DELETED">Deleted</option>
        </Select>

        <Input value={developerId} onChange={(event) => setDeveloperId(event.target.value)} placeholder="Developer id" />
      </div>

      <p className="mt-3 text-xs text-muted">
        Live filter updates. Showing {totalElements} bots.
      </p>
    </Card>
  );
}
