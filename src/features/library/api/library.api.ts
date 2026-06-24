import { http } from '@/shared/lib/api';
import { env } from '@/shared/config/env';
import type { PaginatedResponse } from '@/shared/types';
import type { LibraryItem, LibraryFilters } from '../types/library.types';
import { DEFAULT_LIBRARY_PAGE_SIZE } from '../constants/library.constants';
import { mockLibraryApi } from './library.mock';

const realLibraryApi = {
  list: (filters: LibraryFilters) =>
    http.get<PaginatedResponse<LibraryItem>>('/library', {
      params: {
        search: filters.search || undefined,
        category: filters.category === 'all' ? undefined : filters.category,
        page: filters.page,
        pageSize: DEFAULT_LIBRARY_PAGE_SIZE,
      },
    }),
};

export const libraryApi = env.NEXT_PUBLIC_USE_MOCK_API
  ? mockLibraryApi
  : realLibraryApi;
