'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import { Search, Check, Phone, Mail } from 'lucide-react';

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
import { useLeads, useMarkLeadHandled } from '../hooks/use-leads';
import { LEAD_STATUS } from '../constants/leads.constants';
import type { LeadFilters, LeadRecord } from '../types/lead.types';

const STATUS_VARIANT: Record<LeadRecord['status'], 'default' | 'success'> = {
  new: 'default',
  handled: 'success',
};

const STATUS_OPTIONS = ['all', ...Object.values(LEAD_STATUS)] as const;

const INITIAL: LeadFilters = { search: '', status: 'all', page: 1 };

/** Admin leads table: search + status filter + mark-as-handled action. */
export function LeadsTable() {
  const t = useTranslations('leads');
  const tc = useTranslations('common');
  const te = useTranslations('errors');
  const locale = useLocale() as Locale;

  const [filters, setFilters] = useState<LeadFilters>(INITIAL);
  const { data, isLoading, isError, refetch } = useLeads(filters);
  const markHandled = useMarkLeadHandled();

  const handle = (lead: LeadRecord) =>
    markHandled.mutate(lead.id, {
      onSuccess: () => toast.success(t('handledToast', { name: lead.name })),
    });

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
              status: v as LeadFilters['status'],
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
                {t(`statusFilter.${s}`)}
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
                  <TableHead>{t('columns.name')}</TableHead>
                  <TableHead>{t('columns.contact')}</TableHead>
                  <TableHead className="w-32">
                    {t('columns.needType')}
                  </TableHead>
                  <TableHead>{t('columns.message')}</TableHead>
                  <TableHead className="w-28">{t('columns.status')}</TableHead>
                  <TableHead className="w-32 text-right">
                    {t('columns.createdAt')}
                  </TableHead>
                  <TableHead className="w-28 text-right">
                    <span className="sr-only">{tc('actions')}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <span className="flex items-center gap-1.5">
                        <Phone className="size-3.5" />
                        {lead.phone}
                      </span>
                      {lead.email ? (
                        <span className="mt-0.5 flex items-center gap-1.5">
                          <Mail className="size-3.5" />
                          {lead.email}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {t(`needType.${lead.needType}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate text-sm">
                      {lead.message}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[lead.status]}>
                        {t(`status.${lead.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right text-sm">
                      {formatDate(lead.createdAt, locale)}
                    </TableCell>
                    <TableCell className="text-right">
                      {lead.status === LEAD_STATUS.NEW ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={markHandled.isPending}
                          onClick={() => handle(lead)}
                        >
                          <Check className="size-4" />
                          {t('markHandled')}
                        </Button>
                      ) : null}
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
