/**
 * Studio (BMT Decor AI — 6-step design flow) constants.
 *
 * Labels are exposed as translation keys (never hardcoded copy); components
 * resolve them under the `studio` namespace.
 */

/** The 6 sequential steps of the design flow. */
export const WIZARD_STEPS = [
  'create',
  'space',
  'design',
  'result',
  'render',
  'export',
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number];

/** Construction categories. Commercial types are post-MVP (disabled in UI). */
export const CONSTRUCTION_TYPES = {
  APARTMENT: 'apartment',
  TOWNHOUSE: 'townhouse',
  VILLA: 'villa',
  OFFICE: 'office',
  COMMERCIAL: 'commercial',
  HOTEL: 'hotel',
} as const;

export type ConstructionType =
  (typeof CONSTRUCTION_TYPES)[keyof typeof CONSTRUCTION_TYPES];

/** Construction-type options with their MVP availability. */
export const CONSTRUCTION_TYPE_OPTIONS: ReadonlyArray<{
  value: ConstructionType;
  group: 'residential' | 'commercial';
  mvp: boolean;
}> = [
  { value: CONSTRUCTION_TYPES.APARTMENT, group: 'residential', mvp: true },
  { value: CONSTRUCTION_TYPES.TOWNHOUSE, group: 'residential', mvp: true },
  { value: CONSTRUCTION_TYPES.VILLA, group: 'residential', mvp: true },
  { value: CONSTRUCTION_TYPES.OFFICE, group: 'commercial', mvp: false },
  { value: CONSTRUCTION_TYPES.COMMERCIAL, group: 'commercial', mvp: false },
  { value: CONSTRUCTION_TYPES.HOTEL, group: 'commercial', mvp: false },
];

/**
 * Floor-plan image upload limits (MVP, confirmed by stakeholder):
 * JPG/PNG/HEIC · max 10MB per image · max 5 images per floor · max 3 floors.
 */
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const MAX_IMAGES_PER_FLOOR = 5;
export const MAX_FLOORS = 3;
/** Accepted image MIME types + extensions for the file input / validation. */
export const ACCEPTED_IMAGE_MIME = [
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
] as const;
export const IMAGE_ACCEPT_ATTR = '.jpg,.jpeg,.png,.heic,.heif,image/*';

/** Max AI re-generations allowed per project (the first run is automatic). */
export const MAX_REGENERATIONS = 2;

/** Fixed rough-construction cost (phần thô) — display only, not editable. */
export const ROUGH_COST_PER_SQM = 3_500_000;

/** Interior budget packages (VNĐ/m²) for finishing + interior portions. */
export const BUDGET_PACKAGES = {
  BASIC: 'basic',
  STANDARD: 'standard',
  PREMIUM: 'premium',
} as const;

export type BudgetPackageId =
  (typeof BUDGET_PACKAGES)[keyof typeof BUDGET_PACKAGES];

export interface BudgetPackage {
  id: BudgetPackageId;
  /** Finishing (phần hoàn thiện) cost per m². */
  finishingPerSqm: number;
  /** Interior (phần nội thất) cost per m². */
  interiorPerSqm: number;
}

export const BUDGET_PACKAGE_LIST: readonly BudgetPackage[] = [
  {
    id: BUDGET_PACKAGES.BASIC,
    finishingPerSqm: 1_800_000,
    interiorPerSqm: 2_000_000,
  },
  {
    id: BUDGET_PACKAGES.STANDARD,
    finishingPerSqm: 2_800_000,
    interiorPerSqm: 3_500_000,
  },
  {
    id: BUDGET_PACKAGES.PREMIUM,
    finishingPerSqm: 4_500_000,
    interiorPerSqm: 6_000_000,
  },
];

/** Design styles (multi-select). */
export const DESIGN_STYLES = {
  MODERN: 'modern',
  MINIMALIST: 'minimalist',
  INDOCHINE: 'indochine',
  TRADITIONAL: 'traditional',
} as const;

export type DesignStyleId = (typeof DESIGN_STYLES)[keyof typeof DESIGN_STYLES];

export const DESIGN_STYLE_LIST = Object.values(DESIGN_STYLES);

/** Spatial layout preference. */
export const LAYOUT_OPTIONS = ['open', 'separated'] as const;
export type LayoutOption = (typeof LAYOUT_OPTIONS)[number];

/** Lighting preference. */
export const LIGHTING_OPTIONS = ['natural', 'artificial'] as const;
export type LightingOption = (typeof LIGHTING_OPTIONS)[number];

/** Preferred house orientation. */
export const HOUSE_DIRECTIONS = ['east', 'west', 'south', 'north'] as const;
export type HouseDirection = (typeof HOUSE_DIRECTIONS)[number];

/** Estimate categories shown as the 3 tabs in step 4. */
export const ESTIMATE_CATEGORIES = ['rough', 'finishing', 'interior'] as const;
export type EstimateCategoryId = (typeof ESTIMATE_CATEGORIES)[number];

/** Default primary color for the interactive color picker. */
export const DEFAULT_PRIMARY_COLOR = '#0f766e';

/** Export language options for step 6. Pricing is VND-only (USD dropped per spec). */
export const EXPORT_LANGUAGES = ['vi', 'en'] as const;
