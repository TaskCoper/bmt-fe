import type {
  GalleryBuilding,
  GalleryKind,
  GalleryPhotoVariant,
  GalleryStyle,
  GallerySort
} from '../constants/gallery.constants'

/** A floor-plan drawing — group 1 of a project. */
export interface GalleryDrawing {
  id: string
  /** Deterministic hue for the placeholder tile. */
  hue: number
}

/** A finished-interior photo — group 2 of a project (3D render or real photo). */
export interface GalleryPhoto {
  id: string
  hue: number
  variant: GalleryPhotoVariant
}

/**
 * A single design-reference item — one project. Each project bundles two asset
 * groups: floor-plan {@link GalleryDrawing drawings} and finished-interior
 * {@link GalleryPhoto photos}.
 */
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
  /** Group 1 — floor-plan drawings (at least one). */
  drawings: GalleryDrawing[]
  /** Group 2 — finished-interior photos: 3D renders + real photos (at least one). */
  photos: GalleryPhoto[]
  /** Rich-text write-up (HTML from the CMS) shown on the detail page. */
  body: string
}

/** Client-side list filters. */
export interface GalleryFilters {
  search: string
  style: GalleryStyle | 'all'
  building: GalleryBuilding | 'all'
  sort: GallerySort
  page: number
}
