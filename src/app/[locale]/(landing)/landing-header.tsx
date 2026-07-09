'use client'

import type { ReactNode } from 'react'

import { AuthDialog, useLogout } from '@/features/auth'
import { LandingNavbar } from '@/features/landing'
import { useAuth } from '@/shared/auth'
import { AccountMenu } from '@/shared/components/account-menu'
import { AuthCta } from '@/shared/components/auth-cta'

/** CTA button that opens the global guest auth popup — injected into the navbar. */
function AuthTrigger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <AuthCta mode='login' size='sm' className={className}>
      {children}
    </AuthCta>
  )
}

/** Signed-in account dropdown, wired with the auth feature's logout flow. */
function UserMenu() {
  const { user } = useAuth()
  const logout = useLogout()
  if (!user) return null
  return <AccountMenu user={user} onLogout={() => logout.mutate()} />
}

/**
 * App-layer glue: wires the auth feature's login/register popup and the
 * signed-in account menu into the landing navbar. Lives in `app/` because only
 * this layer may import both `features/landing` and `features/auth`.
 */
export function LandingHeader() {
  return (
    <>
      <LandingNavbar AuthTrigger={AuthTrigger} UserMenu={UserMenu} />
      {/* Single global instance of the guest auth popup; opened via AuthCta. */}
      <AuthDialog />
    </>
  )
}
