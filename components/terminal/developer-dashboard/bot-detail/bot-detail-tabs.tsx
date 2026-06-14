import { DetailTab } from '@/lib/hooks/use-bot-operations';

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
        <div className="mb-6 rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 font-mono text-[11px] leading-relaxed text-warning">
          WARNING: This bot is currently PAUSED. Active client subscriptions remain connected, but outgoing execution signals are rejected until running state is restored.
        </div>
      )}

      <div className="flex flex-wrap gap-1 border-b border-border font-mono">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${        
              activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tabLabels[tab]}
            {activeTab === tab && (
              <span className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
