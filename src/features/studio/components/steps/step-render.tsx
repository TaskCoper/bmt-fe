'use client'

import { useTranslations } from 'next-intl'
import { Heart } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { EmptyState } from '@/shared/components/common'
import { useWizardStore } from '../../store/wizard.store'
import { StepSection } from '../step-section'

/** Step 5 — 3D render gallery: favorite + caption each image. */
export function StepRender() {
  const t = useTranslations('studio.render')

  const result = useWizardStore((s) => s.result)
  const toggleFavorite = useWizardStore((s) => s.toggleFavorite)
  const setCaption = useWizardStore((s) => s.setCaption)

  if (!result) {
    return <EmptyState title={t('emptyTitle')} description={t('emptyHint')} />
  }

  const favCount = result.renders.filter((r) => r.favorite).length

  return (
    <StepSection title={t('title')} description={t('hint')}>
      <div className='flex items-center gap-2'>
        <Badge variant='secondary'>{t('count', { count: result.renders.length })}</Badge>
        <Badge variant='success'>{t('favCount', { count: favCount })}</Badge>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {result.renders.map((render) => (
          <figure key={render.id} className='overflow-hidden rounded-lg border'>
            <div className='relative aspect-[4/3]'>
              <div
                className='size-full'
                style={{
                  background: `linear-gradient(135deg, hsl(${render.hue} 70% 55%), hsl(${(render.hue + 40) % 360} 65% 35%))`
                }}
              />
              <span className='absolute top-2 left-2 rounded bg-black/40 px-2 py-0.5 text-xs font-medium text-white'>
                {t(`kind.${render.kind}`)} · {t('floorLabel', { floor: render.floor })}
              </span>
              <button
                type='button'
                onClick={() => toggleFavorite(render.id)}
                aria-label={t('favorite')}
                aria-pressed={render.favorite}
                className='bg-background/80 hover:bg-background absolute top-2 right-2 rounded-full p-1.5 transition-colors'
              >
                <Heart
                  className={cn(
                    'size-4',
                    render.favorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'
                  )}
                />
              </button>
            </div>
            <figcaption className='p-2'>
              <Input
                value={render.caption}
                onChange={(e) => setCaption(render.id, e.target.value)}
                placeholder={t('captionPlaceholder')}
                className='h-8 border-0 px-1 text-sm shadow-none focus-visible:ring-0'
              />
            </figcaption>
          </figure>
        ))}
      </div>
    </StepSection>
  )
}
