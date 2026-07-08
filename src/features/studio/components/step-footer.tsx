'use client'

import { useTranslations } from 'next-intl'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { Button } from '@/shared/components/ui/button'
import {
  WIZARD_STEPS,
  projectStepPath,
  type WizardStepId,
} from '../constants/studio.constants'

/**
 * Shared back / next footer for a step page. `onNext` (+ label) is optional so a
 * step can own a bespoke primary action (e.g. "Generate", "Confirm → renders").
 */
export function StepFooter({
  projectId,
  step,
  onNext,
  nextLabel,
  nextDisabled,
  hideNext,
}: {
  projectId: string
  step: WizardStepId
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  hideNext?: boolean
}) {
  const t = useTranslations('studio.nav')
  const index = WIZARD_STEPS.indexOf(step)
  const prev = index > 0 ? WIZARD_STEPS[index - 1]! : null

  return (
    <div className="border-border/50 mt-2 flex items-center justify-between border-t pt-6">
      {prev ? (
        <Button
          variant="ghost"
          asChild
          className="hover:bg-background/60 backdrop-blur"
        >
          <Link href={projectStepPath(projectId, prev)}>
            <ArrowLeft className="size-4" />
            {t('back')}
          </Link>
        </Button>
      ) : (
        <span />
      )}

      {!hideNext ? (
        <Button
          size="lg"
          onClick={onNext}
          disabled={nextDisabled}
          className="shadow-[0_8px_24px_-8px_oklch(0.77_0.155_65_/_0.6)]"
        >
          {nextLabel ?? t('next')}
          <ArrowRight className="size-4" />
        </Button>
      ) : null}
    </div>
  )
}
