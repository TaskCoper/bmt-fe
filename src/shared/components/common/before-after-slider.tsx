'use client'

import { useRef, useState } from 'react'
import { ChevronsLeftRight } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import { StockImage } from './stock-image'

interface BeforeAfterProps {
  seed: string | number
  alt: string
  /** Number of before/after pairs. */
  count?: number
  beforeLabel: string
  afterLabel: string
  className?: string
}

/**
 * Before/After gallery: a draggable compare slider for the active pair on the
 * left, and a vertical thumbnail column (one thumb per pair) on the right to
 * switch between multiple before/after shots.
 */
export function BeforeAfterSlider({ seed, alt, count = 4, beforeLabel, afterLabel, className }: BeforeAfterProps) {
  const [active, setActive] = useState(0)
  const pairs = Array.from({ length: Math.max(1, count) }, (_, i) => `${seed}-${i}`)
  const activeSeed = pairs[Math.min(active, pairs.length - 1)]!

  return (
    <div className={cn('flex gap-3 sm:gap-4', className)}>
      {/* Main — draggable before/after for the active pair */}
      <div className='min-w-0 flex-1'>
        <Compare key={activeSeed} seed={activeSeed} alt={alt} beforeLabel={beforeLabel} afterLabel={afterLabel} />
      </div>

      {/* Right — vertical thumbnails capped to the main image height, scrollable */}
      {pairs.length > 1 ? (
        <div className='relative w-20 shrink-0 sm:w-24'>
          <div className='scrollbar-none absolute inset-0 flex flex-col gap-3 overflow-y-auto'>
            {pairs.map((s, i) => (
              <button
                key={s}
                type='button'
                aria-label={`${afterLabel} ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  'relative aspect-[4/3] shrink-0 overflow-hidden rounded-xl border transition',
                  i === active ? '' : 'opacity-55 hover:opacity-100'
                )}
              >
                <StockImage seed={s} alt={`${afterLabel} ${i + 1}`} width={240} className='size-full' />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

/** A single draggable before/after compare pane. */
function Compare({
  seed,
  alt,
  beforeLabel,
  afterLabel
}: {
  seed: string | number
  alt: string
  beforeLabel: string
  afterLabel: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const [pos, setPos] = useState(50)

  const update = (clientX: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)))
  }

  return (
    <div
      ref={ref}
      className='relative aspect-[4/3] w-full cursor-ew-resize touch-none overflow-hidden rounded-2xl border select-none sm:aspect-video'
      onPointerDown={(e) => {
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e.clientX)
      }}
      onPointerMove={(e) => {
        if (dragging.current) update(e.clientX)
      }}
      onPointerUp={(e) => {
        dragging.current = false
        e.currentTarget.releasePointerCapture(e.pointerId)
      }}
    >
      {/* After (full) */}
      <StockImage seed={seed} alt={alt} width={1200} className='absolute inset-0 size-full' />

      {/* Before (raw/unfinished photo, clipped) */}
      <div className='absolute inset-0' style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <StockImage seed={seed} alt={alt} width={1200} before className='size-full' />
      </div>

      <Badge className='absolute bottom-3 left-3 border-white/25 bg-black/45 text-white backdrop-blur-md'>
        {beforeLabel}
      </Badge>
      <Badge className='absolute right-3 bottom-3 border-white/25 bg-black/45 text-white backdrop-blur-md'>
        {afterLabel}
      </Badge>

      {/* Divider + handle */}
      <div
        className='absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]'
        style={{ left: `${pos}%` }}
      >
        <div className='absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/95 text-neutral-700 shadow-md'>
          <ChevronsLeftRight className='size-4' />
        </div>
      </div>
    </div>
  )
}
