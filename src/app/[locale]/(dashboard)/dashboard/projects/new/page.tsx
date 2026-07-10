import type { Locale } from '@/i18n/routing'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import CreateProjectPage from '../create-project'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'project' })
  return { title: t('dialog.title') }
}

export default async function NewProjectPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <CreateProjectPage />
}
