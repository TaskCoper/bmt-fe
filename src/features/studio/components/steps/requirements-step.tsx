'use client'

import { useTranslations } from 'next-intl'

import { useRouter } from '@/i18n/navigation'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { projectStepPath } from '../../constants/studio.constants'
import { useCurrentProject, useWizardStore } from '../../store/wizard.store'
import { AddressRegionField } from '../address-region-field'
import { BudgetSlider } from '../budget-slider'
import { CompassPicker } from '../compass-picker'
import { FloorSegmented } from '../floor-segmented'
import { PaletteSwatches } from '../palette-swatches'
import { RequirementsPreview } from '../requirements-preview'
import { Segmented } from '../segmented'
import { StepFooter } from '../step-footer'
import { StepSection } from '../step-section'
import { StyleRadioCard } from '../style-radio-card'

/** Step 2 — building info, style, extra preferences and target budget. */
export function RequirementsStep({ projectId }: { projectId: string }) {
  const t = useTranslations('studio.requirements')
  const ta = useTranslations('studio.area')
  const te = useTranslations('studio.extra')
  const router = useRouter()

  const project = useCurrentProject()
  const patch = useWizardStore((s) => s.patch)
  const data = project?.data

  const canAdvance = !!data && data.area > 0 && data.budget > 0

  return (
    <div className='space-y-6'>
      <div className='grid items-start gap-5 lg:grid-cols-[1.35fr_1fr]'>
        {/* Form console */}
        <div className='glass-panel space-y-8 p-6 sm:p-7'>
          <StepSection title={t('buildingTitle')} description={t('buildingHint')}>
            <div className='space-y-6'>
              <AddressRegionField />
              <FloorSegmented />
              <div className='space-y-2 sm:max-w-xs'>
                <Label htmlFor='build-area'>
                  {ta('buildLabel')} <span className='text-destructive'>*</span>
                </Label>
                <div className='relative'>
                  <Input
                    id='build-area'
                    type='number'
                    min={0}
                    value={data?.area || ''}
                    onChange={(e) => patch({ area: Number(e.target.value) })}
                    className='pr-12'
                  />
                  <span className='text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm'>m²</span>
                </div>
              </div>
            </div>
          </StepSection>

          <StepSection title={t('styleTitle')} description={t('styleHint')}>
            <StyleRadioCard />
          </StepSection>

          <StepSection title={t('extraTitle')} description={t('extraHint')}>
            <div className='grid gap-6 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label>{te('openPlanLabel')}</Label>
                <Segmented
                  value={data?.openPlan ? 'open' : 'sep'}
                  options={['open', 'sep'] as const}
                  onChange={(v) => patch({ openPlan: v === 'open' })}
                  render={(v) => (v === 'open' ? te('openPlanOn') : te('openPlanOff'))}
                />
              </div>
              <div className='space-y-2'>
                <Label>{te('lightingLabel')}</Label>
                <Segmented
                  value={data?.lighting ?? 'natural'}
                  options={['natural', 'artificial'] as const}
                  onChange={(v) => patch({ lighting: v })}
                  render={(v) => te(`lighting.${v}`)}
                />
              </div>
              <CompassPicker />
              <PaletteSwatches />
            </div>
          </StepSection>

          <StepSection title={t('budgetTitle')} description={t('budgetHint')}>
            <BudgetSlider />
          </StepSection>
        </div>

        {/* Live sketch */}
        <RequirementsPreview />
      </div>

      <StepFooter
        projectId={projectId}
        step='requirements'
        nextDisabled={!canAdvance}
        onNext={() => router.push(projectStepPath(projectId, 'layouts'))}
      />
    </div>
  )
}
