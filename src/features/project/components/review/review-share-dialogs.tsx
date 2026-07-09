'use client'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea
} from '@/shared/components/ui'
import { Check, Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

interface ShareLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shareUrl: string
}

export function ShareLinkDialog({ open, onOpenChange, shareUrl }: ShareLinkDialogProps) {
  const t = useTranslations('project.form.review.share')
  const [copied, setCopied] = useState(false)

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(shareUrl)}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='share-url' className='text-xs'>
              {t('linkLabel')}
            </Label>
            <div className='flex gap-2'>
              <Input id='share-url' value={shareUrl} readOnly className='font-mono text-xs' />
              <Button type='button' variant='outline' onClick={handleCopy}>
                {copied ? <Check className='size-4' /> : <Copy className='size-4' />}
                {copied ? t('copied') : t('copy')}
              </Button>
            </div>
          </div>

          <div className='bg-muted/40 flex items-center gap-4 rounded-md border p-4'>
            <div className='bg-background grid size-32 shrink-0 place-items-center rounded-md border'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrSrc} alt={t('qrTitle')} width={112} height={112} className='size-28' />
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-semibold'>{t('qrTitle')}</p>
              <p className='text-muted-foreground text-xs'>{t('qrCaption')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface SendEmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SendEmailDialog({ open, onOpenChange }: SendEmailDialogProps) {
  const t = useTranslations('project.form.review.email')
  const tc = useTranslations('common')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (!email.trim()) return
    toast.success(t('sent', { email: email.trim() }))
    onOpenChange(false)
    setEmail('')
    setMessage('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className='space-y-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='email-recipient' className='text-xs'>
              {t('recipientLabel')}
            </Label>
            <Input
              id='email-recipient'
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('recipientPlaceholder')}
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='email-message' className='text-xs'>
              {t('messageLabel')}
            </Label>
            <Textarea
              id='email-message'
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={t('messagePlaceholder')}
            />
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              {tc('cancel')}
            </Button>
            <Button type='button' onClick={handleSend} disabled={!email.trim()}>
              {t('send')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
