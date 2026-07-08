import { http } from '@/shared/lib/api'
import { env } from '@/shared/config/env'
import type { PaginatedResponse } from '@/shared/types'
import type { PortfolioFilters, PortfolioItem } from '../types/portfolio.types'
import { mockPortfolioApi } from './portfolio.mock'

const realPortfolioApi = {
  list: (filters: PortfolioFilters) =>
    http.get<PaginatedResponse<PortfolioItem>>('/portfolio', {
      params: {
        category: filters.category === 'all' ? undefined : filters.category,
        page: filters.page
      }
    }),
  listAll: (filters: PortfolioFilters) =>
    http.get<PaginatedResponse<PortfolioItem>>('/admin/portfolio', {
      params: {
        category: filters.category === 'all' ? undefined : filters.category,
        page: filters.page
      }
    }),
  getBySlug: (slug: string) => http.get<PortfolioItem | null>(`/portfolio/${slug}`)
}

export const portfolioApi = env.NEXT_PUBLIC_USE_MOCK_API ? mockPortfolioApi : realPortfolioApi
