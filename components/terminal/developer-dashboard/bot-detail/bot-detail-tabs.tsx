import { DetailTab } from '@/lib/hooks/use-bot-operations';

interface BotDetailTabsProps {
  activeTab: DetailTab;
  setActiveTab: (tab: DetailTab) => void;
  status: string;
}

const tabLabels: Record<DetailTab, string> = {
  overview: 'Overview',
  analytics: 'Analytics',
  credentials: 'API credentials',
  integration: 'Integration health',
  signals: 'Signals',
  subscribers: 'Subscribers',
};

export function BotDetailTabs({ activeTab, setActiveTab, status }: BotDetailTabsProps) {
  const tabs = Object.keys(tabLabels) as DetailTab[];

  return (
    <div className="px-6 sm:px-8">
      {status === 'PAUSED' && (
        <div className="mb-6 rounded-xl border border-border bg-warning-soft px-4 py-3 text-sm text-warning">
          This bot is stopped. Existing subscriptions remain active, but new trading signals are rejected until it is resumed.
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-border pb-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${        
              activeTab === tab ? 'text-main' : 'text-muted hover:text-main'
            }`}
          >
            {tabLabels[tab]}
            {activeTab === tab && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
