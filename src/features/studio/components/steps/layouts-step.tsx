'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { ThumbsDown, ThumbsUp } from 'lucide-react'

import { useRouter } from '@/i18n/navigation'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { projectStepPath } from '../../constants/studio.constants'
import { useCurrentProject, useWizardStore } from '../../store/wizard.store'
import { AIGeneratingOverlay } from '../ai-generating-overlay'
import { FloorDropzone } from '../floor-dropzone'
import { StepFooter } from '../step-footer'
import { StepSection } from '../step-section'

/** Step 3 — upload a floor plan per floor, then trigger the mock AI. */
export function LayoutsStep({ projectId }: { projectId: string }) {
  const t = useTranslations('studio.layouts')
  const router = useRouter()

  const project = useCurrentProject()
  const generate = useWizardStore((s) => s.generate)
  const isGenerating = useWizardStore((s) => s.isGenerating)

  const floors = project?.data.floors ?? 0
  const images = project?.data.images

  // Ground floor (0) + `floors` upper floors, in fixed order.
  const floorList = useMemo(
    () => Array.from({ length: floors + 1 }, (_, i) => i),
    [floors],
  )
  const complete = useMemo(
    () => floorList.every((f) => (images ?? []).some((img) => img.floor === f)),
    [floorList, images],
  )

  const runGenerate = async () => {
    await generate()
    router.push(projectStepPath(projectId, 'result'))
  }

  return (
    <div className="space-y-8">
      <StepSection title={t('guideTitle')} description={t('guideHint')}>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div className="text-success border-glass-border bg-background/40 flex items-center gap-2 rounded-xl border p-3 text-sm backdrop-blur-sm">
            <ThumbsUp className="size-4 shrink-0" />
            {t('sampleGood')}
          </div>
          <div className="text-destructive border-glass-border bg-background/40 flex items-center gap-2 rounded-xl border p-3 text-sm backdrop-blur-sm">
            <ThumbsDown className="size-4 shrink-0" />
            {t('sampleBad')}
          </div>
        </div>

        <div className="space-y-4">
          {floorList.map((f) => (
            <FloorDropzone
              key={f}
              floor={f}
              label={f === 0 ? t('floorGround') : t('floorUpper', { n: f })}
            />
          ))}
        </div>
      </StepSection>

      {!complete ? (
        <Alert>
          <AlertDescription>{t('incomplete')}</AlertDescription>
        </Alert>
      ) : null}

      <StepFooter
        projectId={projectId}
        step="layouts"
        nextLabel={t('generate')}
        nextDisabled={!complete || isGenerating}
        onNext={() => void runGenerate()}
      />

      {isGenerating ? <AIGeneratingOverlay /> : null}
    </div>
  )
}
