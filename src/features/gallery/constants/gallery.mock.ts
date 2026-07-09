import { GALLERY_BUILDING, GALLERY_KIND, GALLERY_PHOTO_VARIANT, GALLERY_STYLE } from './gallery.constants'
import type { GalleryDrawing, GalleryItem, GalleryPhoto } from '../types/gallery.types'

const STYLES = Object.values(GALLERY_STYLE)
const BUILDINGS = Object.values(GALLERY_BUILDING)
const KINDS = Object.values(GALLERY_KIND)

const TAGS = ['phòng khách', 'phòng ngủ', 'bếp', 'mặt tiền', 'ban công']

/** Group 1 — 1..3 floor-plan drawings, deterministic hues around the cover. */
function makeDrawings(i: number, baseHue: number): GalleryDrawing[] {
  const count = 1 + (i % 3)
  return Array.from({ length: count }, (_, d) => ({
    id: `g-${String(i + 1).padStart(2, '0')}-d${d + 1}`,
    hue: (baseHue + d * 12) % 360
  }))
}

/** Group 2 — 2..5 finished-interior photos, alternating render / real. */
function makePhotos(i: number, baseHue: number): GalleryPhoto[] {
  const count = 2 + (i % 4)
  return Array.from({ length: count }, (_, p) => ({
    id: `g-${String(i + 1).padStart(2, '0')}-p${p + 1}`,
    hue: (baseHue + 30 + p * 24) % 360,
    variant: p % 2 === 0 ? GALLERY_PHOTO_VARIANT.RENDER : GALLERY_PHOTO_VARIANT.REAL
  }))
}

/**
 * Sample design-reference library for local dev. Each item is a project with a
 * floor-plan drawing group and a finished-interior photo group. Titles are
 * Vietnamese sample copy; real content (text VI+EN, images) comes from the CMS.
 */
export const MOCK_GALLERY: readonly GalleryItem[] = Array.from({ length: 18 }, (_, i): GalleryItem => {
  const style = STYLES[i % STYLES.length]!
  const building = BUILDINGS[i % BUILDINGS.length]!
  const kind = KINDS[i % KINDS.length]!
  const hue = (i * 37) % 360
  return {
    id: `g-${String(i + 1).padStart(2, '0')}`,
    title: `Mẫu thiết kế #${i + 1}`,
    description: 'Mẫu tham khảo do BMT Decor tuyển chọn.',
    style,
    building,
    kind,
    tags: [TAGS[i % TAGS.length]!, TAGS[(i + 2) % TAGS.length]!],
    hue,
    popularity: ((i * 53) % 90) + 10,
    // A couple of items left unpublished to exercise the admin view.
    published: i % 7 !== 0,
    createdAt: new Date(2026, 5, 28 - i).toISOString(),
    drawings: makeDrawings(i, hue),
    photos: makePhotos(i, hue)
  }
})
