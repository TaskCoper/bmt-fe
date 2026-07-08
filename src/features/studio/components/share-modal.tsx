'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Check, Copy, Share2, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

/** Share dialog: public link (copy), multi-email send, and a real QR code. */
export function ShareModal({ token }: { token: string }) {
  const t = useTranslations('studio.share')
  const tCommon = useTranslations('common')
  const [emails, setEmails] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const [revoked, setRevoked] = useState(false)

  // Build an absolute, locale-prefixed share URL for copy + QR.
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = `${origin}/vi/share/${token}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success(t('copied'))
    } catch {
      toast.error(t('copied'))
    }
  }

  const addEmail = () => {
    const value = draft.trim()
    if (!value || emails.includes(value)) return
    setEmails((e) => [...e, value])
    setDraft('')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="size-4" />
          {t('openButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel-strong border-0">
        <DialogHeader>
          <DialogTitle className="tracking-tight">
            {t('modalTitle')}
          </DialogTitle>
          <DialogDescription>{t('modalHint')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Public link */}
          <div className="space-y-2">
            <Label>{t('linkLabel')}</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={revoked ? '' : url}
                className="border-glass-border bg-background/40 text-xs backdrop-blur-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copy}
                disabled={revoked}
                className="border-glass-border bg-background/50 shrink-0 backdrop-blur transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-soft)]"
              >
                <Copy className="size-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {revoked ? (
                <>
                  <Badge variant="secondary">{t('revoked')}</Badge>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setRevoked(false)}
                  >
                    {t('recreate')}
                  </Button>
                </>
              ) : (
                <Button
                  variant="link"
                  size="sm"
                  className="text-destructive px-0"
                  onClick={() => setRevoked(true)}
                >
                  {t('revoke')}
                </Button>
              )}
            </div>
          </div>

          {/* Emails */}
          <div className="space-y-2">
            <Label>{t('emailLabel')}</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addEmail()
                  }
                }}
                placeholder={t('emailPlaceholder')}
              />
              <Button variant="outline" onClick={addEmail}>
                {t('emailAdd')}
              </Button>
            </div>
            {emails.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {emails.map((e) => (
                  <Badge key={e} variant="secondary" className="gap-1">
                    {e}
                    <button
                      type="button"
                      onClick={() =>
                        setEmails((prev) => prev.filter((x) => x !== e))
                      }
                      aria-label={tCommon('close')}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : null}
            <Button
              size="sm"
              disabled={emails.length === 0}
              onClick={() => toast.success(t('emailSent'))}
            >
              <Check className="size-4" />
              {t('emailSend')}
            </Button>
          </div>

          {/* QR */}
          {!revoked ? (
            <div className="space-y-2">
              <Label>{t('qrLabel')}</Label>
              <div className="border-glass-border w-fit rounded-xl border bg-white p-3 shadow-[0_1px_2px_oklch(0.3_0.03_60_/_0.06),0_10px_30px_-12px_oklch(0.3_0.03_60_/_0.2)]">
                <QRCodeSVG value={url} size={128} />
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
