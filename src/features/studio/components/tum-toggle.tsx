'use client'

import { useTranslations } from 'next-intl'

import { Label } from '@/shared/components/ui/label'
import { useCurrentProject, useWizardStore } from '../store/wizard.store'
import { Segmented } from './segmented'

/** "Có tum / không tum" toggle — only shown for modern & neoclassical styles. */
export function TumToggle() {
  const t = useTranslations('studio.tum')
  const project = useCurrentProject()
  const patch = useWizardStore((s) => s.patch)
  const hasTum = project?.data.hasTum ?? false

  return (
    <div className='animate-in fade-in slide-in-from-top-1 space-y-2'>
      <Label>{t('label')}</Label>
      <Segmented
        value={hasTum ? 'on' : 'off'}
        options={['off', 'on'] as const}
        onChange={(v) => patch({ hasTum: v === 'on' })}
        render={(v) => (v === 'on' ? t('on') : t('off'))}
      />
    </div>
  )
}
