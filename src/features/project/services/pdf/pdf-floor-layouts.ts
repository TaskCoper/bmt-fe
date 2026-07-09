import type { PdfFloorRoom } from './pdf-types'

const FILL_A = '#e2c9a3'
const FILL_B = '#c9d8bc'
const FILL_C = '#e8d4bb'
const FILL_D = '#d5b8d6'
const FILL_E = '#c6d5e7'

export type FloorLayoutKey = 'ground' | 'floor1' | 'floor2' | 'floor3' | 'floor4' | 'roof' | 'tum'

/**
 * Mirrors src/features/project/components/ai-design-result/mock-floor-plan-svg.tsx
 * with hex colors that react-pdf's Svg primitives can consume.
 */
export const PDF_FLOOR_LAYOUTS: Record<FloorLayoutKey, Omit<PdfFloorRoom, 'label'>[]> = {
  ground: [
    { key: 'living', x: 40, y: 40, w: 340, h: 240, color: FILL_A },
    { key: 'dining', x: 40, y: 300, w: 200, h: 160, color: FILL_B },
    { key: 'kitchen', x: 260, y: 300, w: 260, h: 160, color: FILL_C },
    { key: 'wc', x: 540, y: 300, w: 100, h: 160, color: FILL_D },
    { key: 'stairs', x: 400, y: 40, w: 160, h: 240, color: FILL_E }
  ],
  floor1: [
    { key: 'bedroom1', x: 40, y: 40, w: 300, h: 220, color: FILL_A },
    { key: 'bedroom2', x: 360, y: 40, w: 260, h: 220, color: FILL_B },
    { key: 'bath', x: 40, y: 280, w: 180, h: 180, color: FILL_D },
    { key: 'stairs', x: 240, y: 280, w: 160, h: 180, color: FILL_E },
    { key: 'balcony', x: 420, y: 280, w: 200, h: 180, color: FILL_C }
  ],
  floor2: [
    { key: 'bedroom1', x: 40, y: 40, w: 280, h: 260, color: FILL_A },
    { key: 'bedroom2', x: 340, y: 40, w: 280, h: 200, color: FILL_B },
    { key: 'bath', x: 340, y: 260, w: 140, h: 200, color: FILL_D },
    { key: 'stairs', x: 500, y: 260, w: 120, h: 200, color: FILL_E },
    { key: 'balcony', x: 40, y: 320, w: 280, h: 140, color: FILL_C }
  ],
  floor3: [
    { key: 'bedroom1', x: 40, y: 40, w: 340, h: 200, color: FILL_A },
    { key: 'bedroom3', x: 400, y: 40, w: 220, h: 200, color: FILL_B },
    { key: 'balcony', x: 40, y: 260, w: 180, h: 200, color: FILL_C },
    { key: 'laundry', x: 240, y: 260, w: 160, h: 200, color: FILL_D },
    { key: 'stairs', x: 420, y: 260, w: 200, h: 200, color: FILL_E }
  ],
  floor4: [
    { key: 'living', x: 40, y: 40, w: 340, h: 220, color: FILL_A },
    { key: 'bedroom1', x: 400, y: 40, w: 220, h: 220, color: FILL_B },
    { key: 'bath', x: 40, y: 280, w: 160, h: 180, color: FILL_D },
    { key: 'stairs', x: 220, y: 280, w: 160, h: 180, color: FILL_E },
    { key: 'balcony', x: 400, y: 280, w: 220, h: 180, color: FILL_C }
  ],
  roof: [
    { key: 'terrace', x: 40, y: 40, w: 580, h: 420, color: FILL_B },
    { key: 'stairs', x: 260, y: 180, w: 140, h: 140, color: FILL_E }
  ],
  tum: [
    { key: 'attic', x: 160, y: 100, w: 340, h: 300, color: FILL_A },
    { key: 'stairs', x: 260, y: 180, w: 140, h: 140, color: FILL_E }
  ]
}

export const FLOOR_PLAN_VIEWBOX = { width: 660, height: 500 } as const
