import { http } from '@/shared/lib/api';
import { env } from '@/shared/config/env';
import type { PaginatedResponse } from '@/shared/types';
import type {
  Estimate,
  EstimateFilters,
  EstimateSummary,
} from '../types/estimate.types';
import { DEFAULT_ESTIMATE_PAGE_SIZE } from '../constants/estimate.constants';
import { mockEstimateApi } from './estimate.mock';

const realEstimateApi = {
  list: (filters: EstimateFilters) =>
    http.get<PaginatedResponse<Estimate>>('/estimates', {
      params: {
        search: filters.search || undefined,
        status: filters.status === 'all' ? undefined : filters.status,
        page: filters.page,
        pageSize: DEFAULT_ESTIMATE_PAGE_SIZE,
      },
    }),

  getSummary: () => http.get<EstimateSummary>('/estimates/summary'),
};

export const estimateApi = env.NEXT_PUBLIC_USE_MOCK_API
  ? mockEstimateApi
  : realEstimateApi;
