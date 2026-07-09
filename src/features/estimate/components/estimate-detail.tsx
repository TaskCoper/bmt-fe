'use client'

import { Fragment } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowLeft, Ruler, Layers, DoorOpen, Building2, Package } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/shared/constants/routes'
import type { Locale } from '@/i18n/routing'
import { formatCurrency, formatDate } from '@/shared/utils'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { EmptyState, ErrorState } from '@/shared/components/common'
import { useEstimate } from '../hooks/use-estimates'
import { calcEstimate } from '../services/estimate.service'
import type { EstimateStatus } from '../constants/estimate.constants'

const STATUS_VARIANT: Record<EstimateStatus, 'default' | 'secondary' | 'success' | 'warning' | 'outline'> = {
  draft: 'secondary',
  pending: 'warning',
  approved: 'success',
  rejected: 'outline'
}

export function EstimateDetail({ id }: { id: string }) {
  const t = useTranslations('estimate.detail')
  const tc = useTranslations('estimate.creator')
  const tl = useTranslations('estimate')
  const te = useTranslations('errors')
  const tCommon = useTranslations('common')
  const locale = useLocale() as Locale

  const { data: estimate, isLoading, isError, refetch } = useEstimate(id)
  const money = (v: number) => formatCurrency(v, locale)
  const result = estimate?.input ? calcEstimate(estimate.input) : null

  const backLink = (
    <Button variant='ghost' size='sm' asChild className='-ml-2 w-fit'>
      <Link href={ROUTES.ESTIMATES}>
        <ArrowLeft className='size-4' />
        {t('back')}
      </Link>
    </Button>
  )

  if (isLoading) {
    return (
      <div className='space-y-6'>
        {backLink}
        <Skeleton className='h-24 w-full' />
        <Skeleton className='h-64 w-full' />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='space-y-6'>
        {backLink}
        <ErrorState
          title={te('generic')}
          description={te('network')}
          retryLabel={tCommon('more')}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  if (!estimate) {
    return (
      <div className='space-y-6'>
        {backLink}
        <EmptyState title={t('notFound.title')} description={t('notFound.description')} />
      </div>
    )
  }

  const meta = estimate.input
    ? [
        { icon: Ruler, label: tc('areaLabel'), value: `${estimate.input.area} m²` },
        { icon: Layers, label: tc('floorsLabel'), value: estimate.input.floors },
        { icon: DoorOpen, label: tc('roomsLabel'), value: estimate.input.rooms },
        { icon: Building2, label: tc('buildingLabel'), value: tc(`building.${estimate.input.building}`) },
        { icon: Package, label: tc('packageLabel'), value: tc(`package.${estimate.input.packageId}`) }
      ]
    : []

  return (
    <div className='space-y-6'>
      {backLink}

      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-3'>
            <h1 className='text-2xl font-semibold tracking-tight'>{estimate.name}</h1>
            <Badge variant={STATUS_VARIANT[estimate.status]}>{tl(`status.${estimate.status}`)}</Badge>
          </div>
          <p className='text-muted-foreground text-sm'>{estimate.projectName}</p>
          <p className='text-muted-foreground text-xs'>
            <span className='font-mono'>{estimate.code}</span>
            {' · '}
            {t('createdAt', { date: formatDate(estimate.createdAt, locale) })}
          </p>
        </div>
        <div className='sm:text-right'>
          <p className='text-muted-foreground text-xs'>{t('totalLabel')}</p>
          <p className='text-primary text-2xl font-bold tabular-nums'>{money(estimate.total)}</p>
        </div>
      </div>

      {/* Description */}
      {estimate.description ? (
        <Card>
          <CardContent className='p-6'>
            <h2 className='mb-2 text-sm font-semibold'>{t('descriptionTitle')}</h2>
            <p className='text-muted-foreground text-sm leading-relaxed'>{estimate.description}</p>
          </CardContent>
        </Card>
      ) : null}

      {/* Parameters + breakdown */}
      {result ? (
        <Card>
          <CardContent className='space-y-6 p-6'>
            {/* Parameters */}
            <div>
              <h2 className='mb-3 text-sm font-semibold'>{t('parametersTitle')}</h2>
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
                {meta.map((m) => (
                  <div key={m.label} className='flex items-center gap-3 rounded-lg border p-3'>
                    <m.icon className='text-muted-foreground size-4 shrink-0' />
                    <div className='min-w-0'>
                      <div className='text-muted-foreground text-xs'>{m.label}</div>
                      <div className='truncate text-sm font-medium'>{m.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown */}
            <div>
              <h2 className='mb-3 text-sm font-semibold'>{t('breakdownTitle')}</h2>
              <div className='rounded-lg border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{tc('columns.portion')}</TableHead>
                      <TableHead className='w-36 text-right'>{tc('columns.quantity')}</TableHead>
                      <TableHead className='w-36 text-right'>{tc('columns.unitPrice')}</TableHead>
                      <TableHead className='w-36 text-right'>{tc('columns.amount')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.lines.map((line) => (
                      <Fragment key={line.portion}>
                        <TableRow className='bg-muted hover:bg-muted'>
                          <TableCell className='font-semibold'>{tc(`portion.${line.portion}`)}</TableCell>
                          <TableCell className='text-right tabular-nums'>
                            {line.quantity} {line.unit}
                          </TableCell>
                          <TableCell className='text-right font-medium tabular-nums'>{money(line.unitPrice)}</TableCell>
                          <TableCell className='text-right font-semibold tabular-nums'>{money(line.amount)}</TableCell>
                        </TableRow>
                        {line.items.map((it, j) => (
                          <TableRow key={it.key} className={j % 2 === 1 ? 'bg-muted/40' : undefined}>
                            <TableCell className='text-muted-foreground py-2 pl-8 text-sm'>
                              {tc(`subPortion.${it.key}`)}
                            </TableCell>
                            <TableCell className='py-2 text-right text-sm tabular-nums'>
                              {it.quantity} {it.unit}
                            </TableCell>
                            <TableCell className='py-2 text-right text-sm tabular-nums'>
                              {money(it.unitPrice)}
                            </TableCell>
                            <TableCell className='py-2 text-right text-sm tabular-nums'>{money(it.amount)}</TableCell>
                          </TableRow>
                        ))}
                      </Fragment>
                    ))}
                    <TableRow className='border-t-2 bg-transparent'>
                      <TableCell colSpan={3} className='font-semibold'>
                        {tc('total')}
                      </TableCell>
                      <TableCell className='text-primary text-right text-base font-bold tabular-nums'>
                        {money(result.total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
