'use client'

import { useState, type ReactNode } from 'react'

import { AppSidebar } from '@/shared/components/app-sidebar'
import { AssistantDock } from '@/shared/components/assistant-dock'
import { AssistantDrawer } from '@/shared/components/assistant-drawer'
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar'
import { cn } from '@/shared/lib/utils'
import { DashboardBrandHeader } from './dashboard-brand-header'
import { DashboardTopbar } from './dashboard-topbar'

interface DashboardLayoutProps {
  children: ReactNode
  /**
   * Logout handler wired by the app layer (the auth feature owns the flow).
   * Forwarded to the user menu in the sidebar footer.
   */
  onLogout?: () => void
  /**
   * AI chatbot UI injected by the app layer (the `chatbot` feature owns it).
   * Rendered inside the right-side drawer so `shared/` stays feature-agnostic.
   */
  assistant?: ReactNode
}

/**
 * Authenticated app shell: a full-width top header (brand + reference-library +
 * locale/theme), then a shadcn sidebar (sidebar-07) offset below it, a
 * breadcrumb bar over the scrollable content, a floating assistant dock, and a
 * right-side AI chatbot drawer. Wrap with `ProtectedRoute` at the route group.
 */
export function DashboardLayout({ children, onLogout, assistant }: DashboardLayoutProps) {
  const [assistantOpen, setAssistantOpen] = useState(false)

  return (
    <SidebarProvider className='flex-col'>
      <DashboardBrandHeader />
      <div className='flex flex-1'>
        <AppSidebar className='top-16! h-[calc(100svh-4rem)]!' onLogout={onLogout} />
        <SidebarInset
          className={cn('min-h-0 transition-[margin] duration-300 ease-out', assistantOpen && 'xl:mr-[380px]')}
        >
          <DashboardTopbar />
          <main className='flex-1 px-4 py-6 lg:px-8 lg:py-8'>
            <div className='mx-auto w-full max-w-7xl'>{children}</div>
          </main>
        </SidebarInset>
      </div>
      <AssistantDrawer open={assistantOpen} onClose={() => setAssistantOpen(false)}>
        {assistant}
      </AssistantDrawer>
      <AssistantDock open={assistantOpen} onOpenChange={setAssistantOpen} />
    </SidebarProvider>
  )
}
