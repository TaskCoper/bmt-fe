import {
  Building2,
  Calculator,
  FilePlus2,
  FileText,
  FolderKanban,
  Images,
  Inbox,
  ListChecks,
  Users,
  type LucideIcon
} from 'lucide-react'

import { ROLES, type Role } from '@/shared/auth'
import { ROUTES } from '@/shared/constants/routes'

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
  | 'projectCreate'
  | 'myProjects'

/** A leaf navigation entry (a real, clickable destination). */
export interface NavLeaf {
  /** Key under the `nav` translation namespace. */
  labelKey: NavLabelKey
  /** Destination URL. Omit when the leaf triggers an `action` instead. */
  href?: string
  /** Named action emitted via `onAction` instead of navigating. */
  action?: string
  /** URL patterns (`:param`, `*` wildcards) that mark this item active. Falls back to `href` prefix match. */
  activePatterns?: readonly string[]
  /** Patterns that suppress active state even when `activePatterns` matches. */
  activeExcludePatterns?: readonly string[]
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
  /** URL patterns (`:param`, `*` wildcards) that mark this item active. Falls back to `href` prefix match. */
  activePatterns?: readonly string[]
  /** Patterns that suppress active state even when `activePatterns` matches. */
  activeExcludePatterns?: readonly string[]
}

/**
 * Primary dashboard navigation. Labels are translation keys (never hardcoded
 * text); icons and routes are colocated for a single source of truth. Library
 * lives in the top header and the AI chatbot is a floating dock — neither
 * belongs in this list.
 */
export const DASHBOARD_NAV: readonly NavItem[] = [
  {
    labelKey: 'myProjects',
    icon: FolderKanban,
    children: [
      {
        labelKey: 'projectCreate',
        href: ROUTES.PROJECT_NEW,
        activePatterns: ['/dashboard/projects/new']
      },
      {
        labelKey: 'projects',
        href: ROUTES.PROJECTS,
        activePatterns: ['/dashboard/projects', '/dashboard/projects/:slug', '/dashboard/projects/:slug/*'],
        activeExcludePatterns: ['/dashboard/projects/new']
      }
    ]
  },
  {
    labelKey: 'myEstimates',
    icon: Calculator,
    children: [
      {
        labelKey: 'estimateCreate',
        href: ROUTES.ESTIMATE_NEW,
        activePatterns: ['/dashboard/estimates/new']
      },
      {
        labelKey: 'estimateList',
        href: ROUTES.ESTIMATES,
        activePatterns: ['/dashboard/estimates', '/dashboard/estimates/:id'],
        activeExcludePatterns: ['/dashboard/estimates/new']
      }
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
