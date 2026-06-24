'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useDebouncedValue } from '@/shared/hooks';
import { projectApi } from '../api/project.api';
import { projectKeys } from '../api/project.keys';
import { useProjectFiltersStore } from '../store/project-filters.store';

/**
 * Reads filters from the feature store, debounces the search term, and queries
 * the paginated project list. `keepPreviousData` avoids layout jumps while
 * paging. This is the canonical "server state + client state" composition.
 */
export function useProjects() {
  const filters = useProjectFiltersStore((s) => s.filters);
  const debouncedSearch = useDebouncedValue(filters.search, 300);
  const effectiveFilters = { ...filters, search: debouncedSearch };

  return useQuery({
    queryKey: projectKeys.list(effectiveFilters),
    queryFn: () => projectApi.list(effectiveFilters),
    placeholderData: keepPreviousData,
  });
}
