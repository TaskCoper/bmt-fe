'use client'

import { ArrowRight, Plus, Trash2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { EmptyState, StepDots, type StepStatus } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { ROUTES } from '@/shared/constants/routes'
import { formatDate } from '@/shared/utils'
import { WIZARD_STEPS, projectStepPath } from '../constants/studio.constants'
import { computeStepStatuses } from '../services/studio.service'
import { useProjectList, useWizardStore } from '../store/wizard.store'

/** Dashboard grid of in-progress design projects with per-step StepDots. */
export function ProjectsBoard() {
  const t = useTranslations('studio.board')
  const tType = useTranslations('studio.constructionType')
  const locale = useLocale() as Locale
  const projects = useProjectList()
  const deleteProject = useWizardStore((s) => s.deleteProject)

  if (projects.length === 0) {
    return (
      <EmptyState
        title={t('emptyTitle')}
        description={t('emptyHint')}
        action={
          <Button asChild>
            <Link href={ROUTES.PROJECT_NEW}>
              <Plus className='size-4' />
              {t('create')}
            </Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {projects.map((project) => {
        const statuses = computeStepStatuses(project)
        const dots: StepStatus[] = WIZARD_STEPS.map((s) => statuses[s])
        const activeStep = WIZARD_STEPS.find((s) => statuses[s] === 'active') ?? 'export'
        const stepNo = WIZARD_STEPS.indexOf(activeStep) + 1

        return (
          <div key={project.id} className='glass-card flex flex-col gap-4 p-5'>
            <div className='flex items-start justify-between gap-2'>
              <div className='min-w-0'>
                <p className='truncate font-semibold tracking-tight'>{project.data.name || t('emptyTitle')}</p>
                <p className='text-muted-foreground text-xs'>{tType(`${project.data.constructionType}.label`)}</p>
              </div>
              <Button
                variant='ghost'
                size='icon'
                aria-label={t('remove')}
                className='text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                onClick={() => deleteProject(project.id)}
              >
                <Trash2 className='size-4' />
              </Button>
            </div>

            <StepDots statuses={dots} />

            <p className='text-muted-foreground text-xs'>
              {t('updated', { date: formatDate(project.updatedAt, locale) })}
            </p>

            <Button asChild size='sm' className='mt-auto shadow-[0_6px_18px_-8px_oklch(0.77_0.155_65_/_0.55)]'>
              <Link href={projectStepPath(project.id, activeStep)}>
                {t('continue', { step: stepNo })}
                <ArrowRight className='size-4' />
              </Link>
            </Button>
          </div>
        )
      })}
    </div>
  )
}
