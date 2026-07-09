'use client'

import { LayoutDashboard, LogOut, Settings, UserRound } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import type { AuthUser } from '@/shared/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu'
import { ROUTES } from '@/shared/constants/routes'

/** Two-letter initials for the avatar fallback (first + last word). */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0]![0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? '') : ''
  return (first + last).toUpperCase()
}

/**
 * Authenticated account dropdown (avatar trigger). Used in public headers where
 * a logged-in visitor should see their account, not the login CTA. Logout is
 * wired by the app layer (the auth feature owns the flow).
 */
export function AccountMenu({
  user,
  onLogout
}: {
  user: Pick<AuthUser, 'name' | 'email' | 'avatarUrl'>
  onLogout?: () => void
}) {
  const t = useTranslations('nav')
  const initials = initialsOf(user.name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-full' aria-label={user.name}>
          <Avatar className='size-8'>
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel className='flex flex-col'>
          <span className='truncate text-sm font-medium'>{user.name}</span>
          <span className='text-muted-foreground truncate text-xs font-normal'>{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={ROUTES.DASHBOARD}>
            <LayoutDashboard />
            {t('dashboard')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.PROFILE}>
            <UserRound />
            {t('profile')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.SETTINGS}>
            <Settings />
            {t('settings')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
