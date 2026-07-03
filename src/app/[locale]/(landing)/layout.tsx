import type { ReactNode } from 'react';

import {
  LandingNavbar,
  LandingFooter,
  FloatingContact,
} from '@/features/landing';

/** Public marketing layout: navbar + content + footer + quick-contact buttons. */
export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <LandingNavbar />
      <main className="flex-1">{children}</main>
      <LandingFooter />
      <FloatingContact />
    </div>
  );
}
