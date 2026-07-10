'use client'

import type { Locale } from '@/i18n/routing'
import { Card, CardContent } from '@/shared/components/ui'
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

  const fmt = (n: number, opts?: Intl.NumberFormatOptions) => formatNumber(n, locale, opts)
  const fmtB = (n: number) => fmt(n, { maximumFractionDigits: 1 })
  const pill = (chunks: ReactNode) => <Pill>{chunks}</Pill>
  const regionName = t(`regionName.${consultation.region}` as 'regionName.north')

  return (
    <Card className='bg-accent/70 border-primary/25'>
      <CardContent className='space-y-3 text-sm'>
        <p className='font-semibold leading-relaxed'>
          {t.rich('greeting', { customerName: consultation.customerName, pill })}
        </p>
        <p className='leading-relaxed'>
          {t.rich('body', {
            landArea: fmt(consultation.landArea),
            floorCount: consultation.floorCount,
            totalFloorArea: fmt(consultation.totalFloorArea),
            city: consultation.city,
            budgetMin: fmtB(consultation.budgetMinBillion),
            budgetMax: fmtB(consultation.budgetMaxBillion),
            userBudget: fmtB(consultation.userBudgetBillion),
            contingencyMin: fmtB(consultation.contingencyMinBillion),
            contingencyMax: fmtB(consultation.contingencyMaxBillion),
            constructionMin: consultation.constructionMonthsMin,
            constructionMax: consultation.constructionMonthsMax,
            roughMin: consultation.roughMonthsMin,
            roughMax: consultation.roughMonthsMax,
            finishingMin: consultation.finishingMonthsMin,
            finishingMax: consultation.finishingMonthsMax,
            region: regionName,
            pill
          })}
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
