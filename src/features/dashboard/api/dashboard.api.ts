import { http } from '@/shared/lib/api';
import { env } from '@/shared/config/env';
import type { DashboardData } from '../types/dashboard.types';
import { mockDashboardApi } from './dashboard.mock';

const realDashboardApi = {
  getOverview: () => http.get<DashboardData>('/dashboard/overview'),
};

export const dashboardApi = env.NEXT_PUBLIC_USE_MOCK_API
  ? mockDashboardApi
  : realDashboardApi;
