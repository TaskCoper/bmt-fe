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
export { ProjectList } from './components/project-list';
export { useProjects } from './hooks/use-projects';
export { useProjectFiltersStore } from './store/project-filters.store';
export { projectApi } from './api/project.api';
export { projectKeys } from './api/project.keys';
export { projectService } from './services/project.service';
export {
  createProjectSchema,
  type ProjectFormValues,
  type ProjectSchemaMessages,
} from './schemas/project.schema';
export {
  PROJECT_STATUS,
  DEFAULT_PROJECT_PAGE_SIZE,
  type ProjectStatus,
} from './constants/project.constants';
export type {
  Project,
  CreateProjectPayload,
  ProjectFilters,
} from './types/project.types';
