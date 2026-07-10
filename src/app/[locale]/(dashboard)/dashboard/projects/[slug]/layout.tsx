import { ProjectFlowLayout } from '@/features/project'
import type { Locale } from '@/i18n/routing'
import { setRequestLocale } from 'next-intl/server'
import { type ReactNode } from 'react'

interface Props {
  children: ReactNode
  params: Promise<{ locale: string; slug: string }>
}

export default async function ProjectLayout({ children, params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale as Locale)

  return (
    <div className='project-canvas min-h-screen'>
      <div className='mx-auto w-5xl p-8'>
        <ProjectFlowLayout slug={slug}>{children}</ProjectFlowLayout>
      </div>
    </div>
  )
}
