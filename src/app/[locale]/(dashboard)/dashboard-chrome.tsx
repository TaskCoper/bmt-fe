'use client';

import type { ReactNode } from 'react';

import { useLogout } from '@/features/auth';
import { DashboardLayout } from '@/shared/layouts';

/**
 * App-layer glue: wires the auth feature's logout flow into the shared
 * dashboard shell. Lives in `app/` because only this layer may import both
 * `features/` and `shared/` (the shell itself must stay feature-agnostic).
 */
export function DashboardChrome({ children }: { children: ReactNode }) {
  const logout = useLogout();

  return (
    <DashboardLayout onLogout={() => logout.mutate()}>
      {children}
    </DashboardLayout>
  );
}
