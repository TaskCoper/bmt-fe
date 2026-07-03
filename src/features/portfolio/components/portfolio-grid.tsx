'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, MapPin } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { EmptyState } from '@/shared/components/common';
import { usePortfolio } from '../hooks/use-portfolio';
import { PORTFOLIO_CATEGORY } from '../constants/portfolio.constants';
import type { PortfolioFilters } from '../types/portfolio.types';

const CATEGORY_OPTIONS = ['all', ...Object.values(PORTFOLIO_CATEGORY)] as const;

/** Public portfolio grid with a category filter (Q&A §3.1.2). */
export function PortfolioGrid() {
  const t = useTranslations('portfolio');
  const [filters, setFilters] = useState<PortfolioFilters>({
    category: 'all',
    page: 1,
  });
  const { data, isLoading } = usePortfolio(filters);

  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_OPTIONS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilters({ category: c, page: 1 })}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              filters.category === c
                ? 'bg-primary text-primary-foreground border-primary'
                : 'hover:bg-muted',
            )}
          >
            {t(`category.${c}`)}
          </button>
        ))}
      </div>

      {isLoading || !data ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      ) : data.items.length === 0 ? (
        <EmptyState
          title={t('empty.title')}
          description={t('empty.description')}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item) => (
            <Link
              key={item.id}
              href={`${ROUTES.PORTFOLIO}/${item.slug}`}
              className="group overflow-hidden rounded-xl border transition-shadow hover:shadow-lg"
            >
              <div
                className="aspect-[4/3] w-full"
                style={{
                  background: `linear-gradient(135deg, hsl(${item.coverHue} 65% 55%), hsl(${(item.coverHue + 45) % 360} 60% 38%))`,
                }}
              />
              <div className="space-y-2 p-4">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline">
                    {t(`category.${item.category}`)}
                  </Badge>
                  <Badge variant="secondary">{item.style}</Badge>
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {item.summary}
                </p>
                <div className="text-muted-foreground flex items-center justify-between pt-1 text-xs">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {item.location}
                  </span>
                  <span className="text-foreground inline-flex items-center gap-1 font-medium group-hover:underline">
                    {t('viewDetail')}
                    <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
