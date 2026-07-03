/**
 * Pure domain logic for the design studio — no React, no HTTP.
 *
 * Budget math and the deterministic mock estimate generation live here so they
 * stay unit-testable and the UI layer remains thin.
 */
import {
  BUDGET_PACKAGE_LIST,
  ESTIMATE_CATEGORIES,
  ROUGH_COST_PER_SQM,
  type BudgetPackageId,
  type EstimateCategoryId,
} from '../constants/studio.constants'
import type {
  AreaSummary,
  BudgetBreakdown,
  EstimateCategory,
  EstimateItem,
  GenerateResult,
  RenderImage,
  WizardData,
} from '../types/studio.types'

function packageOf(id: BudgetPackageId) {
  return BUDGET_PACKAGE_LIST.find((p) => p.id === id) ?? BUDGET_PACKAGE_LIST[0]!
}

/** Compute the budget breakdown for a package + floor area. */
export function calcBudget(
  packageId: BudgetPackageId,
  area: number,
): BudgetBreakdown {
  const pkg = packageOf(packageId)
  const safeArea = Number.isFinite(area) && area > 0 ? area : 0
  const rough = ROUGH_COST_PER_SQM * safeArea
  const finishing = pkg.finishingPerSqm * safeArea
  const interior = pkg.interiorPerSqm * safeArea
  return { rough, finishing, interior, total: rough + finishing + interior }
}

/** Cost-structure shares (for the donut chart), normalised to 0–1. */
export function budgetShares(
  b: BudgetBreakdown,
): Record<EstimateCategoryId, number> {
  const total = b.total || 1
  return {
    rough: b.rough / total,
    finishing: b.finishing / total,
    interior: b.interior / total,
  }
}

/**
 * Line-item templates per category. Quantities scale with floor area so the
 * generated estimate roughly reconciles with the package budget. Names/units
 * are translation keys resolved by the UI (kept stable & deterministic).
 */
const ITEM_TEMPLATES: Record<
  EstimateCategoryId,
  ReadonlyArray<{ key: string; unit: string; share: number }>
> = {
  rough: [
    { key: 'foundation', unit: 'm3', share: 0.35 },
    { key: 'frame', unit: 'm2', share: 0.4 },
    { key: 'masonry', unit: 'm2', share: 0.25 },
  ],
  finishing: [
    { key: 'flooring', unit: 'm2', share: 0.3 },
    { key: 'painting', unit: 'm2', share: 0.25 },
    { key: 'ceiling', unit: 'm2', share: 0.2 },
    { key: 'doors', unit: 'set', share: 0.25 },
  ],
  interior: [
    { key: 'living', unit: 'set', share: 0.3 },
    { key: 'kitchen', unit: 'set', share: 0.3 },
    { key: 'bedroom', unit: 'set', share: 0.25 },
    { key: 'lighting', unit: 'set', share: 0.15 },
  ],
}

function buildCategory(
  id: EstimateCategoryId,
  categoryTotal: number,
  area: number,
): EstimateCategory {
  const templates = ITEM_TEMPLATES[id]
  const items: EstimateItem[] = templates.map((tpl) => {
    const amount = Math.round(categoryTotal * tpl.share)
    const quantity =
      tpl.unit === 'set'
        ? Math.max(1, Math.round(area / 40))
        : Math.max(1, Math.round(area * tpl.share))
    const unitPrice = quantity > 0 ? Math.round(amount / quantity) : amount
    return {
      name: `${id}.${tpl.key}.name`,
      material: `${id}.${tpl.key}.material`,
      method: `${id}.${tpl.key}.method`,
      quantity,
      unit: tpl.unit,
      unitPrice,
      amount,
      note: `${id}.${tpl.key}.note`,
    }
  })
  const total = items.reduce((sum, it) => sum + it.amount, 0)
  return { id, items, total }
}

/** Derive the construction-area summary from the declared floor area. */
export function deriveArea(area: number): AreaSummary {
  const safeArea = Number.isFinite(area) && area > 0 ? area : 0
  const floors = safeArea > 200 ? 3 : safeArea > 100 ? 2 : 1
  const groundFloorArea = Math.round(safeArea / floors)
  return {
    landArea: Math.round(groundFloorArea * 1.25),
    groundFloorArea,
    totalFloorArea: safeArea,
    usableArea: Math.round(safeArea * 0.85),
    floors,
    estimatedHeight: floors * 3.4 + 1.5,
  }
}

let renderSeed = 0

/** Build the full mock AI result from the collected wizard data. */
export function generateResult(
  data: WizardData,
  /** Monotonic timestamp injected by the caller (scripts have no Date.now). */
  now: string,
): GenerateResult {
  const budget = calcBudget(data.packageId, data.area)
  const categoryTotals: Record<EstimateCategoryId, number> = {
    rough: budget.rough,
    finishing: budget.finishing,
    interior: budget.interior,
  }
  const categories = ESTIMATE_CATEGORIES.map((id) =>
    buildCategory(id, categoryTotals[id], data.area),
  )

  // AI returns 2 exterior + 2 interior renders per floor.
  const area = deriveArea(data.area)
  const renders: RenderImage[] = []
  for (let floor = 1; floor <= area.floors; floor++) {
    for (const kind of ['exterior', 'interior'] as const) {
      for (let n = 0; n < 2; n++) {
        renderSeed = (renderSeed + 47) % 360
        renders.push({
          id: `r-${floor}-${kind}-${n + 1}`,
          hue: renderSeed,
          kind,
          floor,
          caption: '',
          favorite: false,
        })
      }
    }
  }

  return {
    budget,
    categories,
    area,
    renders,
    generatedAt: now,
  }
}

export const studioService = {
  calcBudget,
  budgetShares,
  deriveArea,
  generateResult,
}
