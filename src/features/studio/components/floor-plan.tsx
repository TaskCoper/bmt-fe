'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'

/** Schematic 2D floor-plan placeholder with zoom controls (step 4A). */
export function FloorPlan() {
  const t = useTranslations('studio.result')
  const [scale, setScale] = useState(1)

  const rooms = [
    { x: 10, y: 10, w: 110, h: 80, label: t('room.living') },
    { x: 130, y: 10, w: 80, h: 80, label: t('room.kitchen') },
    { x: 10, y: 100, w: 90, h: 70, label: t('room.bedroom') },
    { x: 110, y: 100, w: 60, h: 70, label: t('room.bath') },
    { x: 180, y: 100, w: 30, h: 70, label: t('room.hall') }
  ]

  return (
    <div className='space-y-2'>
      <div className='bg-muted/30 relative overflow-hidden rounded-lg border'>
        <div className='absolute top-2 right-2 z-10 flex gap-1'>
          <Button
            type='button'
            size='icon'
            variant='outline'
            onClick={() => setScale((s) => Math.min(2, s + 0.2))}
            aria-label={t('zoomIn')}
          >
            <ZoomIn className='size-4' />
          </Button>
          <Button
            type='button'
            size='icon'
            variant='outline'
            onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
            aria-label={t('zoomOut')}
          >
            <ZoomOut className='size-4' />
          </Button>
          <Button type='button' size='icon' variant='outline' onClick={() => setScale(1)} aria-label={t('zoomReset')}>
            <Maximize className='size-4' />
          </Button>
        </div>
        <div className='flex h-72 items-center justify-center p-4'>
          <svg
            viewBox='0 0 220 180'
            className='h-full w-full transition-transform'
            style={{ transform: `scale(${scale})` }}
          >
            <rect x={4} y={4} width={212} height={172} fill='none' stroke='var(--border)' strokeWidth={2} />
            {rooms.map((r) => (
              <g key={r.label}>
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  fill='var(--muted)'
                  stroke='var(--primary)'
                  strokeWidth={1.5}
                  opacity={0.85}
                />
                <text
                  x={r.x + r.w / 2}
                  y={r.y + r.h / 2}
                  textAnchor='middle'
                  dominantBaseline='middle'
                  fill='var(--foreground)'
                  fontSize={8}
                >
                  {r.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      <p className='text-muted-foreground text-xs'>{t('drawingHint')}</p>
    </div>
  )
}
