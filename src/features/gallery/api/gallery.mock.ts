import type { PaginatedResponse } from '@/shared/types'
import { mockDelay, paginate } from '@/shared/lib'
import { DEFAULT_GALLERY_PAGE_SIZE } from '../constants/gallery.constants'
import { MOCK_GALLERY } from '../constants/gallery.mock'
import type { GalleryFilters, GalleryItem } from '../types/gallery.types'

function applyFilters(
  filters: GalleryFilters,
  includeUnpublished = false,
): GalleryItem[] {
  let items = [...MOCK_GALLERY]
  if (!includeUnpublished) {
    items = items.filter((g) => g.published)
  }

  if (filters.search) {
    const q = filters.search.toLowerCase()
    items = items.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }
  if (filters.style !== 'all') {
    items = items.filter((g) => g.style === filters.style)
  }
  if (filters.building !== 'all') {
    items = items.filter((g) => g.building === filters.building)
  }

  items.sort((a, b) =>
    filters.sort === 'popular'
      ? b.popularity - a.popularity
      : b.createdAt.localeCompare(a.createdAt),
  )

  return items
}

export const mockGalleryApi = {
  async list(filters: GalleryFilters): Promise<PaginatedResponse<GalleryItem>> {
    await mockDelay()
    return paginate(
      applyFilters(filters),
      filters.page,
      DEFAULT_GALLERY_PAGE_SIZE,
    )
  },
  /** Admin list — includes unpublished items. */
  async listAll(
    filters: GalleryFilters,
  ): Promise<PaginatedResponse<GalleryItem>> {
    await mockDelay()
    return paginate(
      applyFilters(filters, true),
      filters.page,
      DEFAULT_GALLERY_PAGE_SIZE,
    )
  },
}
