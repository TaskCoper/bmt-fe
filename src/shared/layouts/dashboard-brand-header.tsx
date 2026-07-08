import { Link } from '@/i18n/navigation'
import { LanguageSwitcher, Logo, ThemeToggle } from '@/shared/components/common'
import { ROUTES } from '@/shared/constants/routes'

/**
 * Full-width top header for the dashboard: brand wordmark on the left,
 * locale + theme switchers on the right (same shape as the auth/login header).
 * The sidebar is offset to sit below this bar.
 */
export function DashboardBrandHeader() {
  return (
    <header className='bg-background sticky top-0 z-30 flex h-16 w-full shrink-0 items-center gap-4 border-b px-4 lg:px-6'>
      <Link href={ROUTES.HOME} aria-label='Home'>
        <Logo />
      </Link>
      <div className='ml-auto flex items-center gap-1'>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  )
}
