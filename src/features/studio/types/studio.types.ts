import type {
  BudgetPackageId,
  ConstructionType,
  DesignStyleId,
  EstimateCategoryId,
  HouseDirection,
  LayoutOption,
  LightingOption,
} from '../constants/studio.constants';

/** An uploaded image reference (mock — holds a name + object URL/placeholder). */
export interface UploadedImage {
  id: string;
  name: string;
  /** Floor index it belongs to (0 = ground floor), or `-1` for extra docs. */
  floor: number;
}

/** Step 1–3 user input collected by the wizard (client state). */
export interface WizardData {
  // Step 1 — create
  name: string;
  constructionType: ConstructionType;
  note: string;

  // Step 2 — space & images
  images: UploadedImage[];
  area: number;
  rooms: string;

  // Step 3 — design & budget
  packageId: BudgetPackageId;
  styles: DesignStyleId[];
  moodboardCount: number;
  layout: LayoutOption;
  lighting: LightingOption;
  direction: HouseDirection;
  primaryColor: string;
}

/** Breakdown of estimated budget by portion. */
export interface BudgetBreakdown {
  rough: number;
  finishing: number;
  interior: number;
  total: number;
}

/** A single line item inside an estimate category (with tooltip detail). */
export interface EstimateItem {
  name: string;
  /** Suggested material (matched to the selected package). */
  material: string;
  /** Construction method note. */
  method: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  note: string;
}

/** One of the 3 estimate tabs. */
export interface EstimateCategory {
  id: EstimateCategoryId;
  items: EstimateItem[];
  total: number;
}

/** Construction-area summary table (step 4D). */
export interface AreaSummary {
  landArea: number;
  groundFloorArea: number;
  totalFloorArea: number;
  usableArea: number;
  floors: number;
  estimatedHeight: number;
}

/** A render image in the gallery (step 5). */
export interface RenderImage {
  id: string;
  /** Placeholder gradient seed used to render a deterministic preview. */
  hue: number;
  /** Whether this is an exterior or interior render. */
  kind: 'exterior' | 'interior';
  /** 1-based floor this render belongs to (1 = ground floor). */
  floor: number;
  caption: string;
  favorite: boolean;
}

/** Full mock AI result produced after step 3. */
export interface GenerateResult {
  budget: BudgetBreakdown;
  categories: EstimateCategory[];
  area: AreaSummary;
  renders: RenderImage[];
  generatedAt: string;
}

/** Which sections to include when exporting the PDF (step 6). */
export interface ExportOptions {
  coverPage: boolean;
  projectInfo: boolean;
  drawings: boolean;
  estimate: boolean;
  summary: boolean;
  renders: boolean;
  language: 'vi' | 'en';
}
