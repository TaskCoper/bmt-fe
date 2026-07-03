'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { portfolioApi } from '../api/portfolio.api'
import { portfolioKeys } from '../api/portfolio.keys'
import type { PortfolioFilters } from '../types/portfolio.types'

/** Paginated portfolio list. */
export function usePortfolio(filters: PortfolioFilters) {
  return useQuery({
    queryKey: portfolioKeys.list(filters),
    queryFn: () => portfolioApi.list(filters),
    placeholderData: keepPreviousData,
  })
}

/** Admin list — includes unpublished items. */
export function usePortfolioAdmin(filters: PortfolioFilters) {
  return useQuery({
    queryKey: [...portfolioKeys.list(filters), 'admin'],
    queryFn: () => portfolioApi.listAll(filters),
    placeholderData: keepPreviousData,
  })
}

/** A single portfolio item by slug. */
export function usePortfolioItem(slug: string) {
  return useQuery({
    queryKey: portfolioKeys.detail(slug),
    queryFn: () => portfolioApi.getBySlug(slug),
  })
}
