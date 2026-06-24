import { QUERY_KEY_ROOTS } from '@/shared/constants/query-keys';
import type { ContentFilters } from '../types/cms.types';

/** Hierarchical query-key factory for the cms feature. */
export const cmsKeys = {
  all: [QUERY_KEY_ROOTS.cms] as const,
  lists: () => [...cmsKeys.all, 'list'] as const,
  list: (filters: ContentFilters) => [...cmsKeys.lists(), filters] as const,
};
