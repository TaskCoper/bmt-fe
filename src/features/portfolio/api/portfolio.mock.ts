import type { PaginatedResponse } from '@/shared/types'
import { mockDelay, paginate } from '@/shared/lib'
import { MOCK_PORTFOLIO } from '../constants/portfolio.mock'
import type { PortfolioFilters, PortfolioItem } from '../types/portfolio.types'

const PAGE_SIZE = 6

function applyFilters(filters: PortfolioFilters, includeUnpublished = false): PortfolioItem[] {
  let items = [...MOCK_PORTFOLIO]
  if (!includeUnpublished) {
    items = items.filter((p) => p.published)
  }
  if (filters.category !== 'all') {
    items = items.filter((p) => p.category === filters.category)
  }
  return items
}

export const mockPortfolioApi = {
  async list(filters: PortfolioFilters): Promise<PaginatedResponse<PortfolioItem>> {
    await mockDelay()
    return paginate(applyFilters(filters), filters.page, PAGE_SIZE)
  },
  /** Admin list — includes unpublished items. */
  async listAll(filters: PortfolioFilters): Promise<PaginatedResponse<PortfolioItem>> {
    await mockDelay()
    return paginate(applyFilters(filters, true), filters.page, PAGE_SIZE)
  },
  async getBySlug(slug: string): Promise<PortfolioItem | null> {
    await mockDelay(150)
    return MOCK_PORTFOLIO.find((p) => p.slug === slug) ?? null
  }
}
