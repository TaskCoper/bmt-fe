import { ProjectDetail } from '@/features/project'
import type { Locale } from '@/i18n/routing'
import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  return (
    <div className='mx-auto w-full max-w-7xl p-4'>
      <ProjectDetail slug={slug} />
    </div>
  )
}
