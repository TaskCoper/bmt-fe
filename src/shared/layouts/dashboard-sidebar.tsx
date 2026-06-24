'use client';

import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { Logo } from '@/shared/components/common';
import { useAuth } from '@/shared/auth';
import { DASHBOARD_NAV } from './nav-config';

/**
 * Persistent left navigation for the dashboard shell.
 * Hidden on small screens (the header exposes a mobile entry point).
 */
export function DashboardSidebar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { hasAnyRole } = useAuth();

  return (
    <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border hidden w-64 shrink-0 flex-col border-r lg:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" aria-label={t('dashboard')}>
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {DASHBOARD_NAV.filter(
          (item) => !item.roles || hasAnyRole(item.roles),
        ).map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
              )}
            >
              <Icon className="size-4 shrink-0" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
