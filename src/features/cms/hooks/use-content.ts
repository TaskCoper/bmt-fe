'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useDebouncedValue } from '@/shared/hooks';
import { cmsApi } from '../api/cms.api';
import { cmsKeys } from '../api/cms.keys';
import type { ContentFilters } from '../types/cms.types';

/** Paginated CMS content list, with the search term debounced. */
export function useContent(filters: ContentFilters) {
  const debouncedSearch = useDebouncedValue(filters.search, 300);
  const effectiveFilters = { ...filters, search: debouncedSearch };

  return useQuery({
    queryKey: cmsKeys.list(effectiveFilters),
    queryFn: () => cmsApi.list(effectiveFilters),
    placeholderData: keepPreviousData,
  });
}
