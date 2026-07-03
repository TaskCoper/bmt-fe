'use client'

import { type ReactNode, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

import type { Locale } from '@/i18n/routing'
import { formatDate } from '@/shared/utils'
import { Badge } from '@/shared/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import type { UserRecord } from '../types/user.types'

/** Read-only user detail dialog (Q&A §7.2.1 — "xem chi tiết"). */
export function UserDetailDialog({
  trigger,
  user,
}: {
  trigger: ReactNode
  user: UserRecord
}) {
  const t = useTranslations('users')
  const [open, setOpen] = useState(false)
  const locale = useLocale() as Locale

  const rows: { label: string; value: ReactNode }[] = [
    { label: t('columns.email'), value: user.email },
    { label: t('columns.role'), value: t(`roles.${user.role}`) },
    {
      label: t('columns.status'),
      value: (
        <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
          {t(`status.${user.status}`)}
        </Badge>
      ),
    },
    {
      label: t('columns.createdAt'),
      value: formatDate(user.createdAt, locale),
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user.name}</DialogTitle>
          <DialogDescription>{t('detail.subtitle')}</DialogDescription>
        </DialogHeader>
        <dl className="divide-y">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-3 text-sm"
            >
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  )
}
