import type { HouseType } from './project.types'

export const PackageTier = {
  Basic: 'basic',
  Standard: 'standard',
  Premium: 'premium'
} as const

export type PackageTier = (typeof PackageTier)[keyof typeof PackageTier]

export const EstimatePart = {
  Rough: 'rough',
  Finishing: 'finishing',
  Interior: 'interior'
} as const

export type EstimatePart = (typeof EstimatePart)[keyof typeof EstimatePart]

export const EstimateUnit = {
  M2: 'm2',
  M3: 'm3',
  Md: 'md',
  Bo: 'bo',
  Cai: 'cai',
  Set: 'set'
} as const

export type EstimateUnit = (typeof EstimateUnit)[keyof typeof EstimateUnit]

export type EstimateItemRequires = 'hasTum' | 'hasRoof'

export interface EstimateItem {
  code: string
  nameKey: string
  unit: EstimateUnit
  quantity: number
  unitPricePerTier: Record<PackageTier, number>
  isConditional?: boolean
  requires?: EstimateItemRequires
}

export const FloorId = {
  Ground: 'ground',
  Floor1: 'floor1',
  Floor2: 'floor2',
  Floor3: 'floor3',
  Floor4: 'floor4',
  Roof: 'roof',
  Tum: 'tum'
} as const

export type FloorId = (typeof FloorId)[keyof typeof FloorId]

export interface AreaMetrics {
  landArea: number
  groundFloorArea: number
  totalFloorArea: number
  usableArea: number
  floorCount: number
  estimatedHeight: number
  usableFactor: number
  houseType: HouseType
}

export interface Consultation {
  customerName: string
  landArea: number
  floorCount: number
  totalFloorArea: number
  city: string
  budgetMinBillion: number
  budgetMaxBillion: number
  hasTum: boolean
}

export interface DealerInfo {
  name: string
  addressPreMerger: string
  phone?: string
}

export interface Budget {
  rough: number
  finishing: number
  interior: number
  total: number
}

export interface PackagePricing {
  rough: number
  finishing: number
  interior: number
}
