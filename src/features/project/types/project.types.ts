import type { ProjectStatus } from '../constants/project.constants';

/** A construction project as returned by the backend. */
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

/** Payload for creating a project. */
export interface CreateProjectPayload {
  name: string;
  description?: string;
}

/** Client-side list filters (mirrors `PaginationParams` plus status). */
export interface ProjectFilters {
  search: string;
  status: ProjectStatus | 'all';
  page: number;
}
