import type {
  EstimateBuilding,
  EstimatePackageId,
  EstimatePortion,
  EstimateStatus,
  EstimateSubItemKey
} from '../constants/estimate.constants'

/** A cost estimate as returned by the backend. */
export interface Estimate {
  id: string
  code: string
  name: string
  projectName: string
  status: EstimateStatus
  total: number
  itemsCount: number
  createdAt: string
  /** Optional free-text note captured on save. */
  description?: string
  /** Inputs used to compute the breakdown (present on the detail record). */
  input?: EstimateInput
}

/** Aggregate figures shown above the estimate list. */
export interface EstimateSummary {
  total: number
  approved: number
  pending: number
  totalValue: number
}

/** Client-side list filters. */
export interface EstimateFilters {
  search: string
  status: EstimateStatus | 'all'
  minPrice: number
  maxPrice: number
  page: number
}

/** Inputs for the standalone estimate creator. */
export interface EstimateInput {
  area: number
  floors: number
  rooms: number
  building: EstimateBuilding
  packageId: EstimatePackageId
}

/** A sub-item of a portion (materials, labour, …). */
export interface EstimateSubItem {
  key: EstimateSubItemKey
  quantity: number
  unit: string
  unitPrice: number
  amount: number
}

/** A single breakdown row of a computed estimate. */
export interface EstimateLine {
  portion: EstimatePortion
  quantity: number
  unit: string
  unitPrice: number
  amount: number
  /** Cost sub-items (materials / labour / …) that make up this portion. */
  items: EstimateSubItem[]
}

/** Result of the standalone estimate computation. */
export interface EstimateResult {
  lines: EstimateLine[]
  total: number
}
