'use client'

import { useTranslations } from 'next-intl'
import { MapPin } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { PROVINCES } from '../constants/provinces'
import type { Region } from '../constants/studio.constants'
import { useCurrentProject, useWizardStore } from '../store/wizard.store'

/** Province select that infers (and badges) the macro-region from the choice. */
export function AddressRegionField() {
  const t = useTranslations('studio.address')
  const project = useCurrentProject()
  const patch = useWizardStore((s) => s.patch)

  const address = project?.data.address ?? ''
  const region = project?.data.region

  const onSelect = (id: string) => {
    const province = PROVINCES.find((p) => p.id === id)
    if (!province) return
    patch({ address: province.name, region: province.region as Region })
  }

  const currentId = PROVINCES.find((p) => p.name === address)?.id ?? ''

  return (
    <div className='space-y-2'>
      <Label>{t('label')}</Label>
      <div className='flex flex-wrap items-center gap-3'>
        <Select value={currentId} onValueChange={onSelect}>
          <SelectTrigger className='sm:w-72'>
            <MapPin className='text-muted-foreground size-4' />
            <SelectValue placeholder={t('placeholder')} />
          </SelectTrigger>
          <SelectContent className='max-h-72'>
            {PROVINCES.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {region ? (
          <Badge variant='secondary'>
            {t('regionLabel')}: {t(`region.${region}`)}
          </Badge>
        ) : null}
      </div>
    </div>
  )
}
