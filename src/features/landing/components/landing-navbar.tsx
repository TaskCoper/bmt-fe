'use client';

import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/shared/constants/routes';
import {
  Logo,
  ThemeToggle,
  LanguageSwitcher,
} from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { LANDING_NAV } from '../constants/landing.constants';

/** Public landing header: in-page anchor nav, locale/theme switchers, CTA. */
export function LandingNavbar() {
  const t = useTranslations('landing.nav');
  const tAuth = useTranslations('auth.login');

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 lg:px-8">
        <a href="#home" aria-label="BMT AI Construction" className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {LANDING_NAV.map((item) => (
            <a
              key={item.sectionId}
              href={`#${item.sectionId}`}
              className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {t(item.labelKey)}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={ROUTES.LOGIN}>{tAuth('submit')}</Link>
          </Button>

          {/* Mobile menu */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right top-0 right-0 left-auto h-full max-w-xs translate-x-0 translate-y-0 rounded-none border-l">
              <DialogTitle className="sr-only">Menu</DialogTitle>
              <Logo className="mb-4" />
              <nav className="flex flex-col gap-1">
                {LANDING_NAV.map((item) => (
                  <DialogClose asChild key={item.sectionId}>
                    <a
                      href={`#${item.sectionId}`}
                      className="hover:bg-accent rounded-md px-3 py-2 text-sm font-medium"
                    >
                      {t(item.labelKey)}
                    </a>
                  </DialogClose>
                ))}
              </nav>
              <Button asChild className="mt-4">
                <Link href={ROUTES.LOGIN}>{tAuth('submit')}</Link>
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
