'use client'

import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { WIZARD_STEPS } from '../constants/studio.constants'
import { useWizardStore } from '../store/wizard.store'

/**
 * Vertical progress stepper shown in the left column of the design flow.
 * Completed steps are revisitable; future steps stay locked until reached.
 */
export function WizardStepper() {
  const t = useTranslations('studio.steps')
  const stepIndex = useWizardStore((s) => s.stepIndex)
  const furthestStep = useWizardStore((s) => s.furthestStep)
  const requestGoTo = useWizardStore((s) => s.requestGoTo)

  return (
    <ol className="space-y-1">
      {WIZARD_STEPS.map((step, index) => {
        const isActive = index === stepIndex
        const isDone = index < furthestStep
        const reachable = index <= furthestStep

        return (
          <li key={step}>
            <button
              type="button"
              disabled={!reachable}
              onClick={() => reachable && requestGoTo(index)}
              aria-current={isActive ? 'step' : undefined}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                isActive
                  ? 'bg-primary/10 text-foreground'
                  : reachable
                    ? 'hover:bg-muted text-muted-foreground'
                    : 'cursor-not-allowed opacity-50',
              )}
            >
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isDone
                      ? 'border-success bg-success text-success-foreground'
                      : 'border-border text-muted-foreground',
                )}
              >
                {isDone ? <Check className="size-4" /> : index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">
                  {t(`${step}.title`)}
                </span>
                <span className="text-muted-foreground block truncate text-xs">
                  {t(`${step}.subtitle`)}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
