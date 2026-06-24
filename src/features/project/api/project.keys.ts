import { QUERY_KEY_ROOTS } from '@/shared/constants/query-keys';
import type { ProjectFilters } from '../types/project.types';

/** Hierarchical query-key factory for the project feature. */
export const projectKeys = {
  all: [QUERY_KEY_ROOTS.projects] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: ProjectFilters) =>
    [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};
