'use client';

import { Bot, ScrollText, Signal, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export type AdminBotDetailTab = 'overview' | 'signals' | 'subscribers' | 'audit';

interface AdminBotDetailTabsProps {
  activeTab: AdminBotDetailTab;
  onChange: (tab: AdminBotDetailTab) => void;
}

export function AdminBotDetailTabs({ activeTab, onChange }: AdminBotDetailTabsProps) {
  const t = useTranslations('Admin.Bots.detail.tabs');

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant={activeTab === 'overview' ? 'primary' : 'outline'} onClick={() => onChange('overview')}>
        <Bot className="size-4" />
        {t('overview')}
      </Button>
      <Button variant={activeTab === 'signals' ? 'primary' : 'outline'} onClick={() => onChange('signals')}>
        <Signal className="size-4" />
        {t('signals')}
      </Button>
      <Button variant={activeTab === 'subscribers' ? 'primary' : 'outline'} onClick={() => onChange('subscribers')}>
        <Users className="size-4" />
        {t('subscribers')}
      </Button>
      <Button variant={activeTab === 'audit' ? 'primary' : 'outline'} onClick={() => onChange('audit')}>
        <ScrollText className="size-4" />
        {t('audit')}
      </Button>
    </div>
  );
}
