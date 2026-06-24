/**
 * Centralized, type-safe route map (locale-agnostic).
 *
 * next-intl's `Link`/`useRouter` add the locale prefix automatically, so
 * paths here are written WITHOUT a leading locale segment.
 */
export const ROUTES = {
  // Landing
  HOME: '/',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Dashboard (protected)
  DASHBOARD: '/dashboard',
  PROJECTS: '/dashboard/projects',
  ESTIMATES: '/dashboard/estimates',
  LIBRARY: '/dashboard/library',
  CHATBOT: '/dashboard/chatbot',
  CMS: '/dashboard/cms',
  USERS: '/dashboard/users',

  // Account
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/** Routes a guest may NOT access once authenticated (redirect to dashboard). */
export const GUEST_ONLY_ROUTES: readonly string[] = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
];

/** Route prefixes that require authentication. */
export const PROTECTED_ROUTE_PREFIXES: readonly string[] = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.SETTINGS,
];
