import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { CreateBotWorkspace } from '../../../components/terminal/create-bot/create-bot-workspace';

export default async function TerminalCreateBotPage() {
  const cookieStore = cookies();
  const role = cookieStore.get('marcus_role')?.value;

  if (role !== 'OPERATOR' && role !== 'ADMIN') {
    redirect('/terminal');
  }

  return <CreateBotWorkspace />;
}
