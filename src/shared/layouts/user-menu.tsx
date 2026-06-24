'use client';

import { useTranslations } from 'next-intl';
import { LogOut, User, Settings } from 'lucide-react';

import { Link, useRouter } from '@/i18n/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { getInitials } from '@/shared/utils';
import { useAuth, useAuthStore } from '@/shared/auth';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface UserMenuProps {
  /**
   * Logout handler. Defaults to clearing client auth state and redirecting to
   * login. The auth feature should pass a handler that also calls the backend
   * `/auth/logout` endpoint before clearing state.
   */
  onLogout?: () => void;
}

export function UserMenu({ onLogout }: UserMenuProps) {
  const t = useTranslations('nav');
  const { user } = useAuth();
  const router = useRouter();

  function handleLogout() {
    if (onLogout) {
      onLogout();
      return;
    }
    useAuthStore.getState().reset();
    router.replace(ROUTES.LOGIN);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-9 rounded-full p-0"
          aria-label={user?.name ?? 'Account'}
        >
          <Avatar className="size-9">
            <AvatarImage src={user?.avatarUrl} alt={user?.name ?? ''} />
            <AvatarFallback>
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate font-medium">{user?.name}</span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={ROUTES.PROFILE}>
            <User className="size-4" />
            {t('profile')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.SETTINGS}>
            <Settings className="size-4" />
            {t('settings')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut className="size-4" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
