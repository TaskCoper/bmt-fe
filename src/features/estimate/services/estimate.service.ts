/**
 * Pure domain logic for the standalone cost estimator — no React, no HTTP.
 * Mirrors the studio budget rules (shared pricing) so the two flows agree.
 */
import {
  ESTIMATE_BASE_ROOMS,
  ESTIMATE_BREAKDOWN,
  ESTIMATE_BUILDING_FACTOR,
  ESTIMATE_PACKAGES,
  ESTIMATE_ROOM_SURCHARGE,
  ROUGH_COST_PER_SQM,
  type EstimatePackageId
} from '../constants/estimate.constants'
import type { EstimateInput, EstimateResult } from '../types/estimate.types'

function packageOf(id: EstimatePackageId) {
  return ESTIMATE_PACKAGES.find((p) => p.id === id) ?? ESTIMATE_PACKAGES[0]
}

/**
 * Compute a reference estimate from the declared inputs.
 * - Quantity = total constructed floor area = area × floors.
 * - Building type scales every rate (villa/townhouse cost more).
 * - Extra rooms add an interior surcharge (partitions, doors, fit-out).
 * amount = unitPrice × quantity, so the table stays internally consistent.
 */
export function calcEstimate(input: EstimateInput): EstimateResult {
  const area = Number.isFinite(input.area) && input.area > 0 ? input.area : 0
  const floors = Number.isFinite(input.floors) && input.floors > 0 ? Math.floor(input.floors) : 1
  const rooms = Number.isFinite(input.rooms) && input.rooms > 0 ? Math.floor(input.rooms) : 0
  const pkg = packageOf(input.packageId)

  const buildingFactor = ESTIMATE_BUILDING_FACTOR[input.building] ?? 1
  const roomFactor = 1 + ESTIMATE_ROOM_SURCHARGE * Math.max(0, rooms - ESTIMATE_BASE_ROOMS)

  // Total constructed area across all floors drives the quantity.
  const builtArea = area * floors

  const lines = [
    { portion: 'rough' as const, rate: ROUGH_COST_PER_SQM * buildingFactor },
    { portion: 'finishing' as const, rate: pkg.finishingPerSqm * buildingFactor },
    { portion: 'interior' as const, rate: pkg.interiorPerSqm * buildingFactor * roomFactor }
  ].map((row) => {
    // Split the portion rate into its sub-items (materials, labour, …).
    const items = ESTIMATE_BREAKDOWN[row.portion].map((sub) => {
      const unitPrice = Math.round(row.rate * sub.fraction)
      return { key: sub.key, quantity: builtArea, unit: 'm²', unitPrice, amount: unitPrice * builtArea }
    })
    // Portion totals are the sum of their sub-items (keeps the table consistent).
    const unitPrice = items.reduce((sum, it) => sum + it.unitPrice, 0)
    return {
      portion: row.portion,
      quantity: builtArea,
      unit: 'm²',
      unitPrice,
      amount: unitPrice * builtArea,
      items
    }
  })

  const total = lines.reduce((sum, l) => sum + l.amount, 0)
  return { lines, total }
}

export const estimateService = { calcEstimate }
