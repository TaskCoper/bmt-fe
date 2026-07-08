/**
 * Public API of the `studio` feature — the BMT Decor AI 6-step design flow
 * (create → requirements → layouts → AI result → render → export PDF).
 *
 * Multi-route: each step is a page under `/dashboard/projects/[projectId]/…`.
 * State is a per-project snapshot persisted to localStorage (autosave); the
 * "AI generation" is a deterministic mock in `services/`.
 */
export { CreateProjectForm } from './components/create-project-form'
export { StudioShell } from './components/studio-shell'
export { ProjectsBoard } from './components/projects-board'
export { RequirementsStep } from './components/steps/requirements-step'
export { LayoutsStep } from './components/steps/layouts-step'
export { ResultStep } from './components/steps/result-step'
export { RenderStep } from './components/steps/render-step'
export { ExportStep } from './components/steps/export-step'
export { EstimateDetail } from './components/estimate-detail'
export { ShareView } from './components/share-view'

export {
  useWizardStore,
  useCurrentProject,
  useProjectList,
} from './store/wizard.store'
export { studioService } from './services/studio.service'

export {
  WIZARD_STEPS,
  projectStepPath,
  BUDGET_PACKAGE_LIST,
  HOUSE_STYLE_LIST,
  CONSTRUCTION_TYPE_OPTIONS,
  PACKAGE_TIERS,
  type WizardStepId,
  type PackageTier,
  type ConstructionType,
  type HouseStyle,
  type Region,
} from './constants/studio.constants'
export type {
  WizardData,
  BudgetBreakdown,
  GenerateResult,
  EstimateSection,
  EstimateItem,
  EstimateSelection,
  ProjectSnapshot,
} from './types/studio.types'
