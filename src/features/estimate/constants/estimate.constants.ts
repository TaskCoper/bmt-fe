/** Estimate feature constants. */

export const ESTIMATE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type EstimateStatus =
  (typeof ESTIMATE_STATUS)[keyof typeof ESTIMATE_STATUS];

export const DEFAULT_ESTIMATE_PAGE_SIZE = 8;
