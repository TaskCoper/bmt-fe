'use client'

import type { Locale } from '@/i18n/routing'
import { formatNumber } from '@/shared/utils'
import { useLocale, useTranslations } from 'next-intl'
import type { AreaMetrics } from '../../types/ai-design-result.types'
import { InfoTooltip } from './info-tooltip'

interface AIDesignResultAreaInfoProps {
  metrics: AreaMetrics
  hasTum: boolean
}

interface Row {
  labelKey: string
  tooltipKey: string
  tooltipValues?: Record<string, string | number>
  value: string
  extra?: string
}

export function AIDesignResultAreaInfo({ metrics, hasTum }: AIDesignResultAreaInfoProps) {
  const t = useTranslations('project.form.aiDesignResult')
  const locale = useLocale() as Locale
  const upperFloors = Math.max(0, metrics.floorCount - 1)

  const rows: Row[] = [
    {
      labelKey: 'area.land',
      tooltipKey: 'tooltips.area.land',
      value: `${formatNumber(metrics.landArea, locale)} m²`
    },
    {
      labelKey: 'area.groundFloor',
      tooltipKey: 'tooltips.area.groundFloor',
      value: `${formatNumber(metrics.groundFloorArea, locale)} m²`
    },
    {
      labelKey: 'area.totalFloor',
      tooltipKey: 'tooltips.area.totalFloor',
      value: `${formatNumber(metrics.totalFloorArea, locale)} m²`
    },
    {
      labelKey: 'area.usable',
      tooltipKey: 'tooltips.area.usable',
      tooltipValues: { factor: metrics.usableFactor },
      value: `${formatNumber(metrics.usableArea, locale)} m²`
    },
    {
      labelKey: 'area.floorCount',
      tooltipKey: 'tooltips.area.floorCount',
      value: t('area.floorCountValue', { count: metrics.floorCount }),
      extra: t('area.floorCountNote', { upperFloors, hasTum: hasTum ? 'yes' : 'no' })
    },
    {
      labelKey: 'area.height',
      tooltipKey: 'tooltips.area.height',
      value: t('area.heightValue', {
        height: formatNumber(metrics.estimatedHeight, locale, { maximumFractionDigits: 1 })
      })
    }
  ]

  return (
    <section className='space-y-3'>
      <h3 className='text-lg font-semibold'>{t('section4D')}</h3>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        {rows.map((row) => (
          <div key={row.labelKey} className='bg-card flex items-start justify-between gap-3 rounded-md border p-3'>
            <div className='flex flex-col gap-0.5'>
              <div className='flex items-center gap-1.5'>
                <span className='text-muted-foreground text-sm'>{t(row.labelKey as never)}</span>
                <InfoTooltip labelKey={row.tooltipKey} values={row.tooltipValues} />
              </div>
              {row.extra && <span className='text-muted-foreground text-xs'>{row.extra}</span>}
            </div>
            <span className='text-foreground text-sm font-semibold tabular-nums'>{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
