'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { ThemeToggle, LanguageSwitcher } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Separator } from '@/shared/components/ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'

const NOTIFICATION_KEYS = ['product', 'project', 'marketing'] as const

/** Account settings: appearance, notifications, security, danger zone. */
export function SettingsPanel() {
  const t = useTranslations('settings')

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    product: true,
    project: true,
    marketing: false,
  })
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })

  function changePassword() {
    if (pwd.next.length < 8) {
      toast.error(t('security.tooShort'))
      return
    }
    if (pwd.next !== pwd.confirm) {
      toast.error(t('security.mismatch'))
      return
    }
    setPwd({ current: '', next: '', confirm: '' })
    toast.success(t('security.changed'))
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>{t('appearance.title')}</CardTitle>
          <CardDescription>{t('appearance.hint')}</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <div>
              <p className="text-sm font-medium">{t('appearance.theme')}</p>
              <p className="text-muted-foreground text-sm">
                {t('appearance.themeHint')}
              </p>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between py-3 last:pb-0">
            <div>
              <p className="text-sm font-medium">{t('appearance.language')}</p>
              <p className="text-muted-foreground text-sm">
                {t('appearance.languageHint')}
              </p>
            </div>
            <LanguageSwitcher />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>{t('notifications.title')}</CardTitle>
          <CardDescription>{t('notifications.hint')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {NOTIFICATION_KEYS.map((key) => (
            <label
              key={key}
              className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-lg border p-3"
            >
              <Checkbox
                checked={notifications[key]}
                onCheckedChange={(v) =>
                  setNotifications((n) => ({ ...n, [key]: Boolean(v) }))
                }
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-medium">
                  {t(`notifications.${key}.label`)}
                </p>
                <p className="text-muted-foreground text-sm">
                  {t(`notifications.${key}.desc`)}
                </p>
              </div>
            </label>
          ))}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => toast.success(t('notifications.saved'))}
            >
              {t('notifications.save')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>{t('security.title')}</CardTitle>
          <CardDescription>{t('security.hint')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="current-pwd">{t('security.current')}</Label>
              <Input
                id="current-pwd"
                type="password"
                autoComplete="current-password"
                value={pwd.current}
                onChange={(e) =>
                  setPwd((p) => ({ ...p, current: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pwd">{t('security.new')}</Label>
              <Input
                id="new-pwd"
                type="password"
                autoComplete="new-password"
                value={pwd.next}
                onChange={(e) =>
                  setPwd((p) => ({ ...p, next: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pwd">{t('security.confirm')}</Label>
              <Input
                id="confirm-pwd"
                type="password"
                autoComplete="new-password"
                value={pwd.confirm}
                onChange={(e) =>
                  setPwd((p) => ({ ...p, confirm: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={changePassword}>{t('security.submit')}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">
            {t('danger.title')}
          </CardTitle>
          <CardDescription>{t('danger.hint')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">{t('danger.desc')}</p>
            <Button
              variant="destructive"
              onClick={() => toast.error(t('danger.confirm'))}
            >
              {t('danger.delete')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
