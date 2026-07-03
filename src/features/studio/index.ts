/**
 * Public API of the `studio` feature — the BMT Decor AI 6-step design flow
 * (create → upload → design & budget → AI result → render → export PDF).
 *
 * UI-first: wizard state is held in a feature-scoped Zustand store and the
 * "AI generation" is a deterministic mock in `services/`.
 */
export { ProjectWizard } from './components/project-wizard';
export { useWizardStore } from './store/wizard.store';
export { studioService } from './services/studio.service';
export {
  WIZARD_STEPS,
  BUDGET_PACKAGE_LIST,
  DESIGN_STYLE_LIST,
  CONSTRUCTION_TYPE_OPTIONS,
  type WizardStepId,
  type BudgetPackageId,
  type ConstructionType,
  type DesignStyleId,
} from './constants/studio.constants';
export type {
  WizardData,
  BudgetBreakdown,
  GenerateResult,
  EstimateCategory,
  EstimateItem,
} from './types/studio.types';
