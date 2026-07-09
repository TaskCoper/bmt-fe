'use client'

import type { Locale } from '@/i18n/routing'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/shared/components/ui'
import { formatCurrency } from '@/shared/utils'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { FINISHING_ITEMS, INTERIOR_ITEMS, ROUGH_ITEMS } from '../../constants/ai-design-result.constants'
import { EstimatePart, type Budget, type EstimateItem, type PackageTier } from '../../types/ai-design-result.types'

interface ReviewEstimateProps {
  tier: PackageTier
  hasTum: boolean
  hasRoof: boolean
  budget: Budget
}

function filterItems(items: readonly EstimateItem[], hasTum: boolean, hasRoof: boolean): readonly EstimateItem[] {
  return items.filter((item) => {
    if (item.requires === 'hasTum') return hasTum
    if (item.requires === 'hasRoof') return hasRoof
    return true
  })
}

export function ReviewEstimate({ tier, hasTum, hasRoof, budget }: ReviewEstimateProps) {
  const t = useTranslations('project.form.aiDesignResult')
  const tReview = useTranslations('project.form.review.sections.estimate')
  const locale = useLocale() as Locale

  const parts = useMemo(
    () =>
      [
        { key: EstimatePart.Rough, items: filterItems(ROUGH_ITEMS, hasTum, hasRoof), amount: budget.rough },
        { key: EstimatePart.Finishing, items: FINISHING_ITEMS, amount: budget.finishing },
        { key: EstimatePart.Interior, items: INTERIOR_ITEMS, amount: budget.interior }
      ] as const,
    [budget.finishing, budget.interior, budget.rough, hasRoof, hasTum]
  )

  return (
    <div className='space-y-3'>
      <Tabs defaultValue={EstimatePart.Rough}>
        <TabsList>
          {parts.map((part) => (
            <TabsTrigger key={part.key} value={part.key}>
              {tReview(`tabs.${part.key}`)}
            </TabsTrigger>
          ))}
        </TabsList>

        {parts.map((part) => (
          <TabsContent key={part.key} value={part.key} className='pt-2'>
            <div className='overflow-hidden rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-20'>{t('columns.code')}</TableHead>
                    <TableHead>{t('columns.item')}</TableHead>
                    <TableHead className='w-16 text-right'>{t('columns.quantity')}</TableHead>
                    <TableHead className='w-36 text-right'>{t('columns.amount')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {part.items.map((item) => {
                    const amount = item.unitPricePerTier[tier] * item.quantity
                    return (
                      <TableRow key={item.code}>
                        <TableCell className='font-mono text-xs'>{item.code}</TableCell>
                        <TableCell>{t(`items.${part.key}.${item.code}.name` as never)}</TableCell>
                        <TableCell className='text-right tabular-nums'>{item.quantity}</TableCell>
                        <TableCell className='text-right font-medium tabular-nums'>
                          {formatCurrency(amount, locale)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow className='bg-primary/5'>
                    <TableCell colSpan={3} className='font-semibold'>
                      {tReview('totalRow')}
                    </TableCell>
                    <TableCell className='text-primary text-right text-sm font-bold tabular-nums'>
                      {formatCurrency(part.amount, locale)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className='bg-primary/5 flex items-center justify-between rounded-md border px-4 py-3'>
        <p className='text-sm font-semibold'>{tReview('totalRow')}</p>
        <p className='text-primary text-lg font-bold tabular-nums'>{formatCurrency(budget.total, locale)}</p>
      </div>
    </div>
  )
}
