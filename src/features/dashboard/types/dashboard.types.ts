/** Project status mirror (no cross-feature import allowed). */
export type RecentProjectStatus =
  | 'draft'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'archived';

/** Headline KPIs for the dashboard overview. */
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalEstimates: number;
  pendingEstimates: number;
  libraryItems: number;
  revenue: number;
}

export interface RecentProject {
  id: string;
  name: string;
  status: RecentProjectStatus;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  kind: 'project' | 'estimate' | 'user' | 'library';
  message: string;
  at: string;
}

/** Everything the overview screen needs in one payload. */
export interface DashboardData {
  stats: DashboardStats;
  recentProjects: RecentProject[];
  activity: ActivityItem[];
}
