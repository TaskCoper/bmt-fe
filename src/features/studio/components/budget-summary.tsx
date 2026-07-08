'use client'

import type { Locale } from '@/i18n/routing'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/shared/utils'
import { useLocale, useTranslations } from 'next-intl'
import type { BudgetBreakdown } from '../types/studio.types'

/** Reusable "estimated budget" summary table (steps 3 & 4). */
export function BudgetSummary({ budget, className }: { budget: BudgetBreakdown; className?: string }) {
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
    { key: 'interior', value: budget.interior, note: t('interiorNote') }
  ]

  return (
    <div
      className={cn(
        'border-glass-border bg-background/40 overflow-hidden rounded-xl border backdrop-blur-sm',
        className
      )}
    >
      <table className='w-full text-sm'>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className='border-glass-border border-b'>
              <td className='px-4 py-3.5'>
                <div className='font-medium'>{t(`portion.${row.key}`)}</div>
                <div className='text-muted-foreground text-xs'>{row.note}</div>
              </td>
              <td className='px-4 py-3.5 text-right font-medium tracking-tight tabular-nums'>{money(row.value)}</td>
              <td className='px-4 py-3 text-right font-medium tabular-nums'>{money(row.value)}</td>
            </tr>
          ))}
          <tr className='bg-primary/[0.06] backdrop-blur'>
            <td className='px-4 py-3.5 font-semibold tracking-tight'>{t('total')}</td>
            <td className='text-primary px-4 py-3.5 text-right text-base font-bold tracking-tight tabular-nums'>
              {money(budget.total)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
