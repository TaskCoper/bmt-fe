'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import { Search, Info, History, Plus, Pencil, Trash2 } from 'lucide-react';

import type { Locale } from '@/i18n/routing';
import { formatCurrency, formatDate } from '@/shared/utils';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { EmptyState, ErrorState } from '@/shared/components/common';
import { PriceFormDialog } from './price-form-dialog';
import { useLibrary } from '../hooks/use-library';
import {
  LIBRARY_CATEGORY,
  PRICE_REGION,
  type LibraryCategory,
} from '../constants/library.constants';
import type { LibraryFilters, LibraryItem } from '../types/library.types';

const CATEGORY_VARIANT: Record<
  LibraryCategory,
  'default' | 'secondary' | 'outline'
> = {
  material: 'default',
  labor: 'secondary',
  equipment: 'outline',
};

const CATEGORY_OPTIONS = ['all', ...Object.values(LIBRARY_CATEGORY)] as const;
const REGION_OPTIONS = ['all', ...Object.values(PRICE_REGION)] as const;
const PACKAGES = ['basic', 'standard', 'premium'] as const;

const INITIAL: LibraryFilters = {
  search: '',
  category: 'all',
  region: 'all',
  page: 1,
};

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
        <Select
          value={filters.region}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              region: v as LibraryFilters['region'],
              page: 1,
            }))
          }
        >
          <SelectTrigger className="sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REGION_OPTIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {t(`region.${r}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <PriceFormDialog
          trigger={
            <Button>
              <Plus className="size-4" />
              {t('form.add')}
            </Button>
          }
        />
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
                  <TableHead className="w-28">{t('columns.code')}</TableHead>
                  <TableHead>{t('columns.name')}</TableHead>
                  <TableHead className="w-28">
                    {t('columns.category')}
                  </TableHead>
                  <TableHead className="w-28">{t('columns.region')}</TableHead>
                  <TableHead className="w-20">{t('columns.unit')}</TableHead>
                  <TableHead className="text-right">
                    {t('columns.unitPrice')}
                  </TableHead>
                  <TableHead className="w-20 text-right">
                    <span className="sr-only">{tc('actions')}</span>
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
                    <TableCell>
                      <Badge variant="outline">
                        {t(`region.${item.region}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.unit}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(item.unitPrice, locale)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <DetailTooltip category={item.category} />
                        <HistoryPopover item={item} locale={locale} />
                        <PriceFormDialog
                          item={item}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={tc('edit')}
                            >
                              <Pencil className="size-4" />
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={tc('delete')}
                          onClick={() =>
                            toast.success(
                              t('form.deleted', { name: item.name }),
                            )
                          }
                        >
                          <Trash2 className="text-destructive size-4" />
                        </Button>
                      </div>
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

/** Bilingual material-by-package + method + note tooltip (Q&A §5.2.3). */
function DetailTooltip({ category }: { category: LibraryCategory }) {
  const t = useTranslations('library');

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('detail.title')}>
          <Info className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs space-y-1.5 text-left">
        <p className="font-medium">{t('detail.title')}</p>
        <ul className="space-y-0.5">
          {PACKAGES.map((p) => (
            <li key={p} className="flex justify-between gap-3">
              <span className="opacity-70">{t(`detail.package.${p}`)}:</span>
              <span>{t(`detail.${category}.materials.${p}`)}</span>
            </li>
          ))}
        </ul>
        <p>
          <span className="opacity-70">{t('detail.methodLabel')}: </span>
          {t(`detail.${category}.method`)}
        </p>
        <p>
          <span className="opacity-70">{t('detail.noteLabel')}: </span>
          {t(`detail.${category}.note`)}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

/** Price-change history popover (Q&A §5.2.2 — old projects keep their price). */
function HistoryPopover({
  item,
  locale,
}: {
  item: LibraryItem;
  locale: Locale;
}) {
  const t = useTranslations('library');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('history.title')}>
          <History className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <p className="mb-2 text-sm font-medium">{t('history.title')}</p>
        <ul className="space-y-1.5">
          {[...item.priceHistory].reverse().map((pt, i) => (
            <li
              key={pt.date}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">
                {formatDate(pt.date, locale)}
                {i === 0 ? ` · ${t('history.current')}` : ''}
              </span>
              <span className="tabular-nums">
                {formatCurrency(pt.price, locale)}
              </span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
