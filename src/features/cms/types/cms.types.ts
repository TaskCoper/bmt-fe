import type { ContentStatus, ContentType } from '../constants/cms.constants';

/** A CMS content entry (landing page section, blog post, banner…). */
export interface ContentEntry {
  id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  author: string;
  updatedAt: string;
}

/** Client-side list filters. */
export interface ContentFilters {
  search: string;
  status: ContentStatus | 'all';
  page: number;
}
