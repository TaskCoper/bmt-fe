'use client';

import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { useAuth } from '@/shared/auth';
import { cn } from '@/shared/lib/utils';
import {
  Logo,
  ThemeToggle,
  LanguageSwitcher,
} from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { DASHBOARD_NAV } from './nav-config';
import { UserMenu } from './user-menu';

interface DashboardHeaderProps {
  /** Logout handler forwarded to the user menu (wired by the app layer). */
  onLogout?: () => void;
}

/**
 * Top bar for the dashboard shell: mobile nav trigger, locale + theme
 * switchers, and the user menu.
 */
export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const t = useTranslations('nav');
  const { hasAnyRole } = useAuth();

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-16 items-center gap-2 border-b px-4 backdrop-blur lg:px-6">
      {/* Mobile navigation */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left top-0 left-0 h-full max-w-72 translate-x-0 translate-y-0 rounded-none border-r sm:max-w-72">
          <DialogTitle className="sr-only">{t('dashboard')}</DialogTitle>
          <Logo className="mb-4" />
          <nav className="space-y-1">
            {DASHBOARD_NAV.filter(
              (item) => !item.roles || hasAnyRole(item.roles),
            ).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                  )}
                >
                  <Icon className="size-4" />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
        </DialogContent>
      </Dialog>

      <div className="ml-auto flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
        <UserMenu onLogout={onLogout} />
      </div>
    </header>
  );
}
