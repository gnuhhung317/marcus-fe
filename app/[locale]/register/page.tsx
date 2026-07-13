import { useTranslations } from 'next-intl'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import RegisterForm from '@/components/Auth/RegisterForm'

export const metadata = {
  title: 'Create account — Marcus Trading',
}

export default function RegisterPage() {
  const t = useTranslations('Register')

  return (
    <MarketingShell>
      <div className="mx-auto max-w-3xl py-8">
        <h1 className="text-3xl font-semibold text-white md:text-4xl">{t('title')}</h1>
        <p className="mt-3 text-sm text-muted">{t('subtitle')}</p>
        <div className="mt-6 glass rounded-2xl p-6 md:p-7">
          <RegisterForm />
        </div>
      </div>
    </MarketingShell>
  )
}
