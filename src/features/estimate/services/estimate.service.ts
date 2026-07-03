/**
 * Pure domain logic for the standalone cost estimator — no React, no HTTP.
 * Mirrors the studio budget rules (shared pricing) so the two flows agree.
 */
import {
  ESTIMATE_PACKAGES,
  ROUGH_COST_PER_SQM,
  type EstimatePackageId,
} from '../constants/estimate.constants'
import type { EstimateInput, EstimateResult } from '../types/estimate.types'

function packageOf(id: EstimatePackageId) {
  return ESTIMATE_PACKAGES.find((p) => p.id === id) ?? ESTIMATE_PACKAGES[0]
}

/**
 * Compute a reference estimate from the declared inputs. Quantity for each
 * portion is the total floor area (m²); amount = rate × area.
 */
export function calcEstimate(input: EstimateInput): EstimateResult {
  const area = Number.isFinite(input.area) && input.area > 0 ? input.area : 0
  const pkg = packageOf(input.packageId)

  const lines = [
    { portion: 'rough' as const, unitPrice: ROUGH_COST_PER_SQM },
    { portion: 'finishing' as const, unitPrice: pkg.finishingPerSqm },
    { portion: 'interior' as const, unitPrice: pkg.interiorPerSqm },
  ].map((row) => ({
    portion: row.portion,
    quantity: area,
    unit: 'm²',
    unitPrice: row.unitPrice,
    amount: Math.round(row.unitPrice * area),
  }))

  const total = lines.reduce((sum, l) => sum + l.amount, 0)
  return { lines, total }
}

export const estimateService = { calcEstimate }
