import { Font } from '@react-pdf/renderer'

const FONT_BASE = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/bevietnampro'

let registered = false

export function registerPdfFonts(): void {
  if (registered) return
  Font.register({
    family: 'Be Vietnam Pro',
    fonts: [
      { src: `${FONT_BASE}/BeVietnamPro-Regular.ttf`, fontWeight: 400 },
      { src: `${FONT_BASE}/BeVietnamPro-Medium.ttf`, fontWeight: 500 },
      { src: `${FONT_BASE}/BeVietnamPro-SemiBold.ttf`, fontWeight: 600 },
      { src: `${FONT_BASE}/BeVietnamPro-Bold.ttf`, fontWeight: 700 }
    ]
  })
  registered = true
}
