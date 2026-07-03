'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import {
  Search,
  Download,
  Lock,
  FileText,
  Image,
  PencilRuler,
} from 'lucide-react'

import { useAuth } from '@/shared/auth'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import { EmptyState, ErrorState } from '@/shared/components/common'
import { useGallery } from '../hooks/use-gallery'
import {
  GALLERY_BUILDING,
  GALLERY_KIND,
  GALLERY_SORT,
  GALLERY_STYLE,
} from '../constants/gallery.constants'
import type { GalleryFilters, GalleryItem } from '../types/gallery.types'

const STYLE_OPTIONS = ['all', ...Object.values(GALLERY_STYLE)] as const
const BUILDING_OPTIONS = ['all', ...Object.values(GALLERY_BUILDING)] as const

const KIND_ICON = {
  [GALLERY_KIND.IMAGE]: Image,
  [GALLERY_KIND.DRAWING]: PencilRuler,
  [GALLERY_KIND.PDF]: FileText,
} as const

const INITIAL: GalleryFilters = {
  search: '',
  style: 'all',
  building: 'all',
  sort: 'newest',
  page: 1,
}

/** Public design-reference library grid (Q&A §6). */
export function GalleryGrid() {
  const t = useTranslations('gallery')
  const tc = useTranslations('common')
  const te = useTranslations('errors')
  const { isAuthenticated } = useAuth()

  const [filters, setFilters] = useState<GalleryFilters>(INITIAL)
  const { data, isLoading, isError, refetch } = useGallery(filters)

  const download = (item: GalleryItem) => {
    if (!isAuthenticated) {
      toast.info(t('loginToDownload'))
      return
    }
    toast.success(t('downloadStarted', { title: item.title }))
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
            }
            placeholder={t('searchPlaceholder')}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.style}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              style: v as GalleryFilters['style'],
              page: 1,
            }))
          }
        >
          <SelectTrigger>
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
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              building: v as GalleryFilters['building'],
              page: 1,
            }))
          }
        >
          <SelectTrigger>
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
        <Select
          value={filters.sort}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              sort: v as GalleryFilters['sort'],
              page: 1,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GALLERY_SORT.map((s) => (
              <SelectItem key={s} value={s}>
                {t(`sort.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
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
        <EmptyState
          title={t('empty.title')}
          description={t('empty.description')}
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item) => {
              const KindIcon = KIND_ICON[item.kind]
              return (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-xl border"
                >
                  {/* Thumbnail (all visitors see this) */}
                  <div className="relative aspect-[4/3]">
                    <div
                      className="size-full"
                      style={{
                        background: `linear-gradient(135deg, hsl(${item.hue} 65% 55%), hsl(${(item.hue + 40) % 360} 60% 38%))`,
                      }}
                    />
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2 gap-1"
                    >
                      <KindIcon className="size-3" />
                      {t(`kind.${item.kind}`)}
                    </Badge>
                  </div>

                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline">
                        {t(`style.${item.style}`)}
                      </Badge>
                      <Badge variant="outline">
                        {t(`building.${item.building}`)}
                      </Badge>
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Download — gated for guests */}
                    {isAuthenticated ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => download(item)}
                      >
                        <Download className="size-4" />
                        {t('download')}
                      </Button>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => download(item)}
                          >
                            <Lock className="size-4" />
                            {t('download')}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t('loginToDownload')}</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {t('count', { count: data.meta.totalItems })}
            </p>
            {data.meta.totalPages > 1 ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.meta.page <= 1}
                  onClick={() =>
                    setFilters((f) => ({ ...f, page: f.page - 1 }))
                  }
                >
                  {tc('previous')}
                </Button>
                <span className="text-muted-foreground text-sm">
                  {tc('pageOf', {
                    page: data.meta.page,
                    total: data.meta.totalPages,
                  })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.meta.page >= data.meta.totalPages}
                  onClick={() =>
                    setFilters((f) => ({ ...f, page: f.page + 1 }))
                  }
                >
                  {tc('next')}
                </Button>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}
