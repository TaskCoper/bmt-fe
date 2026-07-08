import { HouseType } from '../types/project.types'
import {
  EstimateUnit,
  PackageTier,
  type Consultation,
  type EstimateItem,
  type PackagePricing,
  type DealerInfo,
  type AreaMetrics
} from '../types/ai-design-result.types'

export const AI_LOADING_MS = 2500

export const DEFAULT_PACKAGE_TIER: PackageTier = PackageTier.Standard

export const PACKAGE_TIER_ORDER: readonly PackageTier[] = [
  PackageTier.Basic,
  PackageTier.Standard,
  PackageTier.Premium
] as const

/** Unit prices per m² of applicable area, expressed in millions of VND. */
export const PACKAGE_PRICING: Record<PackageTier, PackagePricing> = {
  [PackageTier.Basic]: { rough: 3.5, finishing: 1.8, interior: 3.0 },
  [PackageTier.Standard]: { rough: 3.5, finishing: 2.5, interior: 5.0 },
  [PackageTier.Premium]: { rough: 3.5, finishing: 3.8, interior: 8.0 }
}

export const ROUGH_COST_PER_SQM_MILLIONS = 3.5

/** Usable-area factor per house type. Nhà phố 80%, biệt thự 82%, căn hộ 88%. */
export const USABLE_AREA_FACTOR: Record<HouseType, number> = {
  [HouseType.Townhouse]: 0.8,
  [HouseType.Villa]: 0.82,
  [HouseType.Appartment]: 0.88
}

/** Market average distribution ranges (for the consultation-card copy). */
export const MARKET_DISTRIBUTION = {
  roughMin: 0.5,
  roughMax: 0.55,
  finishingMin: 0.3,
  finishingMax: 0.35,
  interiorMin: 0.15,
  interiorMax: 0.2
} as const

/**
 * Share of the user's Step-2 `budgetAmount` allocated to each portion.
 * Midpoints of the market ranges above; sums to 100%.
 */
export const USER_BUDGET_SHARES = {
  rough: 0.52,
  finishing: 0.32,
  interior: 0.16
} as const

/** Fallback total budget in VND when the user hasn't set one at Step 2. */
export const FALLBACK_USER_BUDGET = 2_000_000_000

/** Fallback used when the project draft has no data yet. Matches the spec's demo sample. */
export const FALLBACK_CONSULTATION: Consultation = {
  customerName: 'Khách hàng',
  landArea: 80,
  floorCount: 5,
  totalFloorArea: 320,
  city: 'Hồ Chí Minh',
  budgetMinBillion: 3.0,
  budgetMaxBillion: 3.5,
  hasTum: true
}

export const FALLBACK_AREA_METRICS: AreaMetrics = {
  landArea: 80,
  groundFloorArea: 64,
  totalFloorArea: 320,
  usableArea: 256,
  floorCount: 5,
  estimatedHeight: 18.5,
  usableFactor: USABLE_AREA_FACTOR[HouseType.Townhouse],
  houseType: HouseType.Townhouse
}

const M = 1_000_000

