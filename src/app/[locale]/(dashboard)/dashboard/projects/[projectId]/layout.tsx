import { setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { StudioShell } from '@/features/studio'

export default async function ProjectLayout({
  children,
  params
}: LayoutProps<'/[locale]/dashboard/projects/[projectId]'>) {
  const { locale, projectId } = await params
  setRequestLocale(locale as Locale)
  return <StudioShell projectId={projectId}>{children}</StudioShell>
}
