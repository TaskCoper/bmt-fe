'use client';

import { useTranslations, useLocale } from 'next-intl';
import {
  Users,
  FolderKanban,
  Calculator,
  Inbox,
  Mail,
  Sparkles,
} from 'lucide-react';

import type { Locale } from '@/i18n/routing';
import { formatNumber } from '@/shared/utils';
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  const { stats } = data;
  const cards = [
    {
      label: t('stats.customers'),
      value: formatNumber(stats.totalCustomers, locale),
      hint: t('stats.customersHint'),
      icon: Users,
    },
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
      label: t('stats.leads'),
      value: formatNumber(stats.unhandledLeads, locale),
      hint: t('stats.leadsHint'),
      icon: Inbox,
      accent: 'destructive' as const,
    },
    {
      label: t('stats.newsletter'),
      value: formatNumber(stats.newsletterSignups, locale),
      hint: t('stats.newsletterHint'),
      icon: Mail,
    },
    {
      label: t('stats.aiUsage'),
      value: formatNumber(stats.aiUsage, locale),
      hint: t('stats.aiUsageHint'),
      icon: Sparkles,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((c) => (
        <StatCard
          key={c.label}
          label={c.label}
          value={c.value}
          hint={c.hint}
          icon={c.icon}
          accent={c.accent}
        />
      ))}
    </div>
  );
}
