'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Search, UserPlus } from 'lucide-react';

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
import { EmptyState, ErrorState } from '@/shared/components/common';
import type { Role } from '@/shared/auth';
import { useUsers } from '../hooks/use-users';
import type { UserRecord, UserFilters } from '../types/user.types';

const ROLE_VARIANT: Record<Role, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  user: 'secondary',
  guest: 'outline',
};

const STATUS_VARIANT: Record<UserRecord['status'], 'success' | 'secondary'> = {
  active: 'success',
  inactive: 'secondary',
};

const INITIAL: UserFilters = { search: '', page: 1 };

/** Admin-only users table: search + full UX state matrix + pagination. */
export function UserTable() {
  const t = useTranslations('users');
  const tc = useTranslations('common');
  const te = useTranslations('errors');
  const locale = useLocale() as Locale;

  const [filters, setFilters] = useState<UserFilters>(INITIAL);
  const { data, isLoading, isError, refetch } = useUsers(filters);

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
        <Button>
          <UserPlus className="size-4" />
          {t('invite')}
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
                  <TableHead>{t('columns.name')}</TableHead>
                  <TableHead>{t('columns.email')}</TableHead>
                  <TableHead className="w-28">{t('columns.role')}</TableHead>
                  <TableHead className="w-28">{t('columns.status')}</TableHead>
                  <TableHead className="w-32 text-right">
                    {t('columns.createdAt')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={ROLE_VARIANT[user.role]}>
                        {t(`roles.${user.role}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[user.status]}>
                        {t(`status.${user.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right text-sm">
                      {formatDate(user.createdAt, locale)}
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
                  onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
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
                  onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
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
