'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Search, Plus } from 'lucide-react';

import type { Locale } from '@/i18n/routing';
import { formatDate } from '@/shared/utils';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { EmptyState, ErrorState } from '@/shared/components/common';
import { useContent } from '../hooks/use-content';
import {
  CONTENT_STATUS,
  type ContentStatus,
} from '../constants/cms.constants';
import type { ContentFilters } from '../types/cms.types';

const STATUS_VARIANT: Record<
  ContentStatus,
  'default' | 'secondary' | 'success' | 'warning'
> = {
  published: 'success',
  draft: 'secondary',
  scheduled: 'warning',
};

const STATUS_OPTIONS = ['all', ...Object.values(CONTENT_STATUS)] as const;

const INITIAL: ContentFilters = { search: '', status: 'all', page: 1 };

export function ContentTable() {
  const t = useTranslations('cms');
  const tc = useTranslations('common');
  const te = useTranslations('errors');
  const locale = useLocale() as Locale;

  const [filters, setFilters] = useState<ContentFilters>(INITIAL);
  const { data, isLoading, isError, refetch } = useContent(filters);

  return (
    <div className="space-y-4">
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
              status: v as ContentFilters['status'],
              page: 1,
            }))
          }
        >
          <SelectTrigger className="sm:w-44">
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
        <Button>
          <Plus className="size-4" />
          {t('create')}
        </Button>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
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
        <EmptyState title={t('empty.title')} description={t('empty.description')} />
      ) : (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('columns.title')}</TableHead>
                  <TableHead className="w-24">{t('columns.type')}</TableHead>
                  <TableHead className="w-28">{t('columns.status')}</TableHead>
                  <TableHead className="w-36">{t('columns.author')}</TableHead>
                  <TableHead className="w-32 text-right">
                    {t('columns.updated')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {t(`type.${c.type}`)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[c.status]}>
                        {t(`status.${c.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.author}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right text-sm">
                      {formatDate(c.updatedAt, locale)}
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
