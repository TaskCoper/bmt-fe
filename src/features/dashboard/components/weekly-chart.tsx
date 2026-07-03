'use client'

import { useTranslations } from 'next-intl'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useDashboard } from '../hooks/use-dashboard'

/**
 * Projects vs. estimates created per week (last 8 weeks). Hand-rolled CSS bar
 * chart — keeps the bundle dependency-free, matching the studio donut.
 */
export function WeeklyChart() {
  const t = useTranslations('dashboard.weekly')
  const { data, isLoading } = useDashboard()

  if (isLoading || !data) {
    return <Skeleton className="h-72 w-full" />
  }

  const { weekly } = data
  const max = Math.max(
    1,
    ...weekly.map((w) => Math.max(w.projects, w.estimates)),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('title')}</CardTitle>
        <div className="text-muted-foreground flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="bg-chart-1 size-2.5 rounded-[2px]" />
            {t('projects')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="bg-chart-2 size-2.5 rounded-[2px]" />
            {t('estimates')}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-56 items-end justify-between gap-2">
          {weekly.map((w) => (
            <div
              key={w.label}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-full w-full items-end justify-center gap-1">
                <div
                  className="bg-chart-1 w-1/2 rounded-t-sm transition-all"
                  style={{ height: `${(w.projects / max) * 100}%` }}
                  title={`${t('projects')}: ${w.projects}`}
                />
                <div
                  className="bg-chart-2 w-1/2 rounded-t-sm transition-all"
                  style={{ height: `${(w.estimates / max) * 100}%` }}
                  title={`${t('estimates')}: ${w.estimates}`}
                />
              </div>
              <span className="text-muted-foreground text-[10px]">
                {w.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
