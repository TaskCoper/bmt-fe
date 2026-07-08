'use client'

import { useLocale, useTranslations } from 'next-intl'

import type { Locale } from '@/i18n/routing'
import { formatCurrency } from '@/shared/utils'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Slider } from '@/shared/components/ui/slider'
import { useCurrentProject, useWizardStore } from '../store/wizard.store'

const MIN = 100_000_000
const MAX = 20_000_000_000
const STEP = 50_000_000

/** Target-budget control: a slider and a synced VNĐ number input. */
export function BudgetSlider() {
  const t = useTranslations('studio.budget')
  const locale = useLocale() as Locale
  const project = useCurrentProject()
  const patch = useWizardStore((s) => s.patch)
  const budget = project?.data.budget ?? 0

  const setBudget = (v: number) => {
    const clamped = Math.min(MAX, Math.max(0, Number.isFinite(v) ? v : 0))
    patch({ budget: clamped })
  }

  return (
    <div className='space-y-5'>
      <div className='border-glass-border bg-background/40 flex flex-wrap items-end justify-between gap-3 rounded-xl border p-4 backdrop-blur-sm'>
        <div className='space-y-1'>
          <Label>{t('sliderLabel')}</Label>
          <p className='text-primary text-3xl font-semibold tracking-tight tabular-nums'>
            {formatCurrency(budget, locale)}
          </p>
        </div>
        <div className='w-56'>
          <Input
            type='number'
            min={0}
            step={STEP}
            value={budget || ''}
            onChange={(e) => setBudget(Number(e.target.value))}
            className='tabular-nums'
          />
        </div>
      </div>
      <Slider
        min={MIN}
        max={MAX}
        step={STEP}
        value={[Math.min(MAX, Math.max(MIN, budget))]}
        onValueChange={([v]) => setBudget(v ?? MIN)}
      />
      <p className='text-muted-foreground text-xs'>{t('sliderHint')}</p>
    </div>
  )
}
