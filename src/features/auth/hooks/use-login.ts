'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useRouter } from '@/i18n/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/auth';
import { isApiError } from '@/shared/lib/api';
import { authApi } from '../api/auth.api';
import { authKeys } from '../api/auth.keys';
import type { LoginPayload } from '../types/auth.types';

/**
 * Login mutation: calls the backend, seeds the auth store + query cache, then
 * redirects. Errors are normalized to {@link ApiError} by the HTTP layer.
 */
export function useLogin(redirectTo: string = ROUTES.DASHBOARD) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: ({ user }) => {
      setUser(user);
      queryClient.setQueryData(authKeys.currentUser(), user);
      router.replace(redirectTo);
    },
    onError: (error) => {
      toast.error(
        isApiError(error) ? error.message : 'Unable to sign in. Try again.',
      );
    },
  });
}
