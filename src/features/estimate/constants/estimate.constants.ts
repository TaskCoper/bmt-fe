/** Estimate feature constants. */

export const ESTIMATE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const

export type EstimateStatus = (typeof ESTIMATE_STATUS)[keyof typeof ESTIMATE_STATUS]

export const DEFAULT_ESTIMATE_PAGE_SIZE = 8

/** Bounds + step for the list price-range picker (VNĐ). */
export const ESTIMATE_PRICE_MIN = 0
export const ESTIMATE_PRICE_MAX = 8_000_000_000
export const ESTIMATE_PRICE_STEP = 100_000_000

// --- Standalone estimate creator (stakeholder Q&A §5.1) ---

/** Residential building types (MVP). */
export const ESTIMATE_BUILDINGS = ['apartment', 'townhouse', 'villa'] as const
export type EstimateBuilding = (typeof ESTIMATE_BUILDINGS)[number]

/** Cost multiplier by building type — villas/townhouses cost more per m². */
export const ESTIMATE_BUILDING_FACTOR: Record<EstimateBuilding, number> = {
  apartment: 1,
  townhouse: 1.08,
  villa: 1.2
}

/** Interior baseline room count; each extra room adds a surcharge below. */
export const ESTIMATE_BASE_ROOMS = 1
/** Interior surcharge per room above {@link ESTIMATE_BASE_ROOMS} (+8%/room). */
export const ESTIMATE_ROOM_SURCHARGE = 0.08

/** Fixed rough-construction cost (phần thô) per m². */
export const ROUGH_COST_PER_SQM = 3_500_000

/** Material packages with finishing + interior rates (VNĐ/m²). */
export const ESTIMATE_PACKAGES = [
  { id: 'basic', finishingPerSqm: 1_800_000, interiorPerSqm: 2_000_000 },
  { id: 'standard', finishingPerSqm: 2_800_000, interiorPerSqm: 3_500_000 },
  { id: 'premium', finishingPerSqm: 4_500_000, interiorPerSqm: 6_000_000 }
] as const

export type EstimatePackageId = (typeof ESTIMATE_PACKAGES)[number]['id']

/** Estimate cost portions (the 3 breakdown rows). */
export const ESTIMATE_PORTIONS = ['rough', 'finishing', 'interior'] as const
export type EstimatePortion = (typeof ESTIMATE_PORTIONS)[number]

/**
 * Sub-item breakdown per portion (materials / labour / …). Fractions of each
 * portion's per-m² rate — they sum to 1 within a portion.
 */
export const ESTIMATE_BREAKDOWN = {
  rough: [
    { key: 'roughMaterial', fraction: 0.55 },
    { key: 'roughLabor', fraction: 0.35 },
    { key: 'roughOther', fraction: 0.1 }
  ],
  finishing: [
    { key: 'finishMaterial', fraction: 0.6 },
    { key: 'finishLabor', fraction: 0.4 }
  ],
  interior: [
    { key: 'interiorCabinet', fraction: 0.55 },
    { key: 'interiorAppliance', fraction: 0.25 },
    { key: 'interiorDecor', fraction: 0.2 }
  ]
} as const satisfies Record<EstimatePortion, readonly { key: string; fraction: number }[]>

/** Union of all sub-item keys (for typed i18n lookups). */
export type EstimateSubItemKey = (typeof ESTIMATE_BREAKDOWN)[EstimatePortion][number]['key']
