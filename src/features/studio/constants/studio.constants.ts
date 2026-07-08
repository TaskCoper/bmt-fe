/**
 * Studio (BMT Decor AI — 6-step design flow) constants.
 *
 * Labels are exposed as translation keys (never hardcoded copy); components
 * resolve them under the `studio` namespace.
 */

/** The 6 sequential steps of the design flow (order = flow order). */
export const WIZARD_STEPS = ['create', 'requirements', 'layouts', 'result', 'render', 'export'] as const

export type WizardStepId = (typeof WIZARD_STEPS)[number]

/** URL segment for each step under `/dashboard/projects/[projectId]/…`. */
export const STEP_SEGMENTS: Record<WizardStepId, string> = {
  create: '',
  requirements: 'requirements',
  layouts: 'layouts',
  result: 'results',
  render: 'renders',
  export: 'export'
}

/** Locale-agnostic path for a project step (create → the shared `new` page). */
export function projectStepPath(projectId: string, step: WizardStepId): string {
  if (step === 'create') return '/dashboard/projects/new'
  return `/dashboard/projects/${projectId}/${STEP_SEGMENTS[step]}`
}

/** Construction categories. Commercial types are post-MVP (disabled in UI). */
export const CONSTRUCTION_TYPES = {
  APARTMENT: 'apartment',
  TOWNHOUSE: 'townhouse',
  VILLA: 'villa',
  OFFICE: 'office',
  COMMERCIAL: 'commercial',
  HOTEL: 'hotel'
} as const

export type ConstructionType = (typeof CONSTRUCTION_TYPES)[keyof typeof CONSTRUCTION_TYPES]

/** Construction-type options with their MVP availability. */
export const CONSTRUCTION_TYPE_OPTIONS: ReadonlyArray<{
  value: ConstructionType
  group: 'residential' | 'commercial'
  mvp: boolean
}> = [
  { value: CONSTRUCTION_TYPES.APARTMENT, group: 'residential', mvp: true },
  { value: CONSTRUCTION_TYPES.TOWNHOUSE, group: 'residential', mvp: true },
  { value: CONSTRUCTION_TYPES.VILLA, group: 'residential', mvp: true },
  { value: CONSTRUCTION_TYPES.OFFICE, group: 'commercial', mvp: false },
  { value: CONSTRUCTION_TYPES.COMMERCIAL, group: 'commercial', mvp: false },
  { value: CONSTRUCTION_TYPES.HOTEL, group: 'commercial', mvp: false }
]

/** Vietnam macro-regions (derived from the selected province). */
export const REGIONS = ['north', 'central', 'south'] as const
export type Region = (typeof REGIONS)[number]

/**
 * Floor-plan image upload limits (MVP, confirmed by stakeholder):
 * JPG/PNG/HEIC · max 10MB per image · max 5 images per floor.
 */
export const MAX_IMAGE_SIZE_MB = 10
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
export const MAX_IMAGES_PER_FLOOR = 5

/**
 * Number of floors ABOVE the ground floor. `floors = 0` → ground only (trệt);
 * `floors = 3` → trệt + 3. Drives the number of upload dropzones in step 3.
 */
export const MAX_FLOORS = 3
export const FLOOR_OPTIONS = [0, 1, 2, 3] as const

/** Accepted image MIME types + extensions for the file input / validation. */
export const ACCEPTED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'] as const
export const IMAGE_ACCEPT_ATTR = '.jpg,.jpeg,.png,.heic,.heif,image/*'

/** Max AI re-generations allowed per project (the first run is automatic). */
export const MAX_REGENERATIONS = 2

/** Fixed rough-construction cost (phần thô) — display only, not editable. */
export const ROUGH_COST_PER_SQM = 3_500_000

/** Interior budget tiers (VNĐ/m²) for finishing + interior portions. */
export const BUDGET_PACKAGES = {
  BASIC: 'basic',
  STANDARD: 'standard',
  PREMIUM: 'premium'
} as const

export type BudgetPackageId = (typeof BUDGET_PACKAGES)[keyof typeof BUDGET_PACKAGES]

