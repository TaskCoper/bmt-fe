import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { PageHeader } from '@/shared/components/common'
import { AdminGuard } from '@/shared/auth'
import { GalleryAdminTable } from '@/features/gallery'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gallery.admin' })
  return { title: t('title') }
}

export default async function AdminGalleryPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'gallery.admin' })

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('subtitle')} />
      <AdminGuard>
        <GalleryAdminTable />
      </AdminGuard>
    </div>
  )
}
