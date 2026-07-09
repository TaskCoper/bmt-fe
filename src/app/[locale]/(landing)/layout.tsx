import type { ReactNode } from 'react'

import { LandingFooter, FloatingContact } from '@/features/landing'
import { LandingHeader } from './landing-header'

/** Public marketing layout: navbar + content + footer + quick-contact buttons. */
export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex min-h-svh flex-col'>
      <LandingHeader />
      <main className='flex-1'>{children}</main>
      <LandingFooter />
      <FloatingContact />
    </div>
  )
}
