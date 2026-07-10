import { Link } from '@/i18n/navigation'
import { Logo } from '@/shared/components/common'
import { ROUTES } from '@/shared/constants/routes'
import { ADMIN_COPY } from './admin.copy'

/**
 * Full-width top header for the admin area: brand wordmark + an "admin" chip.
 * Deliberately has NO locale or theme switcher — the back-office is
 * single-language (Vietnamese) and uses a single, fixed appearance.
 */
export function AdminHeader() {
  return (
    <header className='bg-background/80 sticky top-0 z-30 flex h-16 w-full shrink-0 items-center gap-3 border-b px-4 backdrop-blur-md lg:px-6'>
      <Link href={ROUTES.ADMIN} aria-label={ADMIN_COPY.root} className='flex items-center gap-2.5'>
        <Logo />
        <span className='bg-primary/10 text-primary hidden rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide sm:inline'>
          {ADMIN_COPY.badge}
        </span>
      </Link>
    </header>
  )
}
