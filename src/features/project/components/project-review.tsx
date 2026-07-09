'use client'

import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { Button, Card, CardContent } from '@/shared/components/ui'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  DEFAULT_PACKAGE_TIER,
  FALLBACK_AREA_METRICS,
  FALLBACK_CONSULTATION,
  FALLBACK_USER_BUDGET,
  PACKAGE_PRICING,
  ROUGH_COST_PER_SQM_MILLIONS,
  USABLE_AREA_FACTOR
} from '../constants/ai-design-result.constants'
import { GALLERY_IMAGES } from '../constants/galleries.constants'
import { generateProjectPdf } from '../services/pdf/generate-project-pdf'
import { buildPdfData, type PdfStrings } from '../services/pdf/pdf-data-builder'
import { useProjectStore, useSetProjectFlow } from '../store/project.store'
import { FloorId, type AreaMetrics, type Budget } from '../types/ai-design-result.types'
import type { HouseType } from '../types/project.types'
import { ReviewCover } from './review/review-cover'
import { ReviewEstimate } from './review/review-estimate'
import { ReviewFloorPlans } from './review/review-floor-plans'
import { ReviewFooterPreview } from './review/review-footer-preview'
import { ReviewProjectInfo } from './review/review-project-info'
import { ReviewRenders } from './review/review-renders'
import { ReviewSectionCard } from './review/review-section-card'
import { REVIEW_SECTION_KEYS, type ReviewSection, type ReviewSectionKey } from './review/review-sections'
import { SendEmailDialog, ShareLinkDialog } from './review/review-share-dialogs'
import { ReviewSharePanel } from './review/review-share-panel'

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

const DEFAULT_INCLUDED: Record<ReviewSectionKey, boolean> = {
  cover: true,
  projectInfo: true,
  floorPlans: true,
  estimate: true,
  renders: true
}

interface ProjectReviewProps {
  slug: string
}

