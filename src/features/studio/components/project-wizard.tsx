'use client'

import { useTranslations } from 'next-intl'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/constants/routes'
import { Button } from '@/shared/components/ui/button'
import { Progress } from '@/shared/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { WIZARD_STEPS } from '../constants/studio.constants'
import { useWizardStore } from '../store/wizard.store'
import { WizardStepper } from './wizard-stepper'
import { StepCreate } from './steps/step-create'
import { StepSpace } from './steps/step-space'
import { StepDesign } from './steps/step-design'
import { StepResult } from './steps/step-result'
import { StepRender } from './steps/step-render'
import { StepExport } from './steps/step-export'

const STEP_COMPONENTS = [
  StepCreate,
  StepSpace,
  StepDesign,
  StepResult,
  StepRender,
  StepExport,
] as const

/**
 * The BMT Decor AI 6-step design flow shell: left progress stepper, the active
 * step's content, and the back/next footer. Wizard state lives in the store.
 */
export function ProjectWizard() {
  const t = useTranslations('studio')
  const tSteps = useTranslations('studio.steps')
  const router = useRouter()

  const stepIndex = useWizardStore((s) => s.stepIndex)
  const next = useWizardStore((s) => s.next)
  const back = useWizardStore((s) => s.back)
  const reset = useWizardStore((s) => s.reset)
  const pendingNav = useWizardStore((s) => s.pendingNav)
  const confirmNav = useWizardStore((s) => s.confirmNav)
  const cancelNav = useWizardStore((s) => s.cancelNav)
  const tEdit = useTranslations('studio.editWarning')
  const nameFilled = useWizardStore((s) => s.data.name.trim().length > 0)
  // Step 2 requires a floor area and at least one floor-plan image.
  const areaFilled = useWizardStore((s) => s.data.area > 0)
  const hasFloorImage = useWizardStore((s) =>
    s.data.images.some((i) => i.floor >= 0),
  )

  const stepKey = WIZARD_STEPS[stepIndex]!
  const StepComponent = STEP_COMPONENTS[stepIndex]!
  const isFirst = stepIndex === 0
  const isLast = stepIndex === WIZARD_STEPS.length - 1
  const canAdvance =
    stepIndex === 0
      ? nameFilled
      : stepIndex === 1
        ? areaFilled && hasFloorImage
        : true
  const progress = ((stepIndex + 1) / WIZARD_STEPS.length) * 100

  const finish = () => {
    reset()
    router.push(ROUTES.PROJECTS)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Left progress rail */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="space-y-4 rounded-xl border p-4">
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium">
              {t('progressLabel', {
                current: stepIndex + 1,
                total: WIZARD_STEPS.length,
              })}
            </p>
            <Progress value={progress} />
          </div>
          <WizardStepper />
        </div>
      </aside>

      {/* Active step */}
      <div className="min-w-0 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">
            {tSteps(`${stepKey}.title`)}
          </h2>
          <p className="text-muted-foreground text-sm">
            {tSteps(`${stepKey}.description`)}
          </p>
        </div>

        <StepComponent />

        <div className="flex items-center justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={back}
            disabled={isFirst}
            className={isFirst ? 'invisible' : undefined}
          >
            <ArrowLeft className="size-4" />
            {t('nav.back')}
          </Button>

          {isLast ? (
            <Button onClick={finish}>
              <Check className="size-4" />
              {t('nav.finish')}
            </Button>
          ) : (
            <Button onClick={next} disabled={!canAdvance}>
              {t('nav.next')}
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Edit-after-result confirmation (§4.1.3) */}
      <Dialog
        open={pendingNav !== null}
        onOpenChange={(o) => !o && cancelNav()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tEdit('title')}</DialogTitle>
            <DialogDescription>{tEdit('description')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelNav}>
              {tEdit('cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmNav}>
              {tEdit('confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
