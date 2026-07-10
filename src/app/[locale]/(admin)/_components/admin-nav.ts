import { LayoutDashboard, FileText, Users, Inbox, Images, Building2, type LucideIcon } from 'lucide-react'

import { ROUTES } from '@/shared/constants/routes'
import { ADMIN_COPY } from './admin.copy'

/** A single admin sidebar destination. Admin nav is flat — no collapsibles. */
export interface AdminNavItem {
  label: string
  href: string
  icon: LucideIcon
  /** Short description shown on the overview quick-access cards. */
  description: string
}

/**
 * Primary navigation for the admin back-office. This is completely separate from
 * the customer `DASHBOARD_NAV` so the two sidebars never leak into each other.
 */
export const ADMIN_NAV: readonly AdminNavItem[] = [
  {
    label: ADMIN_COPY.pages.overview.title,
    href: ROUTES.ADMIN,
    icon: LayoutDashboard,
    description: ADMIN_COPY.pages.overview.subtitle
  },
  {
    label: ADMIN_COPY.pages.cms.title,
    href: ROUTES.CMS,
    icon: FileText,
    description: ADMIN_COPY.pages.cms.subtitle
  },
  {
    label: ADMIN_COPY.pages.users.title,
    href: ROUTES.USERS,
    icon: Users,
    description: ADMIN_COPY.pages.users.subtitle
  },
  {
    label: ADMIN_COPY.pages.leads.title,
    href: ROUTES.LEADS,
    icon: Inbox,
    description: ADMIN_COPY.pages.leads.subtitle
  },
  {
    label: ADMIN_COPY.pages.gallery.title,
    href: ROUTES.ADMIN_GALLERY,
    icon: Images,
    description: ADMIN_COPY.pages.gallery.subtitle
  },
  {
    label: ADMIN_COPY.pages.portfolio.title,
    href: ROUTES.ADMIN_PORTFOLIO,
    icon: Building2,
    description: ADMIN_COPY.pages.portfolio.subtitle
  }
]

/** Whether a nav item is active for the current (locale-stripped) pathname. */
export function isAdminNavActive(href: string, pathname: string): boolean {
  // The overview lives at the section root, so it must match exactly — every
  // other admin route also starts with `/admin` and would otherwise light it up.
  if (href === ROUTES.ADMIN) return pathname === ROUTES.ADMIN
  return pathname === href || pathname.startsWith(`${href}/`)
}
