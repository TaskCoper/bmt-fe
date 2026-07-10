'use client'

import { cn } from '@/shared/lib/utils'
import { Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  PACKAGE_PRICING,
  PACKAGE_TIER_ORDER,
  ROUGH_COST_PER_SQM_MILLIONS
} from '../../constants/ai-design-result.constants'
import type { PackageSelection, PackageTier } from '../../types/ai-design-result.types'
import { InfoTooltip } from './info-tooltip'

interface AIDesignResultPackageSelectorProps {
  value: PackageSelection
  onChange: (selection: PackageSelection) => void
}

const SELECTABLE_ROWS = [{ key: 'finishing' as const }, { key: 'interior' as const }] as const

export function AIDesignResultPackageSelector({ value, onChange }: AIDesignResultPackageSelectorProps) {
  const t = useTranslations('project.form.aiDesignResult')

  const select = (key: keyof PackageSelection, tier: PackageTier) => onChange({ ...value, [key]: tier })

  return (
    <section className='space-y-3'>
      <h3 className='flex items-center gap-1.5 text-lg font-semibold'>
        {t('packageSelector.header')}
        <InfoTooltip labelKey='tooltips.packageHeader' />
      </h3>

      <div className='overflow-hidden rounded-lg border bg-card'>
        {/* Header row — tier names */}
        <div className='grid grid-cols-[2fr_1fr_1fr_1fr] border-b bg-muted/40 px-4 py-2'>
          <div />
          {PACKAGE_TIER_ORDER.map((tier) => (
            <div key={tier} className='text-center'>
              <p className='text-sm font-semibold'>{t(`packages.${tier}.name`)}</p>
              <p className='text-muted-foreground text-[10px]'>{t(`packages.${tier}.description`)}</p>
            </div>
          ))}
        </div>

        {/* Rough row — locked, same across all tiers */}
        <div className='grid grid-cols-[2fr_1fr_1fr_1fr] items-center border-b bg-muted/20 px-4 py-3'>
          <div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
            <Lock className='size-3.5 shrink-0' aria-hidden />
            <span>{t('packageSelector.roughLocked')}</span>
            <InfoTooltip labelKey='tooltips.roughLocked' />
          </div>
          {PACKAGE_TIER_ORDER.map((tier) => (
            <p key={tier} className='text-muted-foreground text-center text-sm font-semibold tabular-nums'>
              {t('packageSelector.perSqm', { value: ROUGH_COST_PER_SQM_MILLIONS })}
            </p>
          ))}
        </div>

        {/* Finishing and interior rows — independently selectable */}
        {SELECTABLE_ROWS.map(({ key }, rowIdx) => (
          <div
            key={key}
            className={cn(
              'grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-2 px-4 py-3',
              rowIdx < SELECTABLE_ROWS.length - 1 && 'border-b'
            )}
          >
            <p className='text-sm font-medium'>{t(`packageSelector.${key}`)}</p>
            {PACKAGE_TIER_ORDER.map((tier) => {
              const isSelected = value[key] === tier
              return (
                <button
                  key={tier}
                  type='button'
                  onClick={() => select(key, tier)}
                  aria-pressed={isSelected}
                  className={cn(
                    'relative rounded-md border px-2 py-2 text-center text-sm font-semibold tabular-nums transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/40'
                      : 'border-input hover:bg-accent/40'
                  )}
                >
                  {isSelected && (
                    <span className='absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-1.5 py-px text-[9px] font-semibold text-primary-foreground'>
                      {t('packageSelector.active')}
                    </span>
                  )}
                  {t('packageSelector.perSqm', { value: PACKAGE_PRICING[tier][key] })}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <p className='text-muted-foreground flex items-center gap-1.5 text-xs'>
        <Lock className='size-3' aria-hidden />
        {t('packageSelector.roughNote')}
      </p>
    </section>
  )
}
