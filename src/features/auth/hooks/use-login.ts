'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useRouter } from '@/i18n/navigation'
import { useAuthDialogStore, useAuthStore } from '@/shared/auth'
import { isApiError } from '@/shared/lib/api'
import { authApi } from '../api/auth.api'
import { authKeys } from '../api/auth.keys'
import type { LoginPayload } from '../types/auth.types'

/**
 * Login mutation: calls the backend, seeds the auth store + query cache. After
 * success it resumes any pending gated action (e.g. a gallery download/view),
 * else honours an explicit `redirectTo`, else stays on the current page — it no
 * longer forces the dashboard. Errors are normalized to {@link ApiError}.
 */
export function useLogin(redirectTo?: string) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  const closeAuthDialog = useAuthDialogStore((s) => s.close)
  const consumePendingAction = useAuthDialogStore((s) => s.consumePendingAction)

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: ({ user }) => {
      setUser(user)
      queryClient.setQueryData(authKeys.currentUser(), user)
      // Consume the pending action BEFORE closing (close() clears it).
      const pending = consumePendingAction()
      closeAuthDialog()
      if (pending) pending()
      else if (redirectTo) router.replace(redirectTo)
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : 'Unable to sign in. Try again.')
    }
  })
}
