'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Search, FileCheck2, Clock, FileStack, Wallet } from 'lucide-react';

import type { Locale } from '@/i18n/routing';
import { formatCurrency, formatNumber } from '@/shared/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { EmptyState, ErrorState } from '@/shared/components/common';
import { useEstimates, useEstimateSummary } from '../hooks/use-estimates';
import {
  ESTIMATE_STATUS,
  type EstimateStatus,
} from '../constants/estimate.constants';
import type { EstimateFilters } from '../types/estimate.types';

const STATUS_VARIANT: Record<
  EstimateStatus,
  'default' | 'secondary' | 'success' | 'warning' | 'outline'
> = {
  draft: 'secondary',
  pending: 'warning',
  approved: 'success',
  rejected: 'outline',
};

const STATUS_OPTIONS = ['all', ...Object.values(ESTIMATE_STATUS)] as const;

const INITIAL: EstimateFilters = { search: '', status: 'all', page: 1 };

export function EstimateList() {
  const t = useTranslations('estimate');
  const tc = useTranslations('common');
  const te = useTranslations('errors');
  const locale = useLocale() as Locale;

  const [filters, setFilters] = useState<EstimateFilters>(INITIAL);
  const { data, isLoading, isError, refetch } = useEstimates(filters);
  const { data: summary } = useEstimateSummary();

  const summaryCards = [
    {
      label: t('summary.total'),
      value: summary ? formatNumber(summary.total, locale) : '—',
      icon: FileStack,
    },
    {
      label: t('summary.approved'),
      value: summary ? formatNumber(summary.approved, locale) : '—',
      icon: FileCheck2,
    },
    {
      label: t('summary.pending'),
      value: summary ? formatNumber(summary.pending, locale) : '—',
      icon: Clock,
    },
    {
      label: t('summary.totalValue'),
      value: summary ? formatCurrency(summary.totalValue, locale) : '—',
      icon: Wallet,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {c.label}
              </CardTitle>
              <c.icon className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">
                {c.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
            }
            placeholder={t('searchPlaceholder')}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.status}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              status: v as EstimateFilters['status'],
              page: 1,
            }))
          }
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {t(`status.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title={te('generic')}
          description={te('network')}
          retryLabel={tc('more')}
          onRetry={() => refetch()}
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          title={t('empty.title')}
          description={t('empty.description')}
        />
      ) : (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">{t('columns.code')}</TableHead>
                  <TableHead>{t('columns.name')}</TableHead>
                  <TableHead className="w-28">{t('columns.status')}</TableHead>
                  <TableHead className="text-right">
                    {t('columns.total')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {e.code}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{e.name}</div>
                      <div className="text-muted-foreground truncate text-sm">
                        {e.projectName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[e.status]}>
                        {t(`status.${e.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(e.total, locale)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {t('count', { count: data.meta.totalItems })}
            </p>
            {data.meta.totalPages > 1 ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.meta.page <= 1}
                  onClick={() =>
                    setFilters((f) => ({ ...f, page: f.page - 1 }))
                  }
                >
                  {tc('previous')}
                </Button>
                <span className="text-muted-foreground text-sm">
                  {tc('pageOf', {
                    page: data.meta.page,
                    total: data.meta.totalPages,
                  })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.meta.page >= data.meta.totalPages}
                  onClick={() =>
                    setFilters((f) => ({ ...f, page: f.page + 1 }))
                  }
                >
                  {tc('next')}
                </Button>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
