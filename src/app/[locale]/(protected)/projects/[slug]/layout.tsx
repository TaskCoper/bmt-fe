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
    <div
      className='bg-secondary min-h-screen'
      style={{
        backgroundColor: '#fbfaf7',
        backgroundImage:
          'radial-gradient(circle at top right, rgba(245,239,228,0.7), transparent 65%),' +
          'linear-gradient(rgba(180,168,145,0.08) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(180,168,145,0.08) 1px, transparent 1px),' +
          'linear-gradient(rgba(180,168,145,0.03) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(180,168,145,0.03) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 120px 120px, 120px 120px, 24px 24px, 24px 24px'
      }}
    >
      <div className='mx-auto w-5xl p-8'>
        <ProjectFlowLayout slug={slug}>{children}</ProjectFlowLayout>
      </div>
    </div>
  )
}
