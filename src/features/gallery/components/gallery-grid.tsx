'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Search, PencilRuler, Image as ImageIcon, Download, Lock } from 'lucide-react'

import { useRouter } from '@/i18n/navigation'
import { useAuth, useAuthDialogStore } from '@/shared/auth'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip'
import {
  EmptyState,
  ErrorState,
  RevealStagger,
  StockImage,
  revealItemVariants,
  revealSpring
} from '@/shared/components/common'
import { ROUTES } from '@/shared/constants/routes'
import { useGallery } from '../hooks/use-gallery'
import { GALLERY_BUILDING, GALLERY_STYLE } from '../constants/gallery.constants'
import type { GalleryFilters, GalleryItem } from '../types/gallery.types'

const STYLE_OPTIONS = ['all', ...Object.values(GALLERY_STYLE)] as const
const BUILDING_OPTIONS = ['all', ...Object.values(GALLERY_BUILDING)] as const

const INITIAL: GalleryFilters = {
  search: '',
  style: 'all',
  building: 'all',
  sort: 'newest',
  page: 1
}

/** Public design-reference library grid (Q&A §6). */
export function GalleryGrid() {
  const t = useTranslations('gallery')
  const tc = useTranslations('common')
  const te = useTranslations('errors')
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const openAuth = useAuthDialogStore((s) => s.open)

  const [filters, setFilters] = useState<GalleryFilters>(INITIAL)
  const { data, isLoading, isError, refetch } = useGallery(filters)

  const goToDetail = (item: GalleryItem) => router.push(`${ROUTES.GALLERY}/${item.id}`)
  const startDownload = (item: GalleryItem) => toast.success(t('downloadStarted', { title: item.title }))

  // Detail is open to everyone; only downloading is gated.
  const openDetail = (item: GalleryItem) => goToDetail(item)

  // Download = the project's PDF. Gated for guests (nudge + auth popup + resume).
  const download = (item: GalleryItem) => {
    if (!isAuthenticated) {
      toast.info(t('loginToDownload'))
      openAuth('login', () => startDownload(item))
      return
    }
    startDownload(item)
  }

  return (
    <div className='space-y-6'>
      {/* Filter toolbar — glass surface: search + style/building dropdowns */}
      <div className='border-glass-border bg-background/60 flex flex-col gap-3 rounded-2xl border p-3 backdrop-blur-sm sm:flex-row sm:items-center'>
        <div className='relative flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
            placeholder={t('searchPlaceholder')}
            className='pl-9'
          />
        </div>
        <Select
          value={filters.style}
          onValueChange={(v) => setFilters((f) => ({ ...f, style: v as GalleryFilters['style'], page: 1 }))}
        >
          <SelectTrigger className='w-full sm:w-48'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STYLE_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {t(`style.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.building}
          onValueChange={(v) => setFilters((f) => ({ ...f, building: v as GalleryFilters['building'], page: 1 }))}
        >
          <SelectTrigger className='w-full sm:w-44'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BUILDING_OPTIONS.map((b) => (
              <SelectItem key={b} value={b}>
                {t(`building.${b}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* States */}
      {isLoading ? (
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-80 w-full rounded-2xl' />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title={te('generic')}
          description={te('network')}
          retryLabel={tc('more')}
          onRetry={() => refetch()}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState title={t('empty.title')} description={t('empty.description')} />
      ) : (
        <>
          <p className='text-muted-foreground text-sm'>{t('count', { count: data.meta.totalItems })}</p>

          <RevealStagger className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3' amount={0.1}>
            {data.items.map((item) => (
              <motion.article
                key={item.id}
                variants={revealItemVariants}
                whileHover={{ y: -6 }}
                transition={revealSpring}
                className='glass-card group flex flex-col overflow-hidden'
              >
                {/* Cover — click opens detail (members only) */}
                <button
                  type='button'
                  onClick={() => openDetail(item)}
                  aria-label={item.title}
                  className='block cursor-pointer text-left'
                >
                  <div className='relative aspect-[4/3] overflow-hidden'>
                    <StockImage
                      seed={item.id}
                      alt={item.title}
                      width={600}
                      className='size-full transition-transform duration-500 ease-out group-hover:scale-[1.06]'
                    />

                    {/* Top scrim keeps the badges legible over any hue */}
                    <div
                      className='absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent'
                      aria-hidden
                    />
                    {/* Asset-group counts: drawings + interior photos */}
                    <div className='absolute top-2.5 left-2.5 flex gap-1.5'>
                      <span
                        title={t('card.drawings', { count: item.drawings.length })}
                        className='inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/35 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-md'
                      >
                        <PencilRuler className='size-3' />
                        {item.drawings.length}
                      </span>
                      <span
                        title={t('card.photos', { count: item.photos.length })}
                        className='inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/35 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-md'
                      >
                        <ImageIcon className='size-3' />
                        {item.photos.length}
                      </span>
                    </div>
                  </div>
                </button>

                <div className='flex flex-1 flex-col gap-3 p-4'>
                  <button type='button' onClick={() => openDetail(item)} className='cursor-pointer space-y-1 text-left'>
                    <h3 className='group-hover:text-primary leading-tight font-semibold tracking-tight transition-colors'>
                      {item.title}
                    </h3>
                    <p className='text-muted-foreground line-clamp-2 text-sm'>{item.description}</p>
                  </button>
                  <div className='flex flex-wrap gap-1.5'>
                    <Badge variant='outline'>{t(`style.${item.style}`)}</Badge>
                    <Badge variant='outline'>{t(`building.${item.building}`)}</Badge>
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant='secondary'>
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Download the project's PDF — gated for guests */}
                  <div className='mt-auto pt-1'>
                    {isAuthenticated ? (
                      <Button variant='outline' size='sm' className='w-full' onClick={() => download(item)}>
                        <Download className='size-4' />
                        {t('download')}
                      </Button>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant='outline' size='sm' className='w-full' onClick={() => download(item)}>
                            <Lock className='size-4' />
                            {t('download')}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t('loginToDownload')}</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </RevealStagger>

          {data.meta.totalPages > 1 ? (
            <div className='flex items-center justify-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                disabled={data.meta.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
              >
                {tc('previous')}
              </Button>
              <span className='text-muted-foreground text-sm'>
                {tc('pageOf', { page: data.meta.page, total: data.meta.totalPages })}
              </span>
              <Button
                variant='outline'
                size='sm'
                disabled={data.meta.page >= data.meta.totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
              >
                {tc('next')}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
