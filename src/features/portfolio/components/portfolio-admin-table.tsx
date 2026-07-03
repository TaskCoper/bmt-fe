'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

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
import { Skeleton } from '@/shared/components/ui/skeleton';
import { EmptyState } from '@/shared/components/common';
import { usePortfolioAdmin } from '../hooks/use-portfolio';
import type { PortfolioFilters, PortfolioItem } from '../types/portfolio.types';
import { PortfolioFormDialog } from './portfolio-form-dialog';

const INITIAL: PortfolioFilters = { category: 'all', page: 1 };

/** Admin management table for portfolio projects (Q&A §3.1.2 / CMS). */
export function PortfolioAdminTable() {
  const t = useTranslations('portfolio');
  const tForm = useTranslations('portfolio.form');
  const tc = useTranslations('common');

  const [filters, setFilters] = useState<PortfolioFilters>(INITIAL);
  const { data, isLoading } = usePortfolioAdmin(filters);

  const togglePublish = (item: PortfolioItem) =>
    toast.success(
      item.published
        ? tForm('hidden', { title: item.title })
        : tForm('publishedToast', { title: item.title }),
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <PortfolioFormDialog
          trigger={
            <Button>
              <Plus className="size-4" />
              {tForm('add')}
            </Button>
          }
        />
      </div>

      {isLoading || !data ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : data.items.length === 0 ? (
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
                  <TableHead className="w-14" />
                  <TableHead>{tForm('titleLabel')}</TableHead>
                  <TableHead className="w-32">
                    {tForm('categoryLabel')}
                  </TableHead>
                  <TableHead className="w-28">{tForm('statusLabel')}</TableHead>
                  <TableHead className="w-28 text-right">
                    <span className="sr-only">{tc('actions')}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div
                        className="size-9 rounded-md"
                        style={{
                          background: `linear-gradient(135deg, hsl(${item.coverHue} 65% 55%), hsl(${(item.coverHue + 45) % 360} 60% 38%))`,
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {t(`category.${item.category}`)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.published ? 'success' : 'secondary'}>
                        {item.published ? tForm('published') : tForm('draft')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={tForm('togglePublish')}
                          onClick={() => togglePublish(item)}
                        >
                          {item.published ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                        <PortfolioFormDialog
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
                              tForm('deleted', { title: item.title }),
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
