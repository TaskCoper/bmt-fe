'use client'

import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import type { RenderImage } from '../types/studio.types'

/** Fullscreen render viewer with prev/next navigation. */
export function Lightbox({
  renders,
  index,
  onIndexChange,
  onClose,
}: {
  renders: RenderImage[]
  index: number | null
  onIndexChange: (i: number) => void
  onClose: () => void
}) {
  const t = useTranslations('studio.render')
  const open = index !== null
  const current = index !== null ? renders[index] : undefined

  const go = (delta: number) => {
    if (index === null || renders.length === 0) return
    onIndexChange((index + delta + renders.length) % renders.length)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-panel bg-background/70 max-w-3xl overflow-hidden border-0 p-0 backdrop-blur-md">
        <DialogTitle className="sr-only">{t('title')}</DialogTitle>
        {current ? (
          <div className="relative">
            <div
              className="aspect-video w-full"
              style={{
                background: `linear-gradient(135deg, hsl(${current.hue} 70% 55%), hsl(${(current.hue + 40) % 360} 65% 35%))`,
              }}
            />
            <div className="border-glass-border bg-background/60 flex items-center justify-between gap-3 border-t p-4 backdrop-blur-md">
              <span className="text-sm tracking-tight">
                {t(`kind.${current.kind}`)} ·{' '}
                {t('floorLabel', { floor: current.floor })}
                {current.caption ? ` · ${current.caption}` : ''}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={t('prev')}
                  onClick={() => go(-1)}
                  className="border-glass-border bg-background/50 rounded-full backdrop-blur transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-soft)]"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={t('next')}
                  onClick={() => go(1)}
                  className="border-glass-border bg-background/50 rounded-full backdrop-blur transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-soft)]"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
