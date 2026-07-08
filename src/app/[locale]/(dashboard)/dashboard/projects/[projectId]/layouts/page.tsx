import { setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { LayoutsStep } from '@/features/studio'

interface PageProps {
  params: Promise<{ locale: Locale; projectId: string }>
}

export default async function LayoutsPage({ params }: PageProps) {
  const { locale, projectId } = await params
  setRequestLocale(locale)
  return <LayoutsStep projectId={projectId} />
}
