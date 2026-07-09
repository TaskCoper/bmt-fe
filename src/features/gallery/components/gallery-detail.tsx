'use client'

import { type ReactNode, useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { ArrowLeft, Download, Image as ImageIcon, Lock, PencilRuler } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { useAuth, useAuthDialogStore } from '@/shared/auth'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { EmptyState } from '@/shared/components/common'
import { ROUTES } from '@/shared/constants/routes'
import { useGalleryItem } from '../hooks/use-gallery'
import type { GalleryDrawing, GalleryPhoto } from '../types/gallery.types'

/** Stable no-op subscribe so `useSyncExternalStore` only distinguishes SSR vs client. */
const emptySubscribe = () => () => {}

/** Public project detail: floor-plan drawings + finished-interior photos. */
export function GalleryDetail({ id }: { id: string }) {
  const t = useTranslations('gallery')
  const { isAuthenticated } = useAuth()
  const openAuth = useAuthDialogStore((s) => s.open)
  const { data: item, isLoading, isError } = useGalleryItem(id)

  // Auth state is client-only; gate on hydration so SSR and first paint match.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const back = (
    <Button asChild variant='ghost' size='sm' className='text-muted-foreground -ml-2'>
      <Link href={ROUTES.GALLERY}>
        <ArrowLeft className='size-4' />
        {t('detail.back')}
      </Link>
    </Button>
  )

  const skeleton = (
    <div className='space-y-8'>
      {back}
      <Skeleton className='h-8 w-2/3' />
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='aspect-[4/3] w-full rounded-2xl' />
        ))}
      </div>
    </div>
  )

  if (!mounted || (isAuthenticated && isLoading)) return skeleton

  // Members-only: guests never see the drawings/photos.
  if (!isAuthenticated) {
    return (
      <div className='space-y-8'>
        {back}
        <div className='glass-card mx-auto flex max-w-md flex-col items-center gap-4 p-10 text-center'>
          <span className='bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full'>
            <Lock className='size-6' />
          </span>
          <div className='space-y-1'>
            <h1 className='text-xl font-semibold'>{t('detail.lockedTitle')}</h1>
            <p className='text-muted-foreground text-sm'>{t('detail.lockedDesc')}</p>
          </div>
          <Button onClick={() => openAuth('login')}>{t('detail.loginCta')}</Button>
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

  const downloadPdf = () => toast.success(t('downloadStarted', { title: item.title }))

  return (
    <div className='space-y-10'>
      {back}

      {/* Header */}
      <header className='space-y-4'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold tracking-tight'>{item.title}</h1>
            <p className='text-muted-foreground max-w-2xl'>{item.description}</p>
          </div>
          <Button size='sm' className='shrink-0' onClick={downloadPdf}>
            <Download className='size-4' />
            {t('download')}
          </Button>
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
      </header>

      {/* Group 1 — floor-plan drawings */}
      <AssetGroup
        icon={<PencilRuler className='size-5' />}
        title={t('detail.drawingsTitle')}
        description={t('detail.drawingsDesc')}
        count={item.drawings.length}
      >
        {item.drawings.map((drawing, i) => (
          <DrawingTile key={drawing.id} drawing={drawing} label={t('detail.drawingLabel', { index: i + 1 })} />
        ))}
      </AssetGroup>

      {/* Group 2 — finished-interior photos */}
      <AssetGroup
        icon={<ImageIcon className='size-5' />}
        title={t('detail.photosTitle')}
        description={t('detail.photosDesc')}
        count={item.photos.length}
      >
        {item.photos.map((photo) => (
          <PhotoTile key={photo.id} photo={photo} variantLabel={t(`detail.${photo.variant}`)} />
        ))}
      </AssetGroup>
    </div>
  )
}

/** Section wrapper: title row + a tile grid. */
function AssetGroup({
  icon,
  title,
  description,
  count,
  children
}: {
  icon: ReactNode
  title: string
  description: string
  count: number
  children: ReactNode
}) {
  return (
    <section className='space-y-4'>
      <div className='flex items-center gap-3'>
        <span className='bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl'>{icon}</span>
        <div>
          <h2 className='flex items-center gap-2 text-lg font-semibold tracking-tight'>
            {title}
            <span className='text-muted-foreground text-sm font-normal'>({count})</span>
          </h2>
          <p className='text-muted-foreground text-sm'>{description}</p>
        </div>
      </div>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>{children}</div>
    </section>
  )
}

/** Blueprint-style placeholder for a floor-plan drawing. */
function DrawingTile({ drawing, label }: { drawing: GalleryDrawing; label: string }) {
  return (
    <figure className='glass-card group overflow-hidden'>
      <div
        className='relative aspect-[4/3]'
        style={{
          background: `linear-gradient(135deg, hsl(${drawing.hue} 45% 92%), hsl(${(drawing.hue + 30) % 360} 40% 84%))`
        }}
      >
        <svg
          viewBox='0 0 320 240'
          preserveAspectRatio='xMidYMid meet'
          className='text-foreground/45 absolute inset-0 size-full p-6'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          aria-hidden
        >
          <rect x='10' y='10' width='300' height='220' />
          <line x1='170' y1='10' x2='170' y2='140' />
          <line x1='10' y1='140' x2='170' y2='140' />
          <line x1='170' y1='96' x2='310' y2='96' />
          <rect x='30' y='30' width='48' height='30' strokeWidth='1.5' />
          <circle cx='240' cy='55' r='16' strokeWidth='1.5' />
          <path d='M110 140 a30 30 0 0 0 30 -30' strokeWidth='1.5' />
          <path d='M170 190 a26 26 0 0 1 26 -26' strokeWidth='1.5' />
        </svg>
        <figcaption className='absolute bottom-2.5 left-2.5'>
          <Badge className='border-white/25 bg-black/35 text-white backdrop-blur-md'>{label}</Badge>
        </figcaption>
      </div>
    </figure>
  )
}

/** Gradient placeholder for a finished-interior photo (render / real). */
function PhotoTile({ photo, variantLabel }: { photo: GalleryPhoto; variantLabel: string }) {
  return (
    <figure className='glass-card group overflow-hidden'>
      <div className='relative aspect-[4/3] overflow-hidden'>
        <div
          className='size-full transition-transform duration-500 ease-out group-hover:scale-[1.06]'
          style={{
            background: `linear-gradient(135deg, hsl(${photo.hue} 70% 62%), hsl(${(photo.hue + 45) % 360} 62% 42%))`
          }}
        />
        <svg
          viewBox='0 0 320 240'
          preserveAspectRatio='xMidYMid slice'
          className='absolute inset-0 size-full text-white/25'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          aria-hidden
        >
          <circle cx='250' cy='46' r='18' className='text-white/20' />
          <line x1='0' y1='196' x2='320' y2='196' />
          <rect x='60' y='140' width='96' height='56' />
          <rect x='150' y='96' width='120' height='100' />
          <line x1='150' y1='88' x2='270' y2='88' strokeWidth='3' />
          <rect x='176' y='120' width='30' height='30' />
          <rect x='222' y='120' width='30' height='30' />
        </svg>
        <div className='absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/25 to-transparent' aria-hidden />
        <figcaption className='absolute top-2.5 left-2.5'>
          <Badge className='border-white/25 bg-black/35 text-white backdrop-blur-md'>{variantLabel}</Badge>
        </figcaption>
      </div>
    </figure>
  )
}
