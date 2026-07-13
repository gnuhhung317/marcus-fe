import { useTranslations } from 'next-intl';
import { DetailTab } from '@/lib/hooks/use-bot-operations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BotDetailTabsProps {
  activeTab: DetailTab;
  setActiveTab: (tab: DetailTab) => void;
  status: string;
}

export function BotDetailTabs({ activeTab, setActiveTab, status }: BotDetailTabsProps) {
  const t = useTranslations('DeveloperDashboard.botDetail.tabs');
  const tabs: Array<{ key: DetailTab; label: string }> = [
    { key: 'overview', label: t('overview') },
    { key: 'analytics', label: t('analytics') },
    { key: 'credentials', label: t('credentials') },
    { key: 'integration', label: t('integration') },
    { key: 'signals', label: t('signals') },
    { key: 'subscribers', label: t('subscribers') },
  ];

  return (
    <div className="px-6 sm:px-8">
      {status === 'PAUSED' && (
        <div className="mb-6 rounded-lg border border-warning/20 bg-warning-soft px-4 py-3 font-mono text-[11px] leading-relaxed text-warning">
          <Badge variant="warning" className="mr-2 rounded-md px-2 py-0.5 text-[9px]">
            {t('warningTitle')}
          </Badge>
          {t('pausedMessage')}
        </div>
      )}

      <div className="flex flex-wrap gap-1 border-b border-border font-mono">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            variant={activeTab === tab.key ? 'secondary' : 'ghost'}
            size="sm"
            className={`relative h-10 rounded-none border-b-2 px-4 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === tab.key ? 'border-primary text-main' : 'border-transparent text-muted hover:text-main'}`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-primary" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
