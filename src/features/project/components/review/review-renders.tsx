'use client'

import { Link } from '@/i18n/navigation'
import { Button } from '@/shared/components/ui'
import { ImageIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { galleryImageUrl, type GalleryImage } from '../../constants/galleries.constants'
import type { ImageMeta } from '../../store/project.store'

interface ReviewRendersProps {
  favorites: readonly { image: GalleryImage; meta: ImageMeta }[]
  galleriesUrl: string | null
}

export function ReviewRenders({ favorites, galleriesUrl }: ReviewRendersProps) {
  const t = useTranslations('project.form.review.sections.renders')
  const tRooms = useTranslations('project.form.galleries.rooms')

  if (favorites.length === 0) {
    return (
      <div className='border-border/70 flex flex-col items-center gap-3 rounded-md border border-dashed py-8 text-center'>
        <ImageIcon className='text-muted-foreground size-8' aria-hidden />
        <p className='text-muted-foreground text-sm'>{t('empty')}</p>
        {galleriesUrl && (
          <Button type='button' size='sm' variant='outline' asChild>
            <Link href={galleriesUrl}>{t('backToGalleries')}</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
      {favorites.map(({ image, meta }) => (
        <figure key={image.id} className='border-border/70 overflow-hidden rounded-md border bg-black'>
          <div className='aspect-[4/3]'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={galleryImageUrl(image, 500)}
              alt={tRooms(image.room)}
              loading='lazy'
              decoding='async'
              className='h-full w-full object-cover'
            />
          </div>
          <figcaption className='bg-card border-t px-3 py-2'>
            <p className='text-foreground text-xs font-semibold'>{tRooms(image.room)}</p>
            {meta.caption ? (
              <p className='text-muted-foreground line-clamp-2 text-xs'>{meta.caption}</p>
            ) : (
              <p className='text-muted-foreground/70 text-xs italic'>—</p>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
