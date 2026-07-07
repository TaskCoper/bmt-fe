import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { PageHeader } from '@/shared/components/common'
import { SettingsPanel } from '@/features/settings'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'settings' })
  return { title: t('title') }
}

export default async function SettingsPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'settings' })

  return (
    <div className='space-y-6'>
      <PageHeader title={t('title')} description={t('subtitle')} />
      <SettingsPanel />
    </div>
  )
}
