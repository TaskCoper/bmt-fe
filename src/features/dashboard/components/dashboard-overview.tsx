'use client';

import { useTranslations, useLocale } from 'next-intl';
import { FolderKanban, Calculator, Library, Wallet } from 'lucide-react';

import type { Locale } from '@/i18n/routing';
import { formatNumber, formatCurrency } from '@/shared/utils';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useDashboard } from '../hooks/use-dashboard';
import { StatCard } from './stat-card';

/**
 * KPI grid for the dashboard. Pulls live(-ish) metrics via {@link useDashboard}
 * and renders skeletons while loading.
 */
export function DashboardOverview() {
  const t = useTranslations('dashboard');
  const tn = useTranslations('nav');
  const locale = useLocale() as Locale;
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  const { stats } = data;
  const cards = [
    {
      label: tn('projects'),
      value: formatNumber(stats.totalProjects, locale),
      hint: t('stats.activeHint', { count: stats.activeProjects }),
      icon: FolderKanban,
    },
    {
      label: tn('estimates'),
      value: formatNumber(stats.totalEstimates, locale),
      hint: t('stats.pendingHint', { count: stats.pendingEstimates }),
      icon: Calculator,
    },
    {
      label: tn('library'),
      value: formatNumber(stats.libraryItems, locale),
      hint: t('stats.libraryHint'),
      icon: Library,
    },
    {
      label: t('stats.revenue'),
      value: formatCurrency(stats.revenue, locale),
      hint: t('stats.revenueHint'),
      icon: Wallet,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <StatCard
          key={c.label}
          label={c.label}
          value={c.value}
          hint={c.hint}
          icon={c.icon}
        />
      ))}
    </div>
  );
}
