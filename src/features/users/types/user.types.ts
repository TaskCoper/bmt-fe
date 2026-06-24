import type { Role } from '@/shared/auth';

/** A user account row as shown in the admin users table. */
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
  createdAt: string;
}

/** Client-side list filters. */
export interface UserFilters {
  search: string;
  page: number;
}
