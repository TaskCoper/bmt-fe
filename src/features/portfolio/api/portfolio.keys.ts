import { QUERY_KEY_ROOTS } from '@/shared/constants/query-keys'
import type { PortfolioFilters } from '../types/portfolio.types'

/** Hierarchical query-key factory for the portfolio feature. */
export const portfolioKeys = {
  all: [QUERY_KEY_ROOTS.portfolio] as const,
  lists: () => [...portfolioKeys.all, 'list'] as const,
  list: (filters: PortfolioFilters) => [...portfolioKeys.lists(), filters] as const,
  details: () => [...portfolioKeys.all, 'detail'] as const,
  detail: (slug: string) => [...portfolioKeys.details(), slug] as const
}
