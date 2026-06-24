/**
 * Public API of the `auth` feature.
 * Auth INFRASTRUCTURE (store, guards, roles) lives in `@/shared/auth`; this
 * feature owns the auth FLOWS (forms, API calls, session hooks).
 */
export { LoginForm } from './components/login-form';
export { AuthBootstrap } from './components/auth-bootstrap';
export { useLogin } from './hooks/use-login';
export { useLogout } from './hooks/use-logout';
export { useCurrentUser } from './hooks/use-current-user';
export { authApi } from './api/auth.api';
export { authKeys } from './api/auth.keys';
export {
  createLoginSchema,
  type LoginFormValues,
  type LoginSchemaMessages,
} from './schemas/login.schema';
export type { LoginPayload, LoginResponse } from './types/auth.types';
