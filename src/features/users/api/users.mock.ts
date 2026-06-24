import type { PaginatedResponse } from '@/shared/types';
import { mockDelay, paginate } from '@/shared/lib';
import { MOCK_USERS } from '../constants/users.mock';
import type { UserRecord, UserFilters } from '../types/user.types';

const PAGE_SIZE = 8;

function applyFilters(filters: UserFilters): UserRecord[] {
  let items = [...MOCK_USERS];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }
  return items;
}

export const mockUsersApi = {
  async list(filters: UserFilters): Promise<PaginatedResponse<UserRecord>> {
    await mockDelay();
    return paginate(applyFilters(filters), filters.page, PAGE_SIZE);
  },
};
