import { env } from '@/shared/config/env'
import { http } from '@/shared/lib/api'
import type { PaginatedResponse } from '@/shared/types'
import { DEFAULT_ESTIMATE_PAGE_SIZE, ESTIMATE_PRICE_MAX, ESTIMATE_PRICE_MIN } from '../constants/estimate.constants'
import type { Estimate, EstimateFilters, EstimateSummary } from '../types/estimate.types'
import { mockEstimateApi } from './estimate.mock'

const realEstimateApi = {
  list: (filters: EstimateFilters) =>
    http.get<PaginatedResponse<Estimate>>('/estimates', {
      params: {
        search: filters.search || undefined,
        status: filters.status === 'all' ? undefined : filters.status,
        minTotal: filters.minPrice > ESTIMATE_PRICE_MIN ? filters.minPrice : undefined,
        maxTotal: filters.maxPrice < ESTIMATE_PRICE_MAX ? filters.maxPrice : undefined,
        page: filters.page,
        pageSize: DEFAULT_ESTIMATE_PAGE_SIZE
      }
    }),

  getById: (id: string) => http.get<Estimate>(`/estimates/${id}`),

  getSummary: () => http.get<EstimateSummary>('/estimates/summary')
}

export const estimateApi = env.NEXT_PUBLIC_USE_MOCK_API ? mockEstimateApi : realEstimateApi
