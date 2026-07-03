import { http } from '@/shared/lib/api'
import { env } from '@/shared/config/env'
import type { PaginatedResponse } from '@/shared/types'
import type { GalleryFilters, GalleryItem } from '../types/gallery.types'
import { mockGalleryApi } from './gallery.mock'

const params = (filters: GalleryFilters) => ({
  search: filters.search || undefined,
  style: filters.style === 'all' ? undefined : filters.style,
  building: filters.building === 'all' ? undefined : filters.building,
  sort: filters.sort,
  page: filters.page,
})

const realGalleryApi = {
  list: (filters: GalleryFilters) =>
    http.get<PaginatedResponse<GalleryItem>>('/gallery', {
      params: params(filters),
    }),
  listAll: (filters: GalleryFilters) =>
    http.get<PaginatedResponse<GalleryItem>>('/admin/gallery', {
      params: params(filters),
    }),
}

export const galleryApi = env.NEXT_PUBLIC_USE_MOCK_API
  ? mockGalleryApi
  : realGalleryApi
