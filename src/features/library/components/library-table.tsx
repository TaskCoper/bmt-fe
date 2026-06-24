'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Search } from 'lucide-react';

import type { Locale } from '@/i18n/routing';
import { formatCurrency } from '@/shared/utils';
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
import { useLibrary } from '../hooks/use-library';
import {
  LIBRARY_CATEGORY,
  type LibraryCategory,
} from '../constants/library.constants';
import type { LibraryFilters } from '../types/library.types';

const CATEGORY_VARIANT: Record<
  LibraryCategory,
  'default' | 'secondary' | 'outline'
> = {
  material: 'default',
  labor: 'secondary',
  equipment: 'outline',
};

const CATEGORY_OPTIONS = ['all', ...Object.values(LIBRARY_CATEGORY)] as const;

const INITIAL: LibraryFilters = { search: '', category: 'all', page: 1 };

export function LibraryTable() {
  const t = useTranslations('library');
  const tc = useTranslations('common');
  const te = useTranslations('errors');
  const locale = useLocale() as Locale;

  const [filters, setFilters] = useState<LibraryFilters>(INITIAL);
  const { data, isLoading, isError, refetch } = useLibrary(filters);

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
          value={filters.category}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              category: v as LibraryFilters['category'],
              page: 1,
            }))
          }
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((c) => (
              <SelectItem key={c} value={c}>
                {t(`category.${c}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
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
                  <TableHead className="w-28">{t('columns.code')}</TableHead>
                  <TableHead>{t('columns.name')}</TableHead>
                  <TableHead className="w-28">{t('columns.category')}</TableHead>
                  <TableHead className="w-20">{t('columns.unit')}</TableHead>
                  <TableHead className="text-right">
                    {t('columns.unitPrice')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {item.code}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant={CATEGORY_VARIANT[item.category]}>
                        {t(`category.${item.category}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.unit}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(item.unitPrice, locale)}
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
