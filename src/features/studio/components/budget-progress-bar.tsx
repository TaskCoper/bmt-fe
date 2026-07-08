'use client'

import { useLocale, useTranslations } from 'next-intl'

import type { Locale } from '@/i18n/routing'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/shared/utils'

/**
 * Selected-total vs target-budget bar. Colour AND an explicit delta amount
 * signal over/under budget (never colour alone).
 */
export function BudgetProgressBar({
  total,
  target,
  className,
}: {
  total: number
  target: number
  className?: string
}) {
  const t = useTranslations('studio.progress')
  const locale = useLocale() as Locale

  const ratio = target > 0 ? total / target : 0
  const pct = Math.min(100, Math.round(ratio * 100))
  const over = total > target
  const delta = Math.abs(target - total)

  // ≤100% ok, ≤110% warning, above danger.
  const tone = ratio <= 1 ? 'success' : ratio <= 1.1 ? 'warning' : 'destructive'
  const barColor =
    tone === 'success'
      ? 'bg-success'
      : tone === 'warning'
        ? 'bg-warning'
        : 'bg-destructive'
  const textColor =
    tone === 'success'
      ? 'text-success'
      : tone === 'warning'
        ? 'text-warning'
        : 'text-destructive'

  const message =
    delta === 0
      ? t('exact')
      : over
        ? t('over', { amount: formatCurrency(delta, locale) })
        : t('within', { amount: formatCurrency(delta, locale) })

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t('label')}</span>
        <span className={cn('font-medium tabular-nums', textColor)}>
          {message}
        </span>
      </div>
      <div className="glass-inset h-2.5 w-full overflow-hidden rounded-full">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-soft)]',
            barColor,
          )}
          style={{ width: `${Math.max(2, pct)}%` }}
        />
      </div>
      {over ? (
        <p className="text-muted-foreground text-xs">{t('hint')}</p>
      ) : null}
    </div>
  )
}
