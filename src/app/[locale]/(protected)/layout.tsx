import { ProtectedRoute } from '@/shared/auth'
import type { ReactNode } from 'react'

export default function ProtectedGroupLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
