import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { GalleryDetail } from '@/features/gallery'

interface PageProps {
  params: Promise<{ locale: Locale; id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gallery' })
  return { title: t('title') }
}

export default async function GalleryDetailPage({ params }: PageProps) {
  const { locale, id } = await params
  setRequestLocale(locale)

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10 lg:px-8 lg:py-14'>
      <GalleryDetail id={id} />
    </div>
  )
}
