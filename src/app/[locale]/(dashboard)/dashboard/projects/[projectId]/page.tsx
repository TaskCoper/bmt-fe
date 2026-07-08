import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { projectStepPath } from '@/features/studio'

/** Bare project root → send to its first step (guard handles locked steps). */
export default async function ProjectIndexPage({
  params,
}: {
  params: Promise<{ locale: string; projectId: string }>
}) {
  const { locale, projectId } = await params
  setRequestLocale(locale as Locale)
  redirect(`/${locale}${projectStepPath(projectId, 'requirements')}`)
}
