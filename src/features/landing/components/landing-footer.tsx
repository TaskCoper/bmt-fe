import { useTranslations } from 'next-intl'

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

  const columns: { title: string; links: FooterLink[] }[] = [
    { title: t('productTitle'), links: PRODUCT_LINKS },
    { title: t('companyTitle'), links: COMPANY_LINKS },
    { title: t('legalTitle'), links: LEGAL_LINKS }
  ]

  return (
    <footer className='border-t'>
      <div className='mx-auto w-full max-w-7xl px-4 py-14 lg:px-8'>
        <div className='grid grid-cols-2 gap-10 md:grid-cols-6'>
          <div className='col-span-2'>
            <Logo />
            <p className='text-muted-foreground mt-4 max-w-xs text-sm'>{t('tagline')}</p>
          </div>
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
          <div className='col-span-2 md:col-span-1'>
            <NewsletterForm />
          </div>
        </div>
        <div className='text-muted-foreground mt-12 border-t pt-6 text-sm'>
          © {year} {siteConfig.name}. {t('rights')}
        </div>
      </div>
    </footer>
  )
}
