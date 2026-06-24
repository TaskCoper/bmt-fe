'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useDebouncedValue } from '@/shared/hooks';
import { usersApi } from '../api/users.api';
import { usersKeys } from '../api/users.keys';
import type { UserFilters } from '../types/user.types';

/** Paginated users list, with the search term debounced. */
export function useUsers(filters: UserFilters) {
  const debouncedSearch = useDebouncedValue(filters.search, 300);
  const effectiveFilters = { ...filters, search: debouncedSearch };

  return useQuery({
    queryKey: usersKeys.list(effectiveFilters),
    queryFn: () => usersApi.list(effectiveFilters),
    placeholderData: keepPreviousData,
  });
}
