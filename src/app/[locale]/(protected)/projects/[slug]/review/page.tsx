import { ProjectReview } from '@/features/project'
import type { Locale } from '@/i18n/routing'
import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export default async function ProjectReviewPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  return <ProjectReview slug={slug} />
}
