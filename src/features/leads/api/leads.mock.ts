import type { PaginatedResponse } from '@/shared/types';
import { mockDelay, paginate } from '@/shared/lib';
import {
  DEFAULT_LEADS_PAGE_SIZE,
  LEAD_STATUS,
} from '../constants/leads.constants';
import { MOCK_LEADS } from '../constants/leads.mock';
import type { LeadFilters, LeadRecord } from '../types/lead.types';

function applyFilters(filters: LeadFilters): LeadRecord[] {
  let items = [...MOCK_LEADS];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q),
    );
  }
  if (filters.status !== 'all') {
    items = items.filter((l) => l.status === filters.status);
  }
  return items;
}

export const mockLeadsApi = {
  async list(filters: LeadFilters): Promise<PaginatedResponse<LeadRecord>> {
    await mockDelay();
    return paginate(
      applyFilters(filters),
      filters.page,
      DEFAULT_LEADS_PAGE_SIZE,
    );
  },
  async markHandled(id: string): Promise<{ id: string; status: string }> {
    await mockDelay(150);
    return { id, status: LEAD_STATUS.HANDLED };
  },
};
