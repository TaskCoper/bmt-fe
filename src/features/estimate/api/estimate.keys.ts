import { QUERY_KEY_ROOTS } from '@/shared/constants/query-keys';
import type { EstimateFilters } from '../types/estimate.types';

/** Hierarchical query-key factory for the estimate feature. */
export const estimateKeys = {
  all: [QUERY_KEY_ROOTS.estimates] as const,
  lists: () => [...estimateKeys.all, 'list'] as const,
  list: (filters: EstimateFilters) =>
    [...estimateKeys.lists(), filters] as const,
  summary: () => [...estimateKeys.all, 'summary'] as const,
};
