import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { PortfolioGrid } from '@/features/portfolio'
import { Reveal } from '@/shared/components/common'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'portfolio' })
  return { title: t('title') }
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'portfolio' })

  return (
    <div className='mx-auto w-full max-w-7xl px-4 py-12 lg:px-8 lg:py-16'>
      <Reveal className='mb-8 space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>{t('title')}</h1>
        <p className='text-muted-foreground'>{t('subtitle')}</p>
      </Reveal>
      <PortfolioGrid />
    </div>
  )
}
