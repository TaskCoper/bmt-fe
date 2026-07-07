'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Search, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { EmptyState, ErrorState } from '@/shared/components/common'
import { useGalleryAdmin } from '../hooks/use-gallery'
import type { GalleryFilters, GalleryItem } from '../types/gallery.types'
import { GalleryFormDialog } from './gallery-form-dialog'

const INITIAL: GalleryFilters = {
  search: '',
  style: 'all',
  building: 'all',
  sort: 'newest',
  page: 1
}

/** Admin management table for the design library (Q&A §7.2.2). */
export function GalleryAdminTable() {
  const t = useTranslations('gallery')
  const tForm = useTranslations('gallery.form')
  const tc = useTranslations('common')
  const te = useTranslations('errors')

  const [filters, setFilters] = useState<GalleryFilters>(INITIAL)
  const { data, isLoading, isError, refetch } = useGalleryAdmin(filters)

  const togglePublish = (item: GalleryItem) =>
    toast.success(
      item.published ? tForm('hidden', { title: item.title }) : tForm('publishedToast', { title: item.title })
    )

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
        <div className='relative flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
            placeholder={t('searchPlaceholder')}
            className='pl-9'
          />
        </div>
        <GalleryFormDialog
          trigger={
            <Button>
              <Plus className='size-4' />
              {tForm('add')}
            </Button>
          }
        />
      </div>

      {isLoading ? (
        <div className='space-y-2' aria-busy='true'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-12 w-full' />
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
          <div className='rounded-lg border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-14' />
                  <TableHead>{tForm('titleLabel')}</TableHead>
                  <TableHead className='w-32'>{tForm('styleLabel')}</TableHead>
                  <TableHead className='w-28'>{tForm('kindLabel')}</TableHead>
                  <TableHead className='w-28'>{tForm('statusLabel')}</TableHead>
                  <TableHead className='w-28 text-right'>
                    <span className='sr-only'>{tc('actions')}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div
                        className='size-9 rounded-md'
                        style={{
                          background: `linear-gradient(135deg, hsl(${item.hue} 65% 55%), hsl(${(item.hue + 40) % 360} 60% 38%))`
                        }}
                      />
                    </TableCell>
                    <TableCell className='font-medium'>{item.title}</TableCell>
                    <TableCell className='text-muted-foreground'>{t(`style.${item.style}`)}</TableCell>
                    <TableCell>
                      <Badge variant='outline'>{t(`kind.${item.kind}`)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.published ? 'success' : 'secondary'}>
                        {item.published ? tForm('published') : tForm('draft')}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          aria-label={tForm('togglePublish')}
                          onClick={() => togglePublish(item)}
                        >
                          {item.published ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                        </Button>
                        <GalleryFormDialog
                          item={item}
                          trigger={
                            <Button variant='ghost' size='icon' aria-label={tc('edit')}>
                              <Pencil className='size-4' />
                            </Button>
                          }
                        />
                        <Button
                          variant='ghost'
                          size='icon'
                          aria-label={tc('delete')}
                          onClick={() => toast.success(tForm('deleted', { title: item.title }))}
                        >
                          <Trash2 className='text-destructive size-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='flex items-center justify-between'>
            <p className='text-muted-foreground text-sm'>{t('count', { count: data.meta.totalItems })}</p>
            {data.meta.totalPages > 1 ? (
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={data.meta.page <= 1}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                >
                  {tc('previous')}
                </Button>
                <span className='text-muted-foreground text-sm'>
                  {tc('pageOf', {
                    page: data.meta.page,
                    total: data.meta.totalPages
                  })}
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
          </div>
        </>
      )}
    </div>
  )
}
