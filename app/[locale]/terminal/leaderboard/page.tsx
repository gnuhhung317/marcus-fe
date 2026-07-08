import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ErrorStateCard } from '@/components/shared/api-state';
import LeaderboardClient from '@/components/terminal/leaderboard/leaderboard-client';
import { getLeaderboardPageData } from '@/lib/contracts/client';

export default async function TerminalLeaderboardPage() {
  const t = await getTranslations('Leaderboard.page');
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;
  const normalizedRole = role === 'USER' ? 'TRADER' : role;

  if (normalizedRole !== 'TRADER' && normalizedRole !== 'OPERATOR' && normalizedRole !== 'ADMIN') {
    redirect('/terminal');
  }

  try {
    const leaderboardPage = await getLeaderboardPageData({ dataSource: 'ALL' });
    return <LeaderboardClient initialData={leaderboardPage} />;
  } catch (error) {
    return (
      <ErrorStateCard
        title={t('error.title')}
        message={error instanceof Error ? error.message : t('error.message')}
        actionLabel={t('retry')}
        actionHref="/terminal/leaderboard"
      />
    );
  }
}