/** Alias — a package selected per estimate section (finishing / interior). */
export type PackageTier = BudgetPackageId

export interface BudgetPackage {
  id: BudgetPackageId
  /** Finishing (phần hoàn thiện) cost per m². */
  finishingPerSqm: number
  /** Interior (phần nội thất) cost per m². */
  interiorPerSqm: number
}

export const BUDGET_PACKAGE_LIST: readonly BudgetPackage[] = [
  {
    id: BUDGET_PACKAGES.BASIC,
    finishingPerSqm: 1_800_000,
    interiorPerSqm: 2_000_000
  },
  {
    id: BUDGET_PACKAGES.STANDARD,
    finishingPerSqm: 2_800_000,
    interiorPerSqm: 3_500_000
  },
  {
    id: BUDGET_PACKAGES.PREMIUM,
    finishingPerSqm: 4_500_000,
    interiorPerSqm: 6_000_000
  }
]

/** Order used for tier radio-rows in the estimate table. */
export const PACKAGE_TIERS: readonly PackageTier[] = [
  BUDGET_PACKAGES.BASIC,
  BUDGET_PACKAGES.STANDARD,
  BUDGET_PACKAGES.PREMIUM
]

/**
 * House styles (single-select radio). `roof_*` are the mái-nhà family; the
 * modern & neoclassical styles expose an extra "có tum / không tum" toggle.
 */
export const HOUSE_STYLES = {
  ROOF_THAI: 'roof_thai',
  ROOF_JAPANESE: 'roof_japanese',
  ROOF_TRADITIONAL: 'roof_traditional',
  MODERN_TOWNHOUSE: 'modern_townhouse',
  NEOCLASSICAL: 'neoclassical'
} as const

export type HouseStyle = (typeof HOUSE_STYLES)[keyof typeof HOUSE_STYLES]

export interface HouseStyleOption {
  id: HouseStyle
  group: 'roof' | 'modern'
  /** Whether the "có tum / không tum" toggle applies to this style. */
  hasTumOption: boolean
}

export const HOUSE_STYLE_LIST: readonly HouseStyleOption[] = [
  { id: HOUSE_STYLES.ROOF_THAI, group: 'roof', hasTumOption: false },
  { id: HOUSE_STYLES.ROOF_JAPANESE, group: 'roof', hasTumOption: false },
  { id: HOUSE_STYLES.ROOF_TRADITIONAL, group: 'roof', hasTumOption: false },
  { id: HOUSE_STYLES.MODERN_TOWNHOUSE, group: 'modern', hasTumOption: true },
  { id: HOUSE_STYLES.NEOCLASSICAL, group: 'modern', hasTumOption: true }
]

/** Lighting preference. */
export const LIGHTING_OPTIONS = ['natural', 'artificial'] as const
export type LightingOption = (typeof LIGHTING_OPTIONS)[number]

/** Preferred house orientation (compass picker). */
export const HOUSE_DIRECTIONS = ['east', 'west', 'south', 'north'] as const
export type HouseDirection = (typeof HOUSE_DIRECTIONS)[number]

/** Estimate categories shown as the 3 tabs in step 4. */
export const ESTIMATE_CATEGORIES = ['rough', 'finishing', 'interior'] as const
export type EstimateCategoryId = (typeof ESTIMATE_CATEGORIES)[number]

/** Default primary color + swatch options for the palette picker (data, not tokens). */
export const DEFAULT_PRIMARY_COLOR = '#C9A66B'
export const PALETTE_SWATCHES: readonly string[] = [
  '#C9A66B', // warm oak
  '#2F3E46', // slate
  '#8D6E63', // walnut
  '#EDE6DB', // sand
  '#4E6E58', // sage
  '#B23A48', // terracotta
  '#1F2933', // charcoal
  '#F2A413' // amber (brand)
]

/** Default per-section tier selection when a result is first generated. */
export const DEFAULT_SELECTION = {
  finishing: BUDGET_PACKAGES.STANDARD,
  interior: BUDGET_PACKAGES.STANDARD
} as const

/** Export language options for step 6. Pricing is VND-only. */
export const EXPORT_LANGUAGES = ['vi', 'en'] as const
