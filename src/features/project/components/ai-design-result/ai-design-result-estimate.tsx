'use client'

import type { Locale } from '@/i18n/routing'
import {
  Badge,
  Popover,
  PopoverAnchor,
  PopoverContent,
  Progress,
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
import { cn } from '@/shared/lib/utils'
import { formatCurrency, formatNumber } from '@/shared/utils'
import { Lock } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useRef, useState } from 'react'
import {
  FINISHING_ITEMS,
  INTERIOR_ITEMS,
  ROUGH_ITEMS,
  USER_BUDGET_SHARES
} from '../../constants/ai-design-result.constants'
import type { EstimateItem, EstimatePart, PackageTier } from '../../types/ai-design-result.types'
import { EstimatePart as EstimatePartEnum } from '../../types/ai-design-result.types'
import { AIDesignResultItemPopover } from './ai-design-result-item-popover'
import { InfoTooltip } from './info-tooltip'

interface AIDesignResultEstimateProps {
  tier: PackageTier
  hasTum: boolean
  hasRoof: boolean
  city: string
  userBudget: number
}

interface TabData {
  part: EstimatePart
  items: readonly EstimateItem[]
  target: number
  actual: number
}

function filterItems(items: readonly EstimateItem[], hasTum: boolean, hasRoof: boolean): readonly EstimateItem[] {
  return items.filter((item) => {
    if (item.requires === 'hasTum') return hasTum
    if (item.requires === 'hasRoof') return hasRoof
    return true
  })
}

function sumItems(items: readonly EstimateItem[], tier: PackageTier): number {
  return items.reduce((sum, item) => sum + item.unitPricePerTier[tier] * item.quantity, 0)
}

export function AIDesignResultEstimate({ tier, hasTum, hasRoof, city, userBudget }: AIDesignResultEstimateProps) {
  const t = useTranslations('project.form.aiDesignResult')

  const tabs = useMemo<TabData[]>(() => {
    const rough = filterItems(ROUGH_ITEMS, hasTum, hasRoof)
    const finishing = FINISHING_ITEMS
    const interior = INTERIOR_ITEMS
    return [
      {
        part: EstimatePartEnum.Rough,
        items: rough,
        target: userBudget * USER_BUDGET_SHARES.rough,
        actual: sumItems(rough, tier)
      },
      {
        part: EstimatePartEnum.Finishing,
        items: finishing,
        target: userBudget * USER_BUDGET_SHARES.finishing,
        actual: sumItems(finishing, tier)
      },
      {
        part: EstimatePartEnum.Interior,
        items: interior,
        target: userBudget * USER_BUDGET_SHARES.interior,
        actual: sumItems(interior, tier)
      }
    ]
  }, [tier, hasTum, hasRoof, userBudget])

  return (
    <section className='space-y-3'>
      <h3 className='text-lg font-semibold'>{t('section4B')}</h3>
      <Tabs defaultValue={EstimatePartEnum.Rough}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.part} value={tab.part} className='gap-1.5'>
              {tab.part === EstimatePartEnum.Rough && <Lock className='size-3' aria-hidden />}
              {t(`estimateTabs.${tab.part}` as never)}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.part} value={tab.part} className='space-y-4 pt-2'>
            <EstimateTable items={tab.items} part={tab.part} tier={tier} city={city} />
            <EstimateProgress actual={tab.actual} target={tab.target} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

interface EstimateTableProps {
  items: readonly EstimateItem[]
  part: EstimatePart
  tier: PackageTier
  city: string
}

function EstimateTable({ items, part, tier, city }: EstimateTableProps) {
  const t = useTranslations('project.form.aiDesignResult')
  const locale = useLocale() as Locale
  const [openCode, setOpenCode] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openRow = (code: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setOpenCode(code)
  }

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenCode(null), 200)
  }

  return (
    <div className='overflow-hidden rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-24'>{t('columns.code')}</TableHead>
            <TableHead>{t('columns.item')}</TableHead>
            <TableHead className='w-24'>
              <span className='inline-flex items-center gap-1'>
                {t('columns.unit')}
                <InfoTooltip labelKey='tooltips.unit' />
              </span>
            </TableHead>
            <TableHead className='w-20 text-right'>{t('columns.quantity')}</TableHead>
            <TableHead className='w-40 text-right'>{t('columns.unitPrice')}</TableHead>
            <TableHead className='w-40 text-right'>{t('columns.amount')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const unitPrice = item.unitPricePerTier[tier]
            const amount = unitPrice * item.quantity
            return (
              <Popover
                key={item.code}
                open={openCode === item.code}
                onOpenChange={(next) => !next && setOpenCode(null)}
              >
                <PopoverAnchor asChild>
                  <TableRow
                    tabIndex={0}
                    onMouseEnter={() => openRow(item.code)}
                    onMouseLeave={scheduleClose}
                    onFocus={() => openRow(item.code)}
                    onBlur={scheduleClose}
                    onClick={() => setOpenCode(openCode === item.code ? null : item.code)}
                    className='cursor-pointer'
                  >
                    <TableCell className='font-mono text-xs'>{item.code}</TableCell>
                    <TableCell>
                      <span className='inline-flex items-center gap-1.5'>
                        {t(`items.${part}.${item.code}.name` as never)}
                        {item.code === 'THO-01' && <InfoTooltip labelKey='tooltips.btct' />}
                        {item.isConditional && (
                          <Badge variant='outline' className='py-0 text-[10px]'>
                            {t('conditionalBadge')}
                            <InfoTooltip labelKey='tooltips.dk' className='size-3' />
                          </Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className='inline-flex items-center gap-1'>
                        {t(`units.${item.unit}` as never)}
                        {item.unit === 'md' && <InfoTooltip labelKey='tooltips.md' />}
                      </span>
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>{formatNumber(item.quantity, locale)}</TableCell>
                    <TableCell className='text-right tabular-nums'>{formatCurrency(unitPrice, locale)}</TableCell>
                    <TableCell className='text-right font-semibold tabular-nums'>
                      {formatCurrency(amount, locale)}
                    </TableCell>
                  </TableRow>
                </PopoverAnchor>
                <PopoverContent
                  side='left'
                  align='start'
                  className='w-80'
                  onMouseEnter={() => openRow(item.code)}
                  onMouseLeave={scheduleClose}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <AIDesignResultItemPopover item={item} part={part} tier={tier} city={city} />
                </PopoverContent>
              </Popover>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

interface EstimateProgressProps {
  actual: number
  target: number
}

function EstimateProgress({ actual, target }: EstimateProgressProps) {
  const t = useTranslations('project.form.aiDesignResult')
  const locale = useLocale() as Locale
  const raw = target === 0 ? 0 : (actual / target) * 100
  const clamped = Math.min(100, raw)
  const overshoot = raw > 100

  return (
    <div className='space-y-1.5'>
      <div className='flex items-center justify-between text-xs'>
        <span className='text-muted-foreground inline-flex items-center gap-1'>
          {t('progressTarget', { actual: formatCurrency(actual, locale), target: formatCurrency(target, locale) })}
          <InfoTooltip labelKey='tooltips.progressTarget' />
        </span>
        <span className={cn('font-semibold tabular-nums', overshoot && 'text-destructive')}>{Math.round(raw)}%</span>
      </div>
      <Progress
        value={clamped}
        className={cn(overshoot && '[&_[data-slot=progress-indicator]]:bg-destructive bg-destructive/20')}
      />
    </div>
  )
}
