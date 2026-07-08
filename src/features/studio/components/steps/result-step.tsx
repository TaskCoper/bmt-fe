'use client'

import { useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { RefreshCw } from 'lucide-react'

import type { Locale } from '@/i18n/routing'
import { useRouter } from '@/i18n/navigation'
import { formatDate } from '@/shared/utils'
import { Button } from '@/shared/components/ui/button'
import { MAX_REGENERATIONS, projectStepPath } from '../../constants/studio.constants'
import { breakdownFor } from '../../services/studio.service'
import { useCurrentProject, useWizardStore } from '../../store/wizard.store'
import { AIGeneratingOverlay } from '../ai-generating-overlay'
import { AreaSummary } from '../area-summary'
import { BudgetProgressBar } from '../budget-progress-bar'
import { BudgetSummary } from '../budget-summary'
import { CostDonut } from '../cost-donut'
import { DrawingViewer } from '../drawing-viewer'
import { EstimateTable } from '../estimate-table'
import { StepFooter } from '../step-footer'
import { StepSection } from '../step-section'

/** Step 4 — AI result: drawing, area, estimate + inline package selection. */
export function ResultStep({ projectId }: { projectId: string }) {
  const t = useTranslations('studio.result')
  const locale = useLocale() as Locale
  const router = useRouter()

  const project = useCurrentProject()
  const generate = useWizardStore((s) => s.generate)
  const regenerate = useWizardStore((s) => s.regenerate)
  const isGenerating = useWizardStore((s) => s.isGenerating)

  const result = project?.result ?? null
  const selection = project?.selection
  const regenCount = project?.regenCount ?? 0
  const regenLeft = MAX_REGENERATIONS - regenCount

  // Generate on first arrival (e.g. a deep-link/refresh straight to results).
  useEffect(() => {
    if (project && !result && !isGenerating) void generate()
  }, [project, result, isGenerating, generate])

  if (!result || !selection) {
    return isGenerating ? (
      <AIGeneratingOverlay />
    ) : (
      <div className='flex flex-col items-center justify-center gap-4 py-24 text-center'>
        <p className='text-lg font-semibold'>{t('generating')}</p>
        <p className='text-muted-foreground text-sm'>{t('generatingHint')}</p>
      </div>
    )
  }

  const breakdown = breakdownFor(result, selection)

  return (
    <div className='space-y-5'>
      {/* Regenerate control */}
      <div className='flex flex-wrap items-center justify-end gap-3'>
        <span className={regenLeft > 0 ? 'text-muted-foreground text-xs' : 'text-destructive text-xs'}>
          {regenLeft > 0 ? t('regenLeft', { count: regenLeft }) : t('regenExhausted')}
        </span>
        <Button
          variant='ghost'
          size='sm'
          className='glass-inset rounded-xl'
          onClick={() => void regenerate()}
          disabled={regenLeft <= 0 || isGenerating}
        >
          <RefreshCw className='size-4' />
          {t('regenerate')}
        </Button>
      </div>

      {/* 4A drawing + 4C area */}
      <div className='grid gap-5 lg:grid-cols-[1.6fr_1fr]'>
        <div className='glass-panel p-6'>
          <StepSection title={t('drawingTitle')}>
            <DrawingViewer floors={result.area.floors} />
          </StepSection>
        </div>
        <div className='glass-panel p-6'>
          <StepSection title={t('areaTitle')}>
            <AreaSummary area={result.area} />
          </StepSection>
        </div>
      </div>

      {/* 4B estimate + inline package selection */}
      <div className='glass-panel p-6 sm:p-7'>
        <StepSection title={t('estimateTitle')} description={t('estimateHint')}>
          <EstimateTable projectId={projectId} sections={result.sections} />
          <BudgetProgressBar total={breakdown.total} target={project.data.budget} className='mt-6' />
        </StepSection>
      </div>

      {/* 4E summary + donut */}
      <div className='grid gap-5 lg:grid-cols-2'>
        <div className='glass-panel p-6'>
          <StepSection title={t('summaryTitle')}>
            <BudgetSummary budget={breakdown} />
          </StepSection>
        </div>
        <div className='glass-panel p-6'>
          <StepSection title={t('structureTitle')}>
            <CostDonut budget={breakdown} />
          </StepSection>
        </div>
      </div>

      <p className='text-muted-foreground px-1 text-xs'>
        {t('disclaimer')} {t('estimatedOn', { date: formatDate(result.generatedAt, locale) })}
      </p>

      <StepFooter
        projectId={projectId}
        step='result'
        nextLabel={t('confirmRender')}
        onNext={() => router.push(projectStepPath(projectId, 'render'))}
      />
    </div>
  )
}
