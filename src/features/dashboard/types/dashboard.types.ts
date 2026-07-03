/** Project status mirror (no cross-feature import allowed). */
export type RecentProjectStatus =
  | 'draft'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'archived'

/** Headline KPIs for the dashboard overview (stakeholder Q&A §7.2.3). */
export interface DashboardStats {
  totalCustomers: number
  totalProjects: number
  activeProjects: number
  totalEstimates: number
  pendingEstimates: number
  /** Leads not yet marked as handled — surfaced with a red accent. */
  unhandledLeads: number
  newsletterSignups: number
  /** Total number of AI generations consumed. */
  aiUsage: number
}

/** One bucket in the "created per week" bar chart (last 8 weeks). */
export interface WeeklyPoint {
  /** Short week label, e.g. "W23" or an ISO week start. */
  label: string
  projects: number
  estimates: number
}

export interface RecentProject {
  id: string
  name: string
  status: RecentProjectStatus
  updatedAt: string
}

export interface ActivityItem {
  id: string
  kind: 'project' | 'estimate' | 'user' | 'library'
  message: string
  at: string
}

/** Everything the overview screen needs in one payload. */
export interface DashboardData {
  stats: DashboardStats
  weekly: WeeklyPoint[]
  recentProjects: RecentProject[]
  activity: ActivityItem[]
}
