'use client'

import type { ReactNode } from 'react'
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

  return (
    <div className='fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3.5'>
      <FloatingButton
        href={messengerUrl}
        label={t('messenger')}
        external
        className='bg-[#0084FF]'
        glow='shadow-[0_10px_26px_-8px_#0084ffcc]'
      >
        <MessageCircle className='size-6' />
      </FloatingButton>

      <FloatingButton
        href={zaloUrl}
        label={t('zalo')}
        external
        className='bg-[#0068FF]'
        glow='shadow-[0_10px_26px_-8px_#0068ffcc]'
      >
        <ZaloIcon className='size-7' />
      </FloatingButton>

      <FloatingButton
        href={`tel:${hotline.replace(/\s/g, '')}`}
        label={t('call')}
        className='bg-primary'
        glow='shadow-[0_10px_26px_-8px_oklch(0.77_0.155_65_/_0.7)]'
        pulse
      >
        <Phone className='size-5' />
      </FloatingButton>
    </div>
  )
}

interface FloatingButtonProps {
  href: string
  label: string
  /** Brand background utility (e.g. `bg-[#0084FF]`). */
  className: string
  /** Coloured drop-shadow utility. */
  glow: string
  external?: boolean
  /** Emit an attention-grabbing pulse ring (hotline). */
  pulse?: boolean
  children: ReactNode
}

/** A single floating action button with a hover label + coloured glow. */
function FloatingButton({ href, label, className, glow, external, pulse, children }: FloatingButtonProps) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className='group/fab flex items-center justify-end gap-3 focus-visible:outline-none'
    >
      {/* Hover-reveal label pill */}
      <span className='bg-foreground text-background pointer-events-none origin-right translate-x-1 scale-95 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap opacity-0 shadow-md transition-all duration-200 group-hover/fab:translate-x-0 group-hover/fab:scale-100 group-hover/fab:opacity-100'>
        {label}
      </span>

      {/* Button */}
      <span
        className={cn(
          'relative flex size-12 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover/fab:scale-110',
          className,
          glow
        )}
      >
        {pulse ? (
          <span className={cn('absolute inset-0 -z-10 animate-ping rounded-full opacity-70', className)} />
        ) : null}
        {children}
      </span>
    </a>
  )
}
