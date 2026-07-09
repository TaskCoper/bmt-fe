import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Facebook, Mail, MessageCircle, Phone, Send } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/shared/constants/routes'
import { Logo } from '@/shared/components/common'
import { siteConfig } from '@/shared/config/site'
import { LANDING_SECTIONS } from '../constants/landing.constants'
import { NewsletterForm } from './newsletter-form'

type LinkKey = 'services' | 'process' | 'projects' | 'about' | 'contact' | 'privacy' | 'terms'

interface FooterLink {
  key: LinkKey
  href: string
  /** Anchor links stay on the page; route links navigate. */
  external?: boolean
}

const PRODUCT_LINKS: FooterLink[] = [
  { key: 'services', href: `#${LANDING_SECTIONS.services}` },
  { key: 'process', href: `#${LANDING_SECTIONS.process}` },
  { key: 'projects', href: `#${LANDING_SECTIONS.projects}` }
]

const COMPANY_LINKS: FooterLink[] = [
  { key: 'about', href: `#${LANDING_SECTIONS.about}` },
  { key: 'contact', href: `#${LANDING_SECTIONS.contact}` }
]

const LEGAL_LINKS: FooterLink[] = [
  { key: 'privacy', href: ROUTES.PRIVACY, external: true },
  { key: 'terms', href: ROUTES.TERMS, external: true }
]

export function LandingFooter() {
  const t = useTranslations('landing.footer')
  const year = new Date().getFullYear()
  const { contact } = siteConfig

  const columns: { title: string; links: FooterLink[] }[] = [
    { title: t('productTitle'), links: PRODUCT_LINKS },
    { title: t('companyTitle'), links: COMPANY_LINKS },
    { title: t('legalTitle'), links: LEGAL_LINKS }
  ]

  return (
    <footer className='bg-muted/20 border-t'>
      <div className='mx-auto w-full max-w-7xl px-4 py-16 lg:px-8'>
        <div className='grid gap-10 md:grid-cols-12'>
          {/* Brand + contact + social */}
          <div className='md:col-span-4'>
            <Logo />
            <p className='text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed'>{t('tagline')}</p>

            <div className='mt-6 space-y-2.5 text-sm'>
              <a
                href={`tel:${contact.hotline.replace(/\s/g, '')}`}
                className='text-muted-foreground hover:text-foreground flex w-fit items-center gap-2.5 transition-colors'
              >
                <Phone className='text-primary size-4' />
                {contact.hotline}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className='text-muted-foreground hover:text-foreground flex w-fit items-center gap-2.5 transition-colors'
              >
                <Mail className='text-primary size-4' />
                {contact.email}
              </a>
            </div>

            <div className='mt-5 flex gap-2'>
              <SocialButton href={contact.facebookUrl} label='Facebook'>
                <Facebook className='size-4' />
              </SocialButton>
              <SocialButton href={contact.zaloUrl} label='Zalo'>
                <MessageCircle className='size-4' />
              </SocialButton>
              <SocialButton href={contact.messengerUrl} label='Messenger'>
                <Send className='size-4' />
              </SocialButton>
            </div>
          </div>

          {/* Link columns */}
          <div className='grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-5'>
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className='text-sm font-semibold'>{col.title}</h3>
                <ul className='mt-4 space-y-3'>
                  {col.links.map((link) => (
                    <li key={link.key}>
                      {link.external ? (
                        <Link
                          href={link.href}
                          className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                        >
                          {t(`links.${link.key}`)}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                        >
                          {t(`links.${link.key}`)}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className='md:col-span-3'>
            <NewsletterForm />
          </div>
        </div>

        <div className='mt-14 border-t pt-6'>
          <p className='text-muted-foreground text-sm'>
            © {year} {siteConfig.name}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}

/** Round social/contact icon button linking to an external channel. */
function SocialButton({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noreferrer'
      aria-label={label}
      className='border-glass-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 flex size-9 items-center justify-center rounded-full border transition-colors'
    >
      {children}
    </a>
  )
}
