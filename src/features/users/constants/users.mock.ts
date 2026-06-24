import { ROLES } from '@/shared/auth';
import type { UserRecord } from '../types/user.types';

/**
 * Placeholder user list for the admin screen while there is no backend.
 * Served through `users.mock.ts` → `users.api.ts` (mock switch).
 */
export const MOCK_USERS: readonly UserRecord[] = [
  { id: 'u-1', name: 'Nguyễn Văn An', email: 'an.nguyen@bmt.local', role: ROLES.ADMIN, status: 'active', createdAt: '2025-08-12T03:00:00Z' },
  { id: 'u-2', name: 'Trần Thị Bình', email: 'binh.tran@bmt.local', role: ROLES.USER, status: 'active', createdAt: '2025-09-03T03:00:00Z' },
  { id: 'u-3', name: 'Lê Hoàng Cường', email: 'cuong.le@bmt.local', role: ROLES.USER, status: 'inactive', createdAt: '2025-10-21T03:00:00Z' },
  { id: 'u-4', name: 'Phạm Minh Dũng', email: 'dung.pham@bmt.local', role: ROLES.GUEST, status: 'active', createdAt: '2026-01-15T03:00:00Z' },
  { id: 'u-5', name: 'Võ Thị Em', email: 'em.vo@bmt.local', role: ROLES.USER, status: 'active', createdAt: '2026-02-08T03:00:00Z' },
  { id: 'u-6', name: 'Đặng Quốc Phong', email: 'phong.dang@bmt.local', role: ROLES.USER, status: 'active', createdAt: '2026-03-19T03:00:00Z' },
  { id: 'u-7', name: 'Bùi Thị Giang', email: 'giang.bui@bmt.local', role: ROLES.USER, status: 'inactive', createdAt: '2026-04-02T03:00:00Z' },
  { id: 'u-8', name: 'Hoàng Văn Hải', email: 'hai.hoang@bmt.local', role: ROLES.ADMIN, status: 'active', createdAt: '2026-05-11T03:00:00Z' },
];