export const ROUGH_ITEMS: readonly EstimateItem[] = [
  {
    code: 'THO-01',
    nameKey: 'items.rough.THO-01.name',
    unit: EstimateUnit.M3,
    quantity: 24,
    unitPricePerTier: {
      [PackageTier.Basic]: 5.5 * M,
      [PackageTier.Standard]: 5.5 * M,
      [PackageTier.Premium]: 5.5 * M
    }
  },
  {
    code: 'THO-02',
    nameKey: 'items.rough.THO-02.name',
    unit: EstimateUnit.M2,
    quantity: 480,
    unitPricePerTier: {
      [PackageTier.Basic]: 0.7 * M,
      [PackageTier.Standard]: 0.7 * M,
      [PackageTier.Premium]: 0.7 * M
    }
  },
  {
    code: 'THO-03',
    nameKey: 'items.rough.THO-03.name',
    unit: EstimateUnit.M2,
    quantity: 320,
    unitPricePerTier: {
      [PackageTier.Basic]: 0.3 * M,
      [PackageTier.Standard]: 0.3 * M,
      [PackageTier.Premium]: 0.3 * M
    }
  },
  {
    code: 'THO-04',
    nameKey: 'items.rough.THO-04.name',
    unit: EstimateUnit.Set,
    quantity: 5,
    unitPricePerTier: {
      [PackageTier.Basic]: 40 * M,
      [PackageTier.Standard]: 40 * M,
      [PackageTier.Premium]: 40 * M
    }
  },
  {
    code: 'THO-05',
    nameKey: 'items.rough.THO-05.name',
    unit: EstimateUnit.Bo,
    quantity: 4,
    unitPricePerTier: {
      [PackageTier.Basic]: 55 * M,
      [PackageTier.Standard]: 55 * M,
      [PackageTier.Premium]: 55 * M
    }
  },
  {
    code: 'THO-TUM',
    nameKey: 'items.rough.THO-TUM.name',
    unit: EstimateUnit.Bo,
    quantity: 1,
    unitPricePerTier: {
      [PackageTier.Basic]: 100 * M,
      [PackageTier.Standard]: 100 * M,
      [PackageTier.Premium]: 100 * M
    },
    isConditional: true,
    requires: 'hasTum'
  },
  {
    code: 'THO-ST',
    nameKey: 'items.rough.THO-ST.name',
    unit: EstimateUnit.Md,
    quantity: 40,
    unitPricePerTier: {
      [PackageTier.Basic]: 0.9 * M,
      [PackageTier.Standard]: 0.9 * M,
      [PackageTier.Premium]: 0.9 * M
    },
    isConditional: true,
    requires: 'hasRoof'
  }
] as const

export const FINISHING_ITEMS: readonly EstimateItem[] = [
  {
    code: 'HT-01',
    nameKey: 'items.finishing.HT-01.name',
    unit: EstimateUnit.M2,
    quantity: 640,
    unitPricePerTier: {
      [PackageTier.Basic]: 0.3 * M,
      [PackageTier.Standard]: 0.5 * M,
      [PackageTier.Premium]: 0.8 * M
    }
  },
  {
    code: 'HT-02',
    nameKey: 'items.finishing.HT-02.name',
    unit: EstimateUnit.M2,
    quantity: 900,
    unitPricePerTier: {
      [PackageTier.Basic]: 0.08 * M,
      [PackageTier.Standard]: 0.12 * M,
      [PackageTier.Premium]: 0.2 * M
    }
  },
  {
    code: 'HT-03',
    nameKey: 'items.finishing.HT-03.name',
    unit: EstimateUnit.M2,
    quantity: 320,
    unitPricePerTier: {
      [PackageTier.Basic]: 0.18 * M,
      [PackageTier.Standard]: 0.3 * M,
      [PackageTier.Premium]: 0.5 * M
    }
  },
  {
    code: 'HT-04',
    nameKey: 'items.finishing.HT-04.name',
    unit: EstimateUnit.Bo,
    quantity: 12,
    unitPricePerTier: {
      [PackageTier.Basic]: 3.5 * M,
      [PackageTier.Standard]: 6 * M,
      [PackageTier.Premium]: 12 * M
    }
  },
  {
    code: 'HT-05',
    nameKey: 'items.finishing.HT-05.name',
    unit: EstimateUnit.Bo,
    quantity: 4,
    unitPricePerTier: {
      [PackageTier.Basic]: 8 * M,
      [PackageTier.Standard]: 20 * M,
      [PackageTier.Premium]: 40 * M
    }
  },
  {
    code: 'HT-06',
    nameKey: 'items.finishing.HT-06.name',
    unit: EstimateUnit.Bo,
    quantity: 6,
    unitPricePerTier: {
      [PackageTier.Basic]: 6 * M,
      [PackageTier.Standard]: 20.66 * M,
      [PackageTier.Premium]: 40 * M
    }
  }
] as const

