import { http } from '@/shared/lib/api';
import { env } from '@/shared/config/env';
import type { PaginatedResponse } from '@/shared/types';
import type { UserRecord, UserFilters } from '../types/user.types';
import { mockUsersApi } from './users.mock';

const realUsersApi = {
  list: (filters: UserFilters) =>
    http.get<PaginatedResponse<UserRecord>>('/users', {
      params: { search: filters.search || undefined, page: filters.page },
    }),
};

export const usersApi = env.NEXT_PUBLIC_USE_MOCK_API
  ? mockUsersApi
  : realUsersApi;
