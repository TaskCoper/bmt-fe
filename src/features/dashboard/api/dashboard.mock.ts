import { mockDelay } from '@/shared/lib';
import type { DashboardData } from '../types/dashboard.types';

/** Sample dashboard payload for local development without a backend. */
const MOCK_DASHBOARD: DashboardData = {
  stats: {
    totalProjects: 14,
    activeProjects: 5,
    totalEstimates: 28,
    pendingEstimates: 4,
    libraryItems: 320,
    revenue: 4_850_000_000,
  },
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
};

export const mockDashboardApi = {
  async getOverview(): Promise<DashboardData> {
    await mockDelay();
    return MOCK_DASHBOARD;
  },
};
