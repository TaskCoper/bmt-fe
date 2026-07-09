/** Design reference library (Thư viện tham khảo — stakeholder Q&A §6) constants. */

/** Design styles used to filter the library. */
export const GALLERY_STYLE = {
  MODERN: 'modern',
  NEOCLASSICAL: 'neoclassical',
  SCANDINAVIAN: 'scandinavian',
  JAPANDI: 'japandi',
  INDOCHINE: 'indochine',
  MINIMALIST: 'minimalist'
} as const

export type GalleryStyle = (typeof GALLERY_STYLE)[keyof typeof GALLERY_STYLE]

/** Construction types (residential only for MVP). */
export const GALLERY_BUILDING = {
  APARTMENT: 'apartment',
  TOWNHOUSE: 'townhouse',
  VILLA: 'villa'
} as const

export type GalleryBuilding = (typeof GALLERY_BUILDING)[keyof typeof GALLERY_BUILDING]

/** Asset kinds in the library. */
export const GALLERY_KIND = {
  IMAGE: 'image',
  DRAWING: 'drawing',
  PDF: 'pdf'
} as const

export type GalleryKind = (typeof GALLERY_KIND)[keyof typeof GALLERY_KIND]

/**
 * Interior-photo variants for a project's group 2 (finished spaces): a 3D
 * render vs. an on-site real photo.
 */
export const GALLERY_PHOTO_VARIANT = {
  RENDER: 'render',
  REAL: 'real'
} as const

export type GalleryPhotoVariant = (typeof GALLERY_PHOTO_VARIANT)[keyof typeof GALLERY_PHOTO_VARIANT]

/** Sort options. */
export const GALLERY_SORT = ['newest', 'popular'] as const
export type GallerySort = (typeof GALLERY_SORT)[number]

export const DEFAULT_GALLERY_PAGE_SIZE = 9
