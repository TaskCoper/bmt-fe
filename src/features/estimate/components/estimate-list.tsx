'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { toast } from 'sonner'
import { Search, Plus, Eye, Trash2, SlidersHorizontal } from 'lucide-react'

import { Link, useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/constants/routes'
import type { Locale } from '@/i18n/routing'
import { formatCurrency } from '@/shared/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Label } from '@/shared/components/ui/label'
import { Slider } from '@/shared/components/ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { EmptyState, ErrorState } from '@/shared/components/common'
import { useEstimates } from '../hooks/use-estimates'
import { ESTIMATE_PRICE_MAX, ESTIMATE_PRICE_MIN, ESTIMATE_PRICE_STEP } from '../constants/estimate.constants'
import type { Estimate, EstimateFilters } from '../types/estimate.types'

const INITIAL: EstimateFilters = {
  search: '',
  status: 'all',
  minPrice: ESTIMATE_PRICE_MIN,
  maxPrice: ESTIMATE_PRICE_MAX,
  page: 1
}

export function EstimateList() {
  const t = useTranslations('estimate')
  const tc = useTranslations('common')
  const te = useTranslations('errors')
  const locale = useLocale() as Locale
  const router = useRouter()

  const [filters, setFilters] = useState<EstimateFilters>(INITIAL)
  const [priceDraft, setPriceDraft] = useState<[number, number]>([ESTIMATE_PRICE_MIN, ESTIMATE_PRICE_MAX])
  const { data, isLoading, isError, refetch } = useEstimates(filters)

  const priceActive = filters.minPrice > ESTIMATE_PRICE_MIN || filters.maxPrice < ESTIMATE_PRICE_MAX
  const money = (v: number) => formatCurrency(v, locale)
  const maxLabel = priceDraft[1] >= ESTIMATE_PRICE_MAX ? `${money(ESTIMATE_PRICE_MAX)}+` : money(priceDraft[1])

  const commitPrice = ([min, max]: number[]) =>
    setFilters((f) => ({ ...f, minPrice: min ?? ESTIMATE_PRICE_MIN, maxPrice: max ?? ESTIMATE_PRICE_MAX, page: 1 }))

  const resetPrice = () => {
    setPriceDraft([ESTIMATE_PRICE_MIN, ESTIMATE_PRICE_MAX])
    setFilters((f) => ({ ...f, minPrice: ESTIMATE_PRICE_MIN, maxPrice: ESTIMATE_PRICE_MAX, page: 1 }))
  }

  const view = (e: Estimate) => router.push(`${ROUTES.ESTIMATES}/${e.id}`)
  const remove = (e: Estimate) => toast.success(t('deleted', { name: e.name }))

  return (
    <div className='space-y-6'>
      {/* Toolbar */}
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='w-full justify-start sm:w-auto'>
              <SlidersHorizontal className='size-4' />
              {t('priceRange.label')}
              {priceActive ? <span className='bg-primary ml-1 size-2 rounded-full' /> : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent align='end' className='w-80 space-y-4'>
            <div className='flex items-center justify-between'>
              <Label>{t('priceRange.title')}</Label>
              {priceActive ? (
                <Button variant='ghost' size='sm' className='h-auto px-2 py-1 text-xs' onClick={resetPrice}>
                  {t('priceRange.reset')}
                </Button>
              ) : null}
            </div>
            <div className='flex items-center justify-between text-sm font-medium tabular-nums'>
              <span>{money(priceDraft[0])}</span>
              <span className='text-muted-foreground'>–</span>
              <span>{maxLabel}</span>
            </div>
            <Slider
              min={ESTIMATE_PRICE_MIN}
              max={ESTIMATE_PRICE_MAX}
              step={ESTIMATE_PRICE_STEP}
              value={priceDraft}
              onValueChange={(v) => setPriceDraft([v[0] ?? ESTIMATE_PRICE_MIN, v[1] ?? ESTIMATE_PRICE_MAX])}
              onValueCommit={commitPrice}
            />
          </PopoverContent>
        </Popover>
        <Button asChild>
          <Link href={ROUTES.ESTIMATE_NEW}>
            <Plus className='size-4' />
            {t('createNew')}
          </Link>
        </Button>
      </div>

      {/* States */}
      {isLoading ? (
        <div className='space-y-2' aria-busy='true'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-14 w-full' />
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
                  <TableHead className='w-32'>{t('columns.code')}</TableHead>
                  <TableHead>{t('columns.name')}</TableHead>
                  <TableHead className='text-right'>{t('columns.total')}</TableHead>
                  <TableHead className='w-24 text-right'>{t('columns.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((e, i) => (
                  <TableRow key={e.id} className={i % 2 === 1 ? 'bg-muted/30' : undefined}>
                    <TableCell className='font-mono text-xs'>
                      <button
                        type='button'
                        onClick={() => view(e)}
                        className='text-muted-foreground hover:text-foreground cursor-pointer'
                      >
                        {e.code}
                      </button>
                    </TableCell>
                    <TableCell>
                      <button type='button' onClick={() => view(e)} className='block cursor-pointer text-left'>
                        <div className='group-hover:text-primary font-medium transition-colors hover:text-primary'>
                          {e.name}
                        </div>
                        <div className='text-muted-foreground truncate text-sm'>{e.projectName}</div>
                      </button>
                    </TableCell>
                    <TableCell className='text-right font-medium tabular-nums'>
                      {formatCurrency(e.total, locale)}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='size-8'
                          aria-label={t('rowActions.view')}
                          title={t('rowActions.view')}
                          onClick={() => view(e)}
                        >
                          <Eye className='size-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-muted-foreground hover:text-destructive size-8'
                          aria-label={t('rowActions.delete')}
                          title={t('rowActions.delete')}
                          onClick={() => remove(e)}
                        >
                          <Trash2 className='size-4' />
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
