import { PORTFOLIO_CATEGORY } from './portfolio.constants'
import type { PortfolioItem } from '../types/portfolio.types'

const gallery = (base: number) =>
  Array.from({ length: 6 }, (_, i) => ({
    hue: (base + i * 24) % 360,
    caption: ''
  }))

/**
 * Sample showcase projects for local dev. Real portfolio content (text VI+EN,
 * photos) is curated by BMT Decor via the CMS.
 */
type RawPortfolio = Omit<
  PortfolioItem,
  'published' | 'subtitle' | 'workType' | 'client' | 'beforeHue' | 'afterHue' | 'process' | 'body'
>

/** Standard BMT Decor design-&-build workflow, lightly tailored per project. */
function makeProcess(p: RawPortfolio): PortfolioItem['process'] {
  return [
    {
      title: 'Khảo sát & Tư vấn',
      body: `BMT Decor khảo sát hiện trạng ${p.area}m² tại ${p.location}, trao đổi nhu cầu và ngân sách để đưa ra định hướng phù hợp.`
    },
    {
      title: 'Phát triển ý tưởng thiết kế',
      body: `Phương án phong cách ${p.style} được xây dựng với bảng màu, vật liệu và bố cục công năng tối ưu cho từng khu vực.`
    },
    {
      title: 'Thi công & Giám sát',
      body: 'Đội thi công triển khai theo bản vẽ, giám sát chặt chẽ tiến độ và chất lượng vật tư trong suốt quá trình.'
    },
    {
      title: 'Nghiệm thu & Bàn giao',
      body: 'Hoàn thiện, vệ sinh tổng thể và nghiệm thu cùng khách hàng, bàn giao công trình đúng cam kết.'
    }
  ]
}

/** Rich-text (HTML) article body — reads like a blog post (headings + figures). */
function makeBody(p: RawPortfolio, process: PortfolioItem['process']): string {
  const fig = '<figure class="img-ph"></figure>'
  const parts = [
    `<p><strong>${p.summary}</strong></p>`,
    `<p>${p.description}</p>`,
    fig,
    ...process.map((s, i) => `<h2>${s.title}</h2><p>${s.body}</p>${i === 1 ? fig : ''}`),
    `<blockquote>“BMT Decor không chỉ xây dựng không gian — chúng tôi kiến tạo trải nghiệm sống.”</blockquote>`,
    fig
  ]
  return parts.join('')
}

const RAW: RawPortfolio[] = [
  {
    id: 'pf-1',
    slug: 'can-ho-vinhomes-central-park',
    title: 'Căn hộ Vinhomes Central Park',
    category: PORTFOLIO_CATEGORY.APARTMENT,
    style: 'Hiện đại',
    year: 2025,
    location: 'TP. Hồ Chí Minh',
    area: 95,
    summary: 'Cải tạo căn hộ 2 phòng ngủ theo phong cách hiện đại, tối ưu ánh sáng.',
    description:
      'Dự án cải tạo toàn bộ căn hộ 95m² với giải pháp tối ưu công năng, bảng màu trung tính và vật liệu cao cấp. Hệ thống chiếu sáng nhiều lớp tạo chiều sâu cho không gian.',
    coverHue: 20,
    gallery: gallery(20)
  },
  {
    id: 'pf-2',
    slug: 'nha-pho-thao-dien',
    title: 'Nhà phố Thảo Điền',
    category: PORTFOLIO_CATEGORY.TOWNHOUSE,
    style: 'Tối giản',
    year: 2025,
    location: 'TP. Thủ Đức',
    area: 180,
    summary: 'Nhà phố 3 tầng tối giản với giếng trời và cây xanh.',
    description:
      'Thiết kế nhà phố 3 tầng theo hướng tối giản, tận dụng giếng trời để lấy sáng tự nhiên. Vật liệu gỗ và bê tông mài tạo cảm giác ấm áp, gần gũi.',
    coverHue: 140,
    gallery: gallery(140)
  },
  {
    id: 'pf-3',
    slug: 'biet-thu-da-lat',
    title: 'Biệt thự nghỉ dưỡng Đà Lạt',
    category: PORTFOLIO_CATEGORY.VILLA,
    style: 'Tân cổ điển',
    year: 2024,
    location: 'Đà Lạt',
    area: 320,
    summary: 'Biệt thự tân cổ điển hài hòa với cảnh quan đồi thông.',
    description:
      'Biệt thự nghỉ dưỡng 320m² mang phong cách tân cổ điển, kết hợp vật liệu địa phương và tầm nhìn hướng đồi thông. Nội thất sang trọng nhưng vẫn ấm cúng.',
    coverHue: 265,
    gallery: gallery(265)
  },
  {
    id: 'pf-4',
    slug: 'can-ho-studio-q2',
    title: 'Căn hộ studio Quận 2',
    category: PORTFOLIO_CATEGORY.APARTMENT,
    style: 'Scandinavian',
    year: 2024,
    location: 'TP. Hồ Chí Minh',
    area: 48,
    summary: 'Studio 48m² phong cách Scandinavian sáng và thoáng.',
    description:
      'Tối ưu không gian nhỏ với nội thất thông minh, tông màu sáng và gỗ tự nhiên đặc trưng phong cách Scandinavian.',
    coverHue: 200,
    gallery: gallery(200)
  },
  {
    id: 'pf-5',
    slug: 'nha-pho-go-vap',
    title: 'Nhà phố Gò Vấp',
    category: PORTFOLIO_CATEGORY.TOWNHOUSE,
    style: 'Japandi',
    year: 2025,
    location: 'TP. Hồ Chí Minh',
    area: 150,
    summary: 'Nhà phố phong cách Japandi mộc mạc, tinh tế.',
    description:
      'Kết hợp tinh thần tối giản của Nhật Bản và sự ấm áp Scandinavia, dự án mang đến không gian sống cân bằng và thư thái.',
    coverHue: 35,
    gallery: gallery(35)
  },
  {
    id: 'pf-6',
    slug: 'biet-thu-bien-vung-tau',
    title: 'Biệt thự biển Vũng Tàu',
    category: PORTFOLIO_CATEGORY.VILLA,
    style: 'Hiện đại',
    year: 2024,
    location: 'Vũng Tàu',
    area: 280,
    summary: 'Biệt thự biển hiện đại với hồ bơi vô cực.',
    description: 'Thiết kế mở hướng biển, hồ bơi vô cực và hệ cửa kính lớn xóa nhòa ranh giới trong - ngoài.',
    coverHue: 190,
    gallery: gallery(190)
  }
]

/** Last item left unpublished to exercise the admin view. */
export const MOCK_PORTFOLIO: readonly PortfolioItem[] = RAW.map((p, i) => {
  const process = makeProcess(p)
  return {
    ...p,
    subtitle: 'Gói thiết kế & thi công trọn gói',
    workType: 'Thiết kế & Thi công',
    client: `Khách hàng tại ${p.location}`,
    beforeHue: (p.coverHue + 180) % 360,
    afterHue: p.coverHue,
    process,
    body: makeBody(p, process),
    published: i !== RAW.length - 1
  }
})
