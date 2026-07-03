import { http } from '@/shared/lib/api'
import { env } from '@/shared/config/env'
import type { PaginatedResponse } from '@/shared/types'
import type { LeadFilters, LeadRecord } from '../types/lead.types'
import { mockLeadsApi } from './leads.mock'

const realLeadsApi = {
  list: (filters: LeadFilters) =>
    http.get<PaginatedResponse<LeadRecord>>('/leads', {
      params: {
        search: filters.search || undefined,
        status: filters.status === 'all' ? undefined : filters.status,
        page: filters.page,
      },
    }),
  markHandled: (id: string) =>
    http.patch<{ id: string; status: string }>(`/leads/${id}`, {
      status: 'handled',
    }),
}

export const leadsApi = env.NEXT_PUBLIC_USE_MOCK_API
  ? mockLeadsApi
  : realLeadsApi
