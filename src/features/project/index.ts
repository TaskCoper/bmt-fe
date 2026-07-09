/**
 * Public API of the `project` feature — the canonical full-anatomy template.
 *
 * Folder anatomy (copy for new features):
 *   api/        — endpoint functions + query-key factories
 *   components/ — feature UI (composed from shared/ui)
 *   hooks/      — TanStack Query / custom hooks
 *   schemas/    — Zod schemas + form value types
 *   services/   — pure domain logic (no React/HTTP)
 *   store/      — feature-scoped Zustand stores
 *   types/      — feature domain types
 *   constants/  — feature constants
 *   index.ts    — the ONLY allowed import surface (this file)
 */
export { projectApi } from './api/project.api'
export { projectKeys } from './api/project.keys'
export { default as CreateProjectDialog } from './components/create-project/create-project-dialog'
export { default as FloorCard, type FloorCardData, type FloorCardProps, type FloorSpec } from './components/floor-card'
export { default as ProjectAIDesignResult } from './components/project-ai-design-result'
export { default as ProjectCard } from './components/project-card'
export { default as ProjectDesignRequest } from './components/project-design-request'
export { default as ProjectDetail } from './components/project-detail'
export { ProjectFlowLayout } from './components/project-flow-layout'
export { default as ProjectGalleries } from './components/project-galleries'
export { default as ProjectGrid } from './components/project-grid'
export { ProjectList } from './components/project-list'
export { default as ProjectReview } from './components/project-review'
export { default as ProjectSpaces } from './components/project-spaces'
export { DEFAULT_PROJECT_PAGE_SIZE, PROJECT_STATUS, type ProjectStatus } from './constants/project.constants'
export { useProjects } from './hooks/use-projects'
export { createProjectSchema, type CreateProjectFormValues, type ProjectSchemaMessages } from './schemas/project.schema'
export { projectService } from './services/project.service'
export { useProjectFiltersStore } from './store/project-filters.store'
export {
  buildProjectId,
  getProjectFlowUrls,
  slugifyProjectName,
  useImageMeta,
  useProjectStore,
  useSetProjectFlow,
  type ImageMeta,
  type ProjectDraft,
  type ProjectFlowStep
} from './store/project.store'
