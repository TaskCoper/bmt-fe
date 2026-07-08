'use client'

import { useTranslations } from 'next-intl'

import { cn } from '@/shared/lib/utils'
import { Label } from '@/shared/components/ui/label'
import { HOUSE_DIRECTIONS, type HouseDirection } from '../constants/studio.constants'
import { useCurrentProject, useWizardStore } from '../store/wizard.store'

/** Compass-style 4-direction orientation picker (N/E/S/W around a dial). */
export function CompassPicker() {
  const t = useTranslations('studio.extra')
  const project = useCurrentProject()
  const patch = useWizardStore((s) => s.patch)
  const direction = project?.data.direction

  // Position each direction around a 3×3 grid dial.
  const pos: Record<HouseDirection, string> = {
    north: 'col-start-2 row-start-1',
    east: 'col-start-3 row-start-2',
    south: 'col-start-2 row-start-3',
    west: 'col-start-1 row-start-2'
  }

  return (
    <div className='space-y-2'>
      <Label>{t('directionLabel')}</Label>
      <div className='glass-inset relative grid size-32 grid-cols-3 grid-rows-3 rounded-full p-1'>
        {HOUSE_DIRECTIONS.map((dir) => (
          <button
            key={dir}
            type='button'
            onClick={() => patch({ direction: dir })}
            className={cn(
              'flex items-center justify-center self-center justify-self-center rounded-full text-xs font-semibold transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-soft)]',
              'size-9',
              pos[dir],
              direction === dir
                ? 'bg-primary text-primary-foreground ring-primary/40 ring-offset-background shadow-sm ring-2 ring-offset-1'
                : 'text-muted-foreground hover:bg-background/60'
            )}
          >
            {t(`direction.${dir}`)}
          </button>
        ))}
        <span className='border-glass-border col-start-2 row-start-2 size-2 self-center justify-self-center rounded-full border' />
      </div>
    </div>
  )
}
