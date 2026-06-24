import type { ReactNode } from 'react';

import { ProtectedRoute } from '@/shared/auth';
import { DashboardChrome } from './dashboard-chrome';

/**
 * Authenticated area shell. The session is bootstrapped globally in the locale
 * layout; here `ProtectedRoute` enforces access on the client and
 * `DashboardChrome` wires the logout flow into the shared dashboard shell.
 */
export default function DashboardGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardChrome>{children}</DashboardChrome>
    </ProtectedRoute>
  );
}
