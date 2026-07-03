'use client'

import { useTranslations, useLocale } from 'next-intl'

import type { Locale } from '@/i18n/routing'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/shared/utils'
import type { BudgetBreakdown } from '../types/studio.types'

/** Reusable "estimated budget" summary table (steps 3 & 4). */
export function BudgetSummary({
  budget,
  className,
}: {
  budget: BudgetBreakdown
  className?: string
}) {
  const t = useTranslations('studio.budget')
  const locale = useLocale() as Locale
  const money = (v: number) => formatCurrency(v, locale)

  const rows: Array<{
    key: 'rough' | 'finishing' | 'interior'
    value: number
    note: string
  }> = [
    { key: 'rough', value: budget.rough, note: t('roughNote') },
    { key: 'finishing', value: budget.finishing, note: t('finishingNote') },
    { key: 'interior', value: budget.interior, note: t('interiorNote') },
  ]

  return (
    <div className={cn('rounded-lg border', className)}>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b last:border-0">
              <td className="px-4 py-3">
                <div className="font-medium">{t(`portion.${row.key}`)}</div>
                <div className="text-muted-foreground text-xs">{row.note}</div>
              </td>
              <td className="px-4 py-3 text-right font-medium tabular-nums">
                {money(row.value)}
              </td>
            </tr>
          ))}
          <tr className="bg-muted/50">
            <td className="px-4 py-3 font-semibold">{t('total')}</td>
            <td className="text-primary px-4 py-3 text-right text-base font-bold tabular-nums">
              {money(budget.total)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
