'use client'

import { Link } from '@/i18n/navigation'
import { Button } from '@/shared/components/ui'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import {
  AI_LOADING_MS,
  DEFAULT_PACKAGE_TIER,
  FALLBACK_AREA_METRICS,
  FALLBACK_CONSULTATION,
  FALLBACK_USER_BUDGET,
  PACKAGE_PRICING,
  ROUGH_COST_PER_SQM_MILLIONS,
  USABLE_AREA_FACTOR
} from '../constants/ai-design-result.constants'
import { useProjectStore, useSetProjectFlow } from '../store/project.store'
import {
  FloorId,
  type AreaMetrics,
  type Budget,
  type Consultation,
  type PackageTier
} from '../types/ai-design-result.types'
import type { HouseType } from '../types/project.types'
import { AIDesignResultAreaInfo } from './ai-design-result/ai-design-result-area-info'
import { AIDesignResultConsultation } from './ai-design-result/ai-design-result-consultation'
import { AIDesignResultCtas } from './ai-design-result/ai-design-result-ctas'
import { AIDesignResultEstimate } from './ai-design-result/ai-design-result-estimate'
import { AIDesignResultFloorPlans } from './ai-design-result/ai-design-result-floor-plans'
import { AIDesignResultInputSummary } from './ai-design-result/ai-design-result-input-summary'
import { AIDesignResultPackageSelector } from './ai-design-result/ai-design-result-package-selector'
import { AIDesignResultSkeleton } from './ai-design-result/ai-design-result-skeleton'
import { AIDesignResultTotalSummary } from './ai-design-result/ai-design-result-total-summary'

const M = 1_000_000

const UPPER_FLOOR_IDS = [FloorId.Floor1, FloorId.Floor2, FloorId.Floor3, FloorId.Floor4] as const

function buildVisibleFloors(floorCount: number, hasTum: boolean, hasRoof: boolean): readonly FloorId[] {
  const floors: FloorId[] = [FloorId.Ground]
  const upper = Math.max(0, floorCount - 1)
  for (let i = 0; i < Math.min(upper, UPPER_FLOOR_IDS.length); i += 1) {
    floors.push(UPPER_FLOOR_IDS[i]!)
  }
  if (hasRoof) floors.push(FloorId.Roof)
  if (hasTum) floors.push(FloorId.Tum)
  return floors
}

interface ProjectAIDesignResultProps {
  slug: string
}

