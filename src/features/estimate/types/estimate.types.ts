import type { EstimateStatus } from '../constants/estimate.constants';

/** A cost estimate as returned by the backend. */
export interface Estimate {
  id: string;
  code: string;
  name: string;
  projectName: string;
  status: EstimateStatus;
  total: number;
  itemsCount: number;
  createdAt: string;
}

/** Aggregate figures shown above the estimate list. */
export interface EstimateSummary {
  total: number;
  approved: number;
  pending: number;
  totalValue: number;
}

/** Client-side list filters. */
export interface EstimateFilters {
  search: string;
  status: EstimateStatus | 'all';
  page: number;
}
