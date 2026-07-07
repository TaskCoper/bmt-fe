'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'

/**
 * Newsletter signup (stakeholder Q&A §3.3.3). Double opt-in: submitting sends a
 * confirmation email. UI-first mock — no provider wired yet.
 */
export function NewsletterForm() {
  const t = useTranslations('landing.newsletter')
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setPending(true)
    setTimeout(() => {
      setPending(false)
      toast.success(t('success'))
      setEmail('')
    }, 700)
  }

  return (
    <div>
      <h3 className='text-sm font-semibold'>{t('title')}</h3>
      <p className='text-muted-foreground mt-2 text-sm'>{t('subtitle')}</p>
      <form onSubmit={onSubmit} className='mt-4 flex gap-2'>
        <Input
          type='email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          aria-label={t('title')}
        />
        <Button type='submit' size='icon' disabled={pending} aria-label={t('cta')}>
          {pending ? <Loader2 className='size-4 animate-spin' /> : <Send className='size-4' />}
        </Button>
      </form>
      <p className='text-muted-foreground mt-2 text-xs'>{t('optInNote')}</p>
    </div>
  )
}
