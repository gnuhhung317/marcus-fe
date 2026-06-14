import { DetailTab } from '@/lib/hooks/use-bot-operations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BotDetailTabsProps {
  activeTab: DetailTab;
  setActiveTab: (tab: DetailTab) => void;
  status: string;
}

const tabLabels: Record<DetailTab, string> = {
  overview: 'Overview',
  analytics: 'Analytics',
  credentials: 'Credentials',
  integration: 'Integration',
  signals: 'Signals',
  subscribers: 'Subscribers',
};

export function BotDetailTabs({ activeTab, setActiveTab, status }: BotDetailTabsProps) {
  const tabs = Object.keys(tabLabels) as DetailTab[];

  return (
    <div className="px-6 sm:px-8">
      {status === 'PAUSED' && (
        <div className="mb-6 rounded-lg border border-warning/20 bg-warning-soft px-4 py-3 font-mono text-[11px] leading-relaxed text-warning">
          <Badge variant="warning" className="mr-2 rounded-md px-2 py-0.5 text-[9px]">
            Warning
          </Badge>
          This bot is currently PAUSED. Active client subscriptions remain connected, but outgoing execution signals are rejected until running state is restored.
        </div>
      )}

      <div className="flex flex-wrap gap-1 border-b border-border font-mono">
        {tabs.map((tab) => (
          <Button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            variant={activeTab === tab ? 'secondary' : 'ghost'}
            size="sm"
            className={`relative h-10 rounded-none border-b-2 px-4 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === tab ? 'border-primary text-main' : 'border-transparent text-muted hover:text-main'}`}
          >
            {tabLabels[tab]}
            {activeTab === tab && (
              <span className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-primary" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
