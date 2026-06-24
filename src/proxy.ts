import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import {
  GUEST_ONLY_ROUTES,
  PROTECTED_ROUTE_PREFIXES,
} from '@/shared/constants/routes';
import { AUTH_COOKIE_NAME } from '@/shared/auth/auth.constants';

const intlMiddleware = createMiddleware(routing);

/**
 * Strip the leading locale segment so route-guard checks operate on
 * locale-agnostic paths (e.g. `/vi/dashboard` -> `/dashboard`).
 */
function stripLocale(pathname: string): string {
  const segments = pathname.split('/');
  if (routing.locales.includes(segments[1] as never)) {
    const rest = '/' + segments.slice(2).join('/');
    return rest === '/' ? '/' : rest.replace(/\/$/, '');
  }
  return pathname;
}

function matchesPrefix(path: string, prefixes: readonly string[]): boolean {
  return prefixes.some((p) => path === p || path.startsWith(`${p}/`));
}

/**
 * Composite proxy (formerly `middleware` — renamed for the Next.js 16
 * file convention):
 *  1. Resolve locale & rewrite via next-intl.
 *  2. Apply auth route guards based on the presence of the auth cookie set
 *     by the .NET backend. (Infrastructure only — no token verification here;
 *     authorization is enforced server-side by the API.)
 */
export default function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  const { pathname } = request.nextUrl;
  const path = stripLocale(pathname);
  const locale = pathname.split('/')[1] || routing.defaultLocale;
  const isAuthenticated = request.cookies.has(AUTH_COOKIE_NAME);

  // Block protected routes for unauthenticated users.
  if (matchesPrefix(path, PROTECTED_ROUTE_PREFIXES) && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  // Keep authenticated users away from guest-only routes (login, register…).
  if (GUEST_ONLY_ROUTES.includes(path) && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Run on every path except Next internals, API proxy and static assets.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
