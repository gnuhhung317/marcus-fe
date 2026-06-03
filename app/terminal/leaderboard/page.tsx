import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getLeaderboardPageData } from '@/lib/contracts/client';
import LeaderboardClient from '@/components/terminal/leaderboard/leaderboard-client';

export default async function TerminalLeaderboardPage() {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role !== 'TRADER' && role !== 'OPERATOR' && role !== 'ADMIN') {
    redirect('/terminal');
  }

  // Fetch all rows for client-side sorting/filtering
  const leaderboardPage = await getLeaderboardPageData({ pageSize: 100 });

  return <LeaderboardClient initialData={leaderboardPage} />;
}