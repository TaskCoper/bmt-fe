'use client'

import { useTranslations } from 'next-intl'
import { MessageCircle, Phone } from 'lucide-react'

import { siteConfig } from '@/shared/config/site'
import { cn } from '@/shared/lib/utils'

/** Zalo brand mark (inline SVG — lucide has no Zalo icon). */
function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg viewBox='0 0 48 48' className={className} aria-hidden='true'>
      <path
        fill='currentColor'
        d='M24 4C12.5 4 3 12.4 3 22.8c0 5.9 3 11.1 7.8 14.6-.3 2.3-1.3 4.6-2.9 6.4-.4.5-.1 1.2.5 1.2 3.7-.2 7-1.5 9.7-3.4 2 .5 4.1.8 6.2.8 11.5 0 21-8.4 21-18.8C45 12.4 35.5 4 24 4z'
      />
    </svg>
  )
}

/**
 * Floating quick-contact buttons (Messenger, Zalo, hotline) shown on public
 * pages. Links come from {@link siteConfig.contact} (BMT to provide real URLs).
 */
export function FloatingContact() {
  const t = useTranslations('landing.floating')
  const { messengerUrl, zaloUrl, hotline } = siteConfig.contact

  const base =
    'flex size-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

  return (
    <div className='fixed right-4 bottom-4 z-50 flex flex-col gap-3'>
      <a
        href={messengerUrl}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={t('messenger')}
        title={t('messenger')}
        className={cn(base, 'bg-[#0084FF]')}
      >
        <MessageCircle className='size-6' />
      </a>
      <a
        href={zaloUrl}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={t('zalo')}
        title={t('zalo')}
        className={cn(base, 'bg-[#0068FF]')}
      >
        <ZaloIcon className='size-7' />
      </a>
      <a
        href={`tel:${hotline.replace(/\s/g, '')}`}
        aria-label={t('call')}
        title={t('call')}
        className={cn(base, 'bg-primary')}
      >
        <Phone className='size-5' />
      </a>
    </div>
  )
}
