import type { PaginatedResponse } from '@/shared/types';
import { mockDelay, paginate } from '@/shared/lib';
import {
  ESTIMATE_STATUS,
  DEFAULT_ESTIMATE_PAGE_SIZE,
} from '../constants/estimate.constants';
import type {
  Estimate,
  EstimateFilters,
  EstimateSummary,
} from '../types/estimate.types';

/** Sample estimates for local development without a backend. */
export const MOCK_ESTIMATES: Estimate[] = [
  {
    id: 'e-01',
    code: 'DT-2026-001',
    name: 'Dự toán cải tạo căn hộ Vinhomes',
    projectName: 'Cải tạo căn hộ Vinhomes Central Park',
    status: ESTIMATE_STATUS.APPROVED,
    total: 685_000_000,
    itemsCount: 42,
    createdAt: '2026-05-05T03:00:00Z',
  },
  {
    id: 'e-02',
    code: 'DT-2026-002',
    name: 'Dự toán nội thất café The Workshop',
    projectName: 'Thi công quán café The Workshop',
    status: ESTIMATE_STATUS.APPROVED,
    total: 412_500_000,
    itemsCount: 28,
    createdAt: '2026-04-18T03:00:00Z',
  },
  {
    id: 'e-03',
    code: 'DT-2026-003',
    name: 'Dự toán xây nhà phố anh Tuấn',
    projectName: 'Nhà phố gia đình anh Tuấn',
    status: ESTIMATE_STATUS.PENDING,
    total: 1_950_000_000,
    itemsCount: 76,
    createdAt: '2026-03-22T03:00:00Z',
  },
  {
    id: 'e-04',
    code: 'DT-2026-004',
    name: 'Dự toán cải tạo văn phòng Minh Phát',
    projectName: 'Văn phòng công ty TNHH Minh Phát',
    status: ESTIMATE_STATUS.APPROVED,
    total: 540_000_000,
    itemsCount: 35,
    createdAt: '2026-01-12T03:00:00Z',
  },
  {
    id: 'e-05',
    code: 'DT-2026-005',
    name: 'Dự toán nội thất biệt thự Eco Park',
    projectName: 'Biệt thự Eco Park lô B12',
    status: ESTIMATE_STATUS.DRAFT,
    total: 2_300_000_000,
    itemsCount: 0,
    createdAt: '2026-06-02T03:00:00Z',
  },
  {
    id: 'e-06',
    code: 'DT-2026-006',
    name: 'Dự toán showroom Nhà Xinh',
    projectName: 'Showroom nội thất Nhà Xinh',
    status: ESTIMATE_STATUS.PENDING,
    total: 875_000_000,
    itemsCount: 51,
    createdAt: '2026-05-20T03:00:00Z',
  },
  {
    id: 'e-07',
    code: 'DT-2026-007',
    name: 'Dự toán nâng cấp bếp Biển Đông',
    projectName: 'Cải tạo nhà hàng Hải Sản Biển Đông',
    status: ESTIMATE_STATUS.REJECTED,
    total: 1_120_000_000,
    itemsCount: 63,
    createdAt: '2026-02-28T03:00:00Z',
  },
  {
    id: 'e-08',
    code: 'DT-2026-008',
    name: 'Dự toán căn studio Masteri',
    projectName: 'Căn hộ Masteri Thảo Điền',
    status: ESTIMATE_STATUS.APPROVED,
    total: 168_000_000,
    itemsCount: 19,
    createdAt: '2025-12-08T03:00:00Z',
  },
  {
    id: 'e-09',
    code: 'DT-2026-009',
    name: 'Dự toán Spa Quận 7',
    projectName: 'Spa & Wellness Center Quận 7',
    status: ESTIMATE_STATUS.APPROVED,
    total: 1_680_000_000,
    itemsCount: 88,
    createdAt: '2026-05-27T03:00:00Z',
  },
  {
    id: 'e-10',
    code: 'DT-2026-010',
    name: 'Dự toán kho xưởng Long An',
    projectName: 'Kho xưởng Long An',
    status: ESTIMATE_STATUS.PENDING,
    total: 3_450_000_000,
    itemsCount: 45,
    createdAt: '2026-06-12T03:00:00Z',
  },
  {
    id: 'e-11',
    code: 'DT-2026-011',
    name: 'Dự toán penthouse Landmark 81',
    projectName: 'Penthouse Landmark 81',
    status: ESTIMATE_STATUS.DRAFT,
    total: 5_200_000_000,
    itemsCount: 120,
    createdAt: '2026-04-30T03:00:00Z',
  },
  {
    id: 'e-12',
    code: 'DT-2026-012',
    name: 'Dự toán phòng khám Smile',
    projectName: 'Phòng khám nha khoa Smile',
    status: ESTIMATE_STATUS.APPROVED,
    total: 320_000_000,
    itemsCount: 24,
    createdAt: '2025-11-15T03:00:00Z',
  },
];

function applyFilters(filters: EstimateFilters): Estimate[] {
  let items = [...MOCK_ESTIMATES];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q) ||
        e.projectName.toLowerCase().includes(q),
    );
  }
  if (filters.status !== 'all') {
    items = items.filter((e) => e.status === filters.status);
  }
  return items;
}

export const mockEstimateApi = {
  async list(filters: EstimateFilters): Promise<PaginatedResponse<Estimate>> {
    await mockDelay();
    return paginate(
      applyFilters(filters),
      filters.page,
      DEFAULT_ESTIMATE_PAGE_SIZE,
    );
  },

  async getSummary(): Promise<EstimateSummary> {
    await mockDelay(250);
    return {
      total: MOCK_ESTIMATES.length,
      approved: MOCK_ESTIMATES.filter((e) => e.status === 'approved').length,
      pending: MOCK_ESTIMATES.filter((e) => e.status === 'pending').length,
      totalValue: MOCK_ESTIMATES.filter((e) => e.status === 'approved').reduce(
        (sum, e) => sum + e.total,
        0,
      ),
    };
  },
};
