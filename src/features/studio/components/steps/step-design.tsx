'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Check, Upload } from 'lucide-react'

import type { Locale } from '@/i18n/routing'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/shared/utils'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  BUDGET_PACKAGE_LIST,
  DESIGN_STYLE_LIST,
  HOUSE_DIRECTIONS,
  LAYOUT_OPTIONS,
  LIGHTING_OPTIONS,
  type BudgetPackageId
} from '../../constants/studio.constants'
import { calcBudget } from '../../services/studio.service'
import { useWizardStore } from '../../store/wizard.store'
import { StepSection } from '../step-section'
import { BudgetSummary } from '../budget-summary'

/** A compact segmented choice control built from buttons (CVA-styled). */
function Segmented<T extends string>({
  value,
  options,
  onChange,
  render
}: {
  value: T
  options: readonly T[]
  onChange: (v: T) => void
  render: (v: T) => string
}) {
  return (
    <div className='bg-muted inline-flex flex-wrap gap-1 rounded-lg p-1'>
      {options.map((opt) => (
        <button
          key={opt}
          type='button'
          onClick={() => onChange(opt)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            value === opt ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {render(opt)}
        </button>
      ))}
    </div>
  )
}

/** Step 3 — design direction & budget. The total recomputes live. */
export function StepDesign() {
  const t = useTranslations('studio.design')
  const tb = useTranslations('studio.budget')
  const tPkg = useTranslations('studio.package')
  const tStyle = useTranslations('studio.style')
  const locale = useLocale() as Locale

  const data = useWizardStore((s) => s.data)
  const patch = useWizardStore((s) => s.patch)
  const toggleStyle = useWizardStore((s) => s.toggleStyle)

  const budget = calcBudget(data.packageId, data.area)

  return (
    <div className='space-y-8'>
      {/* A. Budget */}
      <StepSection title={tb('title')} description={tb('hint')}>
        <div className='grid gap-3 md:grid-cols-3'>
          {BUDGET_PACKAGE_LIST.map((pkg) => {
            const selected = data.packageId === pkg.id
            const perSqm = pkg.finishingPerSqm + pkg.interiorPerSqm
            return (
              <button
                key={pkg.id}
                type='button'
                onClick={() => patch({ packageId: pkg.id as BudgetPackageId })}
                className={cn(
                  'relative rounded-lg border p-4 text-left transition-colors',
                  selected ? 'border-primary ring-primary/30 bg-primary/5 ring-2' : 'hover:border-primary/50'
                )}
              >
                {selected ? <Check className='text-primary absolute top-3 right-3 size-4' /> : null}
                <div className='text-sm font-semibold'>{tPkg(`${pkg.id}.name`)}</div>
                <div className='text-muted-foreground mt-1 text-xs'>{tPkg(`${pkg.id}.desc`)}</div>
                <div className='text-primary mt-3 text-lg font-bold tabular-nums'>{formatCurrency(perSqm, locale)}</div>
                <div className='text-muted-foreground text-xs'>{tb('perSqm')}</div>
              </button>
            )
          })}
        </div>

        <BudgetSummary budget={budget} className='mt-2' />
        <p className='text-muted-foreground text-xs'>{tb('autoUpdate')}</p>
      </StepSection>

      {/* B. Styles */}
      <StepSection title={t('styleTitle')} description={t('styleHint')}>
        <div className='flex flex-wrap gap-2'>
          {DESIGN_STYLE_LIST.map((style) => {
            const active = data.styles.includes(style)
            return (
              <button
                key={style}
                type='button'
                onClick={() => toggleStyle(style)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:border-primary/50 hover:bg-muted'
                )}
              >
                {active ? <Check className='size-3.5' /> : null}
                {tStyle(style)}
              </button>
            )
          })}
        </div>
        <div>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => patch({ moodboardCount: data.moodboardCount + 1 })}
          >
            <Upload className='size-4' />
            {t('moodboardUpload')}
          </Button>
          {data.moodboardCount > 0 ? (
            <Badge variant='secondary' className='ml-2'>
              {t('moodboardCount', { count: data.moodboardCount })}
            </Badge>
          ) : null}
        </div>
      </StepSection>

      {/* C. Preferences */}
      <StepSection title={t('prefTitle')} description={t('prefHint')}>
        <div className='grid gap-6 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label>{t('layoutLabel')}</Label>
            <Segmented
              value={data.layout}
              options={LAYOUT_OPTIONS}
              onChange={(v) => patch({ layout: v })}
              render={(v) => t(`layout.${v}`)}
            />
          </div>
          <div className='space-y-2'>
            <Label>{t('lightingLabel')}</Label>
            <Segmented
              value={data.lighting}
              options={LIGHTING_OPTIONS}
              onChange={(v) => patch({ lighting: v })}
              render={(v) => t(`lighting.${v}`)}
            />
          </div>
          <div className='space-y-2'>
            <Label>{t('directionLabel')}</Label>
            <Segmented
              value={data.direction}
              options={HOUSE_DIRECTIONS}
              onChange={(v) => patch({ direction: v })}
              render={(v) => t(`direction.${v}`)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='primary-color'>{t('colorLabel')}</Label>
            <div className='flex items-center gap-3'>
              <input
                id='primary-color'
                type='color'
                value={data.primaryColor}
                onChange={(e) => patch({ primaryColor: e.target.value })}
                className='border-input size-10 cursor-pointer rounded-md border bg-transparent p-1'
              />
              <span className='text-muted-foreground text-sm uppercase tabular-nums'>{data.primaryColor}</span>
            </div>
          </div>
        </div>
      </StepSection>
    </div>
  )
}
