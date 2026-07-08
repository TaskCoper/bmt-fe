/**
 * Pure domain logic for the design studio — no React, no HTTP.
 *
 * Budget math and the deterministic mock estimate generation live here so they
 * stay unit-testable and the UI layer remains thin.
 */
import type { StepStatus } from '@/shared/components/common'
import {
  BUDGET_PACKAGE_LIST,
  ESTIMATE_CATEGORIES,
  PACKAGE_TIERS,
  ROUGH_COST_PER_SQM,
  WIZARD_STEPS,
  type EstimateCategoryId,
  type PackageTier,
  type WizardStepId,
} from '../constants/studio.constants'
import type {
  AreaSummary,
  BudgetBreakdown,
  EstimateItem,
  EstimateSection,
  EstimateTierData,
  GenerateResult,
  ProjectSnapshot,
  RenderImage,
  WizardData,
} from '../types/studio.types'

function packageOf(id: PackageTier) {
  return BUDGET_PACKAGE_LIST.find((p) => p.id === id) ?? BUDGET_PACKAGE_LIST[0]!
}

/** Derive the construction-area summary from the build area + floor count. */
export function deriveArea(area: number, floors: number): AreaSummary {
  const safeArea = Number.isFinite(area) && area > 0 ? area : 0
  const storeys = Math.max(1, Math.floor(floors) + 1)
  const totalFloorArea = safeArea * storeys
  return {
    landArea: Math.round(safeArea * 1.25),
    groundFloorArea: safeArea,
    totalFloorArea,
    usableArea: Math.round(totalFloorArea * 0.85),
    floors: storeys,
    estimatedHeight: Math.round((storeys * 3.4 + 1.5) * 10) / 10,
  }
}

/**
 * Line-item templates per category. Quantities scale with floor area so the
 * generated estimate roughly reconciles with the tier total. Names/units are
 * translation keys resolved by the UI (kept stable & deterministic).
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

function buildTier(
  id: EstimateCategoryId,
  tierTotal: number,
  area: number,
): EstimateTierData {
  const templates = ITEM_TEMPLATES[id]
  const items: EstimateItem[] = templates.map((tpl) => {
    const amount = Math.round(tierTotal * tpl.share)
    const quantity =
      tpl.unit === 'set'
        ? Math.max(1, Math.round(area / 40))
        : Math.max(1, Math.round(area * tpl.share))
    const unitPrice = quantity > 0 ? Math.round(amount / quantity) : amount
    return {
      name: `${id}.${tpl.key}.name`,
      material: `${id}.${tpl.key}.material`,
      alternatives: [`${id}.${tpl.key}.alt`],
      method: `${id}.${tpl.key}.method`,
      quantity,
      unit: tpl.unit,
      unitPrice,
      amount,
      note: `${id}.${tpl.key}.note`,
    }
  })
  const total = items.reduce((sum, it) => sum + it.amount, 0)
  return { total, items }
}

/** Per-m² cost of a finishing/interior category for a given tier. */
function perSqm(id: EstimateCategoryId, tier: PackageTier): number {
  const pkg = packageOf(tier)
  return id === 'finishing' ? pkg.finishingPerSqm : pkg.interiorPerSqm
}

let renderSeed = 0

/** Build the full mock AI result from the collected wizard data. */
export function generateResult(data: WizardData, now: string): GenerateResult {
  const area = deriveArea(data.area, data.floors)
  const totalArea = area.totalFloorArea

  const sections: EstimateSection[] = ESTIMATE_CATEGORIES.map((id) => {
    if (id === 'rough') {
      const total = ROUGH_COST_PER_SQM * totalArea
      return { key: id, tiers: { single: buildTier(id, total, totalArea) } }
    }
    const tiers: EstimateSection['tiers'] = {}
    for (const tier of PACKAGE_TIERS) {
      tiers[tier] = buildTier(id, perSqm(id, tier) * totalArea, totalArea)
    }
    return { key: id, tiers }
  })

  // AI returns 2 exterior + 2 interior renders per storey.
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

  return { sections, area, renders, generatedAt: now }
}

/** Total for one section given the selected tier (rough always uses `single`). */
export function sectionTotal(
  section: EstimateSection,
  tier: PackageTier,
): number {
  if (section.key === 'rough') return section.tiers.single?.total ?? 0
  return section.tiers[tier]?.total ?? 0
}

/** Cost breakdown for the currently-selected tiers. */
export function breakdownFor(
  result: GenerateResult,
  selection: { finishing: PackageTier; interior: PackageTier },
): BudgetBreakdown {
  const find = (k: EstimateCategoryId) =>
    result.sections.find((s) => s.key === k)
  const rough = find('rough')
  const finishing = find('finishing')
  const interior = find('interior')
  const roughTotal = rough?.tiers.single?.total ?? 0
  const finishingTotal = finishing
    ? sectionTotal(finishing, selection.finishing)
    : 0
  const interiorTotal = interior
    ? sectionTotal(interior, selection.interior)
    : 0
  return {
    rough: roughTotal,
    finishing: finishingTotal,
    interior: interiorTotal,
    total: roughTotal + finishingTotal + interiorTotal,
  }
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
 * Per-step completion status for a project snapshot — powers the stepper, the
 * route guard, and the dashboard StepDots. A step is `done` when its inputs are
 * satisfied, `active`/`locked` otherwise (caller marks the current step).
 */
export function computeStepStatuses(
  snapshot: ProjectSnapshot,
): Record<WizardStepId, StepStatus> {
  const { data, result } = snapshot
  const requirementsDone = data.area > 0 && data.budget > 0
  const floorsNeeded = Math.floor(data.floors) + 1
  const uploadedFloors = new Set(
    data.images.filter((i) => i.floor >= 0).map((i) => i.floor),
  )
  const layoutsDone =
    uploadedFloors.size >= floorsNeeded &&
    Array.from({ length: floorsNeeded }).every((_, f) => uploadedFloors.has(f))
  const resultDone = result !== null

  const done: Record<WizardStepId, boolean> = {
    create: data.name.trim().length > 0,
    requirements: requirementsDone,
    layouts: layoutsDone,
    result: resultDone,
    render: resultDone,
    export: resultDone,
  }

  // A step is unlocked once every prior step is done.
  const statuses = {} as Record<WizardStepId, StepStatus>
  let prevDone = true
  for (const step of WIZARD_STEPS) {
    if (done[step]) statuses[step] = 'done'
    else if (prevDone) statuses[step] = 'active'
    else statuses[step] = 'locked'
    prevDone = prevDone && done[step]
  }
  return statuses
}

export const studioService = {
  deriveArea,
  generateResult,
  sectionTotal,
  breakdownFor,
  budgetShares,
  computeStepStatuses,
}
