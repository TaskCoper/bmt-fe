'use client'

import { useState, type ReactNode } from 'react'

import { usePathname } from '@/i18n/navigation'
import { AppSidebar } from '@/shared/components/app-sidebar'
import { AssistantDock } from '@/shared/components/assistant-dock'
import { AssistantDrawer } from '@/shared/components/assistant-drawer'
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar'
import { cn } from '@/shared/lib/utils'
import { DashboardBrandHeader } from './dashboard-brand-header'
import { DashboardTopbar } from './dashboard-topbar'

const PROJECT_ROUTE_RE = /^\/dashboard\/projects\/(?!new(?:\/|$))[^/]+/

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
  /** Named sidebar action emitted by the app layer (e.g. 'createProject'). */
  onAction?: (action: string) => void
}

/**
 * Authenticated app shell: a full-width top header (brand + reference-library +
 * locale/theme), then a shadcn sidebar (sidebar-07) offset below it, a
 * breadcrumb bar over the scrollable content, a floating assistant dock, and a
 * right-side AI chatbot drawer. Wrap with `ProtectedRoute` at the route group.
 */
export function DashboardLayout({ children, onLogout, assistant, onAction }: DashboardLayoutProps) {
  const [assistantOpen, setAssistantOpen] = useState(false)
  const pathname = usePathname()
  const isProjectCanvas = PROJECT_ROUTE_RE.test(pathname)

  return (
    <SidebarProvider className='flex-col'>
      <DashboardBrandHeader />
      <div className='flex flex-1'>
        <AppSidebar className='top-16! h-[calc(100svh-4rem)]!' onLogout={onLogout} onAction={onAction} />
        <SidebarInset
          className={cn(
            'min-h-0 transition-[margin] duration300 ease-out',
            isProjectCanvas && 'project-canvas',
            assistantOpen && 'xl:mr-[380px]'
          )}
        >
          <DashboardTopbar />
          <main className='flex-1 px-4 py-6 lg:px-8 lg:py-8'>{children}</main>
        </SidebarInset>
      </div>
      <AssistantDrawer open={assistantOpen} onClose={() => setAssistantOpen(false)}>
        {assistant}
      </AssistantDrawer>
      <AssistantDock open={assistantOpen} onOpenChange={setAssistantOpen} />
    </SidebarProvider>
  )
}
