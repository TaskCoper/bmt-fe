import { mockDelay, paginate } from '@/shared/lib'
import type { PaginatedResponse } from '@/shared/types'
import {
  DEFAULT_ESTIMATE_PAGE_SIZE,
  ESTIMATE_PRICE_MAX,
  ESTIMATE_PRICE_MIN,
  ESTIMATE_STATUS
} from '../constants/estimate.constants'
import { calcEstimate } from '../services/estimate.service'
import type { Estimate, EstimateFilters, EstimateSummary } from '../types/estimate.types'

/** Raw sample estimates — totals are derived from {@link calcEstimate} below. */
const RAW_ESTIMATES: Omit<Estimate, 'total'>[] = [
  {
    id: 'e-01',
    code: 'DT-2026-001',
    name: 'Dự toán cải tạo căn hộ Vinhomes',
    projectName: 'Cải tạo căn hộ Vinhomes Central Park',
    status: ESTIMATE_STATUS.APPROVED,
    itemsCount: 8,
    createdAt: '2026-05-05T03:00:00Z',
    description: 'Cải tạo toàn bộ căn hộ 3 phòng ngủ, thay mới nội thất và hoàn thiện bề mặt.',
    input: { area: 85, floors: 1, rooms: 3, building: 'apartment', packageId: 'standard' }
  },
  {
    id: 'e-02',
    code: 'DT-2026-002',
    name: 'Dự toán nội thất café The Workshop',
    projectName: 'Thi công quán café The Workshop',
    status: ESTIMATE_STATUS.APPROVED,
    itemsCount: 8,
    createdAt: '2026-04-18T03:00:00Z',
    description: 'Thi công hoàn thiện và nội thất quán café phong cách công nghiệp.',
    input: { area: 60, floors: 1, rooms: 2, building: 'townhouse', packageId: 'standard' }
  },
  {
    id: 'e-03',
    code: 'DT-2026-003',
    name: 'Dự toán xây nhà phố anh Tuấn',
    projectName: 'Nhà phố gia đình anh Tuấn',
    status: ESTIMATE_STATUS.PENDING,
    itemsCount: 8,
    createdAt: '2026-03-22T03:00:00Z',
    description: 'Xây mới nhà phố 3 tầng, trọn gói phần thô, hoàn thiện và nội thất.',
    input: { area: 90, floors: 3, rooms: 5, building: 'townhouse', packageId: 'standard' }
  },
  {
    id: 'e-04',
    code: 'DT-2026-004',
    name: 'Dự toán cải tạo văn phòng Minh Phát',
    projectName: 'Văn phòng công ty TNHH Minh Phát',
    status: ESTIMATE_STATUS.APPROVED,
    itemsCount: 8,
    createdAt: '2026-01-12T03:00:00Z',
    description: 'Cải tạo mặt bằng văn phòng, chia khu làm việc và phòng họp.',
    input: { area: 120, floors: 1, rooms: 4, building: 'townhouse', packageId: 'basic' }
  },
  {
    id: 'e-05',
    code: 'DT-2026-005',
    name: 'Dự toán nội thất biệt thự Eco Park',
    projectName: 'Biệt thự Eco Park lô B12',
    status: ESTIMATE_STATUS.DRAFT,
    itemsCount: 8,
    createdAt: '2026-06-02T03:00:00Z',
    description: 'Nội thất cao cấp cho biệt thự 2 tầng, vật liệu nhập khẩu.',
    input: { area: 150, floors: 2, rooms: 6, building: 'villa', packageId: 'premium' }
  },
  {
    id: 'e-06',
    code: 'DT-2026-006',
    name: 'Dự toán showroom Nhà Xinh',
    projectName: 'Showroom nội thất Nhà Xinh',
    status: ESTIMATE_STATUS.PENDING,
    itemsCount: 8,
    createdAt: '2026-05-20T03:00:00Z',
    description: 'Thiết kế và thi công showroom trưng bày nội thất.',
    input: { area: 100, floors: 1, rooms: 3, building: 'townhouse', packageId: 'standard' }
  },
  {
    id: 'e-07',
    code: 'DT-2026-007',
    name: 'Dự toán nâng cấp bếp Biển Đông',
    projectName: 'Cải tạo nhà hàng Hải Sản Biển Đông',
    status: ESTIMATE_STATUS.REJECTED,
    itemsCount: 8,
    createdAt: '2026-02-28T03:00:00Z',
    description: 'Nâng cấp khu bếp và khu vực phục vụ của nhà hàng hải sản.',
    input: { area: 80, floors: 2, rooms: 4, building: 'townhouse', packageId: 'standard' }
  },
  {
    id: 'e-08',
    code: 'DT-2026-008',
    name: 'Dự toán căn studio Masteri',
    projectName: 'Căn hộ Masteri Thảo Điền',
    status: ESTIMATE_STATUS.APPROVED,
    itemsCount: 8,
    createdAt: '2025-12-08T03:00:00Z',
    description: 'Hoàn thiện căn studio cho thuê, tối ưu công năng.',
    input: { area: 45, floors: 1, rooms: 1, building: 'apartment', packageId: 'basic' }
  },
  {
    id: 'e-09',
    code: 'DT-2026-009',
    name: 'Dự toán Spa Quận 7',
    projectName: 'Spa & Wellness Center Quận 7',
    status: ESTIMATE_STATUS.APPROVED,
    itemsCount: 8,
    createdAt: '2026-05-27T03:00:00Z',
    description: 'Thi công spa cao cấp, nhiều phòng trị liệu riêng.',
    input: { area: 130, floors: 2, rooms: 5, building: 'townhouse', packageId: 'premium' }
  },
  {
    id: 'e-10',
    code: 'DT-2026-010',
    name: 'Dự toán kho xưởng Long An',
    projectName: 'Kho xưởng Long An',
    status: ESTIMATE_STATUS.PENDING,
    itemsCount: 8,
    createdAt: '2026-06-12T03:00:00Z',
    description: 'Xây dựng kho xưởng diện tích lớn, hoàn thiện cơ bản.',
    input: { area: 300, floors: 1, rooms: 2, building: 'townhouse', packageId: 'basic' }
  },
  {
    id: 'e-11',
    code: 'DT-2026-011',
    name: 'Dự toán penthouse Landmark 81',
    projectName: 'Penthouse Landmark 81',
    status: ESTIMATE_STATUS.DRAFT,
    itemsCount: 8,
    createdAt: '2026-04-30T03:00:00Z',
    description: 'Nội thất penthouse 2 tầng, tiêu chuẩn khách sạn 5 sao.',
    input: { area: 200, floors: 2, rooms: 5, building: 'villa', packageId: 'premium' }
  },
  {
    id: 'e-12',
    code: 'DT-2026-012',
    name: 'Dự toán phòng khám Smile',
    projectName: 'Phòng khám nha khoa Smile',
    status: ESTIMATE_STATUS.APPROVED,
    itemsCount: 8,
    createdAt: '2025-11-15T03:00:00Z',
    description: 'Thi công phòng khám nha khoa, đảm bảo tiêu chuẩn vô trùng.',
    input: { area: 70, floors: 1, rooms: 3, building: 'apartment', packageId: 'standard' }
  }
]

