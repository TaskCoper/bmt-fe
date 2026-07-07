import { QUERY_KEY_ROOTS } from '@/shared/constants/query-keys'
import type { LeadFilters } from '../types/lead.types'

/** Hierarchical query-key factory for the leads feature. */
export const leadsKeys = {
  all: [QUERY_KEY_ROOTS.leads] as const,
  lists: () => [...leadsKeys.all, 'list'] as const,
  list: (filters: LeadFilters) => [...leadsKeys.lists(), filters] as const
}