export const INTERIOR_ITEMS: readonly EstimateItem[] = [
  {
    code: 'NT-01',
    nameKey: 'items.interior.NT-01.name',
    unit: EstimateUnit.Bo,
    quantity: 1,
    unitPricePerTier: {
      [PackageTier.Basic]: 100 * M,
      [PackageTier.Standard]: 200 * M,
      [PackageTier.Premium]: 400 * M
    }
  },
  {
    code: 'NT-02',
    nameKey: 'items.interior.NT-02.name',
    unit: EstimateUnit.Bo,
    quantity: 4,
    unitPricePerTier: {
      [PackageTier.Basic]: 25 * M,
      [PackageTier.Standard]: 65 * M,
      [PackageTier.Premium]: 130 * M
    }
  },
  {
    code: 'NT-03',
    nameKey: 'items.interior.NT-03.name',
    unit: EstimateUnit.Bo,
    quantity: 4,
    unitPricePerTier: {
      [PackageTier.Basic]: 25 * M,
      [PackageTier.Standard]: 60 * M,
      [PackageTier.Premium]: 120 * M
    }
  },
  {
    code: 'NT-04',
    nameKey: 'items.interior.NT-04.name',
    unit: EstimateUnit.Bo,
    quantity: 1,
    unitPricePerTier: {
      [PackageTier.Basic]: 60 * M,
      [PackageTier.Standard]: 130 * M,
      [PackageTier.Premium]: 250 * M
    }
  },
  {
    code: 'NT-05',
    nameKey: 'items.interior.NT-05.name',
    unit: EstimateUnit.Bo,
    quantity: 1,
    unitPricePerTier: {
      [PackageTier.Basic]: 40 * M,
      [PackageTier.Standard]: 100 * M,
      [PackageTier.Premium]: 200 * M
    }
  },
  {
    code: 'NT-06',
    nameKey: 'items.interior.NT-06.name',
    unit: EstimateUnit.Bo,
    quantity: 1,
    unitPricePerTier: {
      [PackageTier.Basic]: 200 * M,
      [PackageTier.Standard]: 350 * M,
      [PackageTier.Premium]: 500 * M
    }
  }
] as const

const DEALER_DEFAULT: DealerInfo = {
  name: 'Đại lý VLXD Bảo Minh',
  addressPreMerger: '128 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP. Hồ Chí Minh',
  phone: '090 123 45 67'
}

/** City → dealer map. Keeps pre-merger district names in the address per spec. */
export const DEALER_BY_CITY: Record<string, DealerInfo> = {
  'Hồ Chí Minh': DEALER_DEFAULT,
  'Hà Nội': {
    name: 'Đại lý VLXD Hoàng Gia',
    addressPreMerger: '45 Trường Chinh, Phường Phương Liệt, Quận Thanh Xuân, TP. Hà Nội',
    phone: '024 3868 1234'
  },
  'Đà Nẵng': {
    name: 'Đại lý VLXD Miền Trung',
    addressPreMerger: '212 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, TP. Đà Nẵng',
    phone: '0236 3812 555'
  },
  'Cần Thơ': {
    name: 'Đại lý VLXD Tây Đô',
    addressPreMerger: '58 Nguyễn Trãi, Phường An Hội, Quận Ninh Kiều, TP. Cần Thơ',
    phone: '0292 3765 456'
  },
  default: DEALER_DEFAULT
}

export function resolveDealer(city: string): DealerInfo {
  return DEALER_BY_CITY[city] ?? DEALER_BY_CITY.default!
}

export const FLOOR_ORDER = [
  'ground',
  'floor1',
  'floor2',
  'floor3',
  'floor4',
  'roof',
  'tum'
] as const satisfies readonly string[]
