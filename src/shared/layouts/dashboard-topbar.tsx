'use client'

import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { usePathname } from '@/i18n/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/shared/components/ui/breadcrumb'
import { Separator } from '@/shared/components/ui/separator'
import { SidebarTrigger } from '@/shared/components/ui/sidebar'
import { DASHBOARD_NAV, type NavItem, type NavLabelKey, type NavLeaf } from './nav-config'

function patternToRegex(pattern: string, end: boolean): RegExp {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/:[^/]+/g, '[^/]+')
    .replace(/\*/g, '.*')
  return new RegExp(end ? `^${escaped}$` : `^${escaped}(/|$)`)
}

function isNavActive(item: NavItem | NavLeaf, pathname: string): boolean {
  const patterns = item.activePatterns?.length ? item.activePatterns : item.href ? [item.href] : []
  if (!patterns.length) return false
  const excluded = item.activeExcludePatterns?.some((p) => patternToRegex(p, false).test(pathname))
  if (excluded) return false
  return patterns.some((p) => patternToRegex(p, true).test(pathname))
}

/** Resolve the active nav trail (parent → leaf) for the current pathname. */
function activeTrail(pathname: string): NavLabelKey[] {
  for (const item of DASHBOARD_NAV) {
    if (item.href && isNavActive(item, pathname)) return [item.labelKey]
    const child = item.children?.find((c) => isNavActive(c, pathname))
    if (child) return [item.labelKey, child.labelKey]
  }
  return ['dashboard']
}

/**
 * Dashboard content-area breadcrumb bar: sidebar toggle + breadcrumb of the
 * active section. Brand/locale/theme live in the full-width header above; the
 * user avatar lives in the sidebar footer — both intentionally absent here.
 */
export function DashboardTopbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const trail = activeTrail(pathname)

  return (
    <div className='flex h-12 shrink-0 items-center gap-2 px-4 lg:px-6'>
      <SidebarTrigger className='-ml-1' />
      <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
      <Breadcrumb>
        <BreadcrumbList>
          {trail.map((key, i) => (
            <Fragment key={key}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbPage>{t(key)}</BreadcrumbPage>
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
