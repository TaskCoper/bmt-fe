'use client'

import { Badge, Button, Popover, PopoverContent, PopoverTrigger, Textarea } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import { Heart, PencilLine } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { galleryImageUrl, type GalleryImage } from '../../constants/galleries.constants'
import { useGalleriesStore, useImageMeta } from '../../store/galleries.store'

/** Aspect ratio used to bias masonry — makes cards feel Pinterest-y. */
const ASPECT_RATIO: Record<GalleryImage['aspect'], number> = {
  portrait: 3 / 4,
  landscape: 4 / 3,
  square: 1
}

interface GalleryCardProps {
  slug: string
  image: GalleryImage
  onOpen: () => void
}

export function GalleryCard({ slug, image, onOpen }: GalleryCardProps) {
  const t = useTranslations('project.form.galleries')
  const meta = useImageMeta(slug, image.id)
  const toggleFavorite = useGalleriesStore((s) => s.toggleFavorite)
  const setCaption = useGalleriesStore((s) => s.setCaption)

  const [captionOpen, setCaptionOpen] = useState(false)
  const [draft, setDraft] = useState(meta.caption)

  const paddingTop = `${100 / ASPECT_RATIO[image.aspect]}%`

  const saveCaption = () => {
    setCaption(slug, image.id, draft.trim())
    setCaptionOpen(false)
  }

  return (
    <div className='group mb-4 break-inside-avoid'>
      <div className='border-border/60 relative overflow-hidden rounded-2xl border bg-black shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg'>
        <button
          type='button'
          onClick={onOpen}
          aria-label={t('actions.preview')}
          className='relative block w-full cursor-pointer'
          style={{ paddingTop }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={galleryImageUrl(image, 700)}
            alt={t(`rooms.${image.room}`)}
            loading='lazy'
            decoding='async'
            className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
          />

          <div
            aria-hidden
            className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/25 opacity-90'
          />

          <div className='absolute inset-x-3 top-3 flex items-start justify-between gap-2'>
            <Badge variant='secondary' className='bg-white/85 text-foreground border-white/40 backdrop-blur'>
              {t(`rooms.${image.room}`)}
            </Badge>
          </div>

          {meta.caption && (
            <p className='absolute inset-x-3 bottom-3 line-clamp-2 text-left text-sm font-medium text-white drop-shadow'>
              {meta.caption}
            </p>
          )}
        </button>

        <div className='pointer-events-none absolute top-3 right-3 flex items-center gap-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100'>
          <Popover
            open={captionOpen}
            onOpenChange={(open) => {
              if (open) setDraft(meta.caption)
              setCaptionOpen(open)
            }}
          >
            <PopoverTrigger asChild>
              <Button
                type='button'
                size='icon'
                variant='ghost'
                className='pointer-events-auto size-8 rounded-full bg-white/85 backdrop-blur hover:bg-white'
                aria-label={t('actions.editCaption')}
              >
                <PencilLine className='size-3.5' />
              </Button>
            </PopoverTrigger>
            <PopoverContent align='end' className='w-72 space-y-2'>
              <p className='text-sm font-medium'>{t('actions.captionLabel')}</p>
              <Textarea
                autoFocus
                rows={3}
                value={draft}
                placeholder={t('captionPlaceholder')}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) saveCaption()
                }}
                className='resize-none text-sm'
              />
              <div className='flex justify-end gap-2'>
                <Button type='button' size='sm' variant='ghost' onClick={() => setCaptionOpen(false)}>
                  {t('actions.cancel')}
                </Button>
                <Button type='button' size='sm' onClick={saveCaption}>
                  {t('actions.save')}
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            type='button'
            size='icon'
            variant='ghost'
            onClick={() => toggleFavorite(slug, image.id)}
            className={cn(
              'pointer-events-auto size-8 rounded-full bg-white/85 backdrop-blur transition-colors hover:bg-white',
              meta.favorite && 'bg-rose-50 hover:bg-rose-100'
            )}
            aria-label={t(meta.favorite ? 'actions.unfavorite' : 'actions.favorite')}
          >
            <Heart
              className={cn(
                'size-4 transition-transform',
                meta.favorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-foreground'
              )}
            />
          </Button>
        </div>
      </div>

      <p className='text-muted-foreground mt-2 px-1 text-xs'>{t(`floors.${image.floor}`)}</p>
    </div>
  )
}
