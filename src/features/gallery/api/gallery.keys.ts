import { QUERY_KEY_ROOTS } from '@/shared/constants/query-keys'
import type { GalleryFilters } from '../types/gallery.types'

/** Hierarchical query-key factory for the gallery feature. */
export const galleryKeys = {
  all: [QUERY_KEY_ROOTS.gallery] as const,
  lists: () => [...galleryKeys.all, 'list'] as const,
  list: (filters: GalleryFilters) => [...galleryKeys.lists(), filters] as const,
}
