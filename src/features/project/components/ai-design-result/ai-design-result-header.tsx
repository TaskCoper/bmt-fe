'use client'

import { Badge } from '@/shared/components/ui'
import { useTranslations } from 'next-intl'
import type { HouseType } from '../../types/project.types'
import { InfoTooltip } from './info-tooltip'

interface AIDesignResultHeaderProps {
  houseType: HouseType
  floorCount: number
  hasTum: boolean
}

export function AIDesignResultHeader({ houseType, floorCount, hasTum }: AIDesignResultHeaderProps) {
  const t = useTranslations('project.form.aiDesignResult')
  const upperFloors = Math.max(0, floorCount - 1)

  return (
    <div className='space-y-2'>
      <div className='flex flex-wrap items-center gap-3'>
        <p className='text-2xl font-semibold'>{t('title')}</p>
        <Badge variant='secondary' className='gap-1.5 py-1'>
          <span>{t('configChip', { houseType, upperFloors, hasTum: hasTum ? 'yes' : 'no' })}</span>
          <InfoTooltip labelKey='tooltips.chip' />
        </Badge>
      </div>
      <p className='text-muted-foreground text-sm'>{t('subtitle')}</p>
      <p className='text-muted-foreground text-xs'>{t('tooltipHint')}</p>
    </div>
  )
}
