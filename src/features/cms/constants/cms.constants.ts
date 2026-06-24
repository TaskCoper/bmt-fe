/** CMS feature constants. */

export const CONTENT_STATUS = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
} as const;

export type ContentStatus =
  (typeof CONTENT_STATUS)[keyof typeof CONTENT_STATUS];

export const CONTENT_TYPE = {
  PAGE: 'page',
  POST: 'post',
  BANNER: 'banner',
} as const;

export type ContentType = (typeof CONTENT_TYPE)[keyof typeof CONTENT_TYPE];

export const DEFAULT_CMS_PAGE_SIZE = 8;
