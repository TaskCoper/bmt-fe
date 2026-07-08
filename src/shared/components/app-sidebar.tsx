'use client'

import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'
import { useAuth } from '@/shared/auth'
import { NavUser } from '@/shared/components/nav-user'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/shared/components/ui/sidebar'
import { DASHBOARD_NAV, NAV_CHILD_ICON, type NavItem } from '@/shared/layouts/nav-config'

export function AppSidebar({ onLogout, ...props }: React.ComponentProps<typeof Sidebar> & { onLogout?: () => void }) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const { user, hasAnyRole } = useAuth()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const renderItem = (item: NavItem) => {
    const Icon = item.icon

    // Collapsible parent (e.g. "My estimates" → create / list).
    if (item.children?.length) {
      const parentActive = item.children.some((c) => isActive(c.href))
      return (
        <Collapsible key={item.labelKey} asChild defaultOpen={parentActive} className='group/collapsible'>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={t(item.labelKey)} isActive={parentActive}>
                <Icon />
                <span>{t(item.labelKey)}</span>
                <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.children.map((child) => {
                  const ChildIcon = NAV_CHILD_ICON[child.labelKey]
                  return (
                    <SidebarMenuSubItem key={child.href}>
                      <SidebarMenuSubButton asChild isActive={isActive(child.href)}>
                        <Link href={child.href}>
                          {ChildIcon ? <ChildIcon /> : null}
                          <span>{t(child.labelKey)}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      )
    }

    // Leaf item.
    return (
      <SidebarMenuItem key={item.labelKey}>
        <SidebarMenuButton asChild isActive={isActive(item.href!)} tooltip={t(item.labelKey)}>
          <Link href={item.href!}>
            <Icon />
            <span>{t(item.labelKey)}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {DASHBOARD_NAV.filter((item) => !item.roles || hasAnyRole(item.roles)).map(renderItem)}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} onLogout={onLogout} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
