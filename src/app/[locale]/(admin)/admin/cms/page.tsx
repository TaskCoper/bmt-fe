import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { ContentTable } from '@/features/cms'
import type { Locale } from '@/i18n/routing'
import { PageHeader } from '@/shared/components/common'
import { ADMIN_COPY } from '../../_components/admin.copy'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export const metadata: Metadata = { title: ADMIN_COPY.pages.cms.title }

export default async function AdminCmsPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className='space-y-6'>
      <PageHeader title={ADMIN_COPY.pages.cms.title} description={ADMIN_COPY.pages.cms.subtitle} />
      <ContentTable />
    </div>
  )
}
