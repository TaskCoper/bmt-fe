'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { ArrowLeft, Download } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { useAuth, useAuthDialogStore } from '@/shared/auth'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/shared/components/ui/carousel'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { BeforeAfterSlider, EmptyState, Reveal, StockImage } from '@/shared/components/common'
import { ROUTES } from '@/shared/constants/routes'
import { useGallery, useGalleryItem } from '../hooks/use-gallery'
import type { GalleryItem } from '../types/gallery.types'

/** A gallery slide — a drawing or an interior photo. */
interface Media {
  id: string
  label: string
}

/** Public project detail — ecommerce layout: gallery (left) + info (right). */
export function GalleryDetail({ id }: { id: string }) {
  const t = useTranslations('gallery')
  const { isAuthenticated } = useAuth()
  const openAuth = useAuthDialogStore((s) => s.open)
  const { data: item, isLoading, isError } = useGalleryItem(id)

  // Related references — same building type, excluding the current item.
  const { data: relatedData } = useGallery({
    search: '',
    style: 'all',
    building: item?.building ?? 'all',
    sort: 'newest',
    page: 1
  })
  const related = (relatedData?.items ?? []).filter((r) => r.id !== id).slice(0, 4)

  const back = (
    <Button asChild variant='ghost' size='sm' className='text-muted-foreground -ml-2'>
      <Link href={ROUTES.GALLERY}>
        <ArrowLeft className='size-4' />
        {t('detail.back')}
      </Link>
    </Button>
  )

  if (isLoading) {
    return (
      <div className='space-y-8'>
        {back}
        <div className='grid gap-8 lg:grid-cols-2'>
          <Skeleton className='aspect-square w-full rounded-2xl' />
          <div className='space-y-4'>
            <Skeleton className='h-8 w-3/4' />
            <Skeleton className='h-20 w-full' />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !item) {
    return (
      <div className='space-y-8'>
        {back}
        <EmptyState title={t('detail.notFoundTitle')} description={t('detail.notFoundDesc')} />
      </div>
    )
  }

  const downloadPdf = () => {
    if (!isAuthenticated) {
      // Viewing is open; downloading the PDF still requires an account.
      toast.info(t('loginToDownload'))
      openAuth('login', () => toast.success(t('downloadStarted', { title: item.title })))
      return
    }
    toast.success(t('downloadStarted', { title: item.title }))
  }

  const media: Media[] = [
    ...item.drawings.map((d, i) => ({ id: d.id, label: t('detail.drawingLabel', { index: i + 1 }) })),
    ...item.photos.map((p) => ({ id: p.id, label: t(`detail.${p.variant}`) }))
  ]

  return (
    <div className='space-y-8'>
      {back}

      <div className='grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-12'>
        {/* Left — media gallery (sticky on desktop) */}
        <div className='min-w-0 md:sticky md:top-20'>
          <MediaGallery items={media} />
        </div>

        {/* Right — product-style info */}
        <Reveal direction='right' className='min-w-0 space-y-6'>
          <div className='space-y-3'>
            <div className='flex items-start justify-between gap-3'>
              <h1 className='min-w-0 text-2xl font-bold tracking-tight sm:text-3xl'>{item.title}</h1>
              <Button size='sm' className='shrink-0' onClick={downloadPdf}>
                <Download className='size-4' />
                {t('download')}
              </Button>
            </div>
            <p className='text-muted-foreground text-pretty'>{item.description}</p>
          </div>

          <div className='flex flex-wrap gap-1.5'>
            <Badge variant='outline'>{t(`style.${item.style}`)}</Badge>
            <Badge variant='outline'>{t(`building.${item.building}`)}</Badge>
            {item.tags.map((tag) => (
              <Badge key={tag} variant='secondary'>
                {tag}
              </Badge>
            ))}
          </div>

          {/* Rich-text write-up (CMS) — flows down the right column */}
          <div className='prose-content' dangerouslySetInnerHTML={{ __html: item.body }} />
        </Reveal>
      </div>

      {/* Before / After comparison */}
      <Reveal>
        <section className='space-y-4'>
          <div className='space-y-1'>
            <h2 className='text-2xl font-bold tracking-tight'>{t('detail.beforeAfter')}</h2>
            <p className='text-muted-foreground text-sm'>{t('detail.beforeAfterHint')}</p>
          </div>
          <BeforeAfterSlider
            seed={`${item.id}-ba`}
            alt={item.title}
            count={item.photos.length + item.drawings.length}
            beforeLabel={t('detail.before')}
            afterLabel={t('detail.after')}
          />
        </section>
      </Reveal>

      {/* Related references */}
      {related.length > 0 ? (
        <Reveal>
          <section className='border-t pt-8'>
            <h2 className='mb-5 text-2xl font-bold tracking-tight'>{t('detail.relatedTitle')}</h2>
            <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
              {related.map((r) => (
                <RelatedCard key={r.id} item={r} style={t(`style.${r.style}`)} building={t(`building.${r.building}`)} />
              ))}
            </div>
          </section>
        </Reveal>
      ) : null}
    </div>
  )
}

/** Compact related-reference card. */
function RelatedCard({ item, style, building }: { item: GalleryItem; style: string; building: string }) {
  return (
    <Link href={`${ROUTES.GALLERY}/${item.id}`} className='glass-card group flex flex-col overflow-hidden'>
      <StockImage seed={item.id} alt={item.title} width={600} className='aspect-[4/3] w-full' />
      <div className='flex flex-1 flex-col gap-2 p-3'>
        <h3 className='group-hover:text-primary line-clamp-1 font-medium tracking-tight transition-colors'>
          {item.title}
        </h3>
        <div className='mt-auto flex flex-wrap gap-1'>
          <Badge variant='outline'>{style}</Badge>
          <Badge variant='outline'>{building}</Badge>
        </div>
      </div>
    </Link>
  )
}

/** Main carousel + synced thumbnail carousel (shadcn/embla). */
function MediaGallery({ items }: { items: Media[] }) {
  const [mainApi, setMainApi] = useState<CarouselApi>()
  const [thumbApi, setThumbApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!mainApi) return
    const onSelect = () => {
      const i = mainApi.selectedScrollSnap()
      setCurrent(i)
      thumbApi?.scrollTo(i)
    }
    mainApi.on('select', onSelect)
    return () => {
      mainApi.off('select', onSelect)
    }
  }, [mainApi, thumbApi])

  const multiple = items.length > 1

  return (
    <div className='space-y-3'>
      {/* Main */}
      <Carousel setApi={setMainApi} opts={{ loop: true }} className='w-full'>
        <CarouselContent>
          {items.map((m) => (
            <CarouselItem key={m.id}>
              <div className='relative aspect-square w-full overflow-hidden rounded-2xl border'>
                <StockImage seed={m.id} alt={m.label} width={1000} className='size-full' />
                <div
                  className='absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent'
                  aria-hidden
                />
                <Badge className='absolute top-3 left-3 border-white/25 bg-black/40 text-white backdrop-blur-md'>
                  {m.label}
                </Badge>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {multiple ? (
          <>
            <CarouselPrevious className='left-3' />
            <CarouselNext className='right-3' />
          </>
        ) : null}
      </Carousel>

      {/* Thumbnails */}
      {multiple ? (
        <Carousel setApi={setThumbApi} opts={{ dragFree: true, containScroll: 'keepSnaps' }} className='w-full'>
          <CarouselContent className='-ml-2'>
            {items.map((m, i) => (
              <CarouselItem key={m.id} className='basis-1/4 pl-2 sm:basis-1/5'>
                <button
                  type='button'
                  aria-label={m.label}
                  onClick={() => mainApi?.scrollTo(i)}
                  className={cn(
                    'aspect-square w-full overflow-hidden rounded-lg border transition',
                    i === current ? '' : 'opacity-55 hover:opacity-100'
                  )}
                >
                  <StockImage seed={m.id} alt={m.label} width={200} className='size-full' />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : null}
    </div>
  )
}
