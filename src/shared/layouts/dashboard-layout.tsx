import type { ReactNode } from 'react';

import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';

interface DashboardLayoutProps {
  children: ReactNode;
  /**
   * Logout handler wired by the app layer (the auth feature owns the flow).
   * Passed through to the header's user menu.
   */
  onLogout?: () => void;
}

/**
 * Composable dashboard shell: fixed sidebar + sticky header + scrollable
 * content region. Wrap with `ProtectedRoute` at the route-group layout level.
 */
export function DashboardLayout({ children, onLogout }: DashboardLayoutProps) {
  return (
    <div className="bg-background flex min-h-svh">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader onLogout={onLogout} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
