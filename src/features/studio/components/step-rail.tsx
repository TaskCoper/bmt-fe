'use client'

import { useTranslations } from 'next-intl'
import { Check, Lock } from 'lucide-react'

import { useRouter } from '@/i18n/navigation'
import { cn } from '@/shared/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import {
  WIZARD_STEPS,
  projectStepPath,
  type WizardStepId,
} from '../constants/studio.constants'
import { computeStepStatuses } from '../services/studio.service'
import { useCurrentProject, useWizardStore } from '../store/wizard.store'

/** Index of the first AI-result step — editing earlier steps invalidates it. */
const RESULT_INDEX = WIZARD_STEPS.indexOf('result')

/**
 * Horizontal floating step rail (replaces the boxy left sidebar). Pills are
 * frosted glass; the active pill expands to reveal its label, completed steps
 * carry a check, locked steps are dimmed with a tooltip. Navigation is
 * route-based and guarded once an AI result exists.
 */
export function StepRail({
  projectId,
  currentStep,
}: {
  projectId: string
  currentStep: WizardStepId
}) {
  const t = useTranslations('studio.steps')
  const tg = useTranslations('studio.guard')
  const tn = useTranslations('studio.nav')
  const router = useRouter()
  const project = useCurrentProject()
  const setPendingNav = useWizardStore((s) => s.setPendingNav)

  const statuses = project
    ? computeStepStatuses(project)
    : ({} as Record<WizardStepId, 'locked' | 'active' | 'done'>)
  const blockingStepNo =
    WIZARD_STEPS.findIndex((s) => statuses[s] !== 'done') + 1

  const go = (step: WizardStepId, index: number) => {
    const path = projectStepPath(projectId, step)
    if (project?.result != null && index < RESULT_INDEX) {
      setPendingNav(path)
      return
    }
    router.push(path)
  }

  return (
    <nav
      aria-label={tn('progressLabel')}
      className="flex scrollbar-none gap-2 overflow-x-auto"
    >
      {WIZARD_STEPS.map((step, index) => {
        const status = statuses[step] ?? 'locked'
        const isCurrent = step === currentStep
        const isDone = status === 'done'
        const locked = status === 'locked' && !isCurrent
        const stepNo = index + 1

        const pill = (
          <button
            type="button"
            disabled={locked}
            onClick={() => !locked && go(step, index)}
            aria-current={isCurrent ? 'step' : undefined}
            className={cn(
              'group flex shrink-0 items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-soft)]',
              isCurrent
                ? 'glass-panel-strong'
                : locked
                  ? 'glass-inset cursor-not-allowed opacity-45'
                  : 'glass-inset hover:-translate-y-0.5',
            )}
          >
            <span
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-xl text-[0.8rem] font-bold tabular-nums',
                isCurrent || isDone
                  ? 'from-primary/90 to-primary text-primary-foreground bg-gradient-to-br shadow-[0_4px_12px_-4px_oklch(0.77_0.155_65_/_0.7)]'
                  : 'text-muted-foreground bg-background/40 border-glass-border border',
              )}
            >
              {isDone ? (
                <Check className="size-4" />
              ) : locked ? (
                <Lock className="size-3" />
              ) : (
                stepNo
              )}
            </span>
            {isCurrent ? (
              <span className="min-w-0 pr-1">
                <span className="block text-[0.8rem] leading-tight font-semibold whitespace-nowrap">
                  {t(`${step}.title`)}
                </span>
                <span className="text-muted-foreground block truncate text-[0.68rem] leading-tight">
                  {t(`${step}.subtitle`)}
                </span>
              </span>
            ) : null}
          </button>
        )

        return locked ? (
          <Tooltip key={step}>
            <TooltipTrigger asChild>
              <span className="shrink-0">{pill}</span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {tg('lockedTooltip', { step: blockingStepNo })}
            </TooltipContent>
          </Tooltip>
        ) : (
          <span key={step} className="shrink-0">
            {pill}
          </span>
        )
      })}
    </nav>
  )
}
