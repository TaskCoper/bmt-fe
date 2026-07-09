import { ProjectSpaces } from '@/features/project'
import type { Locale } from '@/i18n/routing'
import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export default async function SpacesPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  return <ProjectSpaces slug={slug} />
}
