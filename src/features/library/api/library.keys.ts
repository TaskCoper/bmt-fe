import { QUERY_KEY_ROOTS } from '@/shared/constants/query-keys';
import type { LibraryFilters } from '../types/library.types';

/** Hierarchical query-key factory for the library feature. */
export const libraryKeys = {
  all: [QUERY_KEY_ROOTS.library] as const,
  lists: () => [...libraryKeys.all, 'list'] as const,
  list: (filters: LibraryFilters) => [...libraryKeys.lists(), filters] as const,
};
