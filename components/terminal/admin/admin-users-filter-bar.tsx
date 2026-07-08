'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useDebouncedValue } from '@/lib/hooks/use-debounce';
import { useUrlFilters } from '@/lib/hooks/use-url-filters';
import type { AdminUsersQueryParams } from '@/lib/validations/admin.schema';

interface AdminUsersFilterBarProps {
  filters: AdminUsersQueryParams;
  totalElements: number;
}

export function AdminUsersFilterBar({ filters, totalElements }: AdminUsersFilterBarProps) {
  const { setFilters } = useUrlFilters();
  const t = useTranslations('Admin.Users.filters');
  const tCommon = useTranslations('Common.roles');
  const formatter = useFormatter();
  const [query, setQuery] = useState(filters.query ?? '');
  const [role, setRole] = useState(filters.role ?? '');
  const [banned, setBanned] = useState(filters.banned === undefined ? '' : String(filters.banned));
  const debouncedQuery = useDebouncedValue(query, 350);

  useEffect(() => {
    setQuery(filters.query ?? '');
  }, [filters.query]);

  useEffect(() => {
    setRole(filters.role ?? '');
  }, [filters.role]);

  useEffect(() => {
    setBanned(filters.banned === undefined ? '' : String(filters.banned));
  }, [filters.banned]);

  useEffect(() => {
    const normalized = debouncedQuery.trim();
    if (normalized === (filters.query ?? '').trim()) {
      return;
    }

    setFilters({ query: normalized || null, page: 0 });
  }, [debouncedQuery, filters.query, setFilters]);

  useEffect(() => {
    const nextValue = role || null;
    if ((filters.role ?? '') === role) {
      return;
    }

    setFilters({ role: nextValue, page: 0 });
  }, [filters.role, role, setFilters]);

  useEffect(() => {
    const nextValue = banned === '' ? null : banned === 'true';
    if ((filters.banned === undefined ? '' : String(filters.banned)) === banned) {
      return;
    }

    setFilters({ banned: nextValue, page: 0 });
  }, [banned, filters.banned, setFilters]);

  return (
    <Card className="rounded-2xl border-border/70 p-4">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <label className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
            <Search className="size-4" />
          </span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('searchPlaceholder')}
            className="pl-10"
          />
        </label>

        <Select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="">{t('roleAll')}</option>
          <option value="ADMIN">{tCommon('ADMIN')}</option>
          <option value="TRADER">{tCommon('TRADER')}</option>
          <option value="DEVELOPER">{tCommon('DEVELOPER')}</option>
        </Select>

        <Select value={banned} onChange={(event) => setBanned(event.target.value)}>
          <option value="">{t('banAll')}</option>
          <option value="false">{t('banActive')}</option>
          <option value="true">{t('banBanned')}</option>
        </Select>
      </div>

      <p className="mt-3 text-xs text-muted">
        {t('liveUpdate', { count: formatter.number(totalElements) })}
      </p>
    </Card>
  );
}
