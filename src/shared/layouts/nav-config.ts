import {
  FolderKanban,
  Calculator,
  FilePlus2,
  ListChecks,
  FileText,
  Users,
  Inbox,
  Images,
  Building2,
  type LucideIcon
} from 'lucide-react'

import { ROUTES } from '@/shared/constants/routes'
import { ROLES, type Role } from '@/shared/auth'

/** Translation keys available under the `nav` namespace for sidebar items. */
export type NavLabelKey =
  | 'dashboard'
  | 'projects'
  | 'myEstimates'
  | 'estimateCreate'
  | 'estimateList'
  | 'cms'
  | 'users'
  | 'leads'
  | 'adminGallery'
  | 'adminPortfolio'

/** A leaf navigation entry (a real, clickable destination). */
export interface NavLeaf {
  /** Key under the `nav` translation namespace. */
  labelKey: NavLabelKey
  href: string
}

/**
 * A single primary navigation entry for the dashboard sidebar. A parent entry
 * omits `href` and provides `children` — it renders as a collapsible group.
 */
export interface NavItem {
  labelKey: NavLabelKey
  icon: LucideIcon
  /** Destination for a leaf item. Omitted when the item has `children`. */
  href?: string
  /** Sub-items; when present the entry is a collapsible parent. */
  children?: readonly NavLeaf[]
  /** Roles allowed to see this item. Empty = all authenticated users. */
  roles?: readonly Role[]
}

/**
 * Primary dashboard navigation. Labels are translation keys (never hardcoded
 * text); icons and routes are colocated for a single source of truth. Library
 * lives in the top header and the AI chatbot is a floating dock — neither
 * belongs in this list.
 */
export const DASHBOARD_NAV: readonly NavItem[] = [
  { labelKey: 'projects', href: ROUTES.PROJECTS, icon: FolderKanban },
  {
    labelKey: 'myEstimates',
    icon: Calculator,
    children: [
      { labelKey: 'estimateCreate', href: ROUTES.ESTIMATE_NEW },
      { labelKey: 'estimateList', href: ROUTES.ESTIMATES }
    ]
  },
  {
    labelKey: 'cms',
    href: ROUTES.CMS,
    icon: FileText,
    roles: [ROLES.ADMIN]
  },
  {
    labelKey: 'adminGallery',
    href: ROUTES.ADMIN_GALLERY,
    icon: Images,
    roles: [ROLES.ADMIN]
  },
  {
    labelKey: 'adminPortfolio',
    href: ROUTES.ADMIN_PORTFOLIO,
    icon: Building2,
    roles: [ROLES.ADMIN]
  },
  {
    labelKey: 'leads',
    href: ROUTES.LEADS,
    icon: Inbox,
    roles: [ROLES.ADMIN]
  },
  {
    labelKey: 'users',
    href: ROUTES.USERS,
    icon: Users,
    roles: [ROLES.ADMIN]
  }
]

/** Icons for the estimate sub-items, keyed by their translation label. */
export const NAV_CHILD_ICON: Partial<Record<NavLabelKey, LucideIcon>> = {
  estimateCreate: FilePlus2,
  estimateList: ListChecks
}
