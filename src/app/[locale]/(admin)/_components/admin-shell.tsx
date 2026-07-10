'use client'

import type { ReactNode } from 'react'

import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar'
import { AdminHeader } from './admin-header'
import { AdminSidebar } from './admin-sidebar'
import { AdminTopbar } from './admin-topbar'

interface AdminShellProps {
  children: ReactNode
  /** Logout handler wired by the app layer (the auth feature owns the flow). */
  onLogout?: () => void
}

/**
 * Admin back-office shell: a full-width brand header, then a collapsible
 * icon sidebar offset below it, a breadcrumb bar over the scrollable content.
 * Intentionally leaner than the customer `DashboardLayout` — no locale/theme
 * switcher and no AI assistant dock.
 */
export function AdminShell({ children, onLogout }: AdminShellProps) {
  return (
    <SidebarProvider className='flex-col'>
      <AdminHeader />
      <div className='flex flex-1'>
        <AdminSidebar className='top-16! h-[calc(100svh-4rem)]!' onLogout={onLogout} />
        <SidebarInset className='min-h-0'>
          <AdminTopbar />
          <main className='flex-1 px-4 py-6 lg:px-8 lg:py-8'>
            <div className='mx-auto w-full max-w-7xl'>{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
