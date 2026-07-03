/** Estimate feature constants. */

export const ESTIMATE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export type EstimateStatus =
  (typeof ESTIMATE_STATUS)[keyof typeof ESTIMATE_STATUS]

export const DEFAULT_ESTIMATE_PAGE_SIZE = 8

// --- Standalone estimate creator (stakeholder Q&A §5.1) ---

/** Residential building types (MVP). */
export const ESTIMATE_BUILDINGS = ['apartment', 'townhouse', 'villa'] as const
export type EstimateBuilding = (typeof ESTIMATE_BUILDINGS)[number]

/** Fixed rough-construction cost (phần thô) per m². */
export const ROUGH_COST_PER_SQM = 3_500_000

/** Material packages with finishing + interior rates (VNĐ/m²). */
export const ESTIMATE_PACKAGES = [
  { id: 'basic', finishingPerSqm: 1_800_000, interiorPerSqm: 2_000_000 },
  { id: 'standard', finishingPerSqm: 2_800_000, interiorPerSqm: 3_500_000 },
  { id: 'premium', finishingPerSqm: 4_500_000, interiorPerSqm: 6_000_000 },
] as const

export type EstimatePackageId = (typeof ESTIMATE_PACKAGES)[number]['id']

/** Estimate cost portions (the 3 breakdown rows). */
export const ESTIMATE_PORTIONS = ['rough', 'finishing', 'interior'] as const
export type EstimatePortion = (typeof ESTIMATE_PORTIONS)[number]
