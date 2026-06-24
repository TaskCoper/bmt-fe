'use client';

import { useTranslations, useLocale } from 'next-intl';
import {
  FolderKanban,
  Calculator,
  Library,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';

import type { Locale } from '@/i18n/routing';
import { formatDate } from '@/shared/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useDashboard } from '../hooks/use-dashboard';
import type { ActivityItem } from '../types/dashboard.types';

const KIND_ICON: Record<ActivityItem['kind'], LucideIcon> = {
  project: FolderKanban,
  estimate: Calculator,
  library: Library,
  user: UserPlus,
};

/** Recent activity timeline for the dashboard. */
export function ActivityFeed() {
  const t = useTranslations('dashboard');
  const locale = useLocale() as Locale;
  const { data, isLoading } = useDashboard();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('activity')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading || !data
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))
          : data.activity.map((item) => {
              const Icon = KIND_ICON[item.kind];
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="bg-muted text-muted-foreground mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm">{item.message}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDate(item.at, locale, {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
      </CardContent>
    </Card>
  );
}
