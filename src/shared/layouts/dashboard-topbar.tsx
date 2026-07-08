'use client'

import { Fragment } from 'react'
import { useTranslations } from 'next-intl'

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
import { DASHBOARD_NAV, type NavLabelKey } from './nav-config'

/** Resolve the active nav trail (parent → leaf) for the current pathname. */
function activeTrail(pathname: string): NavLabelKey[] {
  const matches = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  for (const item of DASHBOARD_NAV) {
    if (item.href && matches(item.href)) return [item.labelKey]
    const child = item.children?.find((c) => matches(c.href))
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
