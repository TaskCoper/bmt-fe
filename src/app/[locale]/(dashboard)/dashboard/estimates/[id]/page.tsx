import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { EstimateDetail } from '@/features/estimate'

interface PageProps {
  params: Promise<{ locale: Locale; id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'estimate.detail' })
  return { title: t('title') }
}

export default async function EstimateDetailPage({ params }: PageProps) {
  const { locale, id } = await params
  setRequestLocale(locale)

  return <EstimateDetail id={id} />
}
