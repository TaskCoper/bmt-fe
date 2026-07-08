import { setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { RequirementsStep } from '@/features/studio'

interface PageProps {
  params: Promise<{ locale: Locale; projectId: string }>
}

export default async function RequirementsPage({ params }: PageProps) {
  const { locale, projectId } = await params
  setRequestLocale(locale)
  return <RequirementsStep projectId={projectId} />
}
