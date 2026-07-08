import type { GalleryBuilding, GalleryKind, GalleryStyle, GallerySort } from '../constants/gallery.constants'

/** A single design-reference item. */
export interface GalleryItem {
  id: string
  title: string
  description: string
  style: GalleryStyle
  building: GalleryBuilding
  kind: GalleryKind
  tags: string[]
  /** Deterministic hue for the placeholder thumbnail. */
  hue: number
  /** Popularity score (downloads/views) — drives the "popular" sort. */
  popularity: number
  /** Whether the item is published (visible to the public). */
  published: boolean
  createdAt: string
}

/** Client-side list filters. */
export interface GalleryFilters {
  search: string
  style: GalleryStyle | 'all'
  building: GalleryBuilding | 'all'
  sort: GallerySort
  page: number
}
