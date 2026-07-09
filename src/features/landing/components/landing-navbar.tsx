'use client'

import { type ComponentType, type ReactNode, useSyncExternalStore } from 'react'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/shared/auth'
import { cn } from '@/shared/lib/utils'
import { LanguageSwitcher, Logo, ThemeToggle } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { ROUTES } from '@/shared/constants/routes'
import { Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { SiteSearch } from './site-search'

/** Stable no-op subscribe so `useSyncExternalStore` only distinguishes SSR vs client. */
const emptySubscribe = () => () => {}

/** Subscribe to window scroll so the header can reveal its background on scroll. */
const subscribeScroll = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true })
  return () => window.removeEventListener('scroll', onChange)
}
const getScrolled = () => window.scrollY > 8

interface LandingNavbarProps {
  /**
   * App-layer slot that wraps its children in the guest auth popup trigger.
   * `features/landing` may not import `features/auth`, so the app layer injects
   * this. When omitted, the CTA falls back to navigating to the `/login` route.
   */
  AuthTrigger?: ComponentType<{ children: ReactNode; className?: string }>
  /** App-layer account dropdown, shown instead of the CTA once signed in. */
  UserMenu?: ComponentType
}

/** Public landing header: in-page anchor nav, locale/theme switchers, auth. */
export function LandingNavbar({ AuthTrigger, UserMenu }: LandingNavbarProps = {}) {
  const t = useTranslations('landing.nav')
  const tAuth = useTranslations('auth.login')
  const { isAuthenticated } = useAuth()

  // Auth state is client-only; gate on hydration so SSR and first paint match.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const authed = mounted && isAuthenticated

  // Transparent at the very top; reveal the glass background once scrolled.
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, () => false)

  const renderCta = (className: string) =>
    AuthTrigger ? (
      <AuthTrigger className={className}>{tAuth('submit')}</AuthTrigger>
    ) : (
      <Button asChild size='sm' className={className}>
        <Link href={ROUTES.LOGIN}>{tAuth('submit')}</Link>
      </Button>
    )

  return (
    <header className='sticky top-3 z-40 px-3 sm:top-4 sm:px-4'>
      <div
        className={cn(
          'mx-auto flex h-14 w-full max-w-6xl items-center gap-4 rounded-2xl border px-3 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 sm:px-4',
          scrolled
            ? 'border-glass-border bg-background/65 shadow-[0_10px_34px_-14px_oklch(0.3_0.03_60_/_0.4)] backdrop-blur-xl backdrop-saturate-150'
            : 'border-transparent bg-transparent'
        )}
      >
        <Link href={ROUTES.HOME} aria-label='BMT AI Construction' className='shrink-0'>
          <Logo />
        </Link>

        <nav className='hidden items-center gap-1 md:flex'>
          <Link
            href={ROUTES.PORTFOLIO}
            className='text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] rounded-lg px-3 py-2 text-sm font-medium transition-colors'
          >
            {t('projects')}
          </Link>
          <Link
            href={ROUTES.GALLERY}
            className='text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] rounded-lg px-3 py-2 text-sm font-medium transition-colors'
          >
            {t('library')}
          </Link>
        </nav>

        <div className='ml-auto flex items-center gap-1.5'>
          <div className='mr-1 hidden lg:block'>
            <SiteSearch />
          </div>
          <LanguageSwitcher />
          <ThemeToggle />
          {authed && UserMenu ? <UserMenu /> : renderCta('hidden sm:inline-flex')}

          {/* Mobile menu */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden' aria-label='Open menu'>
                <Menu className='size-5' />
              </Button>
            </DialogTrigger>
            <DialogContent className='data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right top-0 right-0 left-auto h-full max-w-xs translate-x-0 translate-y-0 rounded-none border-l'>
              <DialogTitle className='sr-only'>Menu</DialogTitle>
              <Logo className='mb-4' />
              <nav className='flex flex-col gap-1'>
                <DialogClose asChild>
                  <Link href={ROUTES.PORTFOLIO} className='hover:bg-accent rounded-md px-3 py-2 text-sm font-medium'>
                    {t('projects')}
                  </Link>
                </DialogClose>
                <DialogClose asChild>
                  <Link href={ROUTES.GALLERY} className='hover:bg-accent rounded-md px-3 py-2 text-sm font-medium'>
                    {t('library')}
                  </Link>
                </DialogClose>
              </nav>
              {!authed && <div className='mt-4'>{renderCta('w-full')}</div>}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}