/** Sample estimates for local development without a backend. */
export const MOCK_ESTIMATES: Estimate[] = RAW_ESTIMATES.map((e) => ({
  ...e,
  total: e.input ? calcEstimate(e.input).total : 0
}))

function applyFilters(filters: EstimateFilters): Estimate[] {
  let items = [...MOCK_ESTIMATES]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    items = items.filter(
      (e) =>
        e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q) || e.projectName.toLowerCase().includes(q)
    )
  }
  if (filters.status !== 'all') {
    items = items.filter((e) => e.status === filters.status)
  }
  if (filters.minPrice > ESTIMATE_PRICE_MIN) {
    items = items.filter((e) => e.total >= filters.minPrice)
  }
  if (filters.maxPrice < ESTIMATE_PRICE_MAX) {
    items = items.filter((e) => e.total <= filters.maxPrice)
  }
  return items
}

export const mockEstimateApi = {
  async list(filters: EstimateFilters): Promise<PaginatedResponse<Estimate>> {
    await mockDelay()
    return paginate(applyFilters(filters), filters.page, DEFAULT_ESTIMATE_PAGE_SIZE)
  },

  async getById(id: string): Promise<Estimate> {
    await mockDelay(250)
    const found = MOCK_ESTIMATES.find((e) => e.id === id)
    if (!found) throw new Error(`Estimate "${id}" not found`)
    return found
  },

  async getSummary(): Promise<EstimateSummary> {
    await mockDelay(250)
    return {
      total: MOCK_ESTIMATES.length,
      approved: MOCK_ESTIMATES.filter((e) => e.status === 'approved').length,
      pending: MOCK_ESTIMATES.filter((e) => e.status === 'pending').length,
      totalValue: MOCK_ESTIMATES.filter((e) => e.status === 'approved').reduce((sum, e) => sum + e.total, 0)
    }
  }
}
