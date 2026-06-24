import {
  LayoutDashboard,
  FolderKanban,
  Calculator,
  Library,
  Bot,
  FileText,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { ROUTES } from '@/shared/constants/routes';
import { ROLES, type Role } from '@/shared/auth';

/** Translation keys available under the `nav` namespace for sidebar items. */
export type NavLabelKey =
  | 'dashboard'
  | 'projects'
  | 'estimates'
  | 'library'
  | 'chatbot'
  | 'cms'
  | 'users';

/** A single primary navigation entry for the dashboard sidebar. */
export interface NavItem {
  /** Key under the `nav` translation namespace. */
  labelKey: NavLabelKey;
  href: string;
  icon: LucideIcon;
  /** Roles allowed to see this item. Empty = all authenticated users. */
  roles?: readonly Role[];
}

/**
 * Primary dashboard navigation. Labels are translation keys (never hardcoded
 * text); icons and routes are colocated for a single source of truth.
 */
export const DASHBOARD_NAV: readonly NavItem[] = [
  { labelKey: 'dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { labelKey: 'projects', href: ROUTES.PROJECTS, icon: FolderKanban },
  { labelKey: 'estimates', href: ROUTES.ESTIMATES, icon: Calculator },
  { labelKey: 'library', href: ROUTES.LIBRARY, icon: Library },
  { labelKey: 'chatbot', href: ROUTES.CHATBOT, icon: Bot },
  {
    labelKey: 'cms',
    href: ROUTES.CMS,
    icon: FileText,
    roles: [ROLES.ADMIN],
  },
  {
    labelKey: 'users',
    href: ROUTES.USERS,
    icon: Users,
    roles: [ROLES.ADMIN],
  },
];
