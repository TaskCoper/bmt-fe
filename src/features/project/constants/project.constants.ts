/** Project feature constants. */

export const PROJECT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export type ProjectStatus =
  (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export const DEFAULT_PROJECT_PAGE_SIZE = 8;
