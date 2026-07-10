import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { GalleryAdminTable } from '@/features/gallery'
import type { Locale } from '@/i18n/routing'
import { PageHeader } from '@/shared/components/common'
import { ADMIN_COPY } from '../../_components/admin.copy'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export const metadata: Metadata = { title: ADMIN_COPY.pages.gallery.title }

export default async function AdminGalleryPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className='space-y-6'>
      <PageHeader title={ADMIN_COPY.pages.gallery.title} description={ADMIN_COPY.pages.gallery.subtitle} />
      <GalleryAdminTable />
    </div>
  )
}
