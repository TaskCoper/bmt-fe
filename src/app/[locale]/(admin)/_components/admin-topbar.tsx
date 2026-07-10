'use client'

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
import { ROUTES } from '@/shared/constants/routes'
import { ADMIN_NAV, isAdminNavActive } from './admin-nav'
import { ADMIN_COPY } from './admin.copy'

/** Label of the active admin section for the current pathname. */
function activeSection(pathname: string): string {
  const match = ADMIN_NAV.find((item) => item.href !== ROUTES.ADMIN && isAdminNavActive(item.href, pathname))
  return match?.label ?? ADMIN_COPY.pages.overview.title
}

/**
 * Admin content-area bar: sidebar toggle + a two-level breadcrumb
 * (root → active section). Brand chip lives in the full-width header above.
 */
export function AdminTopbar() {
  const pathname = usePathname()
  const section = activeSection(pathname)

  return (
    <div className='flex h-12 shrink-0 items-center gap-2 px-4 lg:px-6'>
      <SidebarTrigger className='-ml-1' />
      <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className='text-muted-foreground'>{ADMIN_COPY.root}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{section}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
