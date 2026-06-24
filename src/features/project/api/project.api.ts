import { http } from '@/shared/lib/api';
import { env } from '@/shared/config/env';
import type { PaginatedResponse } from '@/shared/types';
import type {
  Project,
  CreateProjectPayload,
  ProjectFilters,
} from '../types/project.types';
import { DEFAULT_PROJECT_PAGE_SIZE } from '../constants/project.constants';
import { mockProjectApi } from './project.mock';

/** Project feature API surface over the shared HTTP client. */
const realProjectApi = {
  list: (filters: ProjectFilters) =>
    http.get<PaginatedResponse<Project>>('/projects', {
      params: {
        search: filters.search || undefined,
        status: filters.status === 'all' ? undefined : filters.status,
        page: filters.page,
        pageSize: DEFAULT_PROJECT_PAGE_SIZE,
      },
    }),

  getById: (id: string) => http.get<Project>(`/projects/${id}`),

  create: (payload: CreateProjectPayload) =>
    http.post<Project>('/projects', payload),

  remove: (id: string) => http.delete<void>(`/projects/${id}`),
};

export const projectApi = env.NEXT_PUBLIC_USE_MOCK_API
  ? mockProjectApi
  : realProjectApi;
