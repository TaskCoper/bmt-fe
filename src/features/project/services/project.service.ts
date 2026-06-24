import type { Project } from '../types/project.types';
import { PROJECT_STATUS } from '../constants/project.constants';

/**
 * Pure business logic for the project feature.
 *
 * `services/` holds framework-agnostic domain rules (no React, no HTTP) so
 * they're trivially testable and reusable across hooks/components.
 */
export const projectService = {
  isEditable: (project: Project): boolean =>
    project.status !== PROJECT_STATUS.ARCHIVED &&
    project.status !== PROJECT_STATUS.COMPLETED,

  sortByRecent: (projects: Project[]): Project[] =>
    [...projects].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    ),
};
