'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { useDebouncedValue } from '@/shared/hooks'
import { galleryApi } from '../api/gallery.api'
import { galleryKeys } from '../api/gallery.keys'
import type { GalleryFilters } from '../types/gallery.types'

/** Paginated design-library list, with the search term debounced. */
export function useGallery(filters: GalleryFilters) {
  const debouncedSearch = useDebouncedValue(filters.search, 300)
  const effectiveFilters = { ...filters, search: debouncedSearch }

  return useQuery({
    queryKey: galleryKeys.list(effectiveFilters),
    queryFn: () => galleryApi.list(effectiveFilters),
    placeholderData: keepPreviousData
  })
}

/** Admin list — includes unpublished items. */
export function useGalleryAdmin(filters: GalleryFilters) {
  const debouncedSearch = useDebouncedValue(filters.search, 300)
  const effectiveFilters = { ...filters, search: debouncedSearch }

  return useQuery({
    queryKey: [...galleryKeys.list(effectiveFilters), 'admin'],
    queryFn: () => galleryApi.listAll(effectiveFilters),
    placeholderData: keepPreviousData
  })
}
