/**
 * Public API of the `studio` feature — the BMT Decor AI 6-step design flow
 * (create → requirements → layouts → AI result → render → export PDF).
 *
 * Multi-route: each step is a page under `/dashboard/projects/[projectId]/…`.
 * State is a per-project snapshot persisted to localStorage (autosave); the
 * "AI generation" is a deterministic mock in `services/`.
 */
export { CreateProjectForm } from './components/create-project-form'
export { EstimateDetail } from './components/estimate-detail'
export { ProjectsBoard } from './components/projects-board'
export { ShareView } from './components/share-view'
export { ExportStep } from './components/steps/export-step'
export { LayoutsStep } from './components/steps/layouts-step'
export { RenderStep } from './components/steps/render-step'
export { RequirementsStep } from './components/steps/requirements-step'
export { ResultStep } from './components/steps/result-step'
export { StudioShell } from './components/studio-shell'
export { studioService } from './services/studio.service'
export { useCurrentProject, useProjectList, useWizardStore } from './store/wizard.store'

export {
  BUDGET_PACKAGE_LIST,
  CONSTRUCTION_TYPE_OPTIONS,
  HOUSE_STYLE_LIST,
  PACKAGE_TIERS,
  projectStepPath,
  WIZARD_STEPS,
  type ConstructionType,
  type HouseStyle,
  type PackageTier,
  type Region,
  type WizardStepId
} from './constants/studio.constants'
export type {
  BudgetBreakdown,
  EstimateItem,
  EstimateSection,
  EstimateSelection,
  GenerateResult,
  ProjectSnapshot,
  WizardData
} from './types/studio.types'
