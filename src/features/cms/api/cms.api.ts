import { http } from '@/shared/lib/api';
import { env } from '@/shared/config/env';
import type { PaginatedResponse } from '@/shared/types';
import type { ContentEntry, ContentFilters } from '../types/cms.types';
import { DEFAULT_CMS_PAGE_SIZE } from '../constants/cms.constants';
import { mockCmsApi } from './cms.mock';

const realCmsApi = {
  list: (filters: ContentFilters) =>
    http.get<PaginatedResponse<ContentEntry>>('/cms/content', {
      params: {
        search: filters.search || undefined,
        status: filters.status === 'all' ? undefined : filters.status,
        page: filters.page,
        pageSize: DEFAULT_CMS_PAGE_SIZE,
      },
    }),
};

export const cmsApi = env.NEXT_PUBLIC_USE_MOCK_API ? mockCmsApi : realCmsApi;
