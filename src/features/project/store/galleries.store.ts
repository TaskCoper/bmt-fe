'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const STORAGE_KEY = 'bmt.galleries'

interface ImageMeta {
  favorite: boolean
  caption: string
}

interface GalleriesStore {
  meta: Record<string, Record<string, ImageMeta>>
  toggleFavorite: (slug: string, imageId: string) => void
  setCaption: (slug: string, imageId: string, caption: string) => void
}

const emptyMeta: ImageMeta = { favorite: false, caption: '' }

export const useGalleriesStore = create<GalleriesStore>()(
  persist(
    (set) => ({
      meta: {},
      toggleFavorite: (slug, imageId) =>
        set((s) => {
          const project = s.meta[slug] ?? {}
          const current = project[imageId] ?? emptyMeta
          return {
            meta: {
              ...s.meta,
              [slug]: { ...project, [imageId]: { ...current, favorite: !current.favorite } }
            }
          }
        }),
      setCaption: (slug, imageId, caption) =>
        set((s) => {
          const project = s.meta[slug] ?? {}
          const current = project[imageId] ?? emptyMeta
          return {
            meta: {
              ...s.meta,
              [slug]: { ...project, [imageId]: { ...current, caption } }
            }
          }
        })
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export function useImageMeta(slug: string, imageId: string): ImageMeta {
  return useGalleriesStore((s) => s.meta[slug]?.[imageId] ?? emptyMeta)
}
