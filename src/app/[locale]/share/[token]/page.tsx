import { setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { ShareView } from '@/features/studio'

interface PageProps {
  params: Promise<{ locale: Locale; token: string }>
}

export default async function SharePage({ params }: PageProps) {
  const { locale, token } = await params
  setRequestLocale(locale)
  return (
    <main className='bg-background min-h-screen'>
      <ShareView token={token} />
    </main>
  )
}
