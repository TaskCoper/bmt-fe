'use client'

import { Link } from '@/i18n'
import type { Locale } from '@/i18n/routing'
import { Badge, Button, Card, CardContent } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import { formatCurrency, formatDate } from '@/shared/utils'
import { ArrowRight, Check, Lock, PenLine } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo } from 'react'
import {
  getProjectFlowUrl,
  PROJECT_FLOW,
  useProjectStore,
  useSetProjectFlow,
  type ProjectDraft,
  type ProjectFlowStep
} from '../store/project.store'
import type { HouseType } from '../types/project.types'

type StepStatus = 'completed' | 'ready' | 'locked'

interface StepInsight {
  key: string
  label: string
  value: string
}

interface StepView {
  step: ProjectFlowStep
  index: number
  status: StepStatus
  insights: StepInsight[]
}

interface ProjectDetailProps {
  slug: string
}

export default function ProjectDetail({ slug }: ProjectDetailProps) {
  const t = useTranslations('project.form')
  const tSteps = useTranslations('project.form.steps')
  const tSummary = useTranslations('project.form.steps.summary')
  const tHouseType = useTranslations('project.houseType')
  const tStyle = useTranslations('project.form.style')
  const tDirection = useTranslations('project.form.direction')
  const tReviewSections = useTranslations('project.form.review.sections')
  const tPackages = useTranslations('project.form.aiDesignResult.packages')
  const locale = useLocale() as Locale

  const project = useProjectStore((s) => s.projects[slug])

  useSetProjectFlow(slug, 'detail')

  const view = useMemo(() => {
    if (!project) return null
    return buildStepViews(project, {
      houseType: (v: HouseType) => tHouseType(v),
      style: (v: string) => tStyle(v as never),
      direction: (v: string) => tDirection(v as never),
      summary: (k: string) => tSummary(k as never),
      review: (k: string) => tReviewSections(`${k}.title` as never),
      packageName: (v: string) => tPackages(`${v}.name` as never),
      formatCurrency: (v: number) => formatCurrency(v, locale),
      formatDate: (v: string) => formatDate(v, locale)
    })
  }, [project, tHouseType, tStyle, tDirection, tSummary, tReviewSections, tPackages, locale])

  if (!project || !view) {
    return <p className='text-muted-foreground text-sm'>{t('projectNotFound')}</p>
  }

  const { steps, completedCount, resumeIndex } = view
  const resumeStep = steps[resumeIndex]!
  const resumeHref = getProjectFlowUrl(slug, resumeStep.step)
  const isFirstResume = resumeIndex === 1 && steps[1]!.status !== 'completed'
  const isAllComplete = completedCount === steps.length
  const resumeLabel = isAllComplete
    ? tSteps('viewResult')
    : isFirstResume
      ? tSteps('start')
      : tSteps('resume', { step: resumeIndex + 1 })

  return (
    <div className='space-y-4'>
      <Card
        className={cn(
          'gap-4 overflow-hidden border p-6',
          'bg-linear-to-b from-card via-secondary/60 to-secondary/80',
          'shadow-[inset_0_1px_0_theme(colors.white/60%),inset_0_-2px_4px_rgb(0_0_0/6%)]'
        )}
      >
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0 space-y-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='outline' className='bg-card/80 rounded-full font-medium'>
                {tHouseType(project.houseType)}
              </Badge>
              <span className='text-muted-foreground text-xs tabular-nums'>
                {tSummary('createdAt')} · {formatDate(project.createdAt, locale)}
              </span>
            </div>

            <p className='text-2xl font-semibold tracking-tight'>{project.name}</p>

            {project.description ? (
              <p className='text-muted-foreground max-w-xl text-sm leading-relaxed'>{project.description}</p>
            ) : null}
          </div>

          <div className='flex flex-col items-start gap-2 sm:items-end'>
            <span className='text-muted-foreground font-mono text-xs tabular-nums'>
              {tSteps('progress', { completed: completedCount, total: steps.length })}
            </span>
            <ProgressTape completed={completedCount} total={steps.length} />
            <Button asChild size='sm' className='gap-2'>
              <Link href={resumeHref}>
                {resumeLabel}
                <ArrowRight className='size-4' />
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <div className='space-y-2'>
        <div className='px-1'>
          <p className='text-base font-semibold'>{tSteps('insightsTitle')}</p>
          <p className='text-muted-foreground text-sm'>{tSteps('insightsSubtitle')}</p>
        </div>

        <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
          {steps.map((s) => (
            <StepInsightCard key={s.step} slug={slug} view={s} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProgressTape({ completed, total }: { completed: number; total: number }) {
  const fraction = total > 0 ? completed / total : 0
  return (
    <div
      className={cn(
        'relative h-2 w-40 overflow-hidden rounded-full border',
        'bg-linear-to-b from-card via-secondary to-secondary/80'
      )}
      aria-hidden
    >
      <div
        className='from-primary/40 to-primary/70 h-full bg-linear-to-r transition-[width] duration-500 ease-out'
        style={{ width: `${fraction * 100}%` }}
      />
    </div>
  )
}

interface StepInsightCardProps {
  slug: string
  view: StepView
}

function StepInsightCard({ slug, view }: StepInsightCardProps) {
  const tSteps = useTranslations('project.form.steps')
  const tStep = useTranslations(`project.form.steps.${view.step}` as never)

  const stepUrl = getProjectFlowUrl(slug, view.step)
  const isLocked = view.status === 'locked'
  const isCompleted = view.status === 'completed'

  const stepNumber = view.index + 1

  return (
    <Card
      className={cn(
        'gap-3 border p-4 transition-shadow',
        'bg-card',
        isLocked && 'opacity-60',
        !isLocked && 'hover:shadow-sm'
      )}
    >
      <CardContent className='flex flex-col gap-3 p-0'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex min-w-0 items-center gap-2'>
            <span
              className={cn(
                'inline-flex size-7 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-bold tabular-nums',
                isCompleted
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : isLocked
                    ? 'border-muted text-muted-foreground bg-muted/50'
                    : 'border-foreground/70 text-foreground bg-card'
              )}
              aria-hidden
            >
              {stepNumber}
            </span>
            <p className='truncate text-sm font-semibold'>{tStep('label' as never)}</p>
          </div>
          <StatusBadge status={view.status} label={tSteps(`status.${view.status}`)} />
        </div>

        <p className='text-muted-foreground text-xs leading-relaxed'>
          {view.insights.length === 0 ? tStep('empty' as never) : tStep('description' as never)}
        </p>

        {view.insights.length > 0 ? (
          <dl className='divide-border/60 divide-y border-t border-b'>
            {view.insights.map((i) => (
              <div key={i.key} className='flex items-baseline justify-between gap-3 py-1.5 text-xs'>
                <dt className='text-muted-foreground'>{i.label}</dt>
                <dd className='max-w-[70%] truncate text-right font-medium tabular-nums'>{i.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className='pt-1'>
          {isLocked ? (
            <span className='text-muted-foreground inline-flex items-center gap-1.5 text-xs'>
              <Lock className='size-3' />
              {tSteps('status.locked')}
            </span>
          ) : (
            <Button asChild variant='ghost' size='sm' className='h-8 -ml-2 gap-1.5 px-2 text-xs'>
              <Link href={stepUrl}>
                {isCompleted ? <PenLine className='size-3.5' /> : <ArrowRight className='size-3.5' />}
                {isCompleted ? tSteps('editStep') : tSteps('openStep')}
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status, label }: { status: StepStatus; label: string }) {
  const cls =
    status === 'completed'
      ? 'border-primary/40 bg-primary/10 text-primary'
      : status === 'ready'
        ? 'border-foreground/20 bg-card text-foreground'
        : 'border-muted bg-muted/50 text-muted-foreground'

  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-medium', cls)}
    >
      {status === 'completed' ? <Check className='size-3' /> : status === 'locked' ? <Lock className='size-3' /> : null}
      {label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Step derivation
// ---------------------------------------------------------------------------

interface DerivedView {
  steps: StepView[]
  completedCount: number
  resumeIndex: number
}

interface InsightHelpers {
  houseType: (v: HouseType) => string
  style: (v: string) => string
  direction: (v: string) => string
  summary: (k: string) => string
  review: (k: string) => string
  packageName: (v: string) => string
  formatCurrency: (v: number) => string
  formatDate: (v: string) => string
}

function buildStepViews(project: ProjectDraft, h: InsightHelpers): DerivedView {
  const dr = project.designRequest
  const sp = project.spaces
  const galleries = project.galleries ?? {}

  const drDone = Boolean(dr)
  const spDone = Boolean(sp?.description && sp.floors.length > 0)
  const galleryFavorites = Object.values(galleries).filter((m) => m?.favorite).length
  const galleryCaptions = Object.values(galleries).filter((m) => (m?.caption ?? '').trim().length > 0).length
  const galleriesDone = galleryFavorites > 0

  const detailInsights: StepInsight[] = [
    { key: 'houseType', label: h.summary('houseType'), value: h.houseType(project.houseType) },
    { key: 'createdAt', label: h.summary('createdAt'), value: h.formatDate(project.createdAt) }
  ]
  if (project.description) {
    detailInsights.push({ key: 'description', label: h.summary('description'), value: project.description })
  }

  const drInsights: StepInsight[] = drDone
    ? [
        { key: 'budget', label: h.summary('budget'), value: h.formatCurrency(dr!.budgetAmount) },
        { key: 'style', label: h.summary('style'), value: h.style(dr!.style) },
        { key: 'city', label: h.summary('city'), value: dr!.city || '—' },
        { key: 'floors', label: h.summary('floors'), value: String(dr!.floors.length) },
        { key: 'direction', label: h.summary('direction'), value: h.direction(dr!.direction) }
      ]
    : []

  const spInsights: StepInsight[] = spDone
    ? [
        { key: 'floors', label: h.summary('floors'), value: String(sp!.floors.length) },
        {
          key: 'layoutImages',
          label: h.summary('layoutImages'),
          value: String(sp!.floors.reduce((n, f) => n + f.layoutImages.length, 0))
        },
        ...(sp!.description ? [{ key: 'description', label: h.summary('description'), value: sp!.description }] : [])
      ]
    : []

  const aiResult = project.aiDesignResult
  const aiDone = Boolean(aiResult)
  const totalArea = dr?.floors.reduce((n, f) => n + (f.area || 0), 0) ?? 0
  const aiInsights: StepInsight[] = aiDone
    ? [
        { key: 'package', label: h.summary('package'), value: h.packageName(aiResult!.tier) },
        { key: 'budget', label: h.summary('budget'), value: h.formatCurrency(aiResult!.budget.total) },
        {
          key: 'totalArea',
          label: h.summary('totalArea'),
          value: `${aiResult!.metrics.totalFloorArea.toLocaleString()} m²`
        }
      ]
    : drDone && spDone
      ? [
          { key: 'floors', label: h.summary('floors'), value: String(dr!.floors.length) },
          {
            key: 'totalArea',
            label: h.summary('totalArea'),
            value: totalArea > 0 ? `${totalArea.toLocaleString()} m²` : '—'
          },
          { key: 'budget', label: h.summary('budget'), value: h.formatCurrency(dr!.budgetAmount) }
        ]
      : []

  const galleryInsights: StepInsight[] = galleriesDone
    ? [
        { key: 'favorites', label: h.summary('favorites'), value: String(galleryFavorites) },
        ...(galleryCaptions > 0
          ? [{ key: 'captions', label: h.summary('captions'), value: String(galleryCaptions) }]
          : [])
      ]
    : []

  const reviewInsights: StepInsight[] =
    drDone && spDone
      ? [
          { key: 'sections', label: h.summary('sections'), value: '5' },
          {
            key: 'budget',
            label: h.summary('budget'),
            value: h.formatCurrency(aiResult?.budget.total ?? dr!.budgetAmount)
          },
          {
            key: 'favorites',
            label: h.summary('favorites'),
            value: String(galleryFavorites)
          }
        ]
      : []

  const statuses: StepStatus[] = [
    'completed',
    drDone ? 'completed' : 'ready',
    drDone ? (spDone ? 'completed' : 'ready') : 'locked',
    drDone && spDone ? (aiDone ? 'completed' : 'ready') : 'locked',
    drDone && spDone ? (galleriesDone ? 'completed' : 'ready') : 'locked',
    drDone && spDone ? 'ready' : 'locked'
  ]

  const insightsByStep: StepInsight[][] = [
    detailInsights,
    drInsights,
    spInsights,
    aiInsights,
    galleryInsights,
    reviewInsights
  ]

  const steps: StepView[] = PROJECT_FLOW.map(([step], index) => ({
    step,
    index,
    status: statuses[index]!,
    insights: insightsByStep[index]!
  }))

  const completedCount = statuses.filter((s) => s === 'completed').length
  const resumeIndex =
    statuses.findIndex((s, i) => i > 0 && s !== 'completed' && s !== 'locked') !== -1
      ? statuses.findIndex((s, i) => i > 0 && s !== 'completed' && s !== 'locked')
      : steps.length - 1

  return { steps, completedCount, resumeIndex }
}
