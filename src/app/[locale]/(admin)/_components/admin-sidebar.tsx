'use client'

import * as React from 'react'

import { Link, usePathname } from '@/i18n/navigation'
import { useAuth } from '@/shared/auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/shared/components/ui/sidebar'
import { ADMIN_NAV, isAdminNavActive } from './admin-nav'
import { ADMIN_COPY } from './admin.copy'
import { AdminUser } from './admin-user'

/**
 * Admin-only sidebar. It renders exclusively from {@link ADMIN_NAV} — the
 * customer nav never reaches this component, which is the whole point of the
 * isolated `(admin)` route group.
 */
export function AdminSidebar({ onLogout, ...props }: React.ComponentProps<typeof Sidebar> & { onLogout?: () => void }) {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{ADMIN_COPY.badge}</SidebarGroupLabel>
          <SidebarMenu>
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isAdminNavActive(item.href, pathname)} tooltip={item.label}>
                    <Link href={item.href}>
                      <Icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{user && <AdminUser user={user} onLogout={onLogout} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
