import { env } from './env';

/**
 * Static, app-wide metadata. Keep marketing / SEO copy out of this file —
 * user-facing text lives in translation messages (next-intl).
 */
export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  url: env.NEXT_PUBLIC_APP_URL,
  // Default theme handed to next-themes.
  defaultTheme: 'system' as const,
} as const;

export type SiteConfig = typeof siteConfig;
