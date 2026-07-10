'use client'

import { Button } from '@/shared/components/ui'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

interface ZoomPanCanvasProps {
  children: ReactNode
}

/**
 * Thin react-zoom-pan-pinch wrapper with overlaid +/−/reset controls.
 * The wrapper class uses `!` to override the library's inline width/height.
 */
export function ZoomPanCanvas({ children }: ZoomPanCanvasProps) {
  const t = useTranslations('project.form.aiDesignResult')

  return (
    <TransformWrapper
      minScale={0.5}
      maxScale={4}
      initialScale={1}
      centerOnInit
      doubleClick={{ mode: 'reset' }}
      wheel={{ step: 0.1 }}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div className='bg-muted relative overflow-hidden rounded-md border'>
          <TransformComponent
            wrapperClass='!w-full !h-[420px]'
            contentClass='!w-full !h-full flex items-center justify-center'
          >
            {children}
          </TransformComponent>
          <div className='absolute top-3 right-3 flex flex-col gap-1'>
            <Button
              type='button'
              size='icon'
              variant='secondary'
              onClick={() => zoomIn()}
              aria-label={t('zoomIn')}
              className='size-8 shadow-sm'
            >
              <Plus className='size-4' />
            </Button>
            <Button
              type='button'
              size='icon'
              variant='secondary'
              onClick={() => zoomOut()}
              aria-label={t('zoomOut')}
              className='size-8 shadow-sm'
            >
              <Minus className='size-4' />
            </Button>
            <Button
              type='button'
              size='icon'
              variant='outline'
              onClick={() => resetTransform()}
              aria-label={t('reset')}
              className='bg-background size-8 shadow-sm'
            >
              <RotateCcw className='size-4' />
            </Button>
          </div>
        </div>
      )}
    </TransformWrapper>
  )
}
