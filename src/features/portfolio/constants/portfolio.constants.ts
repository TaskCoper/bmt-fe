/** Portfolio (public showcase — stakeholder Q&A §3.1.2) constants. */

/** Residential building categories (MVP). */
export const PORTFOLIO_CATEGORY = {
  APARTMENT: 'apartment',
  TOWNHOUSE: 'townhouse',
  VILLA: 'villa',
} as const;

export type PortfolioCategory =
  (typeof PORTFOLIO_CATEGORY)[keyof typeof PORTFOLIO_CATEGORY];
