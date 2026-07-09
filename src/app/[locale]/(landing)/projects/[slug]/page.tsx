import { setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { PortfolioDetail } from '@/features/portfolio'

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10 lg:px-8 lg:py-14'>
      <PortfolioDetail slug={slug} />
    </div>
  )
}
