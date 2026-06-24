'use client';

import { useQuery } from '@tanstack/react-query';

import { dashboardApi } from '../api/dashboard.api';
import { dashboardKeys } from '../api/dashboard.keys';

/** Fetches the dashboard overview payload (stats + recent + activity). */
export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: dashboardApi.getOverview,
  });
}
