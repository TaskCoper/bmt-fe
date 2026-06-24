'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Search } from 'lucide-react';

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
import { useProjects } from '../hooks/use-projects';
import { useProjectFiltersStore } from '../store/project-filters.store';
import { PROJECT_STATUS, type ProjectStatus } from '../constants/project.constants';

const STATUS_VARIANT: Record<
  ProjectStatus,
  'default' | 'secondary' | 'success' | 'warning' | 'outline'
> = {
  draft: 'secondary',
  active: 'success',
  on_hold: 'warning',
  completed: 'default',
  archived: 'outline',
};

const STATUS_OPTIONS = ['all', ...Object.values(PROJECT_STATUS)] as const;

/**
 * Project list: toolbar (search + status filter) → full UX state matrix
 * (loading skeletons / error / empty / data table) → pagination.
 */
export function ProjectList() {
  const t = useTranslations('project');
  const tc = useTranslations('common');
  const te = useTranslations('errors');
  const locale = useLocale() as Locale;

  const filters = useProjectFiltersStore((s) => s.filters);
  const setSearch = useProjectFiltersStore((s) => s.setSearch);
  const setStatus = useProjectFiltersStore((s) => s.setStatus);
  const setPage = useProjectFiltersStore((s) => s.setPage);

  const { data, isLoading, isError, refetch, isFetching } = useProjects();

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.status}
          onValueChange={(v) => setStatus(v as typeof filters.status)}
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
        <EmptyState title={t('empty.title')} description={t('empty.description')} />
      ) : (
        <>
          <div
            className="rounded-lg border"
            data-fetching={isFetching ? '' : undefined}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('columns.name')}</TableHead>
                  <TableHead className="w-36">{t('columns.status')}</TableHead>
                  <TableHead className="w-32 text-right">
                    {t('columns.updated')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="font-medium">{project.name}</div>
                      {project.description ? (
                        <div className="text-muted-foreground truncate text-sm">
                          {project.description}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[project.status]}>
                        {t(`status.${project.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right text-sm">
                      {formatDate(project.updatedAt, locale)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
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
                  onClick={() => setPage(data.meta.page - 1)}
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
                  onClick={() => setPage(data.meta.page + 1)}
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
