import { setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { ResultStep } from '@/features/studio'

interface PageProps {
  params: Promise<{ locale: Locale; projectId: string }>
}

export default async function ResultsPage({ params }: PageProps) {
  const { locale, projectId } = await params
  setRequestLocale(locale)
  return <ResultStep projectId={projectId} />
}
