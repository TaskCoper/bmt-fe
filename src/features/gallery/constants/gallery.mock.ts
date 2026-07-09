import { GALLERY_BUILDING, GALLERY_KIND, GALLERY_PHOTO_VARIANT, GALLERY_STYLE } from './gallery.constants'
import type { GalleryDrawing, GalleryItem, GalleryPhoto } from '../types/gallery.types'

const STYLES = Object.values(GALLERY_STYLE)
const BUILDINGS = Object.values(GALLERY_BUILDING)
const KINDS = Object.values(GALLERY_KIND)

const TAGS = ['phòng khách', 'phòng ngủ', 'bếp', 'mặt tiền', 'ban công']

const STYLE_VI: Record<string, string> = {
  modern: 'hiện đại',
  neoclassical: 'tân cổ điển',
  scandinavian: 'Scandinavian',
  japandi: 'Japandi',
  indochine: 'Đông Dương',
  minimalist: 'tối giản'
}

const BUILDING_VI: Record<string, string> = {
  apartment: 'căn hộ',
  townhouse: 'nhà phố',
  villa: 'biệt thự'
}

/** Rich-text (HTML) write-up for a reference design — reads like a blog post. */
function makeBody(style: string, building: string): string {
  const s = STYLE_VI[style] ?? style
  const b = BUILDING_VI[building] ?? building
  return [
    `<p><strong>Mẫu thiết kế ${b} phong cách ${s}, được đội ngũ BMT Decor tuyển chọn làm tài liệu tham khảo cho khách hàng.</strong></p>`,
    `<p>Phương án đề cao sự cân bằng giữa công năng và thẩm mỹ, tối ưu ánh sáng tự nhiên cùng luồng di chuyển hợp lý cho từng khu vực sinh hoạt.</p>`,
    `<h2>Ý tưởng thiết kế</h2>`,
    `<p>Bảng màu và vật liệu bám theo tinh thần ${s}: tiết chế chi tiết thừa, đề cao chất liệu thật và cảm giác ấm áp, gần gũi. Không gian mở giúp các khu vực liên kết mạch lạc nhưng vẫn giữ được sự riêng tư cần thiết.</p>`,
    `<h2>Vật liệu &amp; hoàn thiện</h2>`,
    `<ul><li>Sàn gỗ kỹ thuật kết hợp đá tự nhiên cho khu vực chính.</li><li>Hệ tủ bếp và tủ áo kịch trần, tối ưu khả năng lưu trữ.</li><li>Chiếu sáng nhiều lớp: đèn hắt, đèn rọi và đèn trang trí điểm nhấn.</li></ul>`,
    `<h2>Hồ sơ đi kèm</h2>`,
    `<p>Bộ mẫu gồm bản vẽ mặt bằng bố trí và hình ảnh không gian đã hoàn thiện (ảnh 3D render và ảnh thực tế), có thể tải về ở dạng PDF.</p>`,
    `<blockquote>“Một thiết kế tốt không chỉ đẹp mà còn phải phục vụ đúng nhịp sống của gia chủ.”</blockquote>`
  ].join('')
}

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
    photos: makePhotos(i, hue),
    body: makeBody(style, building)
  }
})