export default function ProjectAIDesignResult({ slug }: ProjectAIDesignResultProps) {
  const t = useTranslations('project.form')
  const tc = useTranslations('common')
  const project = useProjectStore((s) => s.projects[slug])

  useSetProjectFlow(slug, 'ai-design-result')

  const [tier, setTier] = useState<PackageTier>(DEFAULT_PACKAGE_TIER)
  const [regenKey, setRegenKey] = useState(0)
  const [readyRegenKey, setReadyRegenKey] = useState<number | null>(null)
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setReadyRegenKey(regenKey)
      setGeneratedAt(new Date())
    }, AI_LOADING_MS)
    return () => clearTimeout(timer)
  }, [regenKey])

  const isLoading = readyRegenKey !== regenKey

  // Sân thượng schema field is not on DesignRequestPayload yet — hardcoded for the mockup demo.
  const hasRoof = true

  const derived = useMemo(() => {
    const designRequest = project?.designRequest
    const houseType = (project?.houseType ?? FALLBACK_AREA_METRICS.houseType) as HouseType
    const usableFactor = USABLE_AREA_FACTOR[houseType]
    const hasTum = designRequest?.hasTum ?? FALLBACK_CONSULTATION.hasTum

    const floorAreas = designRequest?.floors?.map((f) => f.area).filter((v) => v > 0) ?? []
    const floorCount = floorAreas.length > 0 ? floorAreas.length : FALLBACK_AREA_METRICS.floorCount
    const summedFloorArea = floorAreas.reduce((sum, a) => sum + a, 0)
    const totalFloorArea = summedFloorArea > 0 ? summedFloorArea : FALLBACK_AREA_METRICS.totalFloorArea
    const groundFloorArea = floorAreas[0] ?? FALLBACK_AREA_METRICS.groundFloorArea
    const usableArea = Math.round(totalFloorArea * usableFactor)
    const estimatedHeight = Math.round((floorCount * 3.2 + (hasTum ? 3 : 0)) * 10) / 10

    const areaMetrics: AreaMetrics = {
      landArea: FALLBACK_AREA_METRICS.landArea,
      groundFloorArea,
      totalFloorArea,
      usableArea,
      floorCount,
      estimatedHeight,
      usableFactor,
      houseType
    }

    const city =
      designRequest?.city && designRequest.city.trim().length > 0 ? designRequest.city : FALLBACK_CONSULTATION.city
    const userBudget =
      designRequest?.budgetAmount && designRequest.budgetAmount > 0 ? designRequest.budgetAmount : FALLBACK_USER_BUDGET
    const userBudgetBillion = userBudget / 1_000_000_000

    const consultation: Consultation = {
      customerName: project?.name?.trim() || FALLBACK_CONSULTATION.customerName,
      landArea: areaMetrics.landArea,
      floorCount: areaMetrics.floorCount,
      totalFloorArea: areaMetrics.totalFloorArea,
      city,
      budgetMinBillion: Math.max(0.1, Math.round(userBudgetBillion * 10) / 10),
      budgetMaxBillion: Math.max(0.1, Math.round(userBudgetBillion * 1.15 * 10) / 10),
      hasTum
    }

    const budget: Budget = (() => {
      const rough = ROUGH_COST_PER_SQM_MILLIONS * areaMetrics.totalFloorArea * M
      const finishing = PACKAGE_PRICING[tier].finishing * areaMetrics.totalFloorArea * M
      const interior = PACKAGE_PRICING[tier].interior * areaMetrics.usableArea * M
      return { rough, finishing, interior, total: rough + finishing + interior }
    })()

    const visibleFloors = buildVisibleFloors(floorCount, hasTum, hasRoof)

    return { consultation, areaMetrics, hasTum, visibleFloors, budget, city, userBudget }
  }, [project, tier, hasRoof])

  if (!project) {
    return <p>{t('projectNotFound')}</p>
  }

  if (!project.designRequest) {
    return (
      <div className='space-y-6'>
        <div>
          <p className='text-2xl font-semibold'>{t('aiDesignResult.title')}</p>
          <p className='text-muted-foreground text-sm'>{t('spaces.missingDesignRequest')}</p>
        </div>
        {project.prevUrl && (
          <Button type='button' variant='outline' asChild>
            <Link href={project.prevUrl}>{tc('back')}</Link>
          </Button>
        )}
      </div>
    )
  }

  if (!project.spaces) {
    return (
      <div className='space-y-6'>
        <div>
          <p className='text-2xl font-semibold'>{t('aiDesignResult.title')}</p>
          <p className='text-muted-foreground text-sm'>{t('aiDesignResult.missingSpaces')}</p>
        </div>
        {project.prevUrl && (
          <Button type='button' variant='outline' asChild>
            <Link href={project.prevUrl}>{tc('back')}</Link>
          </Button>
        )}
      </div>
    )
  }

  if (isLoading || !generatedAt) {
    return <AIDesignResultSkeleton />
  }

  return (
    <div className='space-y-8'>
      {/* <AIDesignResultHeader
        houseType={derived.areaMetrics.houseType}
        floorCount={derived.areaMetrics.floorCount}
        hasTum={derived.hasTum}
      /> */}
      <AIDesignResultConsultation consultation={derived.consultation} />
      <AIDesignResultInputSummary
        designRequest={project.designRequest}
        houseType={derived.areaMetrics.houseType}
        spacesDescription={project.spaces.description}
      />
      <AIDesignResultFloorPlans floors={derived.visibleFloors} />
      <AIDesignResultAreaInfo metrics={derived.areaMetrics} hasTum={derived.hasTum} />
      <AIDesignResultPackageSelector value={tier} onChange={setTier} />
      <AIDesignResultEstimate
        tier={tier}
        hasTum={derived.hasTum}
        hasRoof={hasRoof}
        city={derived.city}
        userBudget={derived.userBudget}
      />
      <AIDesignResultTotalSummary budget={derived.budget} generatedAt={generatedAt} />
      <AIDesignResultCtas
        prevUrl={project.prevUrl}
        nextUrl={project.nextUrl}
        onRegenerate={() => setRegenKey((k) => k + 1)}
      />
    </div>
  )
}
