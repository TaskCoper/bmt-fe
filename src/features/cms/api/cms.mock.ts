import type { PaginatedResponse } from '@/shared/types';
import { mockDelay, paginate } from '@/shared/lib';
import {
  CONTENT_STATUS,
  CONTENT_TYPE,
  DEFAULT_CMS_PAGE_SIZE,
} from '../constants/cms.constants';
import type { ContentEntry, ContentFilters } from '../types/cms.types';

const S = CONTENT_STATUS;
const T = CONTENT_TYPE;

/** Sample CMS entries for local development without a backend. */
export const MOCK_CONTENT: ContentEntry[] = [
  { id: 'c-01', title: 'Trang chủ — Hero', type: T.PAGE, status: S.PUBLISHED, author: 'Admin', updatedAt: '2026-06-20T03:00:00Z' },
  { id: 'c-02', title: 'Giới thiệu công ty', type: T.PAGE, status: S.PUBLISHED, author: 'Admin', updatedAt: '2026-06-18T03:00:00Z' },
  { id: 'c-03', title: '5 mẹo tiết kiệm chi phí cải tạo nhà', type: T.POST, status: S.PUBLISHED, author: 'Nguyễn Văn An', updatedAt: '2026-06-15T03:00:00Z' },
  { id: 'c-04', title: 'Bảng giá vật tư quý III/2026', type: T.POST, status: S.SCHEDULED, author: 'Trần Thị Bình', updatedAt: '2026-06-22T03:00:00Z' },
  { id: 'c-05', title: 'Banner khuyến mãi mùa hè', type: T.BANNER, status: S.DRAFT, author: 'Admin', updatedAt: '2026-06-23T03:00:00Z' },
  { id: 'c-06', title: 'Quy trình lập dự toán bằng AI', type: T.POST, status: S.PUBLISHED, author: 'Nguyễn Văn An', updatedAt: '2026-06-10T03:00:00Z' },
  { id: 'c-07', title: 'Chính sách bảo mật', type: T.PAGE, status: S.PUBLISHED, author: 'Admin', updatedAt: '2026-05-28T03:00:00Z' },
  { id: 'c-08', title: 'Điều khoản sử dụng', type: T.PAGE, status: S.DRAFT, author: 'Admin', updatedAt: '2026-05-28T03:00:00Z' },
  { id: 'c-09', title: 'Banner trang dự án', type: T.BANNER, status: S.PUBLISHED, author: 'Admin', updatedAt: '2026-06-05T03:00:00Z' },
  { id: 'c-10', title: 'Case study: Spa Quận 7', type: T.POST, status: S.SCHEDULED, author: 'Trần Thị Bình', updatedAt: '2026-06-21T03:00:00Z' },
];

function applyFilters(filters: ContentFilters): ContentEntry[] {
  let items = [...MOCK_CONTENT];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter((c) => c.title.toLowerCase().includes(q));
  }
  if (filters.status !== 'all') {
    items = items.filter((c) => c.status === filters.status);
  }
  return items;
}

export const mockCmsApi = {
  async list(filters: ContentFilters): Promise<PaginatedResponse<ContentEntry>> {
    await mockDelay();
    return paginate(applyFilters(filters), filters.page, DEFAULT_CMS_PAGE_SIZE);
  },
};
