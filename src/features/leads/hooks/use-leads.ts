'use client'

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { useDebouncedValue } from '@/shared/hooks'
import { leadsApi } from '../api/leads.api'
import { leadsKeys } from '../api/leads.keys'
import type { LeadFilters } from '../types/lead.types'

/** Paginated leads list, with the search term debounced. */
export function useLeads(filters: LeadFilters) {
  const debouncedSearch = useDebouncedValue(filters.search, 300)
  const effectiveFilters = { ...filters, search: debouncedSearch }

  return useQuery({
    queryKey: leadsKeys.list(effectiveFilters),
    queryFn: () => leadsApi.list(effectiveFilters),
    placeholderData: keepPreviousData,
  })
}

/** Marks a lead as handled and refreshes the list. */
export function useMarkLeadHandled() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => leadsApi.markHandled(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: leadsKeys.lists() }),
  })
}
