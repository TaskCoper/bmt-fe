'use client'

import type { Locale } from '@/i18n/routing'
import { formatNumber } from '@/shared/utils'
import { useLocale, useTranslations } from 'next-intl'
import type { AreaSummary as AreaSummaryData } from '../types/studio.types'

/** Construction-area summary table (step 4D). */
export function AreaSummary({ area }: { area: AreaSummaryData }) {
  const t = useTranslations('studio.area')
  const locale = useLocale() as Locale
  const n = (v: number) => formatNumber(v, locale)

  const rows: Array<{
    key: 'land' | 'ground' | 'totalFloor' | 'usable' | 'floors' | 'height'
    value: string
  }> = [
    { key: 'land', value: `${n(area.landArea)} m²` },
    { key: 'ground', value: `${n(area.groundFloorArea)} m²` },
    { key: 'totalFloor', value: `${n(area.totalFloorArea)} m²` },
    { key: 'usable', value: `${n(area.usableArea)} m²` },
    { key: 'floors', value: t('floorsValue', { count: area.floors }) },
    { key: 'height', value: `${n(area.estimatedHeight)} m` }
  ]

  return (
    <dl className='divide-glass-border border-glass-border bg-background/40 divide-y rounded-xl border text-sm backdrop-blur-sm'>
      {rows.map((row) => (
        <div key={row.key} className='flex items-center justify-between px-4 py-3'>
          <dt className='text-muted-foreground'>{t(row.key)}</dt>
          <dd className='font-medium tracking-tight tabular-nums'>{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
