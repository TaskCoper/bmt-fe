'use client';

import type { ReactNode } from 'react';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { Toaster } from '@/shared/components/ui/sonner';
import { ThemeProvider } from './theme-provider';
import { QueryProvider } from './query-provider';

/**
 * Single composition root for all client-side providers.
 *
 * Order matters: theme wraps everything (so toasts/tooltips inherit it),
 * then data (Query), then UI context (Tooltip), with the toast portal last.
 * NOTE: `NextIntlClientProvider` is applied in the locale layout, ABOVE this,
 * because it needs the server-resolved messages.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster />
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
