import type { ReactNode } from 'react'

import { AdminGuard, ProtectedRoute } from '@/shared/auth'
import { AdminChrome } from './_components/admin-chrome'

/**
 * Admin-only area shell. Layered access control: `ProtectedRoute` enforces
 * authentication, `AdminGuard` enforces the `admin` role (non-admins get a
 * localized "no access" state instead of the chrome), and `AdminChrome` wires
 * the isolated admin sidebar/layout. The proxy also gates `/admin` on the auth
 * cookie; the backend remains the source of truth for authorization.
 */
export default function AdminGroupLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminGuard>
        <AdminChrome>{children}</AdminChrome>
      </AdminGuard>
    </ProtectedRoute>
  )
}
