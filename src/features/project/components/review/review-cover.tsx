'use client'

import type { Locale } from '@/i18n/routing'
import { Input, Label } from '@/shared/components/ui'
import { formatDate } from '@/shared/utils'
import { useLocale, useTranslations } from 'next-intl'
import type { HouseType } from '../../types/project.types'

interface ReviewCoverProps {
  projectName: string
  houseType: HouseType
  clientName: string
  onClientNameChange: (value: string) => void
  generatedAt: Date
}

export function ReviewCover({ projectName, houseType, clientName, onClientNameChange, generatedAt }: ReviewCoverProps) {
  const t = useTranslations('project.form.review.sections.cover')
  const tHouseType = useTranslations('project.form.aiDesignResult.houseTypeValue')
  const locale = useLocale() as Locale

  return (
    <div className='space-y-4'>
      <div
        className='border-primary/40 relative overflow-hidden rounded-lg border p-6'
        style={{
          background:
            'linear-gradient(135deg, oklch(0.965 0.02 90 / 0.9), oklch(0.99 0.01 90 / 0.7)),' +
            'radial-gradient(circle at 15% 20%, oklch(0.72 0.14 45 / 0.15), transparent 60%),' +
            'radial-gradient(circle at 85% 100%, oklch(0.55 0.15 165 / 0.14), transparent 55%)'
        }}
      >
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <div className='bg-primary text-primary-foreground grid size-10 place-items-center rounded-md text-sm font-bold tracking-widest'>
              BMT
            </div>
            <div className='text-xs leading-tight'>
              <p className='font-semibold'>{t('brand')}</p>
              <p className='text-muted-foreground'>{t('contactPhone')}</p>
              <p className='text-muted-foreground'>{t('contactWebsite')}</p>
            </div>
          </div>
          <p className='text-muted-foreground text-right text-xs'>
            {t('exportedAt', { date: formatDate(generatedAt, locale) })}
          </p>
        </div>

        <div className='mt-8 space-y-2'>
          <p className='text-muted-foreground text-xs uppercase tracking-widest'>{t('projectNameLabel')}</p>
          <p className='text-3xl font-semibold leading-tight'>{projectName}</p>
          <p className='text-muted-foreground text-sm'>
            <span className='mr-1 font-medium'>{t('houseTypeLabel')}:</span>
            {tHouseType(houseType)}
          </p>
        </div>

        {clientName.trim() && (
          <p className='text-foreground mt-6 text-sm'>
            <span className='text-muted-foreground'>{t('clientNameLabel')}:</span>{' '}
            <span className='font-medium'>{clientName}</span>
          </p>
        )}
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='review-client-name' className='text-xs'>
          {t('clientNameLabel')}
        </Label>
        <Input
          id='review-client-name'
          value={clientName}
          onChange={(event) => onClientNameChange(event.target.value)}
          placeholder={t('clientNamePlaceholder')}
        />
      </div>
    </div>
  )
}
