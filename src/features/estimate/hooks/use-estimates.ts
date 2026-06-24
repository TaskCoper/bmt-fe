'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useDebouncedValue } from '@/shared/hooks';
import { estimateApi } from '../api/estimate.api';
import { estimateKeys } from '../api/estimate.keys';
import type { EstimateFilters } from '../types/estimate.types';

/** Paginated estimate list, with the search term debounced. */
export function useEstimates(filters: EstimateFilters) {
  const debouncedSearch = useDebouncedValue(filters.search, 300);
  const effectiveFilters = { ...filters, search: debouncedSearch };

  return useQuery({
    queryKey: estimateKeys.list(effectiveFilters),
    queryFn: () => estimateApi.list(effectiveFilters),
    placeholderData: keepPreviousData,
  });
}

/** Headline figures for the estimate summary cards. */
export function useEstimateSummary() {
  return useQuery({
    queryKey: estimateKeys.summary(),
    queryFn: estimateApi.getSummary,
  });
}
