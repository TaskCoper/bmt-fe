'use client'

import { useTranslations } from 'next-intl'
import type { FloorId } from '../../types/ai-design-result.types'

interface Room {
  key: string
  x: number
  y: number
  w: number
  h: number
  fill: string
}

interface Layout {
  rooms: Room[]
}

const FILL_A = 'color-mix(in oklch, var(--chart-1) 22%, transparent)'
const FILL_B = 'color-mix(in oklch, var(--chart-2) 12%, transparent)'
const FILL_C = 'color-mix(in oklch, var(--chart-3) 26%, transparent)'
const FILL_D = 'color-mix(in oklch, var(--chart-4) 22%, transparent)'
const FILL_E = 'color-mix(in oklch, var(--chart-5) 20%, transparent)'

const LAYOUTS: Record<FloorId, Layout> = {
  ground: {
    rooms: [
      { key: 'living', x: 40, y: 40, w: 340, h: 240, fill: FILL_A },
      { key: 'dining', x: 40, y: 300, w: 200, h: 160, fill: FILL_B },
      { key: 'kitchen', x: 260, y: 300, w: 260, h: 160, fill: FILL_C },
      { key: 'wc', x: 540, y: 300, w: 100, h: 160, fill: FILL_D },
      { key: 'stairs', x: 400, y: 40, w: 160, h: 240, fill: FILL_E }
    ]
  },
  floor1: {
    rooms: [
      { key: 'bedroom1', x: 40, y: 40, w: 300, h: 220, fill: FILL_A },
      { key: 'bedroom2', x: 360, y: 40, w: 260, h: 220, fill: FILL_B },
      { key: 'bath', x: 40, y: 280, w: 180, h: 180, fill: FILL_D },
      { key: 'stairs', x: 240, y: 280, w: 160, h: 180, fill: FILL_E },
      { key: 'balcony', x: 420, y: 280, w: 200, h: 180, fill: FILL_C }
    ]
  },
  floor2: {
    rooms: [
      { key: 'bedroom1', x: 40, y: 40, w: 280, h: 260, fill: FILL_A },
      { key: 'bedroom2', x: 340, y: 40, w: 280, h: 200, fill: FILL_B },
      { key: 'bath', x: 340, y: 260, w: 140, h: 200, fill: FILL_D },
      { key: 'stairs', x: 500, y: 260, w: 120, h: 200, fill: FILL_E },
      { key: 'balcony', x: 40, y: 320, w: 280, h: 140, fill: FILL_C }
    ]
  },
  floor3: {
    rooms: [
      { key: 'bedroom1', x: 40, y: 40, w: 340, h: 200, fill: FILL_A },
      { key: 'bedroom3', x: 400, y: 40, w: 220, h: 200, fill: FILL_B },
      { key: 'balcony', x: 40, y: 260, w: 180, h: 200, fill: FILL_C },
      { key: 'laundry', x: 240, y: 260, w: 160, h: 200, fill: FILL_D },
      { key: 'stairs', x: 420, y: 260, w: 200, h: 200, fill: FILL_E }
    ]
  },
  floor4: {
    rooms: [
      { key: 'living', x: 40, y: 40, w: 340, h: 220, fill: FILL_A },
      { key: 'bedroom1', x: 400, y: 40, w: 220, h: 220, fill: FILL_B },
      { key: 'bath', x: 40, y: 280, w: 160, h: 180, fill: FILL_D },
      { key: 'stairs', x: 220, y: 280, w: 160, h: 180, fill: FILL_E },
      { key: 'balcony', x: 400, y: 280, w: 220, h: 180, fill: FILL_C }
    ]
  },
  roof: {
    rooms: [
      { key: 'terrace', x: 40, y: 40, w: 580, h: 420, fill: FILL_C },
      { key: 'laundry', x: 440, y: 300, w: 180, h: 160, fill: FILL_D }
    ]
  },
  tum: {
    rooms: [
      { key: 'attic', x: 40, y: 40, w: 400, h: 300, fill: FILL_A },
      { key: 'stairs', x: 460, y: 40, w: 160, h: 300, fill: FILL_E }
    ]
  }
}

interface MockFloorPlanSvgProps {
  floorId: FloorId
}

/**
 * Static 2D-plan mock per floor — rooms drawn as labeled rectangles.
 * Distinct palette per floor for visual variety in the mockup.
 */
export function MockFloorPlanSvg({ floorId }: MockFloorPlanSvgProps) {
  const t = useTranslations('project.form.aiDesignResult.rooms')
  const layout = LAYOUTS[floorId]

  return (
    <svg
      viewBox='0 0 660 500'
      className='text-foreground/70 h-full w-full'
      role='img'
      aria-label={`Floor plan ${floorId}`}
    >
      <rect x={20} y={20} width={620} height={460} rx={8} fill='none' stroke='currentColor' strokeWidth={2} />
      {layout.rooms.map((room) => {
        const cx = room.x + room.w / 2
        const cy = room.y + room.h / 2
        return (
          <g key={room.key}>
            <rect
              x={room.x}
              y={room.y}
              width={room.w}
              height={room.h}
              rx={4}
              fill={room.fill}
              stroke='currentColor'
              strokeWidth={1.5}
              strokeOpacity={0.6}
            />
            <text
              x={cx}
              y={cy}
              textAnchor='middle'
              dominantBaseline='middle'
              className='fill-foreground'
              fontSize={16}
              fontWeight={500}
            >
              {t(room.key as never)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
