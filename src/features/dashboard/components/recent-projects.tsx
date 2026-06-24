'use client';

import { useTranslations, useLocale } from 'next-intl';

import type { Locale } from '@/i18n/routing';
import { formatDate } from '@/shared/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useDashboard } from '../hooks/use-dashboard';
import type { RecentProjectStatus } from '../types/dashboard.types';

const STATUS_VARIANT: Record<
  RecentProjectStatus,
  'default' | 'secondary' | 'success' | 'warning' | 'outline'
> = {
  draft: 'secondary',
  active: 'success',
  on_hold: 'warning',
  completed: 'default',
  archived: 'outline',
};

/** Compact "recently updated projects" card for the dashboard. */
export function RecentProjects() {
  const t = useTranslations('dashboard');
  const tp = useTranslations('project');
  const locale = useLocale() as Locale;
  const { data, isLoading } = useDashboard();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('recentProjects')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading || !data
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))
          : data.recentProjects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 border-b py-2 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDate(p.updatedAt, locale)}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[p.status]}>
                  {tp(`status.${p.status}`)}
                </Badge>
              </div>
            ))}
      </CardContent>
    </Card>
  );
}
