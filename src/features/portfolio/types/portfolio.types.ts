import type { PortfolioCategory } from '../constants/portfolio.constants';

/** One image in a portfolio item's gallery (placeholder hue + caption). */
export interface PortfolioImage {
  hue: number;
  caption: string;
}

/** A showcased reference project. */
export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  category: PortfolioCategory;
  style: string;
  year: number;
  location: string;
  area: number;
  summary: string;
  description: string;
  coverHue: number;
  gallery: PortfolioImage[];
  /** Whether the project is published (visible to the public). */
  published: boolean;
}

/** Client-side list filters. */
export interface PortfolioFilters {
  category: PortfolioCategory | 'all';
  page: number;
}
