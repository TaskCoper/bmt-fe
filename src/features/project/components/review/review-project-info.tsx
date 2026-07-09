'use client'

import type { Locale } from '@/i18n/routing'
import { formatCurrency, formatDate, formatNumber } from '@/shared/utils'
import { useLocale, useTranslations } from 'next-intl'
import type { AreaMetrics } from '../../types/ai-design-result.types'

interface ReviewProjectInfoProps {
  projectName: string
  metrics: AreaMetrics
  city: string
  clientBudget: number
  packageName: string
  createdAt: string
}

export function ReviewProjectInfo({
  projectName,
  metrics,
  city,
  clientBudget,
  packageName,
  createdAt
}: ReviewProjectInfoProps) {
  const t = useTranslations('project.form.review.sections.projectInfo')
  const locale = useLocale() as Locale

  const rows: Array<{ label: string; value: string }> = [
    { label: t('landArea'), value: `${formatNumber(metrics.landArea, locale)} m²` },
    {
      label: t('totalFloorArea'),
      value: `${formatNumber(metrics.totalFloorArea, locale)} m²`
    },
    { label: t('floorCount'), value: `${metrics.floorCount}` },
    { label: t('city'), value: city },
    { label: t('budget'), value: formatCurrency(clientBudget, locale) },
    { label: t('package'), value: packageName },
    { label: t('createdAt'), value: formatDate(createdAt, locale) }
  ]

  return (
    <div className='space-y-3'>
      <p className='text-sm font-medium'>{projectName}</p>
      <dl className='bg-card grid grid-cols-1 gap-x-6 gap-y-2 rounded-md border p-4 sm:grid-cols-2'>
        {rows.map((row) => (
          <div key={row.label} className='flex items-center justify-between gap-3 text-sm'>
            <dt className='text-muted-foreground'>{row.label}</dt>
            <dd className='font-medium tabular-nums'>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
