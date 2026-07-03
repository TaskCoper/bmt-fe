import {
  GALLERY_BUILDING,
  GALLERY_KIND,
  GALLERY_STYLE,
} from './gallery.constants'
import type { GalleryItem } from '../types/gallery.types'

const STYLES = Object.values(GALLERY_STYLE)
const BUILDINGS = Object.values(GALLERY_BUILDING)
const KINDS = Object.values(GALLERY_KIND)

const TAGS = ['phòng khách', 'phòng ngủ', 'bếp', 'mặt tiền', 'ban công']

/**
 * Sample design-reference library for local dev. Titles are Vietnamese sample
 * copy; real content (text VI+EN, images) is provided by BMT Decor via the CMS.
 */
export const MOCK_GALLERY: readonly GalleryItem[] = Array.from(
  { length: 18 },
  (_, i): GalleryItem => {
    const style = STYLES[i % STYLES.length]!
    const building = BUILDINGS[i % BUILDINGS.length]!
    const kind = KINDS[i % KINDS.length]!
    return {
      id: `g-${String(i + 1).padStart(2, '0')}`,
      title: `Mẫu thiết kế #${i + 1}`,
      description: 'Mẫu tham khảo do BMT Decor tuyển chọn.',
      style,
      building,
      kind,
      tags: [TAGS[i % TAGS.length]!, TAGS[(i + 2) % TAGS.length]!],
      hue: (i * 37) % 360,
      popularity: ((i * 53) % 90) + 10,
      // A couple of items left unpublished to exercise the admin view.
      published: i % 7 !== 0,
      createdAt: new Date(2026, 5, 28 - i).toISOString(),
    }
  },
)
