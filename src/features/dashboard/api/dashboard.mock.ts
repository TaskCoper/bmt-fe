import { mockDelay } from '@/shared/lib'
import type { DashboardData } from '../types/dashboard.types'

/** Sample dashboard payload for local development without a backend. */
const MOCK_DASHBOARD: DashboardData = {
  stats: {
    totalCustomers: 186,
    totalProjects: 14,
    activeProjects: 5,
    totalEstimates: 28,
    pendingEstimates: 4,
    unhandledLeads: 7,
    newsletterSignups: 42,
    aiUsage: 312,
  },
  weekly: [
    { label: 'W19', projects: 3, estimates: 5 },
    { label: 'W20', projects: 5, estimates: 6 },
    { label: 'W21', projects: 2, estimates: 4 },
    { label: 'W22', projects: 6, estimates: 8 },
    { label: 'W23', projects: 4, estimates: 7 },
    { label: 'W24', projects: 7, estimates: 9 },
    { label: 'W25', projects: 5, estimates: 6 },
    { label: 'W26', projects: 8, estimates: 11 },
  ],
  recentProjects: [
    {
      id: 'p-09',
      name: 'Spa & Wellness Center Quận 7',
      status: 'active',
      updatedAt: '2026-06-21T09:40:00Z',
    },
    {
      id: 'p-06',
      name: 'Showroom nội thất Nhà Xinh',
      status: 'active',
      updatedAt: '2026-06-19T14:20:00Z',
    },
    {
      id: 'p-14',
      name: 'Nhà hàng chay An Lạc',
      status: 'draft',
      updatedAt: '2026-06-23T08:50:00Z',
    },
    {
      id: 'p-10',
      name: 'Kho xưởng Long An',
      status: 'draft',
      updatedAt: '2026-06-22T13:10:00Z',
    },
    {
      id: 'p-01',
      name: 'Cải tạo căn hộ Vinhomes Central Park',
      status: 'active',
      updatedAt: '2026-06-18T08:30:00Z',
    },
  ],
  activity: [
    {
      id: 'a-1',
      kind: 'estimate',
      message: 'Dự toán "Spa Quận 7" được duyệt',
      at: '2026-06-23T10:15:00Z',
    },
    {
      id: 'a-2',
      kind: 'project',
      message: 'Tạo dự án "Nhà hàng chay An Lạc"',
      at: '2026-06-23T08:50:00Z',
    },
    {
      id: 'a-3',
      kind: 'library',
      message: 'Cập nhật đơn giá 12 vật tư',
      at: '2026-06-22T16:30:00Z',
    },
    {
      id: 'a-4',
      kind: 'user',
      message: 'Trần Thị Bình tham gia nhóm',
      at: '2026-06-22T09:00:00Z',
    },
    {
      id: 'a-5',
      kind: 'estimate',
      message: 'Dự toán "Kho xưởng Long An" chờ duyệt',
      at: '2026-06-21T14:45:00Z',
    },
  ],
}

export const mockDashboardApi = {
  async getOverview(): Promise<DashboardData> {
    await mockDelay()
    return MOCK_DASHBOARD
  },
}
