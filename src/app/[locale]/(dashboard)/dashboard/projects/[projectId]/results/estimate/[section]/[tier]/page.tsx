import { setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { EstimateDetail } from '@/features/studio'

interface PageProps {
  params: Promise<{
    locale: Locale
    projectId: string
    section: string
    tier: string
  }>
}

export default async function EstimateDetailPage({ params }: PageProps) {
  const { locale, section, tier } = await params
  setRequestLocale(locale)
  return <EstimateDetail section={section} tier={tier} />
}