export default function ProjectReview({ slug }: ProjectReviewProps) {
  const t = useTranslations('project.form')
  const tReview = useTranslations('project.form.review')
  const tPackages = useTranslations('project.form.aiDesignResult.packages')
  const tHouseType = useTranslations('project.form.aiDesignResult.houseTypeValue')
  const tFloorTabs = useTranslations('project.form.aiDesignResult.floorTabs')
  const tRoomsPlan = useTranslations('project.form.aiDesignResult.rooms')
  const tRoomsGallery = useTranslations('project.form.galleries.rooms')
  const tUnits = useTranslations('project.form.aiDesignResult.units')
  const tColumns = useTranslations('project.form.aiDesignResult.columns')
  const tItems = useTranslations('project.form.aiDesignResult.items')
  const tCoverStr = useTranslations('project.form.review.sections.cover')
  const tInfoStr = useTranslations('project.form.review.sections.projectInfo')
  const tEstimateStr = useTranslations('project.form.review.sections.estimate')
  const tFloorPlansStr = useTranslations('project.form.review.sections.floorPlans')
  const tRendersStr = useTranslations('project.form.review.sections.renders')
  const tFooterStr = useTranslations('project.form.review.sections.footer')
  const tc = useTranslations('common')
  const locale = useLocale() as Locale

  const project = useProjectStore((s) => s.projects[slug])
  const galleryMeta = useProjectStore((s) => s.projects[slug]?.galleries)

  useSetProjectFlow(slug, 'review')

  const [included, setIncluded] = useState<Record<ReviewSectionKey, boolean>>(DEFAULT_INCLUDED)
  const [clientName, setClientName] = useState('')
  const [language, setLanguage] = useState<'vi' | 'en'>('vi')
  const [currency, setCurrency] = useState<'vnd' | 'usd'>('vnd')
  const [isExporting, setIsExporting] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)

  const hasRoof = true
  const tier = DEFAULT_PACKAGE_TIER

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

    const metrics: AreaMetrics = {
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
    const clientBudget =
      designRequest?.budgetAmount && designRequest.budgetAmount > 0 ? designRequest.budgetAmount : FALLBACK_USER_BUDGET

    const budget: Budget = (() => {
      const rough = ROUGH_COST_PER_SQM_MILLIONS * metrics.totalFloorArea * M
      const finishing = PACKAGE_PRICING[tier].finishing * metrics.totalFloorArea * M
      const interior = PACKAGE_PRICING[tier].interior * metrics.usableArea * M
      return { rough, finishing, interior, total: rough + finishing + interior }
    })()

    const visibleFloors = buildVisibleFloors(floorCount, hasTum, hasRoof)

    return { metrics, hasTum, city, clientBudget, budget, visibleFloors }
  }, [project, tier, hasRoof])

  const sections: ReviewSection[] = useMemo(
    () =>
      REVIEW_SECTION_KEYS.map((key) => ({
        key,
        title: tReview(`sections.${key}.title` as never),
        description: tReview(`sections.${key}.description` as never)
      })),
    [tReview]
  )

  const favorites = useMemo(() => {
    if (!galleryMeta) return []
    return GALLERY_IMAGES.filter((image) => galleryMeta[image.id]?.favorite).map((image) => ({
      image,
      meta: galleryMeta[image.id]!
    }))
  }, [galleryMeta])

  if (!project) {
    return <p>{t('projectNotFound')}</p>
  }

  const generatedAt = new Date()
  const shareUrl = `https://app.bmt.vn/share/${project.slug}`
  const packageName = tPackages(`${tier}.name`)

  const allSelected = REVIEW_SECTION_KEYS.every((key) => included[key])
  const selectedCount = REVIEW_SECTION_KEYS.filter((key) => included[key]).length

  const toggleSection = (key: string, next: boolean) => {
    setIncluded((prev) => ({ ...prev, [key as ReviewSectionKey]: next }))
  }

  const toggleAll = (next: boolean) => {
    const map = REVIEW_SECTION_KEYS.reduce<Record<ReviewSectionKey, boolean>>(
      (acc, key) => {
        acc[key] = next
        return acc
      },
      { ...DEFAULT_INCLUDED }
    )
    setIncluded(map)
  }

  const buildPdfStrings = (): PdfStrings => ({
    brand: tCoverStr('brand'),
    contactPhone: tCoverStr('contactPhone'),
    contactWebsite: tCoverStr('contactWebsite'),
    exportedAtLabel: (date) => tCoverStr('exportedAt', { date }),
    pageOf: tFooterStr('pageNumber', { current: '{current}', total: '{total}' }),
    cover: {
      projectNameLabel: tCoverStr('projectNameLabel'),
      houseTypeLabel: tCoverStr('houseTypeLabel'),
      clientNameLabel: tCoverStr('clientNameLabel'),
      houseType: {
        Townhouse: tHouseType('Townhouse'),
        Villa: tHouseType('Villa'),
        Appartment: tHouseType('Appartment')
      }
    },
    projectInfo: {
      title: tInfoStr('title'),
      landArea: tInfoStr('landArea'),
      floorCount: tInfoStr('floorCount'),
      totalFloorArea: tInfoStr('totalFloorArea'),
      city: tInfoStr('city'),
      budget: tInfoStr('budget'),
      packageLabel: tInfoStr('package'),
      createdAt: tInfoStr('createdAt')
    },
    floorPlans: {
      title: tFloorPlansStr('title'),
      tabs: {
        ground: tFloorTabs('ground'),
        floor1: tFloorTabs('floor1'),
        floor2: tFloorTabs('floor2'),
        floor3: tFloorTabs('floor3'),
        floor4: tFloorTabs('floor4'),
        roof: tFloorTabs('roof'),
        tum: tFloorTabs('tum')
      },
      rooms: {
        living: tRoomsPlan('living'),
        kitchen: tRoomsPlan('kitchen'),
        dining: tRoomsPlan('dining'),
        bath: tRoomsPlan('bath'),
        wc: tRoomsPlan('wc'),
        bedroom1: tRoomsPlan('bedroom1'),
        bedroom2: tRoomsPlan('bedroom2'),
        bedroom3: tRoomsPlan('bedroom3'),
        stairs: tRoomsPlan('stairs'),
        balcony: tRoomsPlan('balcony'),
        laundry: tRoomsPlan('laundry'),
        attic: tRoomsPlan('attic'),
        terrace: tRoomsPlan('terrace')
      }
    },
    estimate: {
      title: tEstimateStr('title'),
      totalLabel: tEstimateStr('totalRow'),
      tabs: {
        rough: tEstimateStr('tabs.rough'),
        finishing: tEstimateStr('tabs.finishing'),
        interior: tEstimateStr('tabs.interior')
      },
      columns: {
        code: tColumns('code'),
        item: tColumns('item'),
        unit: tColumns('unit'),
        quantity: tColumns('quantity'),
        amount: tColumns('amount')
      },
      units: {
        m2: tUnits('m2'),
        m3: tUnits('m3'),
        md: tUnits('md'),
        bo: tUnits('bo'),
        cai: tUnits('cai'),
        set: tUnits('set')
      },
      itemName: (part, code) => tItems(`${part}.${code}.name` as never)
    },
    renders: {
      title: tRendersStr('title'),
      empty: tRendersStr('empty'),
      room: {
        living: tRoomsGallery('living'),
        kitchen: tRoomsGallery('kitchen'),
        dining: tRoomsGallery('dining'),
        bedroom: tRoomsGallery('bedroom'),
        bathroom: tRoomsGallery('bathroom'),
        exterior: tRoomsGallery('exterior')
      }
    }
  })

  const handleExportPdf = async () => {
    if (!project) return
    setIsExporting(true)
    try {
      const strings = buildPdfStrings()
      const data = buildPdfData({
        strings,
        locale,
        included,
        projectName: project.name,
        houseType: project.houseType,
        clientName,
        createdAt: project.createdAt,
        city: derived.city,
        clientBudget: derived.clientBudget,
        packageName,
        metrics: derived.metrics,
        hasTum: derived.hasTum,
        hasRoof,
        tier,
        budget: derived.budget,
        visibleFloors: derived.visibleFloors,
        favorites,
        exportedAt: generatedAt
      })
      await generateProjectPdf({ data, fileName: `${project.slug}-proposal` })
      toast.success(tReview('actions.exported'))
    } catch (error) {
      console.error('PDF export failed', error)
      toast.error(tReview('actions.exportFailed'))
    } finally {
      setIsExporting(false)
    }
  }

  const galleriesUrl = `/projects/${project.slug}/galleries`

  const sectionAt = (key: ReviewSectionKey): ReviewSection =>
    sections.find((s) => s.key === key) ?? { key, title: key, description: '' }

  return (
    <div className='space-y-6'>
      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]'>
        <div className='space-y-4'>
          <ReviewSectionCard
            index={1}
            title={sectionAt('cover').title}
            description={sectionAt('cover').description}
            included={included.cover}
            onToggle={(next) => toggleSection('cover', next)}
          >
            <ReviewCover
              projectName={project.name}
              houseType={project.houseType}
              clientName={clientName}
              onClientNameChange={setClientName}
              generatedAt={generatedAt}
            />
          </ReviewSectionCard>

          <ReviewSectionCard
            index={2}
            title={sectionAt('projectInfo').title}
            description={sectionAt('projectInfo').description}
            included={included.projectInfo}
            onToggle={(next) => toggleSection('projectInfo', next)}
          >
            <ReviewProjectInfo
              projectName={project.name}
              metrics={derived.metrics}
              city={derived.city}
              clientBudget={derived.clientBudget}
              packageName={packageName}
              createdAt={project.createdAt}
            />
          </ReviewSectionCard>

          <ReviewSectionCard
            index={3}
            title={sectionAt('floorPlans').title}
            description={sectionAt('floorPlans').description}
            included={included.floorPlans}
            onToggle={(next) => toggleSection('floorPlans', next)}
          >
            <ReviewFloorPlans floors={derived.visibleFloors} />
          </ReviewSectionCard>

          <ReviewSectionCard
            index={4}
            title={sectionAt('estimate').title}
            description={sectionAt('estimate').description}
            included={included.estimate}
            onToggle={(next) => toggleSection('estimate', next)}
          >
            <ReviewEstimate tier={tier} hasTum={derived.hasTum} hasRoof={hasRoof} budget={derived.budget} />
          </ReviewSectionCard>

          <ReviewSectionCard
            index={5}
            title={sectionAt('renders').title}
            description={sectionAt('renders').description}
            included={included.renders}
            onToggle={(next) => toggleSection('renders', next)}
          >
            <ReviewRenders favorites={favorites} galleriesUrl={galleriesUrl} />
          </ReviewSectionCard>

          <Card className='border-border/70 border-dashed'>
            <CardContent className='space-y-2'>
              <p className='text-sm font-semibold'>{tReview('sections.footer.title')}</p>
              <p className='text-muted-foreground text-xs'>{tReview('sections.footer.description')}</p>
              <ReviewFooterPreview />
            </CardContent>
          </Card>

          <div className='flex flex-wrap items-center justify-between gap-2 pt-2'>
            {project.prevUrl ? (
              <Button type='button' variant='outline' asChild>
                <Link href={project.prevUrl}>{tc('back')}</Link>
              </Button>
            ) : (
              <span />
            )}
            <Button type='button' onClick={handleExportPdf} disabled={isExporting || selectedCount === 0}>
              {isExporting ? tReview('actions.exporting') : tReview('actions.finish')}
            </Button>
          </div>
        </div>

        <div>
          <ReviewSharePanel
            sections={sections}
            included={included}
            onToggleSection={toggleSection}
            onToggleAll={toggleAll}
            allSelected={allSelected}
            language={language}
            onLanguageChange={setLanguage}
            currency={currency}
            onCurrencyChange={setCurrency}
            onExportPdf={handleExportPdf}
            onShareLink={() => setShareOpen(true)}
            onSendEmail={() => setEmailOpen(true)}
            isExporting={isExporting}
          />
        </div>
      </div>

      <ShareLinkDialog open={shareOpen} onOpenChange={setShareOpen} shareUrl={shareUrl} />
      <SendEmailDialog open={emailOpen} onOpenChange={setEmailOpen} />
    </div>
  )
}
