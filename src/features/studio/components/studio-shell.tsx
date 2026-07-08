'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog'
import { ROUTES } from '@/shared/constants/routes'
import { WIZARD_STEPS, projectStepPath, type WizardStepId } from '../constants/studio.constants'
import { computeStepStatuses } from '../services/studio.service'
import { useCurrentProject, useWizardStore } from '../store/wizard.store'
import { StepRail } from './step-rail'

const SEGMENT_TO_STEP: Record<string, WizardStepId> = {
  requirements: 'requirements',
  layouts: 'layouts',
  results: 'result',
  renders: 'render',
  export: 'export'
}

/** Steps that lay out their own bento of glass cards (no console wrapper). */
const BENTO_STEPS = new Set<WizardStepId>(['requirements', 'result'])

/** Derive the active step id from the current pathname segment. */
function stepFromPath(pathname: string): WizardStepId {
  const parts = pathname.split('/').filter(Boolean)
  // …/dashboard/projects/<id>/<segment>
  const segment = parts[3] ?? ''
  return SEGMENT_TO_STEP[segment] ?? 'result'
}

/**
 * Shell for every `/dashboard/projects/[projectId]/…` step: opens the project,
 * guards locked steps, and renders the cinematic canvas + floating glass nav +
 * horizontal step rail + a per-step hero + the active step. The estimate-detail
 * route renders bare (it opens in a new tab).
 */
export function StudioShell({ projectId, children }: { projectId: string; children: React.ReactNode }) {
  const t = useTranslations('studio')
  const tType = useTranslations('studio.constructionType')
  const tg = useTranslations('studio.guard')
  const tn = useTranslations('studio.nav')
  const th = useTranslations('studio.hero')
  const pathname = usePathname()
  const router = useRouter()

  const openProject = useWizardStore((s) => s.openProject)
  const project = useCurrentProject()
  const pendingNav = useWizardStore((s) => s.pendingNav)
  const setPendingNav = useWizardStore((s) => s.setPendingNav)
  const clearResult = useWizardStore((s) => s.clearResult)

  const isDetail = pathname.includes('/estimate/')
  const currentStep = stepFromPath(pathname)
  const stepNo = WIZARD_STEPS.indexOf(currentStep) + 1

  // Bind the route's project as the active one.
  useEffect(() => {
    openProject(projectId)
  }, [projectId, openProject])

  // Guard: if the current step is locked, bounce to the first reachable step.
  useEffect(() => {
    if (!project || isDetail) return
    const statuses = computeStepStatuses(project)
    if (statuses[currentStep] === 'locked') {
      const target = WIZARD_STEPS.find((s) => statuses[s] === 'active')
      if (target && target !== currentStep) {
        router.replace(projectStepPath(projectId, target))
      }
    }
  }, [project, currentStep, isDetail, projectId, router])

  // The detail route is a standalone full-page view (new tab) — no chrome.
  if (isDetail) return <>{children}</>

  // Project missing (unknown id / cleared storage).
  if (project === null) {
    return (
      <div className='mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border bg-card px-8 py-16 text-center'>
        <div className='space-y-1'>
          <p className='text-lg font-semibold'>{tg('missing')}</p>
          <p className='text-muted-foreground text-sm'>{tg('missingHint')}</p>
        </div>
        <Button asChild>
          <Link href={ROUTES.PROJECTS}>{tg('backToProjects')}</Link>
        </Button>
      </div>
    )
  }

  const confirmNav = () => {
    const target = pendingNav
    setPendingNav(null)
    clearResult()
    if (target) router.push(target)
  }

  const isBento = BENTO_STEPS.has(currentStep)

  return (
    <div className='mx-auto max-w-6xl'>
      {/* Project bar */}
      <header className='mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3 sm:px-5'>
        <div className='flex min-w-0 items-center gap-3'>
          <span
            aria-hidden
            className='from-primary/90 to-primary flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-extrabold tracking-tighter text-[#241705] shadow-[0_6px_16px_-6px_oklch(0.77_0.155_65_/_0.8)]'
          >
            B
          </span>
          <div className='min-w-0'>
            <p className='text-primary/80 text-[0.62rem] font-semibold tracking-[0.18em] uppercase'>
              {tn('studioEyebrow')}
            </p>
            <h1 className='truncate text-sm font-semibold tracking-tight sm:text-[0.95rem]'>
              {project.data.name || t('export.untitled')}
            </h1>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <span className='bg-muted text-muted-foreground hidden rounded-xl px-3 py-1.5 text-xs font-medium sm:inline'>
            {tType(`${project.data.constructionType}.label`)}
          </span>
          <Button variant='ghost' size='sm' asChild className='hover:bg-accent rounded-xl'>
            <Link href={ROUTES.PROJECTS}>{t('nav.saveExit')}</Link>
          </Button>
        </div>
      </header>

      {/* Horizontal step rail */}
      <div className='mb-8'>
        <StepRail projectId={projectId} currentStep={currentStep} />
      </div>

      {/* Per-step hero */}
      <div className='mb-7 max-w-3xl px-1'>
        <span className='text-primary/80 inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase'>
          <span className='bg-primary size-1.5 rounded-full shadow-[0_0_10px_1px_oklch(0.77_0.155_65)]' />
          {tn('stepOf', { current: stepNo, total: WIZARD_STEPS.length })}
        </span>
        <h2 className='font-display mt-3 text-3xl leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-4xl'>
          {th(`${currentStep}.title`)}
        </h2>
        <p className='text-muted-foreground mt-3 max-w-2xl text-[0.95rem]'>{th(`${currentStep}.lede`)}</p>
      </div>

      {/* Active step */}
      {isBento ? (
        <div className='min-w-0'>{children}</div>
      ) : (
        <div className='min-w-0 rounded-2xl border bg-card p-5 sm:p-7 lg:p-8'>{children}</div>
      )}

      {/* Edit-after-result confirmation */}
      <Dialog open={pendingNav !== null} onOpenChange={(o) => !o && setPendingNav(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('editWarning.title')}</DialogTitle>
            <DialogDescription>{t('editWarning.description')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setPendingNav(null)}>
              {t('editWarning.cancel')}
            </Button>
            <Button variant='destructive' onClick={confirmNav}>
              {t('editWarning.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
