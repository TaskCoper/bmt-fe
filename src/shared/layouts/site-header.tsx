'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/shared/constants/routes';
import {
  Logo,
  ThemeToggle,
  LanguageSwitcher,
} from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';

/** Public marketing header used by the landing route group. */
export function SiteHeader() {
  const t = useTranslations('auth.login');

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 lg:px-8">
        <Link href={ROUTES.HOME} aria-label="Home">
          <Logo />
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href={ROUTES.LOGIN}>{t('submit')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
