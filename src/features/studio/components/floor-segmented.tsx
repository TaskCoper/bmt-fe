'use client'

import { useTranslations } from 'next-intl'

import { Label } from '@/shared/components/ui/label'
import { FLOOR_OPTIONS } from '../constants/studio.constants'
import { useCurrentProject, useWizardStore } from '../store/wizard.store'
import { Segmented } from './segmented'

/** Floor-count picker (Trệt / Trệt+1 / …) — drives the step-3 dropzone count. */
export function FloorSegmented() {
  const t = useTranslations('studio.floors')
  const project = useCurrentProject()
  const patch = useWizardStore((s) => s.patch)
  const floors = project?.data.floors ?? 0

  return (
    <div className='space-y-2'>
      <Label>{t('label')}</Label>
      <Segmented
        value={floors}
        options={FLOOR_OPTIONS}
        onChange={(v) => patch({ floors: v })}
        render={(v) => (v === 0 ? t('ground') : t('plus', { n: v }))}
      />
      <p className='text-muted-foreground text-xs'>{t('hint')}</p>
    </div>
  )
}
