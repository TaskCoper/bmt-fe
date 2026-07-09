import type { Locale } from '@/i18n/routing'
import { formatCurrency, formatDate, formatNumber } from '@/shared/utils'
import { FINISHING_ITEMS, INTERIOR_ITEMS, ROUGH_ITEMS } from '../../constants/ai-design-result.constants'
import { galleryImageUrl, type GalleryImage } from '../../constants/galleries.constants'
import type { ImageMeta } from '../../store/project.store'
import type { AreaMetrics, Budget, EstimateItem, FloorId, PackageTier } from '../../types/ai-design-result.types'
import type { HouseType } from '../../types/project.types'
import { PDF_FLOOR_LAYOUTS, type FloorLayoutKey } from './pdf-floor-layouts'
import type { PdfDocumentData, PdfEstimatePart, PdfEstimateRow, PdfFloor, PdfIncluded } from './pdf-types'

export type PdfLocale = 'vi' | 'en'

/**
 * All translated copy the PDF needs. Keep this flat and pre-resolved so the
 * document itself doesn't touch next-intl.
 */
export interface PdfStrings {
  brand: string
  contactPhone: string
  contactWebsite: string
  exportedAtLabel: (date: string) => string
  pageOf: string
  cover: {
    projectNameLabel: string
    houseTypeLabel: string
    clientNameLabel: string
    houseType: Record<HouseType, string>
  }
  projectInfo: {
    title: string
    landArea: string
    floorCount: string
    totalFloorArea: string
    city: string
    budget: string
    packageLabel: string
    createdAt: string
  }
  floorPlans: {
    title: string
    tabs: Record<string, string>
    rooms: Record<string, string>
  }
  estimate: {
    title: string
    tabs: Record<'rough' | 'finishing' | 'interior', string>
    totalLabel: string
    columns: {
      code: string
      item: string
      unit: string
      quantity: string
      amount: string
    }
    units: Record<string, string>
    itemName: (part: 'rough' | 'finishing' | 'interior', code: string) => string
  }
  renders: {
    title: string
    empty: string
    room: Record<string, string>
  }
}

interface BuilderInput {
  strings: PdfStrings
  locale: Locale
  included: PdfIncluded
  projectName: string
  houseType: HouseType
  clientName: string
  createdAt: string
  city: string
  clientBudget: number
  packageName: string
  metrics: AreaMetrics
  hasTum: boolean
  hasRoof: boolean
  tier: PackageTier
  budget: Budget
  visibleFloors: readonly FloorId[]
  favorites: readonly { image: GalleryImage; meta: ImageMeta }[]
  exportedAt: Date
}

function filterItems(items: readonly EstimateItem[], hasTum: boolean, hasRoof: boolean): readonly EstimateItem[] {
  return items.filter((item) => {
    if (item.requires === 'hasTum') return hasTum
    if (item.requires === 'hasRoof') return hasRoof
    return true
  })
}

function buildEstimatePart(
  key: 'rough' | 'finishing' | 'interior',
  items: readonly EstimateItem[],
  tier: PackageTier,
  subtotal: number,
  strings: PdfStrings,
  locale: Locale
): PdfEstimatePart {
  const rows: PdfEstimateRow[] = items.map((item) => {
    const amount = item.unitPricePerTier[tier] * item.quantity
    return {
      code: item.code,
      name: strings.estimate.itemName(key, item.code),
      quantity: item.quantity,
      unit: strings.estimate.units[item.unit] ?? item.unit,
      amount: formatCurrency(amount, locale)
    }
  })
  return {
    key,
    label: strings.estimate.tabs[key],
    rows,
    subtotal: formatCurrency(subtotal, locale)
  }
}

function buildFloor(floorId: FloorId, strings: PdfStrings): PdfFloor {
  const layout = PDF_FLOOR_LAYOUTS[floorId as FloorLayoutKey] ?? []
  return {
    key: floorId,
    label: strings.floorPlans.tabs[floorId] ?? floorId,
    rooms: layout.map((room) => ({
      ...room,
      label: strings.floorPlans.rooms[room.key] ?? room.key
    }))
  }
}

export function buildPdfData(input: BuilderInput): PdfDocumentData {
  const { strings, locale, included, metrics, tier, budget, favorites, exportedAt } = input

  const roughItems = filterItems(ROUGH_ITEMS, input.hasTum, input.hasRoof)
  const estimateParts: PdfEstimatePart[] = [
    buildEstimatePart('rough', roughItems, tier, budget.rough, strings, locale),
    buildEstimatePart('finishing', FINISHING_ITEMS, tier, budget.finishing, strings, locale),
    buildEstimatePart('interior', INTERIOR_ITEMS, tier, budget.interior, strings, locale)
  ]

  return {
    brand: strings.brand,
    contactPhone: strings.contactPhone,
    contactWebsite: strings.contactWebsite,
    exportedAtLabel: strings.exportedAtLabel(formatDate(exportedAt, locale)),
    included,
    cover: {
      projectName: input.projectName,
      projectNameLabel: strings.cover.projectNameLabel,
      houseType: strings.cover.houseType[input.houseType],
      houseTypeLabel: strings.cover.houseTypeLabel,
      clientName: input.clientName,
      clientNameLabel: strings.cover.clientNameLabel
    },
    projectInfo: {
      title: strings.projectInfo.title,
      projectName: input.projectName,
      rows: [
        { label: strings.projectInfo.landArea, value: `${formatNumber(metrics.landArea, locale)} m²` },
        {
          label: strings.projectInfo.totalFloorArea,
          value: `${formatNumber(metrics.totalFloorArea, locale)} m²`
        },
        { label: strings.projectInfo.floorCount, value: `${metrics.floorCount}` },
        { label: strings.projectInfo.city, value: input.city },
        { label: strings.projectInfo.budget, value: formatCurrency(input.clientBudget, locale) },
        { label: strings.projectInfo.packageLabel, value: input.packageName },
        { label: strings.projectInfo.createdAt, value: formatDate(input.createdAt, locale) }
      ]
    },
    floorPlans: {
      title: strings.floorPlans.title,
      floors: input.visibleFloors.map((floor) => buildFloor(floor, strings))
    },
    estimate: {
      title: strings.estimate.title,
      tabsHint: '',
      parts: estimateParts,
      columns: strings.estimate.columns,
      totalLabel: strings.estimate.totalLabel,
      total: formatCurrency(budget.total, locale)
    },
    renders: {
      title: strings.renders.title,
      empty: strings.renders.empty,
      items: favorites.map(({ image, meta }) => ({
        id: image.id,
        url: galleryImageUrl(image, 900),
        room: strings.renders.room[image.room] ?? image.room,
        caption: meta.caption
      }))
    },
    footer: {
      pageLabel: strings.pageOf
    }
  }
}
