'use client'

import { useRouter } from '@/i18n/navigation'
import { Badge, Button, Card, CardContent } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/plugins/captions.css'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/plugins/counter.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import { GALLERY_IMAGES, GALLERY_ROOMS, galleryImageUrl, type GalleryRoom } from '../constants/galleries.constants'
import { useProjectStore, useSetProjectFlow } from '../store/project.store'
import { GalleryCard } from './galleries/gallery-card'

type RoomFilter = GalleryRoom | 'all'

interface ProjectGalleriesProps {
  slug: string
}

export default function ProjectGalleries({ slug }: ProjectGalleriesProps) {
  const t = useTranslations('project.form')
  const tg = useTranslations('project.form.galleries')
  const tc = useTranslations('common')
  const router = useRouter()

  const project = useProjectStore((s) => s.projects[slug])
  const projectMeta = useProjectStore((s) => s.projects[slug]?.galleries)
  const toggleFavorite = useProjectStore((s) => s.toggleFavorite)

  useSetProjectFlow(slug, 'galleries')

  const [roomFilter, setRoomFilter] = useState<RoomFilter>('all')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const favoriteCount = useMemo(
    () => (projectMeta ? Object.values(projectMeta).filter((m) => m?.favorite).length : 0),
    [projectMeta]
  )

  const visibleImages = useMemo(() => {
    return GALLERY_IMAGES.filter((image) => {
      if (roomFilter !== 'all' && image.room !== roomFilter) return false
      if (onlyFavorites && !projectMeta?.[image.id]?.favorite) return false
      return true
    })
  }, [projectMeta, roomFilter, onlyFavorites])

  const slides = useMemo(
    () =>
      visibleImages.map((image) => ({
        src: galleryImageUrl(image, 1600),
        alt: tg(`rooms.${image.room}`),
        title: `${tg(`rooms.${image.room}`)} · ${tg(`floors.${image.floor}`)}`,
        description: projectMeta?.[image.id]?.caption || tg('captionEmpty')
      })),
    [projectMeta, tg, visibleImages]
  )

  const activeImageId = activeIndex >= 0 ? visibleImages[activeIndex]?.id : undefined
  const activeIsFavorite = activeImageId ? Boolean(projectMeta?.[activeImageId]?.favorite) : false

  if (!project) {
    return <p>{t('projectNotFound')}</p>
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex flex-wrap items-center gap-1.5'>
          <FilterChip active={roomFilter === 'all'} onClick={() => setRoomFilter('all')}>
            {tg('rooms.all')}
          </FilterChip>

          {GALLERY_ROOMS.map((room) => (
            <FilterChip key={room} active={roomFilter === room} onClick={() => setRoomFilter(room)}>
              {tg(`rooms.${room}`)}
            </FilterChip>
          ))}
        </div>

        <Button
          type='button'
          variant={onlyFavorites ? 'default' : 'outline'}
          size='sm'
          onClick={() => setOnlyFavorites((v) => !v)}
          className='gap-2'
        >
          <Heart className={cn('size-3.5', onlyFavorites && 'fill-current')} />
          {tg('filters.favorites')}
          {favoriteCount > 0 && (
            <Badge
              variant='secondary'
              className={cn(
                'ml-1 rounded-full px-1.5 py-0 text-[10px] font-semibold',
                onlyFavorites ? 'border-white/30 bg-white/25 text-white' : ''
              )}
            >
              {favoriteCount}
            </Badge>
          )}
        </Button>
      </div>

      {visibleImages.length === 0 ? (
        <Card className='py-16 text-center'>
          <CardContent className='space-y-2'>
            <p className='text-lg font-semibold'>{tg('empty.title')}</p>
            <p className='text-muted-foreground text-sm'>{tg('empty.description')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className='columns-1 gap-4 sm:columns-2 lg:columns-3'>
          {visibleImages.map((image, index) => (
            <GalleryCard key={image.id} slug={slug} image={image} onOpen={() => setActiveIndex(index)} />
          ))}
        </div>
      )}

      <div className='flex flex-wrap items-center justify-between gap-2 pt-2'>
        {project.prevUrl ? (
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'instant' })
              router.push(project.prevUrl!)
            }}
          >
            {tc('back')}
          </Button>
        ) : (
          <span />
        )}
        {project.nextUrl && (
          <Button
            type='button'
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'instant' })
              router.push(project.nextUrl!)
            }}
          >
            {tg('ctas.nextStep')}
          </Button>
        )}
      </div>

      <Lightbox
        open={activeIndex >= 0}
        close={() => setActiveIndex(-1)}
        index={Math.max(activeIndex, 0)}
        slides={slides}
        on={{ view: ({ index }) => setActiveIndex(index) }}
        plugins={[Captions, Counter, Zoom]}
        captions={{ descriptionTextAlign: 'center' }}
        counter={{ container: { style: { top: 0, bottom: 'unset' } } }}
        carousel={{ finite: true, padding: '32px' }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: 'rgba(15, 15, 15, 0.94)' },
          slide: { padding: 0 }
        }}
        toolbar={{
          buttons: [
            <button
              key='favorite'
              type='button'
              className='yarl__button'
              onClick={() => activeImageId && toggleFavorite(slug, activeImageId)}
              aria-label={tg(activeIsFavorite ? 'actions.unfavorite' : 'actions.favorite')}
            >
              <Heart className={cn('size-6 transition-transform', activeIsFavorite && 'fill-rose-500 text-rose-500')} />
            </button>,
            'close'
          ]
        }}
      />
    </div>
  )
}

interface FilterChipProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
          : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
      )}
    >
      {children}
    </button>
  )
}
