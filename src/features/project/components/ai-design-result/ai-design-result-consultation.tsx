'use client'

import { Card, CardContent } from '@/shared/components/ui'
import type { Locale } from '@/i18n/routing'
import { formatNumber } from '@/shared/utils'
import { useLocale, useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import type { Consultation } from '../../types/ai-design-result.types'
import { InfoTooltip } from './info-tooltip'

interface AIDesignResultConsultationProps {
  consultation: Consultation
}

const Pill = ({ children }: { children: ReactNode }) => (
  <span className='bg-primary/20 text-foreground mx-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums'>
    {children}
  </span>
)

export function AIDesignResultConsultation({ consultation }: AIDesignResultConsultationProps) {
  const t = useTranslations('project.form.aiDesignResult.consultation')
  const locale = useLocale() as Locale

  return (
    <Card className='bg-accent/70 border-primary/25'>
      <CardContent className='space-y-3 text-sm'>
        <p className='leading-relaxed'>
          {t.rich('body', {
            customerName: consultation.customerName,
            landArea: formatNumber(consultation.landArea, locale),
            floorCount: consultation.floorCount,
            totalFloorArea: formatNumber(consultation.totalFloorArea, locale),
            city: consultation.city,
            budgetMin: formatNumber(consultation.budgetMinBillion, locale, { maximumFractionDigits: 1 }),
            budgetMax: formatNumber(consultation.budgetMaxBillion, locale, { maximumFractionDigits: 1 }),
            pill: (chunks) => <Pill>{chunks}</Pill>
          })}
        </p>
        <p className='text-muted-foreground flex items-start gap-1.5 text-xs'>
          <span>{t('distribution')}</span>
          <InfoTooltip labelKey='tooltips.marketShares' />
        </p>
        {consultation.hasTum && (
          <p className='text-muted-foreground flex items-start gap-1.5 text-xs'>
            <span>{t('tumNote')}</span>
            <InfoTooltip labelKey='tooltips.tum' />
          </p>
        )}
      </CardContent>
    </Card>
  )
}
