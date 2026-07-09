import type { PortfolioCategory } from '../constants/portfolio.constants'

/** One image in a portfolio item's gallery (placeholder hue + caption). */
export interface PortfolioImage {
  hue: number
  caption: string
}

/** A showcased reference project. */
export interface PortfolioItem {
  id: string
  slug: string
  title: string
  category: PortfolioCategory
  style: string
  year: number
  location: string
  area: number
  /** One-line package subtitle under the title. */
  subtitle: string
  summary: string
  description: string
  coverHue: number
  gallery: PortfolioImage[]
  /** Work type for the meta block (e.g. "Thiết kế & Thi công"). */
  workType: string
  /** Client label for the meta block. */
  client: string
  /** Before/after transformation placeholder hues. */
  beforeHue: number
  afterHue: number
  /** Section 03 "Detailed content" — ordered process steps. */
  process: { title: string; body: string }[]
  /** Rich-text article body (HTML from the CMS) — the blog-style project write-up. */
  body: string
  /** Whether the project is published (visible to the public). */
  published: boolean
}

/** Client-side list filters. */
export interface PortfolioFilters {
  category: PortfolioCategory | 'all'
  page: number
}
