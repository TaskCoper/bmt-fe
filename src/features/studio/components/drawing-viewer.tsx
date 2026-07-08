'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'

/** A deterministic, abstract floor-plan drawing (varies subtly per floor). */
function FloorPlanSvg({ seed }: { seed: number }) {
  const split = 70 + (seed % 3) * 18
  return (
    <svg viewBox='0 0 220 180' className='h-auto w-full max-w-2xl' role='img'>
      <rect x='6' y='6' width='208' height='168' rx='3' className='fill-card stroke-foreground/70' strokeWidth='2' />
      <line x1={split} y1='6' x2={split} y2='174' className='stroke-foreground/40' strokeWidth='1.5' />
      <line x1={split} y1='96' x2='214' y2='96' className='stroke-foreground/40' strokeWidth='1.5' />
      <line x1='6' y1='110' x2={split} y2='110' className='stroke-foreground/40' strokeWidth='1.5' />
      <rect x='150' y='20' width='46' height='52' className='fill-primary/10 stroke-primary/40' strokeWidth='1' />
      <rect x='18' y='122' width='40' height='40' className='fill-primary/5 stroke-foreground/30' strokeWidth='1' />
      <line x1={split} y1='40' x2={split + 14} y2='40' className='stroke-card' strokeWidth='3' />
      <line x1='6' y1='60' x2='6' y2='82' className='stroke-primary' strokeWidth='3' />
    </svg>
  )
}

/**
 * 2D drawing viewer with per-floor tabs, zoom/pan (react-zoom-pan-pinch),
 * reset and a lightweight fullscreen toggle.
 */
export function DrawingViewer({ floors }: { floors: number }) {
  const t = useTranslations('studio.viewer')
  const [full, setFull] = useState(false)

  const storeys = Array.from({ length: Math.max(1, floors) }, (_, i) => i)

  return (
    <div
      className={cn(
        'border-glass-border bg-background/40 overflow-hidden rounded-xl border backdrop-blur-sm',
        full && 'bg-background fixed inset-0 z-50 rounded-none'
      )}
    >
      <Tabs defaultValue='0' className='flex h-full flex-col'>
        <div className='border-glass-border bg-background/50 flex items-center justify-between gap-2 border-b p-2 backdrop-blur'>
          <TabsList>
            {storeys.map((f) => (
              <TabsTrigger key={f} value={String(f)}>
                {f === 0 ? t('floorGround') : t('floorUpper', { n: f })}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button variant='ghost' size='icon' aria-label={t('fullscreen')} onClick={() => setFull((v) => !v)}>
            {full ? <Minimize2 className='size-4' /> : <Maximize2 className='size-4' />}
          </Button>
        </div>

        {storeys.map((f) => (
          <TabsContent key={f} value={String(f)} className='m-0 flex-1'>
            <TransformWrapper minScale={0.5} maxScale={4} centerOnInit>
              {({ zoomIn, zoomOut, resetTransform }) => (
                <div className='relative'>
                  <div className='absolute top-2 right-2 z-10 flex flex-col gap-1'>
                    <Button variant='secondary' size='icon' aria-label={t('zoomIn')} onClick={() => zoomIn()}>
                      <ZoomIn className='size-4' />
                    </Button>
                    <Button variant='secondary' size='icon' aria-label={t('zoomOut')} onClick={() => zoomOut()}>
                      <ZoomOut className='size-4' />
                    </Button>
                    <Button variant='secondary' size='icon' aria-label={t('reset')} onClick={() => resetTransform()}>
                      <RotateCcw className='size-4' />
                    </Button>
                  </div>
                  <TransformComponent wrapperClass='!w-full' contentClass='!w-full'>
                    <div className={cn('flex w-full items-center justify-center p-8', full ? 'h-[80vh]' : 'h-80')}>
                      <FloorPlanSvg seed={f} />
                    </div>
                  </TransformComponent>
                </div>
              )}
            </TransformWrapper>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
