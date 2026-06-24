'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useDebouncedValue } from '@/shared/hooks';
import { libraryApi } from '../api/library.api';
import { libraryKeys } from '../api/library.keys';
import type { LibraryFilters } from '../types/library.types';

/** Paginated unit-price catalogue, with the search term debounced. */
export function useLibrary(filters: LibraryFilters) {
  const debouncedSearch = useDebouncedValue(filters.search, 300);
  const effectiveFilters = { ...filters, search: debouncedSearch };

  return useQuery({
    queryKey: libraryKeys.list(effectiveFilters),
    queryFn: () => libraryApi.list(effectiveFilters),
    placeholderData: keepPreviousData,
  });
}
