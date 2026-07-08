import { CreateProjectForm } from '@/features/studio'
import type { Locale } from '@/i18n/routing'
import { AmbientAura, PageHeader } from '@/shared/components/common'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'studio' })
  return { title: t('nav.createProject') }
}

export default async function NewProjectPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'studio' })

  return (
    <div className='relative'>
      <AmbientAura />
      <div className='mx-auto max-w-3xl space-y-6'>
        <PageHeader title={t('nav.createProject')} description={t('subtitle')} />
        <div className='glass-panel-strong p-5 sm:p-7 lg:p-8'>
          <CreateProjectForm />
        </div>
      </div>
    </div>
  )
}
