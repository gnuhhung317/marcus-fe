import { MarketingShell } from '../../components/marketing/marketing-shell'
import RegisterForm from '../../components/Auth/RegisterForm'

export const metadata = {
  title: 'Create account — Marcus Trading',
}

export default function RegisterPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-3xl py-8">
        <h1 className="text-3xl font-semibold text-white md:text-4xl">Create an account</h1>
        <p className="mt-3 text-sm text-muted">Create your Marcus Trading account to start exploring bots and run paper trading.</p>
        <div className="mt-6 glass rounded-2xl p-6 md:p-7">
          <RegisterForm />
        </div>
      </div>
    </MarketingShell>
  )
}
