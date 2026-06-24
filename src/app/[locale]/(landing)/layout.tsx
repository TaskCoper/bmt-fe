import type { ReactNode } from 'react';

import { LandingNavbar, LandingFooter } from '@/features/landing';

/** Public marketing layout: navbar + content + footer. */
export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <LandingNavbar />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  );
}
