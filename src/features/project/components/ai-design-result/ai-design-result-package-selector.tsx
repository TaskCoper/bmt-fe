'use client'

import { Badge, RadioGroup, RadioGroupItem } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import { Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  PACKAGE_PRICING,
  PACKAGE_TIER_ORDER,
  ROUGH_COST_PER_SQM_MILLIONS
} from '../../constants/ai-design-result.constants'
import type { PackageTier } from '../../types/ai-design-result.types'
import { InfoTooltip } from './info-tooltip'

interface AIDesignResultPackageSelectorProps {
  value: PackageTier
  onChange: (tier: PackageTier) => void
}

export function AIDesignResultPackageSelector({ value, onChange }: AIDesignResultPackageSelectorProps) {
  const t = useTranslations('project.form.aiDesignResult')

  return (
    <section className='space-y-3'>
      <h3 className='flex items-center gap-1.5 text-lg font-semibold'>
        {t('packageSelector.header')}
        <InfoTooltip labelKey='tooltips.packageHeader' />
      </h3>

      <RadioGroup
        value={value}
        onValueChange={(next) => onChange(next as PackageTier)}
        className='grid grid-cols-1 gap-3 md:grid-cols-3'
      >
        {PACKAGE_TIER_ORDER.map((tier) => {
          const isActive = value === tier
          return (
            <label
              key={tier}
              className={cn(
                'relative flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors',
                isActive ? 'border-primary bg-primary/5 ring-primary/40 ring-1' : 'hover:bg-accent/40 border-input'
              )}
            >
              <RadioGroupItem value={tier} className='sr-only' />
              {isActive && (
                <Badge className='absolute top-3 right-3 py-0.5 text-[10px]'>{t('packageSelector.active')}</Badge>
              )}
              <div className='space-y-0.5'>
                <p className='text-base font-semibold'>{t(`packages.${tier}.name`)}</p>
                <p className='text-muted-foreground text-xs'>{t(`packages.${tier}.description`)}</p>
              </div>
              <div className='space-y-1.5 text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>{t('packageSelector.finishing')}</span>
                  <span className='font-semibold tabular-nums'>
                    {t('packageSelector.perSqm', { value: PACKAGE_PRICING[tier].finishing })}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>{t('packageSelector.interior')}</span>
                  <span className='font-semibold tabular-nums'>
                    {t('packageSelector.perSqm', { value: PACKAGE_PRICING[tier].interior })}
                  </span>
                </div>
                <div className='flex items-center justify-between border-t pt-1.5'>
                  <span className='text-muted-foreground flex items-center gap-1'>
                    <Lock className='size-3' aria-hidden />
                    {t('packageSelector.roughLocked')}
                    <InfoTooltip labelKey='tooltips.roughLocked' />
                  </span>
                  <span className='font-semibold tabular-nums'>
                    {t('packageSelector.perSqm', { value: ROUGH_COST_PER_SQM_MILLIONS })}
                  </span>
                </div>
              </div>
            </label>
          )
        })}
      </RadioGroup>

      <p className='text-muted-foreground flex items-center gap-1.5 text-xs'>
        <Lock className='size-3' aria-hidden />
        {t('packageSelector.roughNote')}
      </p>
    </section>
  )
}
