/**
 * Root namespaces for TanStack Query keys.
 *
 * Each feature composes its own keys under its namespace (see
 * `features/<feature>/api/<feature>.keys.ts`). Keeping the roots here prevents
 * collisions and makes cross-feature cache invalidation discoverable.
 */
export const QUERY_KEY_ROOTS = {
  auth: 'auth',
  projects: 'projects',
  estimates: 'estimates',
  library: 'library',
  chatbot: 'chatbot',
  cms: 'cms',
  users: 'users',
  profile: 'profile',
  settings: 'settings',
} as const;

export type QueryKeyRoot =
  (typeof QUERY_KEY_ROOTS)[keyof typeof QUERY_KEY_ROOTS];
