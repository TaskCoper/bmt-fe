'use client'

import type { ReactNode } from 'react'

import { useLogout } from '@/features/auth'
import { AdminShell } from './admin-shell'

/**
 * App-layer glue: wires the auth feature's logout flow into the admin shell.
 * Lives in `app/` because only this layer may import both `features/` and
 * `shared/` (the shell itself stays feature-agnostic).
 */
export function AdminChrome({ children }: { children: ReactNode }) {
  const logout = useLogout()

  return <AdminShell onLogout={() => logout.mutate()}>{children}</AdminShell>
}
