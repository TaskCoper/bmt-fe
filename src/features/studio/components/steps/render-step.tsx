'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Heart } from 'lucide-react'

import { useRouter } from '@/i18n/navigation'
import { cn } from '@/shared/lib/utils'
import { EmptyState } from '@/shared/components/common'
import { Badge } from '@/shared/components/ui/badge'
import { Input } from '@/shared/components/ui/input'
import { projectStepPath } from '../../constants/studio.constants'
import { useCurrentProject, useWizardStore } from '../../store/wizard.store'
import { Lightbox } from '../lightbox'
import { Segmented } from '../segmented'
import { StepFooter } from '../step-footer'
import { StepSection } from '../step-section'

/** Step 5 — 3D render gallery: favorite, caption, filter and lightbox. */
export function RenderStep({ projectId }: { projectId: string }) {
  const t = useTranslations('studio.render')
  const router = useRouter()

  const project = useCurrentProject()
  const toggleFavorite = useWizardStore((s) => s.toggleFavorite)
  const setCaption = useWizardStore((s) => s.setCaption)

  const [filter, setFilter] = useState<'all' | 'fav'>('all')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const renders = project?.result?.renders
  const visible = useMemo(
    () => (renders ?? []).filter((r) => (filter === 'fav' ? r.favorite : true)),
    [renders, filter]
  )

  if (!project?.result) {
    return <EmptyState title={t('emptyTitle')} description={t('emptyHint')} />
  }

  const favCount = (renders ?? []).filter((r) => r.favorite).length

  return (
    <StepSection title={t('title')} description={t('hint')}>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <Badge variant='secondary'>{t('count', { count: renders?.length ?? 0 })}</Badge>
          <Badge variant='success'>{t('favCount', { count: favCount })}</Badge>
        </div>
        <Segmented
          value={filter}
          options={['all', 'fav'] as const}
          onChange={setFilter}
          render={(v) => (v === 'all' ? t('filterAll') : t('filterFav'))}
        />
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {visible.map((render) => (
          <figure key={render.id} className={cn('glass-card overflow-hidden p-0', render.favorite && 'glass-selected')}>
            <button
              type='button'
              onClick={() => setLightbox((renders ?? []).findIndex((r) => r.id === render.id))}
              className='relative block aspect-[4/3] w-full'
            >
              <span
                className='block size-full'
                style={{
                  background: `linear-gradient(135deg, hsl(${render.hue} 70% 55%), hsl(${(render.hue + 40) % 360} 65% 35%))`
                }}
              />
              <span className='absolute top-2 left-2 rounded-lg bg-black/35 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm'>
                {t(`kind.${render.kind}`)} · {t('floorLabel', { floor: render.floor })}
              </span>
            </button>
            <figcaption className='flex items-center gap-1 p-2'>
              <button
                type='button'
                onClick={() => toggleFavorite(render.id)}
                aria-label={t('favorite')}
                aria-pressed={render.favorite}
                className='hover:bg-primary/10 rounded-full p-1.5 transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-soft)]'
              >
                <Heart
                  className={cn(
                    'size-4 transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-soft)]',
                    render.favorite ? 'fill-primary text-primary' : 'text-muted-foreground'
                  )}
                />
              </button>
              <Input
                value={render.caption}
                onChange={(e) => setCaption(render.id, e.target.value)}
                placeholder={t('captionPlaceholder')}
                className='h-8 border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0'
              />
            </figcaption>
          </figure>
        ))}
      </div>

      <Lightbox
        renders={renders ?? []}
        index={lightbox}
        onIndexChange={setLightbox}
        onClose={() => setLightbox(null)}
      />

      <StepFooter
        projectId={projectId}
        step='render'
        onNext={() => router.push(projectStepPath(projectId, 'export'))}
      />
    </StepSection>
  )
}
