'use client'

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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar
} from '@/shared/components/ui/sidebar'
import { DASHBOARD_NAV, NAV_CHILD_ICON, type NavItem, type NavLeaf } from '@/shared/layouts/nav-config'
import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import cities from 'public/images/cities.png'
import * as React from 'react'

/** Convert a `:param` / `*` URL pattern to a RegExp. */
function patternToRegex(pattern: string, end: boolean): RegExp {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/:[^/]+/g, '[^/]+')
    .replace(/\*/g, '.*')
  return new RegExp(end ? `^${escaped}$` : `^${escaped}(/|$)`)
}

type ActiveConfig = {
  href?: string
  activePatterns?: readonly string[]
  activeExcludePatterns?: readonly string[]
}

function isItemActive(item: ActiveConfig, pathname: string): boolean {
  const patterns = item.activePatterns?.length ? item.activePatterns : item.href ? [item.href] : []
  if (!patterns.length) return false
  const excluded = item.activeExcludePatterns?.some((p) => patternToRegex(p, false).test(pathname))
  if (excluded) return false
  return patterns.some((p) => patternToRegex(p, true).test(pathname))
}

interface CollapsibleNavItemProps {
  item: NavItem
  pathname: string
  onAction?: (action: string) => void
}

function CollapsibleNavItem({ item, pathname, onAction }: CollapsibleNavItemProps) {
  const t = useTranslations('nav')
  const Icon = item.icon
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const hasActiveChild = (item.children ?? []).some((c) => isItemActive(c, pathname))

  // When the sidebar is collapsed the children are hidden — show active on the parent instead.
  const activeParent = hasActiveChild && isCollapsed

  return (
    <Collapsible asChild open className='group/collapsible'>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={t(item.labelKey)} isActive={activeParent}>
            <Icon />
            <span>{t(item.labelKey)}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleTrigger asChild>
          <SidebarMenuAction>
            <ChevronRight className='transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
            <span className='sr-only'>{t('toggleSubmenu')}</span>
          </SidebarMenuAction>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {(item.children ?? []).map((child: NavLeaf) => {
              const ChildIcon = NAV_CHILD_ICON[child.labelKey]
              return (
                <SidebarMenuSubItem key={child.href ?? child.action}>
                  {child.action ? (
                    <SidebarMenuSubButton onClick={() => onAction?.(child.action!)}>
                      {ChildIcon ? <ChildIcon /> : null}
                      <span>{t(child.labelKey)}</span>
                    </SidebarMenuSubButton>
                  ) : (
                    <SidebarMenuSubButton asChild isActive={isItemActive(child, pathname)}>
                      <Link href={child.href!}>
                        {ChildIcon ? <ChildIcon /> : null}
                        <span>{t(child.labelKey)}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  )}
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function AppSidebar({
  onLogout,
  onAction,
  ...props
}: React.ComponentProps<typeof Sidebar> & { onLogout?: () => void; onAction?: (action: string) => void }) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const { user, hasAnyRole } = useAuth()

  const renderItem = (item: NavItem) => {
    if (item.children?.length) {
      return <CollapsibleNavItem key={item.labelKey} item={item} pathname={pathname} onAction={onAction} />
    }

    return (
      <SidebarMenuItem key={item.labelKey}>
        <SidebarMenuButton asChild isActive={isItemActive(item, pathname)} tooltip={t(item.labelKey)}>
          <Link href={item.href!}>
            <item.icon />
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
      <SidebarFooter>
        <div className='overflow-hidden group-data-[state=collapsed]:hidden'>
          <Image src={cities} alt={t('citiesImageAlt')} className='w-full h-auto' />
        </div>
        {user && <NavUser user={user} onLogout={onLogout} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
