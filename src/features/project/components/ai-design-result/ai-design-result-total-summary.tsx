'use client'

import type { Locale } from '@/i18n/routing'
import {
  Card,
  CardContent,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import { formatCurrency, formatDate } from '@/shared/utils'
import { Lock } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { resolveDealer } from '../../constants/ai-design-result.constants'
import type { Budget } from '../../types/ai-design-result.types'
import { AIDesignResultDonut } from './ai-design-result-donut'
import { InfoTooltip } from './info-tooltip'

interface AIDesignResultTotalSummaryProps {
  budget: Budget
  userBudget: number
  city: string
  generatedAt: Date
}

const PORTIONS = [
  { key: 'rough', locked: true },
  { key: 'finishing', locked: false },
  { key: 'interior', locked: false }
] as const

export function AIDesignResultTotalSummary({ budget, userBudget, city, generatedAt }: AIDesignResultTotalSummaryProps) {
  const t = useTranslations('project.form.aiDesignResult')
  const locale = useLocale() as Locale
  const total = budget.total || 1

  const dealer = resolveDealer(city)
  const diff = Math.abs(budget.total - userBudget)
  const isBelow = budget.total <= userBudget
  const direction = isBelow ? t('totalSummary.closingBelow') : t('totalSummary.closingAbove')

  const budgetRaw = userBudget > 0 ? (budget.total / userBudget) * 100 : 0
  const budgetClamped = Math.min(100, budgetRaw)
  const budgetStatus = budgetRaw > 100 ? 'over' : budgetRaw > 90 ? 'warning' : 'ok'

  const strong = (chunks: ReactNode) => <strong className='font-semibold'>{chunks}</strong>
  const em = (chunks: ReactNode) => (
    <em
      className={cn('not-italic font-semibold', {
        'text-emerald-600': budgetStatus === 'ok',
        'text-amber-500': budgetStatus === 'warning',
        'text-destructive': budgetStatus === 'over'
      })}
    >
      {chunks}
    </em>
  )

  return (
    <section className='space-y-3'>
      <h3 className='flex items-center gap-1.5 text-lg font-semibold'>
        {t('section4E')}
        <InfoTooltip labelKey='tooltips.donut' />
      </h3>

      <Card>
        <CardContent className='grid gap-6 md:grid-cols-[3fr_2fr]'>
          <div className='overflow-hidden rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('totalSummary.portion')}</TableHead>
                  <TableHead className='text-right'>{t('totalSummary.amount')}</TableHead>
                  <TableHead className='w-20 text-right'>{t('totalSummary.share')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PORTIONS.map((p) => {
                  const amount = budget[p.key]
                  const share = Math.round((amount / total) * 100)
                  return (
                    <TableRow key={p.key}>
                      <TableCell>
                        <span className='inline-flex items-center gap-1.5'>
                          {p.locked && <Lock className='size-3' aria-hidden />}
                          {t(`totalSummary.portion${p.key.charAt(0).toUpperCase()}${p.key.slice(1)}` as never)}
                        </span>
                      </TableCell>
                      <TableCell className='text-right tabular-nums'>{formatCurrency(amount, locale)}</TableCell>
                      <TableCell className='text-right tabular-nums'>{share}%</TableCell>
                    </TableRow>
                  )
                })}
                <TableRow className='bg-primary/5'>
                  <TableCell className='font-bold'>{t('totalSummary.totalRow')}</TableCell>
                  <TableCell className='text-right text-base font-bold tabular-nums'>
                    {formatCurrency(budget.total, locale)}
                  </TableCell>
                  <TableCell className='text-right font-bold tabular-nums'>100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className='flex items-center justify-center'>
            <AIDesignResultDonut budget={budget} />
          </div>
        </CardContent>
      </Card>

      {/* Budget vs estimate progress */}
      {userBudget > 0 && (
        <div className='space-y-1.5'>
          <p className='text-muted-foreground text-xs'>
            {t.rich('totalSummary.budgetProgress', {
              actual: formatCurrency(budget.total, locale),
              budget: formatCurrency(userBudget, locale),
              strong
            })}
          </p>
          <Progress
            value={budgetClamped}
            className={cn({
              '[&_[data-slot=progress-indicator]]:bg-emerald-500 bg-emerald-500/15': budgetStatus === 'ok',
              '[&_[data-slot=progress-indicator]]:bg-amber-500 bg-amber-500/15': budgetStatus === 'warning',
              '[&_[data-slot=progress-indicator]]:bg-destructive bg-destructive/15': budgetStatus === 'over'
            })}
          />
          <p
            className={cn('text-right text-xs font-semibold tabular-nums', {
              'text-emerald-600': budgetStatus === 'ok',
              'text-amber-500': budgetStatus === 'warning',
              'text-destructive': budgetStatus === 'over'
            })}
          >
            {Math.round(budgetRaw)}%
          </p>
        </div>
      )}

      {/* Closing CTA */}
      <Card className='p-4'>
        <p className='text-sm leading-relaxed'>
          {t.rich('totalSummary.closing', {
            total: formatCurrency(budget.total, locale),
            direction,
            diff: formatCurrency(diff, locale),
            phone: dealer.phone ?? '',
            strong,
            em
          })}
        </p>
      </Card>

      <div className='text-muted-foreground space-y-0.5 text-xs'>
        <p>{t('totalSummary.disclaimer')}</p>
        <p>{t('totalSummary.generatedAt', { date: formatDate(generatedAt, locale) })}</p>
      </div>
    </section>
  )
}
