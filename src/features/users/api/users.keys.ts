import { QUERY_KEY_ROOTS } from '@/shared/constants/query-keys';
import type { UserFilters } from '../types/user.types';

/** Hierarchical query-key factory for the users feature. */
export const usersKeys = {
  all: [QUERY_KEY_ROOTS.users] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...usersKeys.lists(), filters] as const,
};
