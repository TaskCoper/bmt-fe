import type { StepStatus } from '@/shared/components/common'
import type {
  ConstructionType,
  EstimateCategoryId,
  HouseDirection,
  HouseStyle,
  LightingOption,
  PackageTier,
  Region,
} from '../constants/studio.constants'

/** An uploaded image reference (mock — holds a name + object URL/placeholder). */
export interface UploadedImage {
  id: string
  name: string
  /** Floor index it belongs to (0 = ground floor). */
  floor: number
}

/** Step 1–3 user input collected by the wizard (client state, per project). */
export interface WizardData {
  // Step 1 — create
  name: string
  constructionType: ConstructionType
  note: string

  // Step 2 — requirements & budget
  address: string
  region: Region
  /** Floors above ground (0 = trệt only). Drives step-3 dropzone count. */
  floors: number
  /** Ground-floor build area (m²). */
  area: number
  style: HouseStyle
  /** Only meaningful for styles whose `hasTumOption` is true. */
  hasTum: boolean
  openPlan: boolean
  lighting: LightingOption
  direction: HouseDirection
  primaryColors: string[]
  /** Target budget (VNĐ) — the reference for the step-4 progress bar. */
  budget: number

  // Step 3 — layouts
  images: UploadedImage[]
}

/** Per-section package tier chosen on the step-4 estimate table. */
export interface EstimateSelection {
  finishing: PackageTier
  interior: PackageTier
}

/** Breakdown of estimated cost by portion (for the selected tiers). */
export interface BudgetBreakdown {
  rough: number
  finishing: number
  interior: number
  total: number
}

/** A single line item inside an estimate tier (with material detail). */
export interface EstimateItem {
  name: string
  /** Suggested material (matched to the tier). */
  material: string
  /** Alternative materials (translation keys). */
  alternatives: string[]
  /** Construction method note. */
  method: string
  quantity: number
  unit: string
  unitPrice: number
  amount: number
  note: string
}

/** Cost + line items for one tier of a section. */
export interface EstimateTierData {
  total: number
  items: EstimateItem[]
}

/**
 * One estimate section. `rough` has a single flat tier (`single`); `finishing`
 * and `interior` carry all package tiers so the user can switch inline.
 */
export interface EstimateSection {
  key: EstimateCategoryId
  tiers: Partial<Record<PackageTier | 'single', EstimateTierData>>
}

/** Construction-area summary table (step 4C). */
export interface AreaSummary {
  landArea: number
  groundFloorArea: number
  totalFloorArea: number
  usableArea: number
  /** Number of storeys (floors above ground + 1). */
  floors: number
  estimatedHeight: number
}

/** A render image in the gallery (step 5). */
export interface RenderImage {
  id: string
  /** Placeholder gradient seed used to render a deterministic preview. */
  hue: number
  kind: 'exterior' | 'interior'
  /** 1-based floor this render belongs to (1 = ground floor). */
  floor: number
  caption: string
  favorite: boolean
}

/** Full mock AI result produced after step 3. */
export interface GenerateResult {
  sections: EstimateSection[]
  area: AreaSummary
  renders: RenderImage[]
  generatedAt: string
}

/** Which sections to include when exporting the PDF (step 6). */
export interface ExportOptions {
  coverPage: boolean
  projectInfo: boolean
  drawings: boolean
  estimate: boolean
  summary: boolean
  renders: boolean
  language: 'vi' | 'en'
}

/**
 * A full project snapshot persisted (per id) to localStorage — the "autosave"
 * substrate while there is no backend. One entry per design project.
 */
export interface ProjectSnapshot {
  id: string
  data: WizardData
  selection: EstimateSelection
  result: GenerateResult | null
  regenCount: number
  exportOptions: ExportOptions
  createdAt: string
  updatedAt: string
}

export type { StepStatus }
